import './Buttons.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export function SecondaryButton({ children, onClick }: ButtonProps) {
  return (
    <button type="button" className="btn btn--secondary" onClick={onClick}>
      {children}
    </button>
  );
}