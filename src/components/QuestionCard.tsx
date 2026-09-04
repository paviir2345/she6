import type { ReactNode } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { AudioButton } from './AudioButton';

interface QuestionCardProps {
  question: string;
  children: ReactNode;
  onBack?: () => void;
  onHelp?: () => void;
  audioText?: string;
  backLabel?: string;
}

export function QuestionCard({
  question,
  children,
  onBack,
  onHelp,
  audioText,
  backLabel,
}: QuestionCardProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col flex-1 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-lg font-semibold text-ink-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-7 h-7" />
              {backLabel ?? t('back')}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {audioText && <AudioButton text={audioText} />}
          {onHelp && (
            <button
              onClick={onHelp}
              className="flex items-center gap-2 rounded-full bg-ink-100 px-4 py-2.5 text-lg font-semibold text-ink-600 hover:bg-ink-200 transition-colors"
            >
              <HelpCircle className="w-6 h-6" />
              {t('help')}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 justify-center">
        <h2 className="text-kiosk-q font-bold text-ink-900 mb-8 leading-tight">{question}</h2>
        {children}
      </div>
    </div>
  );
}
