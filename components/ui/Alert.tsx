import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
}

export function Alert({ variant = 'info', title, message, onClose }: AlertProps) {
  const variantConfig = {
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
  };

  const config = variantConfig[variant];

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 flex gap-3`}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-1">
        {title && (
          <h3 className={`text-sm font-semibold ${config.textColor} mb-1`}>{title}</h3>
        )}
        <p className={`text-sm ${config.textColor}`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
