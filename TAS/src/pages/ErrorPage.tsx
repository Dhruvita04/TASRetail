import { useNavigate } from 'react-router-dom';
import '../theme/theme.css';
import './ErrorPage.css';

export function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page__card" role="alert" aria-live="assertive">
        <div className="error-page__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 8v5m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="error-page__eyebrow">Service issue</p>
        <h1 className="error-page__title">Something went wrong</h1>
        <p className="error-page__message">
          We couldn’t complete the merchant mapping right now. Please try again in a moment.
        </p>

        <button type="button" className="error-page__button" onClick={() => navigate('/home')}>
          Back to home
        </button>
      </div>
    </div>
  );
}
