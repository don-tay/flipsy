import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { setMuted } from './lib/fx';
import { loadSettings, pruneOldRooms, randomId, saveHostRoom, saveSettings, type Settings } from './lib/storage';
import { getTheme } from './themes';
import { Home } from './ui/Home';
import { Local } from './ui/Local';
import { ThemesPreview } from './ui/ThemesPreview';
import { useApplyTheme } from './ui/useTheme';
import { Session } from './engine/session';

const useHash = (): [string, (h: string) => void] => {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const on = () => setHash(location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return [hash, (h) => (location.hash = h)];
};

const Room = lazy(() => import('./ui/Room'));

export function App() {
  const [hash, go] = useHash();
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);

  useEffect(() => {
    saveSettings(settings);
    setMuted(settings.muted);
  }, [settings]);
  useEffect(pruneOldRooms, []);

  const room = hash.match(/^#\/r\/([a-z0-9]+)$/)?.[1];
  const homeTheme = getTheme(settings.themeId);
  useApplyTheme(homeTheme);

  const toggleMute = () => update({ muted: !settings.muted });
  const home = () => go('#/');

  const createRoom = () => {
    const id = randomId(8);
    const config = {
      themeId: settings.themeId,
      timerSec: settings.timerOn ? settings.timerSec : null,
      names: [settings.nick.trim() || 'Player 1', 'Player 2'] as [string, string],
    };
    saveHostRoom(id, new Session(config).toSaved(null));
    go(`#/r/${id}`);
  };

  if (room)
    return (
      <Suspense fallback={null}>
        <Room key={room} roomId={room} settings={settings} onToggleMute={toggleMute} onHome={home} />
      </Suspense>
    );
  if (hash === '#/local') return <Local settings={settings} onToggleMute={toggleMute} onLeave={home} />;
  if (hash === '#/themes') return <ThemesPreview />;
  return <Home settings={settings} onChange={update} onLocal={() => go('#/local')} onOnline={createRoom} />;
}
