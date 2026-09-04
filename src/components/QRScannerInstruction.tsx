import { Smartphone, ArrowDown, Camera, FileText } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { AudioButton } from './AudioButton';
import { AccessibilityGuide } from './AccessibilityGuide';

interface QRScannerInstructionProps {
  qrValue: string;
}

export function QRScannerInstruction({ qrValue }: QRScannerInstructionProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div className="text-center max-w-xl">
        <p className="text-3xl font-bold text-ink-900">{t('scanThisCode')}</p>
        <p className="text-xl text-ink-500 mt-2">{t('phoneOpens')}</p>
      </div>

      <div className="relative">
        {/* Faux QR code */}
        <div className="w-64 h-64 bg-white rounded-2xl border-4 border-ink-900 p-3 shadow-kiosk">
          <div className="w-full h-full grid grid-cols-12 grid-rows-12 gap-0.5">
            {Array.from({ length: 144 }).map((_, i) => {
              const seed = (i * 73 + 37) % 100;
              const isCorner =
                (i < 6 && i % 12 < 6) ||
                (i >= 132 && i % 12 < 6) ||
                (i % 12 >= 6 && i < 6) ||
                false;
              const cornerBlock =
                (i < 18 && i % 12 < 3) ||
                (i < 6 && i % 12 < 6) ||
                (i >= 126 && i % 12 < 6) ||
                (i % 12 >= 9 && i < 6);
              return (
                <div
                  key={i}
                  className={`rounded-[1px] ${
                    cornerBlock ? 'bg-ink-900' : seed > 55 ? 'bg-ink-900' : 'bg-white'
                  }`}
                />
              );
            })}
          </div>
        </div>
        <div className="absolute -inset-3 border-4 border-primary-400 rounded-2xl animate-pulse-soft pointer-events-none" />
      </div>

      <AccessibilityGuide message={t('scanThisCode')} target="top" />

      <div className="flex items-center gap-6 text-ink-400">
        <Smartphone className="w-12 h-12" strokeWidth={1.5} />
        <ArrowDown className="w-7 h-7 animate-bounce" />
        <Camera className="w-12 h-12" strokeWidth={1.5} />
        <ArrowDown className="w-7 h-7 animate-bounce" />
        <FileText className="w-12 h-12" strokeWidth={1.5} />
      </div>

      <AudioButton text={`${t('scanThisCode')} ${t('phoneOpens')}`} />

      <p className="text-xs text-ink-300 max-w-sm text-center">
        {qrValue} · session-scoped temporary token
      </p>
    </div>
  );
}
