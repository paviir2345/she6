import { User, Mic, FileText, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Source = 'voice' | 'prescription' | 'phone' | 'patient' | 'caregiver' | 'staff';

interface ProvenanceBadgeProps {
  reportedBy: string;
  source?: Source;
  detail?: string;
}

const SOURCE_ICONS: Partial<Record<Source, LucideIcon>> = {
  voice: Mic,
  prescription: FileText,
  phone: Phone,
  patient: User,
  caregiver: User,
  staff: User,
};

export function ProvenanceBadge({ reportedBy, source, detail }: ProvenanceBadgeProps) {
  const Icon = source ? SOURCE_ICONS[source] : undefined;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{reportedBy}</span>
      {detail && <span className="text-ink-400">· {detail}</span>}
    </div>
  );
}
