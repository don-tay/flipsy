import type { Settings } from '../lib/storage';
import { ThemePicker, TimerField } from './SettingsFields';
import { SoundToggle } from './SoundToggle';

interface Props {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onLocal: () => void;
  onOnline: () => void;
}

export function Home({ settings, onChange, onLocal, onOnline }: Props) {
  return (
    <main className="home">
      <header className="hero">
        <h1 className="logo">Flipsy</h1>
        <p>Find the pairs. Two players, one board.</p>
        <SoundToggle muted={settings.muted} onToggle={() => onChange({ muted: !settings.muted })} />
      </header>

      <div className="actions">
        <button type="button" className="btn primary big" onClick={onLocal}>
          Play on this device
        </button>
        <button type="button" className="btn big" onClick={onOnline}>
          Play online with a friend
        </button>
      </div>

      <section className="panel" aria-labelledby="theme-h">
        <h2 id="theme-h">Pick a theme</h2>
        <ThemePicker themeId={settings.themeId} onSelect={(themeId) => onChange({ themeId })} labelledBy="theme-h" />
      </section>

      <section className="panel">
        <h2>Game settings</h2>
        <label className="field">
          <span>Your name</span>
          <input value={settings.nick} maxLength={14} placeholder="Player 1" onChange={(e) => onChange({ nick: e.target.value })} />
        </label>
        <label className="field">
          <span>Second player (same device)</span>
          <input value={settings.nick2} maxLength={14} placeholder="Player 2" onChange={(e) => onChange({ nick2: e.target.value })} />
        </label>
        <TimerField on={settings.timerOn} seconds={settings.timerSec} onChange={onChange} />
      </section>

      <footer className="foot">
        Icons: Hugeicons Free &amp; Tabler (MIT). <a href="./licenses.txt">Licences</a> · <a href="#/themes">All icons</a>
      </footer>
    </main>
  );
}
