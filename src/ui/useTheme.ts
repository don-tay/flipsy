import { useEffect } from 'react';
import { themeVars } from '../themes';
import type { Theme } from '../themes/types';

export function useApplyTheme(theme: Theme): void {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars(theme)).forEach(([k, v]) => root.style.setProperty(k, v));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.colors.background);
  }, [theme]);
}
