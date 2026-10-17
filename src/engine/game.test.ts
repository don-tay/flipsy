import { describe, expect, it } from 'vitest';
import { PAIRS, flip, isMatch, newGame, other, redact, resolve, timeout, winner, Game } from './game';

const seeded = (seed = 1) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

/** Index of the other card with the same pair as `i`. */
const partner = (g: Game, i: number) => g.cards.findIndex((c, j) => j !== i && c.pair === g.cards[i].pair);
const nonPartner = (g: Game, i: number) => g.cards.findIndex((c, j) => j !== i && c.pair !== g.cards[i].pair);

describe('newGame', () => {
  it('deals 64 cards forming 32 pairs, all face down', () => {
    const g = newGame(0, seeded());
    expect(g.cards).toHaveLength(PAIRS * 2);
    const counts = new Map<number, number>();
    g.cards.forEach((c) => counts.set(c.pair, (counts.get(c.pair) ?? 0) + 1));
    expect(counts.size).toBe(PAIRS);
    expect([...counts.values()].every((n) => n === 2)).toBe(true);
    expect(g.cards.every((c) => c.status === 'down')).toBe(true);
  });

  it('shuffles', () => {
    expect(newGame(0, seeded(1)).cards.map((c) => c.pair)).not.toEqual(newGame(0, seeded(2)).cards.map((c) => c.pair));
  });
});

describe('flip / resolve', () => {
  it('a match scores, keeps the turn, and marks cards matched', () => {
    let g = newGame(0, seeded());
    g = flip(g, 0, 0);
    g = flip(g, 0, partner(g, 0));
    expect(g.phase).toBe('resolve');
    expect(isMatch(g)).toBe(true);
    g = resolve(g);
    expect(g.scores).toEqual([1, 0]);
    expect(g.turn).toBe(0);
    expect(g.cards.filter((c) => c.status === 'matched')).toHaveLength(2);
    expect(g.cards[0].by).toBe(0);
    expect(g.phase).toBe('play');
  });

  it('a miss flips both cards back and passes the turn', () => {
    let g = newGame(0, seeded());
    g = flip(g, 0, 0);
    g = flip(g, 0, nonPartner(g, 0));
    g = resolve(g);
    expect(g.scores).toEqual([0, 0]);
    expect(g.turn).toBe(1);
    expect(g.cards.every((c) => c.status === 'down')).toBe(true);
  });

  it('ignores illegal flips', () => {
    const g = newGame(0, seeded());
    expect(flip(g, 1, 0)).toBe(g);
    expect(flip(g, 0, 99)).toBe(g);
    const one = flip(g, 0, 0);
    expect(flip(one, 0, 0)).toBe(one);
    const two = flip(one, 0, nonPartner(one, 0));
    expect(flip(two, 0, 63)).toBe(two);
  });

  it('declares a winner, a draw, and redacts face-down cards', () => {
    let g = newGame(1, seeded());
    for (let i = 0; i < g.cards.length; i++) {
      if (g.cards[i].status !== 'down') continue;
      g = resolve(flip(flip(g, g.turn, i), g.turn, partner(g, i)));
    }
    expect(g.phase).toBe('done');
    expect(winner(g)).toBe(1);
    expect(winner({ ...g, scores: [16, 16] })).toBe('draw');
    expect(winner({ ...g, phase: 'play' })).toBeNull();

    const fresh = flip(newGame(0, seeded()), 0, 3);
    const view = redact(fresh);
    expect(view.cards[3].pair).toBe(fresh.cards[3].pair);
    expect(view.cards.filter((_, i) => i !== 3).every((c) => c.pair === -1)).toBe(true);
  });
});

describe('timeout', () => {
  it('passes the turn and flips any open card back', () => {
    let g = flip(newGame(0, seeded()), 0, 5);
    g = timeout(g);
    expect(g.turn).toBe(other(0));
    expect(g.cards[5].status).toBe('down');
    expect(g.flipped).toEqual([]);
    expect(g.turnSeq).toBe(1);
  });

  it('does nothing while a pair is being resolved', () => {
    let g = newGame(0, seeded());
    g = flip(flip(g, 0, 0), 0, nonPartner(g, 0));
    expect(timeout(g)).toBe(g);
  });
});
