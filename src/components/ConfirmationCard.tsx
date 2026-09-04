interface ConfirmationCardProps {
  icon: string;
  label: string;
  value: string;
  provenance?: string;
}

export function ConfirmationCard({ icon, label, value, provenance }: ConfirmationCardProps) {
  return (
    <div className="card-kiosk p-6 animate-slide-up">
      <div className="flex items-start gap-4">
        <span className="text-4xl leading-none shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-ink-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-ink-900 mt-1 break-words">{value}</p>
          {provenance && (
            <p className="text-sm text-ink-500 mt-2 font-medium">{provenance}</p>
          )}
        </div>
      </div>
    </div>
  );
}
