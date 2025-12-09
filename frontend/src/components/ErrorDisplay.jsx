import React from 'react';
import '../components.css';

export default function ErrorDisplay({ error, onRetry, onClearError }) {
  if (!error) return null;

  return (
    <div className="error-container fade-in">
      <div className="glass-card error-card">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">{error.type || 'Error'}</h3>
        <p className="error-message">{error.message}</p>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onRetry && (
            <button className="btn btn-primary" onClick={onRetry}>
              Try Again
            </button>
          )}
          {onClearError && (
            <button className="btn btn-secondary" onClick={onClearError}>
              ← Back to Posts
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
