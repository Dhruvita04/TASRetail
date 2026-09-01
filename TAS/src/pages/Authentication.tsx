import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OtpInput } from '../components/otp/OtpInput';
import { ResendTimer } from '../components/otp/ResendTimer';
import { ErrorBanner } from '../components/shared/ErrorBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import '../theme/theme.css';
import './Authentication.css';

export function AuthenticationPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // POST /acs/authenticate with { otp } goes here
      // On success, navigate to /result
      // On failure (e.g., expired OTP), set error message
      console.log('Verifying OTP:', otp);

      // Simulated success - replace with actual API call
      // await api.verifyOtp(otp);
      navigate('/result');
    } catch (err) {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  }

  async function handleResendOtp() {
    try {
      // POST /acs/resend-otp goes here
      console.log('Resending OTP');
      setOtp('');
      setError('');
      // await api.resendOtp();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  }

  return (
    <div className="authentication-page">
      <div className="authentication-page__container">
        <div className="authentication-page__header">
          <div className="authentication-page__icon">
            🏦
          </div>
        </div>

        <h1 className="authentication-page__title">Authenticate to proceed</h1>
        
        <p className="authentication-page__description">
          For your security, please enter the One-Time Password (OTP) sent to your registered mobile number.
        </p>

        <ErrorBanner message={error} visible={!!error} />

        <OtpInput
          length={6}
          value={otp}
          onChange={setOtp}
          disabled={verifying}
        />

        <ResendTimer
          initialSeconds={105}
          onResend={handleResendOtp}
          disabled={verifying}
        />

        <PrimaryButton
          onClick={handleVerifyOtp}
          disabled={verifying || otp.length !== 6}
        >
          {verifying ? 'Verifying…' : 'Verify OTP'}
        </PrimaryButton>

        <SecondaryButton onClick={() => window.history.back()}>
          Cancel
        </SecondaryButton>

        <p className="authentication-page__help-text">
          Didn't receive the OTP? Check your SMS or wait and try again.
        </p>
      </div>
    </div>
  );
}
