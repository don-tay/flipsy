import { KeyboardEvent, useRef, useState } from 'react';
import type { Game } from '../engine/game';
import { strokeColor, tileColor } from '../themes';
import type { Theme } from '../themes/types';
import { ItemIcon } from './ItemIcon';

const COLS = 8;

interface Props {
  theme: Theme;
  game: Game;
  canFlip: boolean;
  onFlip: (index: number) => void;
}

export function Board({ theme, game, canFlip, onFlip }: Props) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [focusIdx, setFocusIdx] = useState(0);
  // Face-down cards arrive without their value; remember it so the face stays drawn while flipping back.
  const lastPair = useRef<number[]>([]);

  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -COLS, ArrowDown: COLS };
    const d = step[e.key];
    if (d === undefined) return;
    e.preventDefault();
    const col = focusIdx % COLS;
    if ((d === -1 && col === 0) || (d === 1 && col === COLS - 1)) return;
    const next = focusIdx + d;
    if (next < 0 || next >= game.cards.length) return;
    setFocusIdx(next);
    boardRef.current?.querySelector<HTMLButtonElement>(`[data-index="${next}"]`)?.focus();
  };

  return (
    <div ref={boardRef} className="board" role="group" aria-label="Memory board, 8 by 8 cards" onKeyDown={move}>
      {game.cards.map((card, i) => {
        if (card.pair >= 0) lastPair.current[i] = card.pair;
        const pair = lastPair.current[i];
        const open = card.status !== 'down';
        const item = pair !== undefined ? theme.items[pair] : undefined;
        const label = open && item ? `${item.name}${card.status === 'matched' ? ', matched' : ''}` : `Card ${i + 1}, face down`;
        return (
          <button
            key={i}
            type="button"
            data-index={i}
            className={`card ${card.status}`}
            aria-label={label}
            aria-disabled={!canFlip || card.status !== 'down'}
            tabIndex={i === focusIdx ? 0 : -1}
            onFocus={() => setFocusIdx(i)}
            onClick={() => canFlip && card.status === 'down' && onFlip(i)}
            style={card.by !== null ? ({ '--ring': `var(--p${card.by})` } as React.CSSProperties) : undefined}
          >
            <span className="card-inner">
              <span className="face back" />
              <span
                className="face front"
                style={item ? { background: tileColor(theme, pair), color: strokeColor(theme, pair) } : undefined}
              >
                {item && <ItemIcon icon={item.icon} stroke={theme.stroke} />}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
