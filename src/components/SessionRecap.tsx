import { AiOutlineStock, AiOutlineClockCircle, AiOutlineTrophy } from 'react-icons/ai';
import { motion } from 'framer-motion';

interface SessionRecapProps {
  completedCount: number;
  totalCount: number;
  mpThisSession: number;
  globalElapsed: number;
  onFinishSession: () => void;
}

function formatGlobalTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function SessionRecap({
  completedCount,
  totalCount,
  mpThisSession,
  globalElapsed,
  onFinishSession,
}: SessionRecapProps) {
  return (
    <div className="bg-graphite border border-steel p-5 sticky top-16">
      <div className="flex items-center gap-2 mb-5">
        <AiOutlineStock size={18} className="text-rosso" />
        <h2
          className="font-display text-polar text-base"
          style={{ letterSpacing: '0.1em' }}
        >
          RECAPITULATIF
        </h2>
      </div>

      <div className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-ash text-xs" style={{ letterSpacing: '0.022em' }}>
              Progression
            </span>
            <span
              className="font-display text-polar text-sm"
              style={{ letterSpacing: '0.05em' }}
            >
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="w-full h-1.5 bg-obsidian">
            <motion.div
              className="h-full bg-rosso"
              initial={{ width: 0 }}
              animate={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-steel" />

        {/* MP Gained */}
        <div className="flex items-center gap-3">
          <AiOutlineTrophy size={16} className="text-rosso" />
          <div>
            <div className="text-ash text-xs" style={{ letterSpacing: '0.022em' }}>
              MP Gagnes
            </div>
            <div
              className="font-display text-rosso text-xl"
              style={{ letterSpacing: '0.05em' }}
            >
              {mpThisSession} MP
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <AiOutlineClockCircle size={16} className="text-ash" />
          <div>
            <div className="text-ash text-xs" style={{ letterSpacing: '0.022em' }}>
              Duree totale
            </div>
            <div
              className="font-display text-polar text-xl tabular-nums"
              style={{ letterSpacing: '0.05em' }}
            >
              {formatGlobalTime(globalElapsed)}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-steel" />

        {/* Finish Button */}
        {completedCount > 0 && (
          <button
            onClick={onFinishSession}
            className="w-full flex items-center justify-center gap-2 bg-obsidian border border-steel text-polar py-3 font-display text-sm tracking-widest hover:border-rosso hover:text-rosso transition-colors"
            style={{ letterSpacing: '0.083em' }}
          >
            TERMINER LA SEANCE
          </button>
        )}
      </div>
    </div>
  );
}
