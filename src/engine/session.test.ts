import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MISS_DELAY_MS, Session } from './session';
import { Game } from './game';

const config = { themeId: 'summer', timerSec: 15 as number | null, names: ['A', 'B'] as [string, string] };
const partner = (g: Game, i: number) => g.cards.findIndex((c, j) => j !== i && c.pair === g.cards[i].pair);
const nonPartner = (g: Game, i: number) => g.cards.findIndex((c, j) => j !== i && c.pair !== g.cards[i].pair);

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const started = (cfg = config, first: 0 | 1 = 0) => {
  const s = new Session(cfg);
  s.startGame(first);
  return s;
};

describe('Session', () => {
  it('resolves a miss after a delay and passes the turn', () => {
    const s = started();
    const g = s.game!;
    s.flip(0, 0);
    s.flip(0, nonPartner(g, 0));
    expect(s.game!.phase).toBe('resolve');
    s.flip(0, 63);
    expect(s.game!.flipped).toHaveLength(2);
    vi.advanceTimersByTime(MISS_DELAY_MS);
    expect(s.game!.turn).toBe(1);
    expect(s.game!.phase).toBe('play');
  });

  it('keeps the turn after a match', () => {
    const s = started();
    s.flip(0, 0);
    s.flip(0, partner(s.game!, 0));
    vi.advanceTimersByTime(MISS_DELAY_MS);
    expect(s.game!.turn).toBe(0);
    expect(s.game!.scores[0]).toBe(1);
  });

  it('passes the turn when the turn timer runs out, and restarts after a match', () => {
    const s = started();
    vi.advanceTimersByTime(15_000);
    expect(s.game!.turn).toBe(1);
    s.flip(1, 0);
    s.flip(1, partner(s.game!, 0));
    vi.advanceTimersByTime(MISS_DELAY_MS);
    expect(s.game!.turn).toBe(1);
    vi.advanceTimersByTime(14_000);
    expect(s.game!.turn).toBe(1);
    vi.advanceTimersByTime(1_000);
    expect(s.game!.turn).toBe(0);
  });

  it('does not run a timer when the timer is off', () => {
    const s = started({ ...config, timerSec: null });
    vi.advanceTimersByTime(120_000);
    expect(s.game!.turn).toBe(0);
  });

  it('pauses: ignores flips and stops the timer; resumes with a fresh timer', () => {
    const s = started();
    s.setPaused(true);
    s.flip(0, 0);
    expect(s.game!.flipped).toEqual([]);
    vi.advanceTimersByTime(60_000);
    expect(s.game!.turn).toBe(0);
    s.setPaused(false);
    vi.advanceTimersByTime(14_999);
    expect(s.game!.turn).toBe(0);
    vi.advanceTimersByTime(1);
    expect(s.game!.turn).toBe(1);
  });

  it('counts down then starts the game', () => {
    const s = new Session(config);
    s.beginCountdown();
    expect(s.status).toBe('countdown');
    expect(s.countdown).toBe(3);
    vi.advanceTimersByTime(3000);
    expect(s.status).toBe('playing');
    expect(s.game).not.toBeNull();
  });

  const finish = (s: Session) => {
    while (s.game!.phase !== 'done') {
      const g = s.game!;
      const i = g.cards.findIndex((c) => c.status === 'down');
      s.flip(g.turn, i);
      s.flip(g.turn, partner(s.game!, i));
      vi.advanceTimersByTime(MISS_DELAY_MS);
    }
  };

  it('rematch needs both players online, and the loser goes first', () => {
    const s = started(config, 0);
    finish(s);
    expect(s.game!.scores).toEqual([32, 0]);
    s.requestRematch(0);
    expect(s.game!.phase).toBe('done');
    expect(s.rematch).toEqual([true, false]);
    s.requestRematch(1);
    expect(s.game!.phase).toBe('play');
    expect(s.game!.turn).toBe(1);
    expect(s.game!.scores).toEqual([0, 0]);
  });

  it('settings change only between games, and apply to the rematch', () => {
    const s = started(config, 0);
    s.updateSettings({ themeId: 'sports', timerSec: null });
    expect(s.config.themeId).toBe('summer');
    finish(s);
    s.updateSettings({ themeId: 'sports', timerSec: null });
    expect(s.config).toMatchObject({ themeId: 'sports', timerSec: null });
    s.requestRematch(0);
    s.requestRematch(1);
    vi.advanceTimersByTime(120_000);
    expect(s.game!.turn).toBe(1);
    expect(s.game!.scores).toEqual([0, 0]);
  });

  it('rematch is immediate in local mode', () => {
    const s = new Session(config, true);
    s.startGame(0);
    finish(s);
    s.requestRematch(0);
    expect(s.game!.phase).toBe('play');
  });

  it('saves and restores a game in progress as paused', () => {
    const s = started();
    s.flip(0, 0);
    const restored = Session.restore(s.toSaved('tok'));
    expect(restored.paused).toBe(true);
    expect(restored.game!.flipped).toEqual([0]);
    expect(restored.status).toBe('playing');
  });

  it('never exposes face-down values in the view', () => {
    const s = started();
    s.flip(0, 7);
    const v = s.view().game!;
    expect(v.cards.filter((c) => c.pair !== -1)).toHaveLength(1);
  });
});
