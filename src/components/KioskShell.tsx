import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { AccessibilityGuide } from '@/components/AccessibilityGuide';
import { AudioButton } from '@/components/AudioButton';

interface KioskShellProps {
  children: ReactNode;
  audioText?: string;
  showGuide?: string;
  onBack?: () => void;
  /** Auto-speak the audioText when this screen first appears */
  autoSpeak?: boolean;
}

/**
 * Outer layout for the patient kiosk screens.
 * Optimized for large touchscreens, generous spacing, top bar with branding.
 */
export function KioskShell({ children, audioText, showGuide, onBack, autoSpeak }: KioskShellProps) {
  const { t } = useI18n();

  return (
    <div className="kiosk-shell bg-gradient-to-b from-primary-50/80 via-ink-50 to-ink-50">
      <header className="flex items-center justify-between px-6 py-4 shrink-0 bg-white/70 backdrop-blur-sm border-b border-primary-100/50">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-base font-semibold text-ink-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
              {t('back')}
            </button>
          )}
          <div className="flex items-center gap-3 ml-1">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-card">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5a7 7 0 0 0-7 7c0 5 7 8 7 8s7-3 7-8a7 7 0 0 0-7-7z" fill="currentColor" opacity="0.3" />
                <path d="M12 9v6M9 12h6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-primary-800 leading-tight">MediKiosk</p>
              <p className="text-xs text-ink-400">{t('tagline')}</p>
            </div>
          </div>
        </div>
        {audioText && <AudioButton text={audioText} size="md" />}
      </header>
      <main className="flex-1 flex flex-col px-6 pb-6 max-w-5xl mx-auto w-full pt-6">
        {showGuide && (
          <div className="mb-4">
            <AccessibilityGuide message={showGuide} />
          </div>
        )}
        {children}
      </main>
      <footer className="px-6 py-2.5 text-center text-sm text-ink-300 shrink-0 border-t border-ink-100/50">
        MediKiosk · Secure Health Kiosk · v1.0
      </footer>
    </div>
  );
}

/**
 * Hook that auto-speaks text when a screen mounts.
 * Respects the autoSpeak prop on KioskShell.
 */
export function useAutoSpeak(text: string | undefined, enabled: boolean | undefined) {
  const { lang } = useI18n();
  // We can't call useSpeech here without it being in a component,
  // so this is handled in PatientFlow instead.
  void lang; void text; void enabled;
}
