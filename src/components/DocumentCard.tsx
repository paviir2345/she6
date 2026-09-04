import { FileText, FlaskConical, Building2, Pill } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type DocType = 'prescription' | 'blood' | 'discharge' | 'medicine';

interface DocumentCardProps {
  type: DocType;
  label: string;
}

const ICONS: Record<DocType, LucideIcon> = {
  prescription: FileText,
  blood: FlaskConical,
  discharge: Building2,
  medicine: Pill,
};

const COLORS: Record<DocType, string> = {
  prescription: 'bg-primary-50 text-primary-600',
  blood: 'bg-danger-50 text-danger-600',
  discharge: 'bg-accent-50 text-accent-600',
  medicine: 'bg-success-50 text-success-600',
};

export function DocumentCard({ type, label }: DocumentCardProps) {
  const Icon = ICONS[type];
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white border border-ink-100 p-5 shadow-card">
      <div className={`flex items-center justify-center w-16 h-16 rounded-xl ${COLORS[type]}`}>
        <Icon className="w-8 h-8" strokeWidth={1.8} />
      </div>
      <span className="text-base font-semibold text-ink-700 text-center">{label}</span>
    </div>
  );
}
