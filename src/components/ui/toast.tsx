'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'warning' | 'error' | 'success';
    duration?: number;
    onClose?: () => void;
}

export function Toast({
    title,
    description,
    variant = 'default',
    onClose,
}: Omit<ToastProps, 'id'>) {
    return (
        <div
            className={cn(
                'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5',
                'bg-background border',
                {
                    'border-amber-500 bg-amber-50 dark:bg-amber-950/20': variant === 'warning',
                    'border-red-500 bg-red-50 dark:bg-red-950/20': variant === 'error',
                    'border-green-500 bg-green-50 dark:bg-green-950/20': variant === 'success',
                    'border-border': variant === 'default',
                }
            )}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-1">
                        {title && (
                            <p
                                className={cn('text-sm font-semibold', {
                                    'text-amber-900 dark:text-amber-100': variant === 'warning',
                                    'text-red-900 dark:text-red-100': variant === 'error',
                                    'text-green-900 dark:text-green-100': variant === 'success',
                                    'text-foreground': variant === 'default',
                                })}
                            >
                                {title}
                            </p>
                        )}
                        {description && (
                            <p
                                className={cn('mt-1 text-sm', {
                                    'text-amber-700 dark:text-amber-300': variant === 'warning',
                                    'text-red-700 dark:text-red-300': variant === 'error',
                                    'text-green-700 dark:text-green-300': variant === 'success',
                                    'text-muted-foreground': variant === 'default',
                                })}
                            >
                                {description}
                            </p>
                        )}
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className={cn(
                                'ml-4 inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                                {
                                    'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900 focus:ring-amber-600':
                                        variant === 'warning',
                                    'text-red-500 hover:bg-red-100 dark:hover:bg-red-900 focus:ring-red-600':
                                        variant === 'error',
                                    'text-green-500 hover:bg-green-100 dark:hover:bg-green-900 focus:ring-green-600':
                                        variant === 'success',
                                    'text-muted-foreground hover:bg-muted focus:ring-primary':
                                        variant === 'default',
                                }
                            )}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Toast container and provider
interface ToastContextValue {
    toasts: ToastProps[];
    addToast: (toast: Omit<ToastProps, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastProps[]>([]);

    const addToast = React.useCallback((toast: Omit<ToastProps, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        // Auto-remove after duration
        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}

            {/* Toast container */}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            {...toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
