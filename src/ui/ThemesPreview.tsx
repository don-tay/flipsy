import { THEMES, strokeColor, tileColor, themeVars } from '../themes';

/** Dev page: every item of every theme, to spot look-alikes at a glance. */
export function ThemesPreview() {
  return (
    <main className="preview">
      <p><a href="#/">← Back</a></p>
      {THEMES.map((t) => (
        <section key={t.id} style={{ ...themeVars(t), background: 'var(--surface)', color: 'var(--text)', fontFamily: t.font } as React.CSSProperties}>
          <h2>{t.name}</h2>
          <div className="preview-grid">
            {t.items.map((item, i) => (
              <figure key={item.name}>
                <span style={{ background: tileColor(t, i), color: strokeColor(t, i), borderRadius: `${t.radius}%` }}>
                  <svg viewBox="0 0 24 24" fill="none">
                    {item.icon.map(([, { key: _key, ...attrs }], k) => (
                      <path key={k} {...attrs} strokeWidth={t.stroke} />
                    ))}
                  </svg>
                </span>
                <figcaption>{item.name}</figcaption>
              </figure>
            ))}
            <span className="back-sample" style={{ background: t.cardBack, borderColor: t.cardBackEdge, borderRadius: `${t.radius}%` }} />
          </div>
        </section>
      ))}
    </main>
  );
}
