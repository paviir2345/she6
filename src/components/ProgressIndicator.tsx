interface ProgressIndicatorProps {
  total: number;
  current: number;
}

export function ProgressIndicator({ total, current }: ProgressIndicatorProps) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      <div className="flex gap-1.5 w-full justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${
              i < current ? 'bg-primary-500' : 'bg-ink-200'
            }`}
          />
        ))}
      </div>
      <div className="text-sm text-ink-400 font-medium">{pct}%</div>
    </div>
  );
}
