export type MuscleGroup =
  | 'Biceps'
  | 'Triceps'
  | 'Pecs'
  | 'Shoulders'
  | 'Back'
  | 'Cardio'
  | 'Core';

export type ExerciseStatus = 'not_started' | 'in_progress' | 'completed';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  mpReward: number;
  status: ExerciseStatus;
  startTime: number | null;
  endTime: number | null;
  duration: number;
  weight: string;
  feeling: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface PurchasedItem {
  item: ShopItem;
  purchaseDate: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  exercises: Exercise[];
  totalDuration: number;
  totalMP: number;
}

export type Page = 'workout' | 'shop' | 'history';

export interface AppState {
  currentPage: Page;
  exercises: Exercise[];
  mpBalance: number;
  purchasedItems: PurchasedItem[];
  sessions: WorkoutSession[];
  globalTimerStart: number | null;
  notification: string | null;
}
