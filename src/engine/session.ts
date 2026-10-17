import { Game, Seat, flip, isMatch, newGame, other, redact, resolve, timeout, winner } from './game';

export interface Config {
  themeId: string;
  timerSec: number | null;
  names: [string, string];
}
export type Status = 'waiting' | 'countdown' | 'playing';

export interface SessionView {
  status: Status;
  countdown: number;
  config: Config;
  game: Game | null;
  paused: boolean;
  rematch: [boolean, boolean];
}

export interface Saved {
  config: Config;
  status: Status;
  game: Game | null;
  guestToken: string | null;
  ts: number;
}

export const MATCH_DELAY_MS = 600;
export const MISS_DELAY_MS = 1000;
export const COUNTDOWN_FROM = 3;

/** Authoritative game session. Runs in the host's browser (or the only browser in local play). */
export class Session {
  config: Config;
  status: Status = 'waiting';
  countdown = 0;
  game: Game | null = null;
  paused = false;
  rematch: [boolean, boolean] = [false, false];

  private listeners = new Set<() => void>();
  private turnTimer: ReturnType<typeof setTimeout> | null = null;
  private resolveTimer: ReturnType<typeof setTimeout> | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private armedSeq = -1;

  constructor(config: Config, private local = false) {
    this.config = config;
  }

  static restore(saved: Saved): Session {
    const s = new Session(saved.config);
    if (saved.game && saved.status === 'playing') {
      s.game = saved.game;
      s.status = 'playing';
      s.paused = true;
    }
    return s;
  }

  view(): SessionView {
    return {
      status: this.status,
      countdown: this.countdown,
      config: this.config,
      game: this.game ? redact(this.game) : null,
      paused: this.paused,
      rematch: this.rematch,
    };
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  startGame(first: Seat = Math.random() < 0.5 ? 0 : 1): void {
    this.clearCountdown();
    this.game = newGame(first);
    this.status = 'playing';
    this.rematch = [false, false];
    this.armedSeq = -1;
    this.changed();
  }

  beginCountdown(): void {
    this.clearCountdown();
    this.status = 'countdown';
    this.countdown = COUNTDOWN_FROM;
    this.countdownTimer = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) this.startGame();
      else this.changed();
    }, 1000);
    this.changed();
  }

  backToWaiting(): void {
    this.clearCountdown();
    this.clearTimers();
    this.status = 'waiting';
    this.game = null;
    this.paused = false;
    this.changed();
  }

  setName(seat: Seat, name: string): void {
    const names: [string, string] = [...this.config.names];
    names[seat] = name;
    this.config = { ...this.config, names };
    this.changed();
  }

  /** Theme and timer can only change between games. */
  updateSettings(patch: Partial<Pick<Config, 'themeId' | 'timerSec'>>): void {
    if (this.game?.phase !== 'done') return;
    this.config = { ...this.config, ...patch };
    this.changed();
  }

  setPaused(paused: boolean): void {
    if (this.paused === paused) return;
    this.paused = paused;
    if (paused) {
      this.clearTimers();
    } else if (this.game?.phase === 'resolve') {
      this.scheduleResolve();
    } else if (this.game?.phase === 'play') {
      this.game = { ...this.game, turnSeq: this.game.turnSeq + 1 };
    }
    this.changed();
  }

  flip(seat: Seat, index: number): void {
    if (this.paused || this.status !== 'playing' || !this.game) return;
    const next = flip(this.game, seat, index);
    if (next === this.game) return;
    this.game = next;
    if (next.phase === 'resolve') this.scheduleResolve();
    this.changed();
  }

  requestRematch(seat: Seat): void {
    if (this.game?.phase !== 'done') return;
    this.rematch = this.local ? [true, true] : seat === 0 ? [true, this.rematch[1]] : [this.rematch[0], true];
    if (this.rematch[0] && this.rematch[1]) {
      const w = winner(this.game);
      this.startGame(w === 'draw' || w === null ? other(this.game.first) : other(w));
    } else {
      this.changed();
    }
  }

  toSaved(guestToken: string | null): Saved {
    return { config: this.config, status: this.status, game: this.game, guestToken, ts: Date.now() };
  }

  dispose(): void {
    this.clearCountdown();
    this.clearTimers();
    this.listeners.clear();
  }

  private scheduleResolve(): void {
    if (!this.game) return;
    if (this.resolveTimer) clearTimeout(this.resolveTimer);
    const delay = isMatch(this.game) ? MATCH_DELAY_MS : MISS_DELAY_MS;
    this.resolveTimer = setTimeout(() => {
      this.resolveTimer = null;
      if (!this.game) return;
      this.game = resolve(this.game);
      this.changed();
    }, delay);
  }

  private armTurnTimer(): void {
    const g = this.game;
    const active = !!g && this.config.timerSec !== null && g.phase === 'play' && !this.paused && this.status === 'playing';
    if (!active) {
      if (this.turnTimer) clearTimeout(this.turnTimer);
      this.turnTimer = null;
      this.armedSeq = -1;
      return;
    }
    if (this.armedSeq === g.turnSeq) return;
    if (this.turnTimer) clearTimeout(this.turnTimer);
    this.armedSeq = g.turnSeq;
    this.turnTimer = setTimeout(() => {
      this.turnTimer = null;
      if (!this.game) return;
      this.game = timeout(this.game);
      this.changed();
    }, (this.config.timerSec as number) * 1000);
  }

  private clearTimers(): void {
    if (this.turnTimer) clearTimeout(this.turnTimer);
    if (this.resolveTimer) clearTimeout(this.resolveTimer);
    this.turnTimer = this.resolveTimer = null;
    this.armedSeq = -1;
  }

  private clearCountdown(): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = null;
  }

  private changed(): void {
    this.armTurnTimer();
    this.listeners.forEach((fn) => fn());
  }
}
