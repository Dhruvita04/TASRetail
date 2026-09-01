import React, { createContext, useContext, useEffect, useState } from 'react';
import type { BankTheme } from './Banktheme.types';
import { bankThemes } from './Bankthemes';
import { fallbackTheme } from './Fallbacktheme';
import { deriveTheme } from './Derivetheme';

const ThemeContext = createContext<BankTheme | null>(null);

export function useBankTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useBankTheme must be used inside ThemeProvider');
  return ctx;
}

function applyCssVariables(theme: BankTheme) {
  const root = document.documentElement.style;
  root.setProperty('--brand-primary', theme.primary);
  root.setProperty('--brand-primary-hover', theme.primaryHover);
  root.setProperty('--brand-primary-active', theme.primaryActive);
  root.setProperty('--brand-primary-disabled', theme.primaryDisabled);
  root.setProperty('--brand-primary-text', theme.textOnPrimary);
  root.setProperty('--brand-accent', theme.accent);
  root.setProperty('--brand-accent-focus-ring', theme.accentFocusRing);
}

export function ThemeProvider({
  sourceid,
  children,
}: {
  sourceid: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<BankTheme | null>(null);

  // Re-runs every time `sourceid` changes — this single effect is the
  // entire "theme updates automatically" mechanism. Nothing else in the
  // component tree needs to know sourceid changed; they just re-render
  // because the context value (and the CSS variables) changed underneath them.
  useEffect(() => {
    const raw = bankThemes[sourceid] ?? fallbackTheme;
    const resolved = deriveTheme(raw);
    applyCssVariables(resolved);
    setTheme(resolved);
  }, [sourceid]);

  if (!theme) return null; // avoids a flash of unstyled content on first mount

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}