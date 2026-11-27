import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;