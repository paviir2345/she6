import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { LargeButton } from './LargeButton';

interface CoachMarkProps {
  title: string;
  body: string;
  onClose: () => void;
  icon?: ReactNode;
  highlight?: ReactNode;
}

/**
 * A pop-up coach mark that overlays the screen to guide the user.
 * Used for navigation guidance, microphone help, audio help, etc.
 */
export function CoachMark({ title, body, onClose, icon, highlight }: CoachMarkProps) {
  const { t } = useI18n();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/50 animate-fade-in p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 hover:bg-ink-100 transition-colors"
          aria-label={t('close')}
        >
          <X className="w-6 h-6 text-ink-400" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          {icon && (
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-ink-900 mb-2">{title}</h3>
            <p className="text-lg text-ink-600 leading-relaxed">{body}</p>
          </div>
        </div>

        {highlight && (
          <div className="mb-6 rounded-2xl bg-primary-50 border border-primary-200 p-4">
            {highlight}
          </div>
        )}

        <div className="flex justify-end">
          <LargeButton variant="primary" onClick={onClose}>
            {t('gotIt')}
          </LargeButton>
        </div>
      </div>
    </div>
  );
}
