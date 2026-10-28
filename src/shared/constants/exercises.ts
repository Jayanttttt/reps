import { Exercise, BodyPart } from '../types';

/**
 * Comprehensive exercise library organized by body part.
 * Users can also add custom exercises.
 */
export const DEFAULT_EXERCISES: Exercise[] = [
  // Chest
  { id: 'bench-press', name: 'Bench Press', bodyPart: 'chest', isCustom: false },
  { id: 'incline-bench-press', name: 'Incline Bench Press', bodyPart: 'chest', isCustom: false },
  { id: 'decline-bench-press', name: 'Decline Bench Press', bodyPart: 'chest', isCustom: false },
  { id: 'dumbbell-press', name: 'Dumbbell Press', bodyPart: 'chest', isCustom: false },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', bodyPart: 'chest', isCustom: false },
  { id: 'chest-fly', name: 'Chest Fly', bodyPart: 'chest', isCustom: false },
  { id: 'cable-crossover', name: 'Cable Crossover', bodyPart: 'chest', isCustom: false },
  { id: 'push-ups', name: 'Push Ups', bodyPart: 'chest', isCustom: false },
  { id: 'pec-deck', name: 'Pec Deck', bodyPart: 'chest', isCustom: false },

  // Back
  { id: 'deadlift', name: 'Deadlift', bodyPart: 'back', isCustom: false },
  { id: 'barbell-row', name: 'Barbell Row', bodyPart: 'back', isCustom: false },
  { id: 'dumbbell-row', name: 'Dumbbell Row', bodyPart: 'back', isCustom: false },
  { id: 'lat-pulldown', name: 'Lat Pulldown', bodyPart: 'back', isCustom: false },
  { id: 'pull-ups', name: 'Pull Ups', bodyPart: 'back', isCustom: false },
  { id: 'seated-cable-row', name: 'Seated Cable Row', bodyPart: 'back', isCustom: false },
  { id: 't-bar-row', name: 'T-Bar Row', bodyPart: 'back', isCustom: false },
  { id: 'face-pull', name: 'Face Pull', bodyPart: 'back', isCustom: false },

  // Shoulders
  { id: 'overhead-press', name: 'Overhead Press', bodyPart: 'shoulders', isCustom: false },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', bodyPart: 'shoulders', isCustom: false },
  { id: 'lateral-raise', name: 'Lateral Raise', bodyPart: 'shoulders', isCustom: false },
  { id: 'front-raise', name: 'Front Raise', bodyPart: 'shoulders', isCustom: false },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', bodyPart: 'shoulders', isCustom: false },
  { id: 'arnold-press', name: 'Arnold Press', bodyPart: 'shoulders', isCustom: false },
  { id: 'upright-row', name: 'Upright Row', bodyPart: 'shoulders', isCustom: false },
  { id: 'shrugs', name: 'Shrugs', bodyPart: 'shoulders', isCustom: false },

  // Biceps
  { id: 'barbell-curl', name: 'Barbell Curl', bodyPart: 'biceps', isCustom: false },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', bodyPart: 'biceps', isCustom: false },
  { id: 'hammer-curl', name: 'Hammer Curl', bodyPart: 'biceps', isCustom: false },
  { id: 'preacher-curl', name: 'Preacher Curl', bodyPart: 'biceps', isCustom: false },
  { id: 'concentration-curl', name: 'Concentration Curl', bodyPart: 'biceps', isCustom: false },
  { id: 'cable-curl', name: 'Cable Curl', bodyPart: 'biceps', isCustom: false },
  { id: 'incline-dumbbell-curl', name: 'Incline Dumbbell Curl', bodyPart: 'biceps', isCustom: false },

  // Triceps
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', bodyPart: 'triceps', isCustom: false },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', bodyPart: 'triceps', isCustom: false },
  { id: 'skull-crusher', name: 'Skull Crusher', bodyPart: 'triceps', isCustom: false },
  { id: 'close-grip-bench', name: 'Close Grip Bench Press', bodyPart: 'triceps', isCustom: false },
  { id: 'dips', name: 'Dips', bodyPart: 'triceps', isCustom: false },
  { id: 'tricep-kickback', name: 'Tricep Kickback', bodyPart: 'triceps', isCustom: false },

  // Legs
  { id: 'squat', name: 'Squat', bodyPart: 'legs', isCustom: false },
  { id: 'leg-press', name: 'Leg Press', bodyPart: 'legs', isCustom: false },
  { id: 'leg-extension', name: 'Leg Extension', bodyPart: 'legs', isCustom: false },
  { id: 'leg-curl', name: 'Leg Curl', bodyPart: 'legs', isCustom: false },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', bodyPart: 'legs', isCustom: false },
  { id: 'lunges', name: 'Lunges', bodyPart: 'legs', isCustom: false },
  { id: 'hack-squat', name: 'Hack Squat', bodyPart: 'legs', isCustom: false },
  { id: 'front-squat', name: 'Front Squat', bodyPart: 'legs', isCustom: false },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', bodyPart: 'legs', isCustom: false },

  // Core
  { id: 'plank', name: 'Plank', bodyPart: 'core', isCustom: false },
  { id: 'crunches', name: 'Crunches', bodyPart: 'core', isCustom: false },
  { id: 'russian-twist', name: 'Russian Twist', bodyPart: 'core', isCustom: false },
  { id: 'leg-raise', name: 'Leg Raise', bodyPart: 'core', isCustom: false },
  { id: 'cable-woodchop', name: 'Cable Woodchop', bodyPart: 'core', isCustom: false },
  { id: 'ab-rollout', name: 'Ab Rollout', bodyPart: 'core', isCustom: false },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', bodyPart: 'core', isCustom: false },

  // Glutes
  { id: 'hip-thrust', name: 'Hip Thrust', bodyPart: 'glutes', isCustom: false },
  { id: 'glute-bridge', name: 'Glute Bridge', bodyPart: 'glutes', isCustom: false },
  { id: 'cable-kickback', name: 'Cable Kickback', bodyPart: 'glutes', isCustom: false },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', bodyPart: 'glutes', isCustom: false },

  // Calves
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', bodyPart: 'calves', isCustom: false },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', bodyPart: 'calves', isCustom: false },

  // Forearms
  { id: 'wrist-curl', name: 'Wrist Curl', bodyPart: 'forearms', isCustom: false },
  { id: 'reverse-wrist-curl', name: 'Reverse Wrist Curl', bodyPart: 'forearms', isCustom: false },
  { id: 'farmer-walk', name: "Farmer's Walk", bodyPart: 'forearms', isCustom: false },

  // Cardio
  { id: 'treadmill', name: 'Treadmill', bodyPart: 'cardio', isCustom: false },
  { id: 'cycling', name: 'Cycling', bodyPart: 'cardio', isCustom: false },
  { id: 'rowing-machine', name: 'Rowing Machine', bodyPart: 'cardio', isCustom: false },
  { id: 'jump-rope', name: 'Jump Rope', bodyPart: 'cardio', isCustom: false },
];

/**
 * Get exercises filtered by body part
 */
export function getExercisesByBodyPart(exercises: Exercise[], bodyPart: BodyPart): Exercise[] {
  return exercises.filter(e => e.bodyPart === bodyPart);
}

/**
 * Body part indicators and badges - Clean, professional styling without emojis
 */
export const BODY_PART_ICONS: Record<BodyPart, string> = {
  chest: '',
  back: '',
  shoulders: '',
  biceps: '',
  triceps: '',
  legs: '',
  core: '',
  glutes: '',
  forearms: '',
  calves: '',
  cardio: '',
};

export const BODY_PART_COLORS: Record<BodyPart, string> = {
  chest: 'bg-red-950/40 text-neutral-200 border-red-500/35',
  back: 'bg-rose-950/40 text-neutral-200 border-rose-500/35',
  shoulders: 'bg-red-950/40 text-neutral-200 border-red-500/35',
  biceps: 'bg-neutral-900/80 text-neutral-200 border-white/20',
  triceps: 'bg-neutral-900/80 text-neutral-200 border-white/20',
  legs: 'bg-red-950/50 text-white border-red-500/40 font-bold',
  core: 'bg-neutral-900/80 text-neutral-200 border-white/20',
  glutes: 'bg-rose-950/40 text-neutral-200 border-rose-500/35',
  forearms: 'bg-neutral-900/80 text-neutral-200 border-white/20',
  calves: 'bg-red-950/40 text-neutral-200 border-red-500/35',
  cardio: 'bg-red-950/40 text-neutral-200 border-red-500/35',
};
