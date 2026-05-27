import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineHistory, AiOutlineDown, AiOutlineClockCircle, AiOutlineTrophy, AiOutlineStock } from 'react-icons/ai';
import type { WorkoutSession } from '@/types';

interface HistoryPageProps {
  sessions: WorkoutSession[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

function formatExerciseTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function HistoryPage({ sessions }: HistoryPageProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AiOutlineHistory size={16} className="text-rosso" />
            <span
              className="font-display text-rosso text-sm"
              style={{ letterSpacing: '0.1em' }}
            >
              HISTORIQUE
            </span>
          </div>
          <h1
            className="font-display text-3xl sm:text-4xl text-polar mb-2"
            style={{ letterSpacing: '0.12em' }}
          >
            MES SEANCES
          </h1>
        </div>
        <div className="bg-graphite border border-steel p-8 text-center">
          <AiOutlineStock size={32} className="text-steel mx-auto mb-3" />
          <p className="text-ash text-sm" style={{ letterSpacing: '0.022em' }}>
            Aucune seance enregistree. Completez un entrainement pour voir votre historique.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <AiOutlineHistory size={16} className="text-rosso" />
          <span
            className="font-display text-rosso text-sm"
            style={{ letterSpacing: '0.1em' }}
          >
            HISTORIQUE
          </span>
        </div>
        <h1
          className="font-display text-3xl sm:text-4xl text-polar mb-2"
          style={{ letterSpacing: '0.12em' }}
        >
          MES SEANCES
        </h1>
        <p className="text-ash text-xs" style={{ letterSpacing: '0.022em' }}>
          {sessions.length} seance{sessions.length > 1 ? 's' : ''} enregistree{sessions.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map((session) => {
          const isExpanded = expandedSession === session.id;
          return (
            <div
              key={session.id}
              className="bg-graphite border border-steel"
            >
              {/* Session Header */}
              <button
                onClick={() =>
                  setExpandedSession(isExpanded ? null : session.id)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-steel/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div
                      className="font-display text-polar text-base"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      {formatDate(session.date).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-ash text-xs">
                        {session.exercises.length} exercices
                      </span>
                      <span className="text-steel">|</span>
                      <span className="flex items-center gap-1 text-ash text-xs">
                        <AiOutlineClockCircle size={10} />
                        {formatDuration(session.totalDuration)}
                      </span>
                      <span className="text-steel">|</span>
                      <span className="flex items-center gap-1 text-rosso text-xs">
                        <AiOutlineTrophy size={10} />
                        {session.totalMP} MP
                      </span>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AiOutlineDown size={14} className="text-ash" />
                </motion.div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-steel px-4 py-3">
                      <div className="space-y-2">
                        {session.exercises.map((ex, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-rosso" />
                              <span className="text-polar text-xs" style={{ letterSpacing: '0.022em' }}>
                                {ex.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-ash">
                              {ex.weight && (
                                <span>{ex.weight} kg</span>
                              )}
                              <span className="font-display tabular-nums">
                                {formatExerciseTime(ex.duration)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
