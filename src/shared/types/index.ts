// ============================================================
// REPS Fitness Tracker - Core Type Definitions
// ============================================================

/** Unique identifier type */
export type ID = string;

/** Days of the week */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// ============================================================
// Body Parts & Exercise Categories
// ============================================================

export type BodyPart =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'glutes'
  | 'forearms'
  | 'calves'
  | 'cardio';

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  legs: 'Legs',
  core: 'Abs & Core',
  glutes: 'Glutes',
  forearms: 'Forearms',
  calves: 'Calves',
  cardio: 'Cardio',
};

// ============================================================
// Exercise Definition
// ============================================================

export interface Exercise {
  id: ID;
  name: string;
  bodyPart: BodyPart;
  isCustom: boolean;
}

// ============================================================
// Sets & Workout Logging
// ============================================================

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number; // in kg
  isCompleted: boolean;
}

export interface ExerciseLog {
  exerciseId: ID;
  exerciseName: string;
  bodyPart: BodyPart;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: ID;
  date: string; // ISO date string YYYY-MM-DD
  dayOfWeek: DayOfWeek;
  bodyParts: BodyPart[];
  exercises: ExerciseLog[];
  duration?: number; // minutes
  completed: boolean;
}

// ============================================================
// Weekly Planner
// ============================================================

export type SplitType = 'single' | 'double' | 'triple' | 'custom';

export interface PlannedExercise {
  exerciseId: ID;
  exerciseName: string;
  bodyPart: BodyPart;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
}

export interface DayPlan {
  day: DayOfWeek;
  isRestDay: boolean;
  splitType: SplitType;
  bodyParts: BodyPart[];
  exercises: PlannedExercise[];
}

export interface WeeklyPlan {
  id: ID;
  name: string;
  createdAt: string;
  updatedAt: string;
  days: Record<DayOfWeek, DayPlan>;
}

// ============================================================
// Monthly Goals
// ============================================================

export interface MonthlyGoal {
  id: ID;
  exerciseId: ID;
  exerciseName: string;
  bodyPart: BodyPart;
  metric: 'weight' | 'reps' | 'volume';
  targetValue: number;
  currentValue: number;
  unit: string;
  description: string;
}

export interface MonthGoals {
  month: string; // YYYY-MM
  goals: MonthlyGoal[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Monthly Reports
// ============================================================

export interface ExerciseProgress {
  exerciseId: ID;
  exerciseName: string;
  bodyPart: BodyPart;
  startWeight: number;
  endWeight: number;
  weightChange: number;
  weightChangePercent: number;
  startMaxReps: number;
  endMaxReps: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number; // weight * reps summed
}

export interface MonthlyReport {
  month: string; // YYYY-MM
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  overallStrengthChange: number; // percentage
  exerciseProgress: ExerciseProgress[];
  bodyPartBreakdown: Record<BodyPart, { sets: number; volume: number }>;
  generatedAt: string;
}

// ============================================================
// Previous Record (for PR suggestions)
// ============================================================

export interface PreviousRecord {
  date: string;
  bestWeight: number;
  bestReps: number;
  bestVolume: number; // best single set volume (weight * reps)
  sets: ExerciseSet[];
}

// ============================================================
// App Settings
// ============================================================

export interface AppSettings {
  weightUnit: 'kg' | 'lbs';
  prIncrementSuggestion: number; // default 2.5 kg
  dataRetentionMonths: number; // default 6
  theme: 'dark';
}

export const DEFAULT_SETTINGS: AppSettings = {
  weightUnit: 'kg',
  prIncrementSuggestion: 2.5,
  dataRetentionMonths: 6,
  theme: 'dark',
};
