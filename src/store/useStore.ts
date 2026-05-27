import { useState, useCallback, useRef, useEffect } from 'react';
import type { Exercise, Page, PurchasedItem, WorkoutSession } from '@/types';
import { INITIAL_EXERCISES, SHOP_ITEMS } from '@/data/exercises';

const STORE_KEY = 'my-meridian-data';

interface StoredData {
  exercises: Exercise[];
  mpBalance: number;
  purchasedItems: PurchasedItem[];
  sessions: WorkoutSession[];
}

function loadStoredData(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* empty */ }
  return null;
}

function saveStoredData(data: StoredData) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch { /* empty */ }
}

export function useStore() {
  const stored = loadStoredData();

  const [currentPage, setCurrentPage] = useState<Page>('workout');
  const [exercises, setExercises] = useState<Exercise[]>(
    stored?.exercises || INITIAL_EXERCISES.map((e) => ({ ...e }))
  );
  const [mpBalance, setMpBalance] = useState<number>(stored?.mpBalance || 0);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>(
    stored?.purchasedItems || []
  );
  const [sessions, setSessions] = useState<WorkoutSession[]>(
    stored?.sessions || []
  );
  const [globalTimerStart, setGlobalTimerStart] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>({});
  const [globalElapsed, setGlobalElapsed] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start global timer when first exercise starts
  useEffect(() => {
    const anyInProgress = exercises.some((e) => e.status === 'in_progress');
    if (anyInProgress && !globalTimerStart) {
      setGlobalTimerStart(Date.now());
    }
  }, [exercises, globalTimerStart]);

  // Tick timer for active exercises and global timer
  useEffect(() => {
    const hasActive = exercises.some((e) => e.status === 'in_progress');
    if (!hasActive && !globalTimerStart) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      setElapsedTimes((prev) => {
        const next: Record<string, number> = { ...prev };
        exercises.forEach((ex) => {
          if (ex.status === 'in_progress' && ex.startTime) {
            next[ex.id] = Math.floor((now - ex.startTime) / 1000);
          }
        });
        return next;
      });
      if (globalTimerStart) {
        setGlobalElapsed(Math.floor((now - globalTimerStart) / 1000));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [exercises, globalTimerStart]);

  // Persist to localStorage
  useEffect(() => {
    const data: StoredData = {
      exercises,
      mpBalance,
      purchasedItems,
      sessions,
    };
    saveStoredData(data);
  }, [exercises, mpBalance, purchasedItems, sessions]);

  const showNotification = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const startExercise = useCallback((id: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, status: 'in_progress' as const, startTime: Date.now() }
          : ex
      )
    );
  }, []);

  const completeExercise = useCallback(
    (id: string, weight: string, feeling: string) => {
      setExercises((prev) => {
        const updated = prev.map((ex) => {
          if (ex.id !== id) return ex;
          const endTime = Date.now();
          const duration = ex.startTime
            ? Math.floor((endTime - ex.startTime) / 1000)
            : 0;
          return {
            ...ex,
            status: 'completed' as const,
            endTime,
            duration,
            weight,
            feeling,
          };
        });

        // Add MP for completed exercise
        const completedEx = updated.find((e) => e.id === id);
        if (completedEx && completedEx.status === 'completed') {
          setMpBalance((mp) => mp + completedEx.mpReward);
        }

        return updated;
      });
    },
    []
  );

  const purchaseItem = useCallback(
    (itemId: string) => {
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item || mpBalance < item.price) return false;

      setMpBalance((prev) => prev - item.price);
      setPurchasedItems((prev) => [
        ...prev,
        {
          item,
          purchaseDate: new Date().toISOString(),
        },
      ]);
      showNotification(
        `Achat effectue avec succes ! Vous avez depense ${item.price} MP`
      );
      return true;
    },
    [mpBalance, showNotification]
  );

  const finishSession = useCallback(() => {
    const completedExercises = exercises.filter(
      (e) => e.status === 'completed'
    );
    if (completedExercises.length === 0) return;

    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      exercises: completedExercises.map((e) => ({ ...e })),
      totalDuration: completedExercises.reduce(
        (sum, e) => sum + e.duration,
        0
      ),
      totalMP: completedExercises.reduce((sum, e) => sum + e.mpReward, 0),
    };

    setSessions((prev) => [session, ...prev]);

    // Reset exercises for next session
    setExercises(INITIAL_EXERCISES.map((e) => ({ ...e })));
    setGlobalTimerStart(null);
    setGlobalElapsed(0);
    setElapsedTimes({});
  }, [exercises]);

  const resetAll = useCallback(() => {
    setExercises(INITIAL_EXERCISES.map((e) => ({ ...e })));
    setMpBalance(0);
    setPurchasedItems([]);
    setSessions([]);
    setGlobalTimerStart(null);
    setGlobalElapsed(0);
    setElapsedTimes({});
    localStorage.removeItem(STORE_KEY);
  }, []);

  const completedCount = exercises.filter((e) => e.status === 'completed').length;
  const inProgressCount = exercises.filter(
    (e) => e.status === 'in_progress'
  ).length;
  const totalMPThisSession = exercises
    .filter((e) => e.status === 'completed')
    .reduce((sum, e) => sum + e.mpReward, 0);

  return {
    currentPage,
    setCurrentPage,
    exercises,
    mpBalance,
    purchasedItems,
    sessions,
    globalTimerStart,
    globalElapsed,
    elapsedTimes,
    notification,
    completedCount,
    inProgressCount,
    totalMPThisSession,
    startExercise,
    completeExercise,
    purchaseItem,
    finishSession,
    resetAll,
    showNotification,
  };
}
