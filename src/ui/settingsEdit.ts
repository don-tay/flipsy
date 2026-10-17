import type { Session } from '../engine/session';
import type { Settings } from '../lib/storage';

export interface SettingsEdit {
  themeId: string;
  timerOn: boolean;
  timerSec: number;
  onChange: (patch: Partial<Settings>) => void;
}

/** Lets a player change theme/timer between games; also remembers the choice for next time. */
export function settingsEdit(session: Session, settings: Settings, onSettings: (patch: Partial<Settings>) => void): SettingsEdit {
  const cur = {
    themeId: session.config.themeId,
    timerOn: session.config.timerSec !== null,
    timerSec: session.config.timerSec ?? settings.timerSec,
  };
  return {
    ...cur,
    onChange: (patch) => {
      onSettings(patch);
      const next = { ...cur, ...patch };
      session.updateSettings({ themeId: next.themeId, timerSec: next.timerOn ? next.timerSec : null });
    },
  };
}
