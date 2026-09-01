import type { BankThemeInput } from './Banktheme.types';

// Used whenever a sourceid has no entry in bankThemes.ts,
// or the theme API call fails. Keeps the journey from breaking
// instead of showing a broken/blank page.
export const fallbackTheme: BankThemeInput = {
  sourceid: 'DEFAULT',
  bankName: 'HDFC',
  logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH-TOLsBcK7E5nYRz7IcBE8yCBBiohAygzBRndaFXT3Q&s=10',
  colors: {
    primary: '#2C5F9E',
    accent: '#1D9E75',
  },
};