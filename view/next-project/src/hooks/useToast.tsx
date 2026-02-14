import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
  IoMdInformationCircle,
  IoMdWarning,
} from 'react-icons/io';

type ToastStatus = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  status: ToastStatus;
  duration?: number;
  isClosable?: boolean;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const statusConfig: Record<ToastStatus, { bgColor: string; icon: React.ReactNode }> = {
  success: {
    bgColor: 'bg-green-500',
    icon: <IoMdCheckmarkCircle className='size-6' />,
  },
  error: {
    bgColor: 'bg-accent-1',
    icon: <IoMdCloseCircle className='size-6' />,
  },
  warning: {
    bgColor: 'bg-yellow-500',
    icon: <IoMdWarning className='size-6' />,
  },
  info: {
    bgColor: 'bg-primary-1',
    icon: <IoMdInformationCircle className='size-6' />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className='fixed right-4 bottom-4 z-9999 flex flex-col gap-2'>
        {toasts.map((toast) => {
          const config = statusConfig[toast.status];
          return (
            <div
              key={toast.id}
              className={`
                ${config.bgColor}
                flex max-w-md min-w-75 items-start gap-3 rounded-lg p-4
                text-white-0 shadow-lg transition-all duration-300
              `}
              role='alert'
            >
              <div className='shrink-0'>{config.icon}</div>
              <div className='flex-1'>
                <p className='font-semibold'>{toast.title}</p>
                {toast.description && (
                  <p className='mt-1 text-sm opacity-90'>{toast.description}</p>
                )}
              </div>
              {toast.isClosable !== false && (
                <button
                  onClick={() => removeToast(toast.id)}
                  className='
                    shrink-0 opacity-70 transition-opacity
                    hover:opacity-100
                  '
                  aria-label='Close'
                >
                  <IoMdCloseCircle className='size-5' />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  // Return a function that matches Chakra's useToast API
  // When called outside of context, return a no-op function
  const toast = useCallback(
    (options: Omit<Toast, 'id'>) => {
      if (context) {
        context.addToast(options);
      } else {
        console.warn('useToast must be used within a ToastProvider');
      }
    },
    [context],
  );

  return toast;
}

export default useToast;
