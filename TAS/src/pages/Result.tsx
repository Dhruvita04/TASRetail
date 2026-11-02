// result.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Result.css";

interface ResultPageProps {
  cardLastFour?: string;
  onDone?: () => void;
  onGoHome?: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({
  cardLastFour = "4321",
  onDone,
  onGoHome,
}) => {
  const navigate = useNavigate();
  const handleDone = onDone ?? (() => navigate("/home"));
  const handleGoHome = onGoHome ?? (() => navigate("/home"));

  return (
    <div className="mapping-result-page">
      <div className="result-card">
        <div className="confetti-wrapper" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="confetti-dot" />
          ))}

          <span className="confetti-plus">+</span>
          <span className="confetti-plus">+</span>
          <span className="confetti-plus">+</span>
          <span className="confetti-plus">+</span>

          <div className="success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h1 className="result-heading">
          Your new card has been successfully mapped!
        </h1>

        <p className="result-body">
          Your new card ending with {cardLastFour} has been updated on your
          selected merchants.
        </p>
        <p className="result-body">
          You can now enjoy seamless payments across all your preferred
          platforms.
        </p>

        <div className="result-actions">
          <button type="button" className="btn-done" onClick={handleDone}>
            Done
          </button>
          <button type="button" className="btn-home" onClick={handleGoHome}>
            Go to Home
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResultPage;
