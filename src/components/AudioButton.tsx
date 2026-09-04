import { Volume2, Square } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useSpeech } from '@/hooks/useSpeech';

interface AudioButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-4 py-2 text-base',
  md: 'px-5 py-3 text-lg',
  lg: 'px-6 py-4 text-xl',
};

export function AudioButton({ text, label, className = '', size = 'md' }: AudioButtonProps) {
  const { lang, t } = useI18n();
  const { speak, stop, speaking, supported } = useSpeech();

  if (!supported) return null;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (speaking) stop();
        else speak(text, lang);
      }}
      className={`inline-flex items-center gap-2.5 rounded-full font-semibold transition-all duration-200 active:scale-95 ${sizeClasses[size]} ${
        speaking
          ? 'bg-accent-100 text-accent-700 ring-2 ring-accent-300'
          : 'bg-primary-50 text-primary-700 hover:bg-primary-100 ring-1 ring-primary-200'
      } ${className}`}
    >
      {speaking ? (
        <span className="flex items-center gap-1">
          <span className="flex items-end gap-0.5 h-5">
            <span className="w-1 bg-accent-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" style={{ height: '40%' }} />
            <span className="w-1 bg-accent-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" style={{ height: '80%' }} />
            <span className="w-1 bg-accent-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.3s]" style={{ height: '60%' }} />
          </span>
          <Square className="w-5 h-5" />
        </span>
      ) : (
        <Volume2 className="w-6 h-6" />
      )}
      {label ?? t('listen')}
    </button>
  );
}
