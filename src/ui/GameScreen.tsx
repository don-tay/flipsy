import { ReactNode, useEffect, useRef, useState } from 'react';
import { Game, Seat, other, winner } from '../engine/game';
import type { SessionView } from '../engine/session';
import { play } from '../lib/fx';
import { getTheme } from '../themes';
import { Board } from './Board';
import { SoundToggle } from './SoundToggle';

interface Props {
  view: SessionView;
  /** The seat this browser plays, or null when both players share this device. */
  mySeat: Seat | null;
  online: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onFlip: (index: number) => void;
  onRematch: () => void;
  onLeave: () => void;
  banner?: ReactNode;
}

const emptyGame = (): Game => ({
  cards: Array.from({ length: 64 }, () => ({ pair: -1, status: 'down' as const, by: null })),
  scores: [0, 0],
  turn: 0,
  first: 0,
  flipped: [],
  phase: 'play',
  turnSeq: 0,
});

export function GameScreen({ view, mySeat, online, muted, onToggleMute, onFlip, onRematch, onLeave, banner }: Props) {
  const theme = getTheme(view.config.themeId);
  const { names } = view.config;
  const game = view.game ?? emptyGame();
  const [announcement, setAnnouncement] = useState('');
  const prev = useRef<Game | null>(null);

  useEffect(() => {
    const before = prev.current;
    prev.current = view.game;
    const g = view.game;
    if (!g || !before || before === g) return;
    const nameOf = (i: number) => theme.items[g.cards[i].pair]?.name ?? 'card';
    const opened = g.cards.flatMap((c, i) => (before.cards[i]?.status === 'down' && c.status === 'up' ? [i] : []));
    const newlyMatched = g.cards.filter((c, i) => before.cards[i]?.status !== 'matched' && c.status === 'matched');
    const closed = g.cards.some((c, i) => before.cards[i]?.status === 'up' && c.status === 'down');
    const parts: string[] = [];
    if (opened.length) {
      play('flip');
      parts.push(`${names[before.turn]} flipped ${nameOf(opened[opened.length - 1])}.`);
    }
    if (newlyMatched.length) {
      parts.push(`Match! ${names[before.turn]} scores.`);
    } else if (closed) {
      parts.push('No match.');
    }
    if (g.phase === 'done' && before.phase !== 'done') {
      const w = winner(g);
      play(w === 'draw' || (mySeat !== null && w !== mySeat) ? 'draw' : 'win');
      parts.push(w === 'draw' ? "It's a draw." : `${names[w as Seat]} wins.`);
    } else if (newlyMatched.length) {
      play('match');
    } else if (closed) {
      play('miss');
    }
    if (g.turn !== before.turn && g.phase !== 'done') parts.push(`${names[g.turn]}'s turn.`);
    if (parts.length) setAnnouncement(parts.join(' '));
  }, [view.game, names, theme, mySeat]);

  const seatToFlip = mySeat ?? game.turn;
  const canFlip =
    view.status === 'playing' && !view.paused && game.phase === 'play' && game.turn === seatToFlip && !!view.game;
  const done = game.phase === 'done';
  const w = winner(game);

  return (
    <main className="game">
      <section className="side" aria-label="Scores">
        <div className="scoreboard">
          {([0, 1] as Seat[]).map((s) => (
            <div
              key={s}
              className={`player ${view.game && !done && game.turn === s ? 'active' : ''}`}
              style={{ '--pc': `var(--p${s})` } as React.CSSProperties}
            >
              <span className="pname">
                {names[s]}
                {mySeat === s ? ' (you)' : ''}
              </span>
              <span className="score" aria-label={`${game.scores[s]} pairs`}>
                {game.scores[s]}
              </span>
            </div>
          ))}
        </div>
        <TurnStatus view={view} game={game} mySeat={mySeat} />
        <div className="tools">
          <SoundToggle muted={muted} onToggle={onToggleMute} />
          <button type="button" className="btn small" onClick={onLeave}>
            Leave
          </button>
        </div>
      </section>

      <div className="board-wrap">
        <Board theme={theme} game={game} canFlip={canFlip} onFlip={onFlip} />
      </div>

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {banner && (
        <div className="banner" role="status">
          {banner}
        </div>
      )}

      {view.status === 'countdown' && (
        <div className="overlay" role="status">
          <div className="dialog">
            <h1>{mySeat === 1 ? `Joined ${names[0]}'s game!` : `${names[1]} joined!`}</h1>
            <p className="big-count">{view.countdown}</p>
          </div>
        </div>
      )}

      {done && (
        <div className="overlay">
          <div className="dialog" role="dialog" aria-label="Game over">
            <h1>{w === 'draw' ? "It's a draw!" : mySeat !== null ? (w === mySeat ? 'You win!' : `${names[w as Seat]} wins`) : `${names[w as Seat]} wins!`}</h1>
            <p className="final">
              {names[0]} {game.scores[0]} – {game.scores[1]} {names[1]}
            </p>
            {online && mySeat !== null && view.rematch[other(mySeat)] && !view.rematch[mySeat] && (
              <p>{names[other(mySeat)]} wants a rematch!</p>
            )}
            <div className="row">
              <button
                type="button"
                className="btn primary"
                onClick={onRematch}
                disabled={online && mySeat !== null && view.rematch[mySeat]}
              >
                {online && mySeat !== null && view.rematch[mySeat] ? 'Waiting for opponent…' : 'Rematch'}
              </button>
              <button type="button" className="btn" onClick={onLeave}>
                Home
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function TurnStatus({ view, game, mySeat }: { view: SessionView; game: Game; mySeat: Seat | null }) {
  const { names, timerSec } = view.config;
  const running = !!view.game && !view.paused && game.phase !== 'done' && view.status === 'playing';
  const [left, setLeft] = useState(timerSec ?? 0);

  useEffect(() => {
    if (timerSec === null || !running) return;
    const start = Date.now();
    setLeft(timerSec);
    const id = setInterval(() => setLeft(Math.max(0, Math.ceil(timerSec - (Date.now() - start) / 1000))), 250);
    return () => clearInterval(id);
  }, [timerSec, game.turnSeq, running]);

  if (!view.game || game.phase === 'done') return <p className="turn">&nbsp;</p>;
  const text = mySeat === null ? `${names[game.turn]}'s turn` : game.turn === mySeat ? 'Your turn' : `${names[game.turn]}'s turn`;
  return (
    <div className="turn-wrap" style={{ '--pc': `var(--p${game.turn})` } as React.CSSProperties}>
      <p className="turn">
        {text}
        {timerSec !== null && <span className="secs"> · {left}s</span>}
      </p>
      {timerSec !== null && (
        <div className="timer" aria-hidden="true">
          <i
            key={`${game.turnSeq}-${running}`}
            style={{ animationDuration: `${timerSec}s`, animationPlayState: running && game.phase === 'play' ? 'running' : 'paused' }}
          />
        </div>
      )}
    </div>
  );
}
