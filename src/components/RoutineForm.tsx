import { ChevronLeft, PlusCircle, Save, Trash2 } from "lucide-react";
import { Exercise, MuscleGroup } from "@/types";

interface RoutineFormProps {
  currentView: "create" | "edit";
  activeMonthName: string;
  routineName: string;
  setRoutineName: (name: string) => void;
  routineExercises: Exercise[];
  setRoutineExercises: (exercises: Exercise[]) => void;
  activeMuscleGroup: MuscleGroup;
  setActiveMuscleGroup: (group: MuscleGroup) => void;
  newExerciseName: string;
  setNewExerciseName: (name: string) => void;
  newExerciseSets: number;
  setNewExerciseSets: (sets: number) => void;
  newExerciseReps: string;
  setNewExerciseReps: (reps: string) => void;
  handleAddExerciseToRoutine: () => void;
  handleRemoveExercise: (id: string) => void;
  handleSaveRoutine: () => void;
  setCurrentView: (view: "dashboard" | "create" | "edit") => void;
}

const MUSCLE_GROUPS: MuscleGroup[] = ["Pecho", "Tríceps", "Piernas", "Hombros", "Espalda", "Bíceps"];

export default function RoutineForm({
  currentView,
  activeMonthName,
  routineName,
  setRoutineName,
  routineExercises,
  activeMuscleGroup,
  setActiveMuscleGroup,
  newExerciseName,
  setNewExerciseName,
  newExerciseSets,
  setNewExerciseSets,
  newExerciseReps,
  setNewExerciseReps,
  handleAddExerciseToRoutine,
  handleRemoveExercise,
  handleSaveRoutine,
  setCurrentView,
}: RoutineFormProps) {
  return (
    <div className="card shadow-sm p-6 md:p-8 space-y-6 animate-in fade-in duration-200 w-full">
      {/* Header del creador */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="p-2.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-all cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-bold text-[var(--text-main)]">
            {currentView === "create" ? "Nueva Rutina" : "Modificar Rutina"}
          </h3>
        </div>
        <button
          onClick={handleSaveRoutine}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Guardar Rutina
        </button>
      </div>

      {/* Label indicating this routine belongs to the Month */}
      <div className="flex items-center gap-2 bg-[var(--primary-glow)] text-[var(--primary)] text-xs font-bold px-4 py-2.5 rounded-lg border border-[var(--primary)]/20 shadow-2xs">
        <span>Destino:</span>
        <strong className="text-[var(--text-main)] uppercase">{activeMonthName}</strong>
        <span className="text-[var(--text-muted)] font-normal">(Se compartirá para las 4 semanas)</span>
      </div>

      {/* Input Nombre Rutina (Ancho Completo) */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
          Nombre de la Rutina
        </label>
        <input
          type="text"
          placeholder="Ej: Día 1, Pierna - Hombros, Día 3"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="w-full h-12 px-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-blue-500 font-semibold text-sm transition-all animate-none"
          maxLength={50}
        />
      </div>

      {/* Selector de Grupo Muscular */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block font-sans">
          Elegir Grupo Muscular
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => setActiveMuscleGroup(group)}
              className={`h-11 px-5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                activeMuscleGroup === group
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Listado y Formulario del Grupo Muscular Seleccionado */}
      <div className="p-5 bg-[var(--bg-main)]/30 border border-[var(--border-color)] rounded-xl space-y-5">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block border-b border-[var(--border-color)]/30 pb-2">
          Ejercicios en el grupo: <strong className="text-[var(--text-main)]">{activeMuscleGroup}</strong>
        </span>

        {/* Lista actual de ejercicios en el grupo */}
        {routineExercises.filter((e) => e.muscleGroup === activeMuscleGroup).length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] italic text-center py-4 bg-[var(--bg-card)]/30 border border-dashed border-[var(--border-color)] rounded-lg">
            No hay ejercicios guardados para {activeMuscleGroup} en esta rutina.
          </p>
        ) : (
          <div className="space-y-2.5">
            {routineExercises
              .filter((e) => e.muscleGroup === activeMuscleGroup)
              .map((ex, index) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-2xs"
                >
                  <span className="text-xs font-bold text-[var(--text-main)]">
                    {index + 1}. {ex.name} &bull;{" "}
                    <span className="text-blue-500 font-extrabold">
                      {ex.sets}x{ex.reps}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all text-[var(--text-muted)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Formulario para añadir ejercicio al grupo activo */}
        <div className="pt-4 border-t border-[var(--border-color)]/30 space-y-4">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            Añadir Ejercicio a {activeMuscleGroup}
          </span>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Nombre del Ejercicio */}
            <div className="flex-1 space-y-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase">
                Nombre del Ejercicio
              </label>
              <input
                type="text"
                placeholder="Ej: Press Inclinado c/manc"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                className="w-full h-11 px-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-blue-500 text-xs font-semibold transition-all"
              />
            </div>

            {/* Series */}
            <div className="w-full sm:w-24 space-y-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase text-center block">
                Series
              </label>
              <input
                type="number"
                min={1}
                value={newExerciseSets}
                onChange={(e) => setNewExerciseSets(parseInt(e.target.value) || 1)}
                className="w-full h-11 px-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none text-xs text-center font-bold"
              />
            </div>

            {/* Repeticiones */}
            <div className="w-full sm:w-28 space-y-1">
              <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase text-center block">
                Reps
              </label>
              <input
                type="text"
                placeholder="Ej: 12"
                value={newExerciseReps}
                onChange={(e) => setNewExerciseReps(e.target.value)}
                className="w-full h-11 px-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none text-xs text-center font-bold"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddExerciseToRoutine}
            className="w-full h-12 px-6 border border-blue-500/30 hover:border-blue-500 text-blue-500 hover:bg-blue-500/5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Agregar Ejercicio a {activeMuscleGroup}
          </button>
        </div>
      </div>

      {/* Acciones del final */}
      <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
        <button
          onClick={handleSaveRoutine}
          className="flex-grow h-13 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
        >
          <Save className="h-4.5 w-4.5" />
          Guardar Rutina Completada
        </button>
        <button
          onClick={() => setCurrentView("dashboard")}
          className="px-8 h-13 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] rounded-lg text-sm font-bold transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
