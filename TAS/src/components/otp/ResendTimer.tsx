import React, { useState, useEffect } from 'react';
import './ResendTimer.css';

interface ResendTimerProps {
  initialSeconds?: number;
  onResend: () => void | Promise<void>;
  disabled?: boolean;
}

export function ResendTimer({ initialSeconds = 105, onResend, disabled = false }: ResendTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend();
      setSecondsLeft(initialSeconds); // Reset timer on successful resend
    } finally {
      setIsResending(false);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isExpired = secondsLeft === 0;

  return (
    <div className="resend-timer">
      <div className="resend-timer__countdown">
        OTP expires in <span className="resend-timer__time">{timeString}</span>
      </div>
      <button
        type="button"
        className="resend-timer__link"
        onClick={handleResend}
        disabled={isExpired || isResending || disabled}
        aria-label="Resend OTP"
      >
        {isResending ? 'Resending…' : 'Resend OTP'}
      </button>
    </div>
  );
}
