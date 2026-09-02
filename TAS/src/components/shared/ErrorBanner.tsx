import './ErrorBanner.css';

interface ErrorBannerProps {
  message?: string;
  visible?: boolean;
}

export function ErrorBanner({ message = '', visible = false }: ErrorBannerProps) {
  if (!visible && !message) return null;

  return (
    <div className="error-banner" role="alert">
      {message && <p className="error-banner__text">{message}</p>}
    </div>
  );
}
