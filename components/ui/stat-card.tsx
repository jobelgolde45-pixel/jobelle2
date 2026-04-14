interface StatCardProps {
  label: string;
  value: string | number;
  note?: string;
  accentColor?: string;
  isHighlight?: boolean;
}

export function StatCard({ label, value, note, accentColor = "bg-blue-100 dark:bg-blue-900/25", isHighlight = false }: StatCardProps) {
  if (isHighlight) {
    return (
      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-800/20 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.3)] dark:border-slate-700/60 dark:from-slate-800 dark:to-slate-950">
        <div className={`absolute -right-5 -top-5 h-28 w-28 rounded-full blur-3xl ${accentColor}`} />
        <p className="relative z-10 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
          {label}
        </p>
        <h3 className="relative z-10 mt-3 font-display text-4xl font-bold">
          {value}
        </h3>
        {note && <p className="relative z-10 mt-4 text-xs text-slate-400">{note}</p>}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/90 p-6 shadow-[0_18px_60px_rgba(148,163,184,0.18)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85">
      <div className={`absolute -right-5 -top-5 h-28 w-28 rounded-full blur-3xl ${accentColor}`} />
      <p className="relative z-10 text-xs font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <h3 className="relative z-10 mt-3 font-display text-4xl font-bold text-slate-800 dark:text-white">
        {value}
      </h3>
      {note && (
        <div className="relative z-10 mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {note}
        </div>
      )}
    </div>
  );
}
