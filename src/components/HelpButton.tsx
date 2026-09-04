import { useState, type ReactNode } from 'react';
import { X, Volume2, Hand, Mic, Phone, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface HelpButtonProps {
  pageText: string;
  onBack: () => void;
}

export function HelpButton({ pageText, onBack }: HelpButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const items: { icon: ReactNode; label: string; action?: () => void }[] = [
    { icon: <Volume2 className="w-7 h-7" />, label: t('hearThisPage'), action: () => {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(pageText);
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
      }
    }},
    { icon: <Hand className="w-7 h-7" />, label: t('showMeWhere') },
    { icon: <Mic className="w-7 h-7" />, label: t('helpAnswer') },
    { icon: <Phone className="w-7 h-7" />, label: t('callStaff') },
    { icon: <ArrowLeft className="w-7 h-7" />, label: t('back'), action: onBack },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-primary-600 text-white px-5 py-3.5 text-lg font-bold shadow-kiosk hover:bg-primary-700 transition-all active:scale-95"
      >
        <Volume2 className="w-6 h-6" />
        {t('help')}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 animate-fade-in" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-bold text-ink-900">{t('howCanWeHelp')}</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-ink-100">
                <X className="w-6 h-6 text-ink-500" />
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.action?.();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-4 rounded-2xl bg-ink-50 px-5 py-4 text-xl font-semibold text-ink-800 hover:bg-primary-50 hover:text-primary-700 transition-colors text-left"
                >
                  <span className="text-primary-600 shrink-0">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
