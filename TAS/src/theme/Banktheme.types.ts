// The raw input every bank supplies (or you enter on their behalf).
// This is intentionally small — everything else gets computed from it.
export interface BankThemeInput {
  sourceid: string;
  bankName: string;
  logoUrl: string;
  colors: {
    primary: string;   // e.g. '#004C8F'
    accent?: string;   // optional — derived from primary if omitted
  };
}

// The full set of tokens components actually consume.
// Produced by deriveTheme() — never written by hand.
export interface BankTheme {
  sourceid: string;
  bankName: string;
  logoUrl: string;
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryDisabled: string;
  textOnPrimary: string;   // '#FFFFFF' or '#000000'
  accent: string;
  accentFocusRing: string;
}