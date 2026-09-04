import { AlertTriangle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

interface AlertCardProps {
  patientId: string;
  department: string;
  timestamp: string;
  redFlagInfo: string;
  severity: Severity;
  severityLabel: string;
  departmentLabel: string;
  timestampLabel: string;
  redFlagLabel: string;
  onAcknowledge: () => void;
  onEscalate: () => void;
  acknowledgeLabel: string;
  escalateLabel: string;
  acknowledged?: boolean;
}

const BORDER: Record<Severity, string> = {
  critical: 'border-l-danger-500',
  high: 'border-l-danger-400',
  medium: 'border-l-warning-400',
  low: 'border-l-primary-400',
};

export function AlertCard({
  patientId, department, timestamp, redFlagInfo, severity, severityLabel,
  departmentLabel, timestampLabel, redFlagLabel, onAcknowledge, onEscalate,
  acknowledgeLabel, escalateLabel, acknowledged,
}: AlertCardProps) {
  return (
    <div className={`bg-white rounded-xl border border-ink-100 ${BORDER[severity]} border-l-4 p-5 shadow-card`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {severity === 'critical' && (
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-danger-50 text-danger-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-ink-900">{patientId}</p>
              <StatusBadge status={severity} label={severityLabel} />
              {acknowledged && (
                <span className="text-xs text-success-600 font-semibold">✓</span>
              )}
            </div>
            <p className="text-sm text-ink-500 mt-1">
              <span className="font-medium text-ink-600">{departmentLabel}:</span> {department}
              <span className="mx-2">·</span>
              <span className="font-medium text-ink-600">{timestampLabel}:</span> {timestamp}
            </p>
            <p className="text-sm text-ink-700 mt-2">
              <span className="font-medium text-ink-500">{redFlagLabel}:</span> {redFlagInfo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAcknowledge}
            disabled={acknowledged}
            className="rounded-lg bg-success-50 text-success-700 px-3 py-2 text-sm font-semibold hover:bg-success-100 disabled:opacity-40 transition-colors"
          >
            {acknowledgeLabel}
          </button>
          <button
            onClick={onEscalate}
            className="rounded-lg bg-danger-50 text-danger-700 px-3 py-2 text-sm font-semibold hover:bg-danger-100 transition-colors"
          >
            {escalateLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
