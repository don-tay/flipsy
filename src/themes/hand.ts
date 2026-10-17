import type { IconData } from './types';

/** Build a hand-drawn icon in the same 24px, rounded-stroke style as Hugeicons. */
export const hand = (...paths: string[]): IconData =>
  paths.map((d) => ['path', { d, stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' }] as const);

const dot = (x: number, y: number, r = 0.6) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const ticks = (cx: number, cy: number, r1: number, r2: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const f = (r: number, fn: (x: number) => number) => (cx + r * fn(a)).toFixed(2);
    return `M${f(r1, Math.cos)} ${(cy + r1 * Math.sin(a)).toFixed(2)}L${f(r2, Math.cos)} ${(cy + r2 * Math.sin(a)).toFixed(2)}`;
  }).join('');

export const pear = hand(
  'M12 8C9 8 7.5 10 7.5 12.5C7.5 14 6 15 6 17.5C6 20 8.5 22 12 22C15.5 22 18 20 18 17.5C18 15 16.5 14 16.5 12.5C16.5 10 15 8 12 8Z',
  'M12 8V5',
  'M12 5.5C12.5 3.5 14.5 2.5 16.5 3C16 5 14.5 6 12 5.5Z',
);
export const strawberry = hand(
  'M12 21C8 19 4.5 14.5 5 10C5.3 8 7 7 9 7H15C17 7 18.7 8 19 10C19.5 14.5 16 19 12 21Z',
  'M8.5 6.5L12 4.5L15.5 6.5',
  'M12 4.5V2.5',
  dot(9, 11),
  dot(15, 11),
  dot(12, 14),
  dot(10, 17),
  dot(14, 17),
);
export const pineapple = hand(
  'M12 10C8.5 10 7 13 7 16C7 19.5 9 22 12 22C15 22 17 19.5 17 16C17 13 15.5 10 12 10Z',
  'M12 10C12 7 10 5 8 4.5',
  'M12 10C12 7 14 5 16 4.5',
  'M12 10V3',
  'M7.5 15L14 21.5',
  'M16.5 15L10 21.5',
);
export const coconut = hand(
  'M3 11H21C21 16.5 17 21 12 21C7 21 3 16.5 3 11Z',
  'M3 11C3 9 7 7.5 12 7.5C17 7.5 21 9 21 11',
  'M14 7.5L17 3',
  'M9 15.5C10.5 16.8 13.5 16.8 15 15.5',
);
export const mango = hand(
  'M7 6C10 3.5 17 4 19 9C21 14 16 20 11 20.5C6 21 3.5 15 5 10.5C5.5 8.5 6 7 7 6Z',
  'M13 4.5C13.5 3 15 2.2 17 2.5',
  'M8 11C8.3 13 9.5 15 11 16',
);
export const kiwi = hand(
  'M12 3C7 3 3.5 7 3.5 12C3.5 17 7 21 12 21C17 21 20.5 17 20.5 12C20.5 7 17 3 12 3Z',
  dot(12, 12, 2),
  ticks(12, 12, 4.2, 6.2, 8),
);
export const peach = hand(
  'M12 6.5C8 4.5 3.5 8 4 13C4.5 18 8.5 21.5 12 21.5C15.5 21.5 19.5 18 20 13C20.5 8 16 4.5 12 6.5Z',
  'M12 6.5C10.5 10 10.5 15 12 21.5',
  'M12 6.5C12 4.5 13.5 3 16 3C16 5 14.5 6.5 12 6.5Z',
);
export const plum = hand(
  'M12 7C7.5 7 4.5 10 4.5 14C4.5 18 8 21 12 21C16 21 19.5 18 19.5 14C19.5 10 16.5 7 12 7Z',
  'M12 7C12 5 12.5 3.5 14 2.5',
  'M8 14C8 12.5 8.7 11.4 9.7 10.8',
);
export const tomato = hand(
  'M12 6.5C6 6.5 3 10 3 14C3 18.5 7 21 12 21C17 21 21 18.5 21 14C21 10 18 6.5 12 6.5Z',
  'M7.5 8.5L10 9.5L12 7.5L14 9.5L16.5 8.5',
  'M12 7.5V4',
);
export const cucumber = hand(
  'M5 14.5L14.5 5C16 3.5 18.5 3.5 20 5C21.5 6.5 21.5 9 20 10.5L10.5 20C9 21.5 6.5 21.5 5 20C3.5 18.5 3.5 16 5 14.5Z',
  'M9.5 11L11 12.5',
  'M13 8.5L14.5 10',
  'M7 15L8.5 16.5',
  'M15 14L16.5 15.5',
);
export const lettuce = hand(
  'M12 21C7 21 4 18 4 14C2.5 12.5 3 10 5 9.5C4.5 7.5 6.5 5.5 9 6C10 4 14 4 15 6C17.5 5.5 19.5 7.5 19 9.5C21 10 21.5 12.5 20 14C20 18 17 21 12 21Z',
  'M12 21V10',
  'M12 16L8.5 12.5',
  'M12 16L15.5 12.5',
  'M12 12.5L9.5 9.5',
  'M12 12.5L14.5 9.5',
);
export const onion = hand(
  'M12 6C14 9 20 10 20 15C20 19 16.5 21.5 12 21.5C7.5 21.5 4 19 4 15C4 10 10 9 12 6Z',
  'M12 6C12 4.5 11.5 3.5 11 2.5',
  'M12 6C12 4.5 13 3.5 14 3',
  'M12 7C9.5 10 8.5 14 9.5 21',
  'M12 7C14.5 10 15.5 14 14.5 21',
);
export const garlic = hand(
  'M12 5C14.5 8 19 9.5 19 14.5C19 18.5 16 21 12 21C8 21 5 18.5 5 14.5C5 9.5 9.5 8 12 5Z',
  'M12 5V2.5',
  'M12 8C10 11 9.5 16 11 21',
  'M12 8C14 11 14.5 16 13 21',
);
export const eggplant = hand(
  'M12 7C9 7 8 9 7 12C6 15.5 7 19 9.5 20.5C11 21.4 13 21.4 14.5 20.5C17 19 18 15.5 17 12C16 9 15 7 12 7Z',
  'M8 8.5C9 7 10.5 6.5 12 7C13.5 6.5 15 7 16 8.5',
  'M12 7V3',
  'M9.5 13C9.5 15 10 17 11 18.5',
);
export const radish = hand(
  'M12 9C7.5 9 5.5 12.5 7.5 16C9 18.5 11 20.5 12 22C13 20.5 15 18.5 16.5 16C18.5 12.5 16.5 9 12 9Z',
  'M12 9C12 6.5 10.5 4.5 8 3.5',
  'M12 9V3',
  'M12 9C12 6.5 13.5 4.5 16 3.5',
);
export const beet = hand(
  'M12 8C7.5 8 4.5 11.5 5 15.5C5.5 19 8.5 21 11.5 21C15.5 21 19 18.5 19 14.5C19 10.5 16 8 12 8Z',
  'M12 8C11 6 9 4.5 7 4.5',
  'M12 8C12.5 6 14.5 4 17 3.5',
  'M12 8V3',
  'M11.5 21L11 23',
);

/** Lemon from Tabler Icons (MIT, (c) 2020-2026 Pawel Kuna), redrawn on a 1.5-stroke grid. */
export const lemon = hand(
  'M17.536 3.393c3.905 3.906 3.905 10.237 0 14.143c-3.906 3.905 -10.237 3.905 -14.143 0l14.143 -14.143',
  'M5.868 15.06a6.5 6.5 0 0 0 9.193 -9.192',
  'M10.464 10.464l4.597 4.597',
  'M10.464 10.464v6.364',
  'M10.464 10.464h6.364',
);
