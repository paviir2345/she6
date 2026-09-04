import { Mic } from 'lucide-react';

interface MicrophoneButtonProps {
  listening: boolean;
  onStart: () => void;
  onStop: () => void;
  label: string;
  listeningLabel: string;
}

export function MicrophoneButton({
  listening,
  onStart,
  onStop,
  label,
  listeningLabel,
}: MicrophoneButtonProps) {
  return (
    <button
      onClick={listening ? onStop : onStart}
      className={`flex flex-col items-center justify-center gap-4 transition-all duration-300 active:scale-95 ${
        listening ? '' : 'hover:scale-105'
      }`}
      aria-label={listening ? listeningLabel : label}
    >
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ${
          listening
            ? 'w-40 h-40 bg-accent-500 text-white animate-breath shadow-kiosk'
            : 'w-36 h-36 bg-primary-500 text-white shadow-kiosk'
        }`}
      >
        <Mic className={`${listening ? 'w-16 h-16' : 'w-14 h-14'}`} strokeWidth={1.8} />
      </div>
      <span className="text-2xl font-bold text-ink-800">
        {listening ? listeningLabel : label}
      </span>
    </button>
  );
}
