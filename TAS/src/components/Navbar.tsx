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
    </header>
  );
}