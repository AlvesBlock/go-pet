interface LoadingStateProps {
  message?: string;
  error?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function LoadingState({ message = "Carregando...", error, onRetry, compact = false }: LoadingStateProps) {
  const containerClasses = compact
    ? "rounded-2xl border border-white/60 bg-white/80 px-6 py-4 text-center shadow-soft"
    : "rounded-[32px] border border-white/60 bg-white/80 p-10 text-center shadow-soft";

  return (
    <div className={containerClasses}>
      {error ? (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-danger">Erro ao carregar dados</p>
          <p className="text-sm text-slate-500">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card hover:bg-brand-500"
            >
              Tentar novamente
            </button>
          )}
        </div>
      ) : (
        <p className="text-lg text-slate-500">{message}</p>
      )}
    </div>
  );
}
