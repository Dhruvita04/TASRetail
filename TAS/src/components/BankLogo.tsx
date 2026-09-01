import React, { useEffect, useState } from 'react';
import './BankLogo.css';

interface BankLogoProps {
  logoUrl?: string;
  bankName: string;
}

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function BankLogo({ logoUrl, bankName }: BankLogoProps) {
  const [failed, setFailed] = useState(false);

  // IMPORTANT: without this, switching from a bank whose logo failed to
  // load to a different bank would incorrectly keep showing the fallback,
  // since `failed` is component state that otherwise persists across
  // prop changes on the same mounted component.
  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);

  if (logoUrl && !failed) {
    return (
      <img
        className="bank-logo"
        src={logoUrl}
        alt={`${bankName} logo`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="bank-logo bank-logo--fallback" aria-label={`${bankName} logo`}>
      {initialsOf(bankName)}
    </div>
  );
}