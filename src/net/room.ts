import { joinRoom, type JsonValue as Json, type Room } from 'trystero';
import { isMatch } from '../engine/game';
import { MATCH_DELAY_MS, MISS_DELAY_MS, type Session, type SessionView } from '../engine/session';

const APP_ID = 'flipsy-don-tay-v1';
export const ABANDON_AFTER_MS = 5 * 60 * 1000;
export const CONNECT_TIMEOUT_MS = 25 * 1000;


interface Hello {
  name: string;
  token: string;
}

function actions(room: Room) {
  return {
    hello: room.makeAction<Json>('hello'),
    view: room.makeAction<Json>('view'),
    flip: room.makeAction<Json>('flip'),
    rematch: room.makeAction<Json>('rematch'),
    full: room.makeAction<Json>('full'),
    seen: room.makeAction<Json>('seen'),
  };
}

export interface HostLinkOptions {
  guestToken: string | null;
  onPersist: (guestToken: string | null) => void;
  onAbandoned: () => void;
  onGuestPresence: (present: boolean) => void;
}

/** Host side: the host's session is authoritative; the single guest only sends intents. */
export class HostLink {
  private room: Room;
  private a: ReturnType<typeof actions>;
  private guestPeer: string | null = null;
  private guestToken: string | null;
  private abandonTimer: ReturnType<typeof setTimeout> | null = null;
  private unsubscribe: () => void;

  constructor(roomId: string, private session: Session, private opts: HostLinkOptions) {
    this.guestToken = opts.guestToken;
    this.room = joinRoom({ appId: APP_ID }, roomId);
    this.a = actions(this.room);

    this.unsubscribe = session.subscribe(() => {
      this.sendView();
      opts.onPersist(this.guestToken);
    });

    this.a.hello.onMessage = (data, { peerId }) => this.onHello(data as unknown as Hello, peerId);
    this.a.flip.onMessage = (data, { peerId }) => {
      if (peerId === this.guestPeer) session.flip(1, (data as unknown as { index: number }).index);
    };
    this.a.rematch.onMessage = (_data, { peerId }) => {
      if (peerId === this.guestPeer) session.requestRematch(1);
    };
    this.a.seen.onMessage = (data, { peerId }) => {
      if (peerId === this.guestPeer) session.ack((data as unknown as { turnSeq: number }).turnSeq);
    };
    this.room.onPeerLeave = (peerId) => {
      if (peerId === this.guestPeer) this.guestLeft();
    };

    if (this.guestToken && session.status === 'playing') this.startAbandonTimer();
  }

  private sendView(): void {
    if (this.guestPeer) void this.a.view.send(this.session.view() as unknown as Json, { target: this.guestPeer });
  }

  private onHello({ name, token }: Hello, peerId: string): void {
    const free = !this.guestToken && !this.guestPeer;
    if (!free && this.guestToken !== token) {
      void this.a.full.send(true, { target: peerId });
      return;
    }
    this.guestPeer = peerId;
    this.guestToken = token;
    this.clearAbandonTimer();
    this.opts.onGuestPresence(true);
    this.session.setName(1, name);
    this.session.setPaused(false);
    if (this.session.status === 'waiting') this.session.beginCountdown();
    this.sendView();
  }

  private guestLeft(): void {
    this.guestPeer = null;
    this.opts.onGuestPresence(false);
    if (this.session.status === 'playing') {
      this.session.setPaused(true);
      this.startAbandonTimer();
    } else {
      this.guestToken = null;
      this.session.backToWaiting();
    }
  }

  private startAbandonTimer(): void {
    this.clearAbandonTimer();
    this.abandonTimer = setTimeout(this.opts.onAbandoned, ABANDON_AFTER_MS);
  }

  private clearAbandonTimer(): void {
    if (this.abandonTimer) clearTimeout(this.abandonTimer);
    this.abandonTimer = null;
  }

  leave(): void {
    this.clearAbandonTimer();
    this.unsubscribe();
    void this.room.leave();
  }
}

export interface GuestLinkHandlers {
  onView: (view: SessionView) => void;
  onFull: () => void;
  onHostLeft: () => void;
  onAbandoned: () => void;
  onConnectTimeout: () => void;
}

/** Guest side: renders whatever the host sends and forwards the guest's intents. */
export class GuestLink {
  private room: Room;
  private a: ReturnType<typeof actions>;
  private hostPeer: string | null = null;
  private abandonTimer: ReturnType<typeof setTimeout> | null = null;
  private connectTimer: ReturnType<typeof setTimeout> | null;
  private ackTimer: ReturnType<typeof setTimeout> | null = null;
  private ackedSeq = -1;

  constructor(roomId: string, hello: Hello, h: GuestLinkHandlers) {
    this.room = joinRoom({ appId: APP_ID }, roomId);
    this.a = actions(this.room);

    this.connectTimer = setTimeout(h.onConnectTimeout, CONNECT_TIMEOUT_MS);
    this.room.onPeerJoin = (peerId) => void this.a.hello.send(hello as unknown as Json, { target: peerId });
    this.a.view.onMessage = (data, { peerId }) => {
      if (!this.hostPeer) this.hostPeer = peerId;
      if (peerId !== this.hostPeer) return;
      this.clearTimers();
      const view = data as unknown as SessionView;
      h.onView(view);
      this.confirmReveal(view);
    };
    this.a.full.onMessage = () => {
      this.clearTimers();
      h.onFull();
    };
    this.room.onPeerLeave = (peerId) => {
      if (peerId !== this.hostPeer) return;
      this.hostPeer = null;
      this.ackedSeq = -1;
      h.onHostLeft();
      this.abandonTimer = setTimeout(h.onAbandoned, ABANDON_AFTER_MS);
    };
  }

  /** Once a pair has been on screen for the full delay, tell the host it may turn the cards back. */
  private confirmReveal(view: SessionView): void {
    const g = view.game;
    if (!g || g.phase !== 'resolve' || g.turnSeq === this.ackedSeq) return;
    this.ackedSeq = g.turnSeq;
    if (this.ackTimer) clearTimeout(this.ackTimer);
    this.ackTimer = setTimeout(() => {
      if (this.hostPeer) void this.a.seen.send({ turnSeq: g.turnSeq }, { target: this.hostPeer });
    }, isMatch(g) ? MATCH_DELAY_MS : MISS_DELAY_MS);
  }

  flip(index: number): void {
    if (this.hostPeer) void this.a.flip.send({ index }, { target: this.hostPeer });
  }

  rematch(): void {
    if (this.hostPeer) void this.a.rematch.send(true, { target: this.hostPeer });
  }

  private clearTimers(): void {
    if (this.connectTimer) clearTimeout(this.connectTimer);
    if (this.abandonTimer) clearTimeout(this.abandonTimer);
    this.connectTimer = this.abandonTimer = null;
  }

  leave(): void {
    this.clearTimers();
    if (this.ackTimer) clearTimeout(this.ackTimer);
    void this.room.leave();
  }
}
