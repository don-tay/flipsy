export type Seat = 0 | 1;
export const PAIRS = 32;

export type CardStatus = 'down' | 'up' | 'matched';
export interface Card {
  pair: number;
  status: CardStatus;
  by: Seat | null;
}
export type Phase = 'play' | 'resolve' | 'done';

export interface Game {
  cards: Card[];
  scores: [number, number];
  turn: Seat;
  first: Seat;
  flipped: number[];
  phase: Phase;
  turnSeq: number;
}

export type Rng = () => number;

export const other = (s: Seat): Seat => (s === 0 ? 1 : 0);

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newGame(first: Seat, rng: Rng = Math.random): Game {
  const pairs = Array.from({ length: PAIRS }, (_, i) => i);
  const deck = shuffle([...pairs, ...pairs], rng);
  return {
    cards: deck.map((pair) => ({ pair, status: 'down', by: null })),
    scores: [0, 0],
    turn: first,
    first,
    flipped: [],
    phase: 'play',
    turnSeq: 0,
  };
}

export function flip(g: Game, seat: Seat, index: number): Game {
  const card = g.cards[index];
  if (g.phase !== 'play' || seat !== g.turn || !card || card.status !== 'down') return g;
  const cards = g.cards.slice();
  cards[index] = { ...card, status: 'up' };
  const flipped = [...g.flipped, index];
  return { ...g, cards, flipped, phase: flipped.length === 2 ? 'resolve' : 'play' };
}

export function isMatch(g: Game): boolean {
  const [a, b] = g.flipped;
  return g.flipped.length === 2 && g.cards[a].pair === g.cards[b].pair;
}

const faceDown = (g: Game): Card[] =>
  g.cards.map((c, i) => (g.flipped.includes(i) ? { ...c, status: 'down' } : c));

export function resolve(g: Game): Game {
  if (g.phase !== 'resolve') return g;
  if (isMatch(g)) {
    const cards = g.cards.map((c, i) =>
      g.flipped.includes(i) ? { ...c, status: 'matched' as const, by: g.turn } : c,
    );
    const scores: [number, number] = [...g.scores];
    scores[g.turn] += 1;
    const done = cards.every((c) => c.status === 'matched');
    return { ...g, cards, scores, flipped: [], phase: done ? 'done' : 'play', turnSeq: g.turnSeq + 1 };
  }
  return { ...g, cards: faceDown(g), flipped: [], turn: other(g.turn), phase: 'play', turnSeq: g.turnSeq + 1 };
}

export function timeout(g: Game): Game {
  if (g.phase !== 'play') return g;
  return { ...g, cards: faceDown(g), flipped: [], turn: other(g.turn), turnSeq: g.turnSeq + 1 };
}

export function winner(g: Game): Seat | 'draw' | null {
  if (g.phase !== 'done') return null;
  if (g.scores[0] === g.scores[1]) return 'draw';
  return g.scores[0] > g.scores[1] ? 0 : 1;
}

export function redact(g: Game): Game {
  return { ...g, cards: g.cards.map((c) => (c.status === 'down' ? { ...c, pair: -1 } : c)) };
}
