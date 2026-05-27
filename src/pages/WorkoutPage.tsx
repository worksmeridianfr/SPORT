import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExerciseCard } from '@/components/ExerciseCard';
import { SessionRecap } from '@/components/SessionRecap';
import type { Exercise } from '@/types';

interface WorkoutPageProps {
  exercises: Exercise[];
  elapsedTimes: Record<string, number>;
  completedCount: number;
  totalMPThisSession: number;
  globalElapsed: number;
  onStartExercise: (id: string) => void;
  onCompleteExercise: (id: string, weight: string, feeling: string) => void;
  onFinishSession: () => void;
}

const groupOrder = ['Pecs', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Core', 'Cardio'];

const groupLabels: Record<string, string> = {
  Pecs: 'PECS',
  Back: 'DOS',
  Shoulders: 'EPAULES',
  Biceps: 'BICEPS',
  Triceps: 'TRICEPS',
  Core: 'CORE',
  Cardio: 'CARDIO',
};

export function WorkoutPage({
  exercises,
  elapsedTimes,
  completedCount,
  totalMPThisSession,
  globalElapsed,
  onStartExercise,
  onCompleteExercise,
  onFinishSession,
}: WorkoutPageProps) {
  const grouped = useMemo(() => {
    const map: Record<string, Exercise[]> = {};
    groupOrder.forEach((g) => (map[g] = []));
    exercises.forEach((ex) => {
      if (!map[ex.muscleGroup]) map[ex.muscleGroup] = [];
      map[ex.muscleGroup].push(ex);
    });
    return map;
  }, [exercises]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-48 sm:h-64 mb-8 overflow-hidden"
      >
        <img
          src="/hero-fitness.jpg"
          alt="Training"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-5 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-rosso" />
            <span
              className="font-display text-rosso text-sm"
              style={{ letterSpacing: '0.1em' }}
            >
              SEANCE DU JOUR
            </span>
          </div>
          <h1
            className="font-display text-3xl sm:text-4xl text-polar"
            style={{ letterSpacing: '0.12em' }}
          >
            PROGRAMME D ENTRAINEMENT
          </h1>
          <p className="text-ash text-xs mt-2" style={{ letterSpacing: '0.022em' }}>
            {exercises.length} exercices au total &bull; Tous les exercices machine
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Exercise Grid */}
        <div className="flex-1 min-w-0 space-y-8">
          {groupOrder.map((group) => {
            const groupExercises = grouped[group];
            if (!groupExercises || groupExercises.length === 0) return null;
            return (
              <div key={group}>
                <div className="flex items-center gap-3 mb-4">
                  <h2
                    className="font-display text-polar text-xl"
                    style={{ letterSpacing: '0.12em' }}
                  >
                    {groupLabels[group]}
                  </h2>
                  <div className="flex-1 h-px bg-steel" />
                  <span className="text-ash text-xs">
                    {groupExercises.length} exercices
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupExercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      elapsedTime={elapsedTimes[exercise.id] || 0}
                      onStart={onStartExercise}
                      onComplete={onCompleteExercise}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Recap - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <SessionRecap
            completedCount={completedCount}
            totalCount={exercises.length}
            mpThisSession={totalMPThisSession}
            globalElapsed={globalElapsed}
            onFinishSession={onFinishSession}
          />
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-graphite border-t border-steel z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-ash text-[10px]" style={{ letterSpacing: '0.05em' }}>
                EXERCICES
              </div>
              <div className="font-display text-polar text-sm" style={{ letterSpacing: '0.05em' }}>
                {completedCount}/{exercises.length}
              </div>
            </div>
            <div>
              <div className="text-ash text-[10px]" style={{ letterSpacing: '0.05em' }}>
                MP
              </div>
              <div className="font-display text-rosso text-sm" style={{ letterSpacing: '0.05em' }}>
                +{totalMPThisSession}
              </div>
            </div>
          </div>
          {completedCount > 0 && (
            <button
              onClick={onFinishSession}
              className="bg-obsidian border border-steel text-polar px-4 py-2 font-display text-xs tracking-widest hover:border-rosso"
              style={{ letterSpacing: '0.06em' }}
            >
              TERMINER
            </button>
          )}
        </div>
      </div>

      {/* Bottom padding for mobile footer */}
      <div className="lg:hidden h-16" />
    </div>
  );
}
