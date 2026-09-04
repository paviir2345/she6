type StatusType =
  | 'draft' | 'review' | 'edited' | 'clarification'
  | 'rejected' | 'approved' | 'exported' | 'pending'
  | 'active' | 'online' | 'offline' | 'critical' | 'high' | 'medium' | 'low';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

const STYLES: Record<StatusType, string> = {
  draft: 'bg-ink-100 text-ink-600',
  review: 'bg-primary-50 text-primary-700',
  edited: 'bg-accent-50 text-accent-700',
  clarification: 'bg-warning-50 text-warning-700',
  rejected: 'bg-danger-50 text-danger-700',
  approved: 'bg-success-50 text-success-700',
  exported: 'bg-primary-100 text-primary-800',
  pending: 'bg-warning-50 text-warning-700',
  active: 'bg-success-50 text-success-700',
  online: 'bg-success-50 text-success-700',
  offline: 'bg-ink-100 text-ink-500',
  critical: 'bg-danger-500 text-white',
  high: 'bg-danger-100 text-danger-700',
  medium: 'bg-warning-100 text-warning-700',
  low: 'bg-primary-50 text-primary-700',
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'critical' || status === 'high' ? 'bg-white' :
        status === 'online' || status === 'active' || status === 'approved' ? 'bg-success-500' :
        status === 'offline' ? 'bg-ink-400' :
        status === 'rejected' ? 'bg-danger-500' :
        'bg-current'
      }`} />
      {label}
    </span>
  );
}
