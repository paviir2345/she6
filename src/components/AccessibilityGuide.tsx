import { Hand, ArrowDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface AccessibilityGuideProps {
  message: string;
  target?: 'below' | 'right' | 'top';
  className?: string;
}

/**
 * A professional, non-childish hand-pointer guide that shows the patient
 * where to tap. Used sparingly for first interactions and unfamiliar actions.
 */
export function AccessibilityGuide({ message, target = 'below', className = '' }: AccessibilityGuideProps) {
  const arrowDir =
    target === 'right' ? 'rotate-[-90deg]' :
    target === 'top' ? 'rotate-180' : '';

  return (
    <div className={`flex items-center gap-3 text-primary-600 animate-slide-up ${className}`}>
      <div className="relative shrink-0">
        <Hand className="w-12 h-12 text-primary-500 fill-primary-100" strokeWidth={1.5} />
      </div>
      {target !== 'top' && (
        <ArrowDown className={`w-7 h-7 text-accent-500 ${arrowDir} animate-bounce`} />
      )}
      <p className="text-2xl font-semibold leading-snug">{message}</p>
    </div>
  );
}

interface GuideBubbleProps {
  children: ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function GuideBubble({ children, side = 'left', className = '' }: GuideBubbleProps) {
  return (
    <div className={`flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse' : ''} ${className}`}>
      <Hand className="w-10 h-10 text-primary-500 fill-primary-100 shrink-0" strokeWidth={1.5} />
      <div className="rounded-2xl bg-primary-50 border border-primary-200 px-4 py-3 text-lg font-semibold text-primary-700">
        {children}
      </div>
    </div>
  );
}
