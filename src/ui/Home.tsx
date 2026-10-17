import { THEMES, strokeColor, tileColor, themeVars } from '../themes';
import type { Theme } from '../themes/types';
import type { Settings } from '../lib/storage';
import { ItemIcon } from './ItemIcon';
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
        <div className="themes" role="radiogroup" aria-labelledby="theme-h">
          {THEMES.map((t) => (
            <ThemeChoice key={t.id} theme={t} selected={t.id === settings.themeId} onSelect={() => onChange({ themeId: t.id })} />
          ))}
        </div>
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
        <div className="field">
          <label className="check">
            <input type="checkbox" checked={settings.timerOn} onChange={(e) => onChange({ timerOn: e.target.checked })} />
            <span>Turn timer</span>
          </label>
          <div className="slider" aria-hidden={!settings.timerOn} style={{ opacity: settings.timerOn ? 1 : 0.45 }}>
            <input
              type="range"
              min={10}
              max={30}
              step={1}
              value={settings.timerSec}
              disabled={!settings.timerOn}
              aria-label="Seconds per turn"
              onChange={(e) => onChange({ timerSec: Number(e.target.value) })}
            />
            <output>{settings.timerSec}s</output>
          </div>
        </div>
      </section>

      <footer className="foot">
        Icons: Hugeicons Free &amp; Tabler (MIT). <a href="./licenses.txt">Licences</a> · <a href="#/themes">All icons</a>
      </footer>
    </main>
  );
}

function ThemeChoice({ theme, selected, onSelect }: { theme: Theme; selected: boolean; onSelect: () => void }) {
  const vars = themeVars(theme);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`theme-choice ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ background: theme.colors.surface, color: theme.colors.text, fontFamily: theme.font, borderColor: selected ? theme.colors.accent : 'transparent', ['--accent' as string]: vars['--accent'] }}
    >
      <span className="mini">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ background: tileColor(theme, i), color: strokeColor(theme, i), borderRadius: `${theme.radius}%` }}>
            <ItemIcon icon={theme.items[i].icon} stroke={theme.stroke} />
          </span>
        ))}
      </span>
      <strong>{theme.name}</strong>
      <small style={{ color: theme.colors.muted }}>{theme.tagline}</small>
    </button>
  );
}
