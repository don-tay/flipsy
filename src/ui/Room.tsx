import { useEffect, useRef, useState } from 'react';
import { Session, type SessionView } from '../engine/session';
import { HostLink, GuestLink } from '../net/room';
import { deleteHostRoom, guestToken, loadHostRoom, saveHostRoom, type Settings } from '../lib/storage';
import { getTheme } from '../themes';
import { GameScreen } from './GameScreen';
import { settingsEdit } from './settingsEdit';
import { Notice } from './Notice';
import { useApplyTheme } from './useTheme';

interface Props {
  roomId: string;
  settings: Settings;
  onSettings: (patch: Partial<Settings>) => void;
  onToggleMute: () => void;
  onHome: () => void;
}

export default function Room(props: Props) {
  return loadHostRoom(props.roomId) ? <HostRoom {...props} /> : <GuestRoom {...props} />;
}

const roomUrl = (id: string) => `${location.origin}${location.pathname}#/r/${id}`;

function HostRoom({ roomId, settings, onSettings, onToggleMute, onHome }: Props) {
  const [session] = useState(() => Session.restore(loadHostRoom(roomId)!));
  const [view, setView] = useState<SessionView>(() => session.view());
  const [abandoned, setAbandoned] = useState(false);
  const [guestHere, setGuestHere] = useState(false);
  const linkRef = useRef<HostLink | null>(null);
  useApplyTheme(getTheme(view.config.themeId));

  useEffect(() => {
    const saved = loadHostRoom(roomId)!;
    const unsubscribe = session.subscribe(() => setView(session.view()));
    const link = new HostLink(roomId, session, {
      guestToken: saved.status === 'playing' ? saved.guestToken : null,
      onPersist: (token) => saveHostRoom(roomId, session.toSaved(token)),
      onAbandoned: () => {
        deleteHostRoom(roomId);
        setAbandoned(true);
      },
      onGuestPresence: setGuestHere,
    });
    linkRef.current = link;
    return () => {
      unsubscribe();
      link.leave();
      session.dispose();
    };
  }, [roomId, session]);

  const leave = () => {
    deleteHostRoom(roomId);
    onHome();
  };

  if (abandoned) {
    return (
      <Notice title="Game abandoned" actions={<button className="btn primary" onClick={onHome}>Back home</button>}>
        Your friend didn’t come back within 5 minutes.
      </Notice>
    );
  }

  if (view.status === 'waiting') return <Lobby url={roomUrl(roomId)} themeName={getTheme(view.config.themeId).name} onCancel={leave} />;

  return (
    <GameScreen
      view={view}
      mySeat={0}
      online
      muted={settings.muted}
      onToggleMute={onToggleMute}
      onFlip={(i) => session.flip(0, i)}
      onRematch={() => session.requestRematch(0)}
      onLeave={leave}
      edit={settingsEdit(session, settings, onSettings)}
      banner={view.status === 'playing' && !guestHere ? `Waiting for ${view.config.names[1]} to reconnect…` : null}
    />
  );
}

function Lobby({ url, themeName, onCancel }: { url: string; themeName: string; onCancel: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the link is selectable in the field */
    }
  };
  const share = () => navigator.share?.({ title: 'Flipsy', text: 'Play Flipsy with me!', url }).catch(() => undefined);

  return (
    <Notice
      title="Invite a friend"
      actions={
        <>
          <button className="btn primary" onClick={copy}>{copied ? 'Copied!' : 'Copy link'}</button>
          {typeof navigator.share === 'function' && <button className="btn" onClick={share}>Share…</button>}
          <button className="btn" onClick={onCancel}>Cancel</button>
        </>
      }
    >
      Send this link. The game starts as soon as your friend opens it. Theme: {themeName}.
      <input className="link" readOnly value={url} aria-label="Game link" onFocus={(e) => e.currentTarget.select()} />
      <span className="waiting">Waiting for your friend…</span>
    </Notice>
  );
}

type GuestState = 'connecting' | 'playing' | 'full' | 'failed' | 'abandoned';

function GuestRoom({ roomId, settings, onToggleMute, onHome }: Props) {
  const [view, setView] = useState<SessionView | null>(null);
  const [state, setState] = useState<GuestState>('connecting');
  const [hostGone, setHostGone] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const linkRef = useRef<GuestLink | null>(null);
  useApplyTheme(getTheme(view?.config.themeId ?? settings.themeId));

  useEffect(() => {
    setState('connecting');
    const link = new GuestLink(
      roomId,
      { name: settings.nick.trim() || 'Player 2', token: guestToken(roomId) },
      {
        onView: (v) => {
          setView(v);
          setHostGone(false);
          setState('playing');
        },
        onFull: () => setState('full'),
        onHostLeft: () => setHostGone(true),
        onAbandoned: () => setState('abandoned'),
        onConnectTimeout: () => setState('failed'),
      },
    );
    linkRef.current = link;
    return () => link.leave();
    // The display name is only sent when joining.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, attempt]);

  const home = <button className="btn" onClick={onHome}>Back home</button>;

  if (state === 'full')
    return (
      <Notice title="This room is full" actions={<button className="btn primary" onClick={onHome}>Start your own game</button>}>
        Two players are already in this game.
      </Notice>
    );
  if (state === 'failed')
    return (
      <Notice
        title="Couldn’t connect"
        actions={
          <>
            <button className="btn primary" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
            {home}
          </>
        }
      >
        We couldn’t reach your friend. Check that they still have the game open, or try a different network.
      </Notice>
    );
  if (state === 'abandoned')
    return (
      <Notice title="Game abandoned" actions={<button className="btn primary" onClick={onHome}>Back home</button>}>
        The host didn’t come back within 5 minutes.
      </Notice>
    );
  if (!view || view.status === 'waiting')
    return (
      <Notice title="Connecting…" actions={home}>
        <span className="waiting">Looking for your friend’s game</span>
      </Notice>
    );

  return (
    <GameScreen
      view={view}
      mySeat={1}
      online
      muted={settings.muted}
      onToggleMute={onToggleMute}
      onFlip={(i) => linkRef.current?.flip(i)}
      onRematch={() => linkRef.current?.rematch()}
      onLeave={onHome}
      banner={hostGone ? `${view.config.names[0]} disconnected. Waiting for them to come back…` : view.paused ? 'Game paused' : null}
    />
  );
}
