import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { removeToast } from '@/store/slices/uiSlice';
import { Button } from './button';

const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.ui);

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          dispatch(removeToast(toast.id));
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [toasts, dispatch]);

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start p-4 rounded-lg border shadow-lg animate-fade-in ${getToastStyles(toast.type)}`}
        >
          <div className="flex-shrink-0 mr-3">
            {getToastIcon(toast.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {toast.message}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 ml-2 h-6 w-6"
            onClick={() => dispatch(removeToast(toast.id))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;