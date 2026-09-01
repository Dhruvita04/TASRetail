import React from 'react';
import { useBankTheme } from '../theme/ThemeProvider';
import { BankLogo } from './BankLogo';
import './Navbar.css';

export function Navbar() {
  // This is the entire mechanism: Navbar never receives sourceid or colors
  // as props. It reads whatever ThemeProvider currently has resolved.
  // When ThemeProvider's sourceid prop changes upstream, it re-derives the
  // theme, this context value updates, and Navbar re-renders automatically.
  const theme = useBankTheme();

  return (
    <header className="navbar" style={{ backgroundColor: theme.primary }}>
      <BankLogo logoUrl={theme.logoUrl} bankName={theme.bankName} />

      <button
        type="button"
        className="navbar__profile"
        style={{ color: theme.textOnPrimary }}
        aria-label="Profile"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      </button>
    </header>
  );
}