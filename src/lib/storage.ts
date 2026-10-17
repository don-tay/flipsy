import type { Saved } from '../engine/session';

export interface Settings {
  themeId: string;
  timerOn: boolean;
  timerSec: number;
  nick: string;
  nick2: string;
  muted: boolean;
}

export const DEFAULT_SETTINGS: Settings = { themeId: 'summer', timerOn: false, timerSec: 15, nick: '', nick2: '', muted: false };

const read = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode): the game still works, it just can't be resumed */
  }
};

export const loadSettings = (): Settings => ({ ...DEFAULT_SETTINGS, ...read<Partial<Settings>>('flipsy:settings') });
export const saveSettings = (s: Settings) => write('flipsy:settings', s);

const roomKey = (id: string) => `flipsy:room:${id}`;
export const loadHostRoom = (id: string): Saved | null => read<Saved>(roomKey(id));
export const saveHostRoom = (id: string, saved: Saved) => write(roomKey(id), saved);
export const deleteHostRoom = (id: string) => localStorage.removeItem(roomKey(id));

export function guestToken(roomId: string): string {
  const key = `flipsy:guest:${roomId}`;
  let token = read<string>(key);
  if (!token) {
    token = randomId(16);
    write(key, token);
  }
  return token;
}

export function randomId(length: number): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

export function pruneOldRooms(maxAgeMs = 24 * 3600 * 1000): void {
  try {
    for (const key of Object.keys(localStorage)) {
      if (!key.startsWith('flipsy:room:')) continue;
      const saved = read<Saved>(key);
      if (!saved || Date.now() - saved.ts > maxAgeMs) localStorage.removeItem(key);
    }
  } catch {
    /* ignore */
  }
}
