import type { ReactNode } from 'react';

interface TouchAnswerCardProps {
  icon?: ReactNode;
  label: string;
  onSelect: () => void;
  emoji?: string;
  selected?: boolean;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

const variantStyles = {
  default: 'hover:border-primary-400 hover:bg-primary-50',
  success: 'hover:border-success-400 hover:bg-success-50',
  danger: 'hover:border-danger-400 hover:bg-danger-50',
  warning: 'hover:border-warning-400 hover:bg-warning-50',
};

export function TouchAnswerCard({
  icon,
  label,
  onSelect,
  emoji,
  selected,
  variant = 'default',
}: TouchAnswerCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-white px-8 py-10 transition-all duration-200 active:scale-[0.98] shadow-card ${
        selected ? 'border-primary-500 ring-4 ring-primary-100' : `border-ink-200 ${variantStyles[variant]}`
      }`}
    >
      {emoji ? (
        <span className="text-6xl leading-none">{emoji}</span>
      ) : icon ? (
        <span className="text-primary-600">{icon}</span>
      ) : null}
      <span className="text-2xl font-bold text-ink-800">{label}</span>
    </button>
  );
}
