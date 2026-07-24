'use client';

import { useState } from 'react';

export interface ErrorAlertProps {
  message: string;
  title?: string;
  type?: 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorAlert({
  message,
  title = 'Error',
  type = 'error',
  dismissible = true,
  onDismiss,
  actionLabel,
  onAction,
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const colors = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[type]} mb-4`} role="alert">
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{icons[type]}</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{title}</h3>
          <p className="text-sm">{message}</p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="shrink-0 text-xl hover:opacity-70"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

// Specific error types
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorAlert
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      actionLabel={onRetry ? "Retry" : undefined}
      onAction={onRetry}
    />
  );
}

export function ValidationError({ errors }: { errors: string[] }) {
  return (
    <ErrorAlert
      title="Validation Error"
      message={errors.join('. ')}
      type="warning"
    />
  );
}

export function BlockchainError({ message, txHash }: { message: string; txHash?: string }) {
  return (
    <ErrorAlert
      title="Blockchain Transaction Failed"
      message={message}
      actionLabel={txHash ? "View on Stellar Expert" : undefined}
      onAction={txHash ? () => window.open(`https://stellar.expert/explorer/testnet/tx/${txHash}`, '_blank') : undefined}
    />
  );
}
