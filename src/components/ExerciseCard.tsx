import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AiOutlineCheck,
  AiOutlineFieldTime,
  AiOutlinePlayCircle,
  AiOutlineCheckCircle,
} from 'react-icons/ai';
import type { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  elapsedTime: number;
  onStart: (id: string) => void;
  onComplete: (id: string, weight: string, feeling: string) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const muscleGroupLabels: Record<string, string> = {
  Biceps: 'BICEPS',
  Triceps: 'TRICEPS',
  Pecs: 'PECS',
  Shoulders: 'EPAULES',
  Back: 'DOS',
  Cardio: 'CARDIO',
  Core: 'CORE',
};

export function ExerciseCard({
  exercise,
  elapsedTime,
  onStart,
  onComplete,
}: ExerciseCardProps) {
  const [weight, setWeight] = useState(exercise.weight || '');
  const [feeling, setFeeling] = useState(exercise.feeling || '');

  const isNotStarted = exercise.status === 'not_started';
  const isInProgress = exercise.status === 'in_progress';
  const isCompleted = exercise.status === 'completed';

  const displayTime = isCompleted
    ? formatDuration(exercise.duration)
    : isInProgress
      ? formatDuration(elapsedTime)
      : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-graphite border border-steel"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-rosso text-xs font-display"
              style={{ letterSpacing: '0.083em' }}
            >
              {muscleGroupLabels[exercise.muscleGroup]}
            </span>
            <span className="text-ash text-xs">+{exercise.mpReward} MP</span>
          </div>
          <h3
            className="font-display text-lg text-polar leading-tight"
            style={{ letterSpacing: '0.1em' }}
          >
            {exercise.name.toUpperCase()}
          </h3>
        </div>

        {/* Status Indicator */}
        <div className="ml-3 flex-shrink-0">
          {isCompleted ? (
            <div className="w-6 h-6 bg-rosso flex items-center justify-center">
              <AiOutlineCheck size={14} className="text-polar" />
            </div>
          ) : isInProgress ? (
            <div className="w-6 h-6 border border-rosso animate-pulse-red flex items-center justify-center">
              <div className="w-2 h-2 bg-rosso" />
            </div>
          ) : (
            <div className="w-6 h-6 border border-steel flex items-center justify-center">
              <div className="w-2 h-2 bg-steel" />
            </div>
          )}
        </div>
      </div>

      {/* Timer Display */}
      {displayTime && (
        <div className="px-4 py-1 flex items-center gap-2">
          <AiOutlineFieldTime size={14} className="text-rosso" />
          <span
            className="font-display text-rosso text-lg tabular-nums"
            style={{ letterSpacing: '0.05em' }}
          >
            {displayTime}
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 pt-2">
        {isNotStarted && (
          <button
            onClick={() => onStart(exercise.id)}
            className="w-full flex items-center justify-center gap-2 bg-polar text-obsidian py-2.5 font-display text-sm tracking-widest hover:bg-ash transition-colors"
            style={{ letterSpacing: '0.083em' }}
          >
            <AiOutlinePlayCircle size={16} />
            COMMENCER L EXO
          </button>
        )}

        {isInProgress && (
          <div className="space-y-3">
            {/* Weight Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Poids utilise (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 bg-obsidian border border-steel text-polar px-3 py-2 text-xs placeholder:text-ash focus:border-rosso focus:outline-none transition-colors"
              />
            </div>

            {/* Feeling Input */}
            <input
              type="text"
              placeholder="Ressenti (facile, difficile, etc.)"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="w-full bg-obsidian border border-steel text-polar px-3 py-2 text-xs placeholder:text-ash focus:border-rosso focus:outline-none transition-colors"
            />

            <button
              onClick={() => onComplete(exercise.id, weight, feeling)}
              className="w-full flex items-center justify-center gap-2 bg-rosso text-polar py-2.5 font-display text-sm tracking-widest hover:brightness-110 transition-all animate-pulse-red"
              style={{ letterSpacing: '0.083em' }}
            >
              <AiOutlineCheckCircle size={16} />
              EXO COMPLETE
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="space-y-1.5">
            {exercise.weight && (
              <div className="flex items-center gap-2 text-xs text-ash">
                <span className="text-steel">Poids:</span>
                <span className="text-polar">{exercise.weight} kg</span>
              </div>
            )}
            {exercise.feeling && (
              <div className="flex items-center gap-2 text-xs text-ash">
                <span className="text-steel">Ressenti:</span>
                <span className="text-polar">{exercise.feeling}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 pt-1">
              <AiOutlineCheck size={12} className="text-rosso" />
              <span
                className="text-rosso text-xs font-display"
                style={{ letterSpacing: '0.05em' }}
              >
                +{exercise.mpReward} MP ACQUIS
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
