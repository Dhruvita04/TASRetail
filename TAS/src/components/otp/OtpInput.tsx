import React, { useRef, useEffect, useState } from 'react';
import './OtpInput.css';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled = false }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(value.split('').slice(0, length).concat(Array(length).fill('')).slice(0, length));

  useEffect(() => {
    setOtp(value.split('').slice(0, length).concat(Array(length).fill('')).slice(0, length));
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // only take last character
    setOtp(newOtp);

    const otpString = newOtp.join('');
    onChange(otpString);

    // Auto-advance to next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (digits) {
      const newOtp = digits.split('');
      setOtp(newOtp.concat(Array(length).fill('')).slice(0, length));
      onChange(newOtp.join(''));
      
      // Focus on the last filled input or the next empty one
      const focusIndex = Math.min(digits.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="otp-input">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="otp-input__box"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
