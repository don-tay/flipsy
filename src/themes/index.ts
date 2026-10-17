import { desk } from './desk';
import { market } from './market';
import { snacks } from './snacks';
import { sports } from './sports';
import { summer } from './summer';
import type { Theme } from './types';
import { vehicles } from './vehicles';
import { bestOf } from '../lib/color';

export const THEMES: Theme[] = [summer, sports, vehicles, snacks, market, desk];
export const DEFAULT_THEME_ID = summer.id;

export const getTheme = (id: string): Theme => THEMES.find((t) => t.id === id) ?? summer;

export const toneOf = (theme: Theme, index: number): number => theme.items[index].tone ?? index % theme.tiles.length;
export const tileColor = (theme: Theme, index: number): string => theme.tiles[toneOf(theme, index)];
export const strokeColor = (theme: Theme, index: number): string =>
  bestOf(tileColor(theme, index), theme.colors.ink, theme.colors.paper);

export function themeVars(t: Theme): Record<string, string> {
  const { colors } = t;
  return {
    '--bg': colors.background,
    '--page': t.page,
    '--surface': colors.surface,
    '--text': colors.text,
    '--muted': colors.muted,
    '--accent': colors.accent,
    '--on-accent': bestOf(colors.accent, colors.ink, colors.paper),
    '--p0': colors.players[0],
    '--p1': colors.players[1],
    '--card-back': t.cardBack,
    '--card-edge': t.cardBackEdge,
    '--tile-radius': `${t.radius}%`,
    '--font': t.font,
  };
}
