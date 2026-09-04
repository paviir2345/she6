import { Pencil } from 'lucide-react';
import { ProvenanceBadge, type Source } from './ProvenanceBadge';
import { StatusBadge } from './StatusBadge';

interface FactVersion {
  value: string;
  reportedBy: string;
  source?: Source;
  detail?: string;
  version: number;
  isEdited?: boolean;
}

interface PhysicianFactCardProps {
  label: string;
  versions: FactVersion[];
  statusLabel: string;
  status: 'draft' | 'review' | 'edited' | 'approved';
  editLabel: string;
  onEdit?: () => void;
}

export function PhysicianFactCard({
  label, versions, statusLabel, status, editLabel, onEdit,
}: PhysicianFactCardProps) {
  const latest = versions[versions.length - 1];
  return (
    <div className="bg-white rounded-xl border border-ink-100 p-4 shadow-card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">{label}</p>
          <p className="text-lg font-bold text-ink-900 mt-0.5">{latest.value}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} label={statusLabel} />
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              <Pencil className="w-3.5 h-3.5" />
              {editLabel}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ProvenanceBadge reportedBy={latest.reportedBy} source={latest.source} detail={latest.detail} />
        {versions.length > 1 && (
          <span className="text-xs text-ink-400">
            v{latest.version} · {versions.length - 1} earlier version{versions.length > 2 ? 's' : ''}
          </span>
        )}
      </div>
      {versions.length > 1 && (
        <details className="mt-2 group">
          <summary className="text-xs text-ink-400 cursor-pointer hover:text-ink-600 select-none">
            Show history
          </summary>
          <div className="mt-2 space-y-1.5 border-l-2 border-ink-100 pl-3">
            {versions.slice(0, -1).reverse().map((v) => (
              <div key={v.version} className="text-xs text-ink-500">
                <span className="font-medium">v{v.version}:</span> {v.value}
                <span className="ml-2 text-ink-400">· {v.reportedBy}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
