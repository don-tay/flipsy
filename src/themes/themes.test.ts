import { describe, expect, it } from 'vitest';
import { contrast } from '../lib/color';
import { PAIRS } from '../engine/game';
import { THEMES, strokeColor, themeVars, tileColor } from './index';

describe.each(THEMES)('theme $id', (t) => {
  it(`has ${PAIRS} distinct items`, () => {
    expect(t.items).toHaveLength(PAIRS);
    expect(new Set(t.items.map((i) => i.name)).size).toBe(PAIRS);
    expect(new Set(t.items.map((i) => JSON.stringify(i.icon))).size).toBe(PAIRS);
  });

  it('has readable text and UI colours', () => {
    const { colors } = t;
    expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.muted, colors.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.accent, themeVars(t)['--on-accent'])).toBeGreaterThanOrEqual(4.5);
    colors.players.forEach((p) => expect(contrast(p, colors.surface)).toBeGreaterThanOrEqual(3));
    colors.players.forEach((p) => expect(contrast(p, colors.background)).toBeGreaterThanOrEqual(3));
  });

  it('draws every icon with at least 4.5:1 contrast on its tile', () => {
    t.items.forEach((item, i) => {
      expect(contrast(tileColor(t, i), strokeColor(t, i)), item.name).toBeGreaterThanOrEqual(4.5);
    });
  });
});
