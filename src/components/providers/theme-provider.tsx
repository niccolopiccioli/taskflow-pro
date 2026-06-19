'use client';

import { useEffect } from 'react';
import { useUIStore, ACCENT_OPTIONS } from '@/lib/store/use-ui-store';

function resolveTheme(theme: 'dark' | 'light' | 'system'): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);
  const accent = useUIStore((s) => s.accent);
  const reduceMotion = useUIStore((s) => s.reduceMotion);
  const compactMode = useUIStore((s) => s.compactMode);

  useEffect(() => {
    const root = document.documentElement;
    const resolved = resolveTheme(theme);

    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    const accentOption = ACCENT_OPTIONS.find((a) => a.id === accent) ?? ACCENT_OPTIONS[0];
    root.style.setProperty('--primary', accentOption.hsl);
    root.style.setProperty('--ring', accentOption.hsl);
    root.dataset.accent = accent;

    root.classList.toggle('reduce-motion', reduceMotion);
    root.classList.toggle('compact-ui', compactMode);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (theme === 'system') {
        root.classList.remove('light', 'dark');
        root.classList.add(resolveTheme('system'));
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme, accent, reduceMotion, compactMode]);

  return <>{children}</>;
}
