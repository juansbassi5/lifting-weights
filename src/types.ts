export type MuscleGroup = "Pecho" | "Tríceps" | "Piernas" | "Hombros" | "Espalda" | "Bíceps";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  muscleGroup: MuscleGroup;
}

export interface Routine {
  id: string;
  monthId: string; // belongs to a Month
  name: string;   // e.g. "Día 1"
  exercises: Exercise[];
  createdAt: string;
}

export interface Month {
  id: string;
  name: string; // e.g. "Mes 1"
}

export interface WeeklyCompletion {
  monthId: string;
  weekId: string; // "w1", "w2", "w3", "w4"
  routineId: string;
  completed: boolean;
}
