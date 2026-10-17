import { THEMES, strokeColor, tileColor, themeVars } from '../themes';
import type { Theme } from '../themes/types';
import { ItemIcon } from './ItemIcon';

export function ThemePicker({ themeId, onSelect, labelledBy }: { themeId: string; onSelect: (id: string) => void; labelledBy: string }) {
  return (
    <div className="themes" role="radiogroup" aria-labelledby={labelledBy}>
      {THEMES.map((t) => (
        <ThemeChoice key={t.id} theme={t} selected={t.id === themeId} onSelect={() => onSelect(t.id)} />
      ))}
    </div>
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

export function TimerField({ on, seconds, onChange }: { on: boolean; seconds: number; onChange: (patch: { timerOn?: boolean; timerSec?: number }) => void }) {
  return (
    <div className="field">
      <label className="check">
        <input type="checkbox" checked={on} onChange={(e) => onChange({ timerOn: e.target.checked })} />
        <span>Turn timer</span>
      </label>
      <div className="slider" style={{ opacity: on ? 1 : 0.45 }}>
        <input
          type="range"
          min={10}
          max={30}
          step={1}
          value={seconds}
          disabled={!on}
          aria-label="Seconds per turn"
          onChange={(e) => onChange({ timerSec: Number(e.target.value) })}
        />
        <output>{seconds}s</output>
      </div>
    </div>
  );
}
