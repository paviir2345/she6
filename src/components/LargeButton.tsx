import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'warning';

interface LargeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'btn-kiosk bg-primary-500 text-white shadow-kiosk hover:bg-primary-600',
  secondary: 'btn-kiosk bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50',
  ghost: 'btn-kiosk bg-transparent text-ink-600 hover:bg-ink-100',
  success: 'btn-kiosk bg-success-500 text-white shadow-kiosk hover:bg-success-600',
  danger: 'btn-kiosk bg-danger-500 text-white shadow-kiosk hover:bg-danger-600',
  warning: 'btn-kiosk bg-warning-500 text-white shadow-kiosk hover:bg-warning-600',
};

export function LargeButton({
  variant = 'primary',
  icon,
  fullWidth,
  className = '',
  children,
  ...props
}: LargeButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
