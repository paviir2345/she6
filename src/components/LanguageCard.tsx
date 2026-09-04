import type { Language } from '@/i18n/translations';

interface LanguageCardProps {
  language: Language;
  onSelect: () => void;
}

export function LanguageCard({ language, onSelect }: LanguageCardProps) {
  return (
    <button
      onClick={onSelect}
      className="card-kiosk flex flex-col items-center justify-center gap-2 px-8 py-10 transition-all duration-200 hover:border-primary-400 hover:shadow-kiosk active:scale-[0.98] animate-fade-in"
    >
      <span className="text-4xl font-bold text-primary-700 leading-tight">{language.label}</span>
      {language.english !== language.label && (
        <span className="text-lg text-ink-500 font-medium">{language.english}</span>
      )}
    </button>
  );
}
