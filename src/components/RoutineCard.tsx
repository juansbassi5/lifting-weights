import { CheckCircle2, Edit3, Trash2 } from "lucide-react";
import { Routine, MuscleGroup } from "@/types";

interface RoutineCardProps {
  routine: Routine;
  isDone: boolean;
  handleToggleCheckpoint: (id: string) => void;
  handleStartEdit: (routine: Routine) => void;
  handleDeleteRoutine: (id: string) => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = ["Pecho", "Tríceps", "Piernas", "Hombros", "Espalda", "Bíceps"];

export default function RoutineCard({
  routine,
  isDone,
  handleToggleCheckpoint,
  handleStartEdit,
  handleDeleteRoutine,
}: RoutineCardProps) {
  return (
    <div
      className={`card !p-0 overflow-hidden border flex flex-col h-full transition-all duration-200 ${
        isDone
          ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
          : "border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
      }`}
    >
      {/* Routine Header */}
      <div
        className={`border-b p-4 text-center transition-colors ${
          isDone
            ? "bg-emerald-500/10 border-emerald-500/20"
            : "bg-[var(--primary-glow)] border-[var(--border-color)]"
        }`}
      >
        <h3
          className={`font-extrabold text-sm uppercase tracking-wider ${
            isDone ? "text-emerald-400" : "text-[var(--primary)]"
          }`}
        >
          {routine.name}
        </h3>
      </div>

      {/* Muscle Groups Content */}
      <div className="p-5 flex-grow space-y-5">
        {MUSCLE_GROUPS.map((group) => {
          const groupExercises = routine.exercises.filter((ex) => ex.muscleGroup === group);
          if (groupExercises.length === 0) return null;

          return (
            <div key={group} className="space-y-2">
              <h5 className="font-bold text-xs text-[var(--text-main)] uppercase border-b border-[var(--border-color)]/30 pb-1 flex justify-between">
                <span>{group}</span>
              </h5>
              <div className="space-y-1">
                {groupExercises.map((ex) => (
                  <div key={ex.id} className="text-xs text-[var(--text-muted)] flex justify-between py-0.5">
                    <span>{ex.name}</span>
                    <span className="font-bold text-[var(--text-main)] whitespace-nowrap ml-2">
                      {ex.sets}x{ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkpoint and Actions row split by borders */}
      <div className="border-t border-[var(--border-color)] flex divide-x divide-[var(--border-color)] bg-[var(--bg-card-hover)]/20">
        {/* Checkpoint toggler */}
        <button
          onClick={() => handleToggleCheckpoint(routine.id)}
          className={`flex-grow py-4 px-6 text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
            isDone
              ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
              : "text-[var(--text-muted)] hover:text-emerald-500 hover:bg-emerald-500/5"
          }`}
        >
          <CheckCircle2 className={`h-4.5 w-4.5 ${isDone ? "text-emerald-400" : "text-[var(--text-muted)]"}`} />
          {isDone ? "Completado" : "Checkpoint"}
        </button>

        {/* Edit Button */}
        <button
          onClick={() => handleStartEdit(routine)}
          className="px-5 py-4 hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all cursor-pointer"
          title="Editar rutina"
        >
          <Edit3 className="h-4 w-4" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => handleDeleteRoutine(routine.id)}
          className="px-5 py-4 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all cursor-pointer"
          title="Eliminar rutina"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
