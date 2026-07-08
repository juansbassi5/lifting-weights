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
    <div className="card shadow-sm !p-9 md:!p-11 flex flex-col gap-4 animate-in fade-in duration-200 w-full">
      {/* Header del creador */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] w-[95%] mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="p-2.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)] transition-all cursor-pointer flex items-center justify-center active:scale-98"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight pl-[2px]">
            {currentView === "create" ? "Nueva Rutina" : "Modificar Rutina"}
          </h3>
        </div>
        <button
          onClick={handleSaveRoutine}
          className="flex items-center gap-2 px-6 h-11.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer border-0 active:scale-98"
        >
          <Save className="h-4 w-4" />
          Guardar Rutina
        </button>
      </div>

      {/* Label indicating this routine belongs to the Month */}
      <div className="flex items-center gap-3 bg-[var(--primary-glow)] text-[var(--primary)] text-xs font-bold px-7.5 py-4.5 rounded-lg border border-[var(--primary)]/20 shadow-2xs w-[95%] mx-auto">
        <span>Destino:</span>
        <strong className="text-[var(--text-main)] uppercase tracking-wide">{activeMonthName}</strong>
        <span className="text-[var(--text-muted)] font-normal ml-1">(Se compartirá para las 4 semanas)</span>
      </div>

      {/* Input Nombre Rutina (Ancho Completo) */}
      <div className="flex flex-col gap-2 w-[95%] mx-auto">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block pl-[2px]">
          Nombre de la Rutina
        </label>
        <input
          type="text"
          placeholder="Ej: Día 1, Pierna - Hombros, Día 3"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="w-full h-12 px-4.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 text-sm font-semibold transition-all"
          maxLength={50}
        />
      </div>

      {/* Selector de Grupo Muscular */}
      <div className="flex flex-col gap-2 w-[95%] mx-auto">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block pl-[2px]">
          Elegir Grupo Muscular
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => setActiveMuscleGroup(group)}
              className={`h-12 px-4.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center justify-center active:scale-98 ${activeMuscleGroup === group
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
      <div className="p-8 md:p-9 bg-[var(--bg-main)]/30 border border-[var(--border-color)] rounded-xl flex flex-col gap-4 w-[95%] mx-auto">
        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block border-b border-[var(--border-color)]/30 pb-3.5 pl-[2px]">
          Ejercicios en el grupo: <strong className="text-[var(--text-main)]">{activeMuscleGroup}</strong>
        </span>

        {/* Lista actual de ejercicios en el grupo */}
        {routineExercises.filter((e) => e.muscleGroup === activeMuscleGroup).length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] italic text-center py-8 bg-[var(--bg-card)]/30 border border-dashed border-[var(--border-color)] rounded-lg">
            No hay ejercicios guardados para {activeMuscleGroup} en esta rutina.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {routineExercises
              .filter((e) => e.muscleGroup === activeMuscleGroup)
              .map((ex, index) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between py-5 px-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-2xs"
                >
                  <span className="text-xs font-bold text-[var(--text-main)] pl-[2px]">
                    {index + 1}. {ex.name} &bull;{" "}
                    <span className="text-blue-500 font-extrabold">
                      {ex.sets}x{ex.reps}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="p-1.5 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all text-[var(--text-muted)] flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Formulario para añadir ejercicio al grupo activo */}
        <div className="pt-7 border-t border-[var(--border-color)]/30 flex flex-col gap-4">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block pl-[2px]">
            Añadir Ejercicio a {activeMuscleGroup}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Nombre del Ejercicio */}
            <div className="sm:col-span-8 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block pl-[2px]">
                Nombre del Ejercicio
              </label>
              <input
                type="text"
                placeholder="Ej: Press Inclinado c/manc"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                className="w-full h-12 px-4.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 text-xs font-semibold transition-all"
              />
            </div>

            {/* Series */}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block pl-[2px]">
                Series
              </label>
              <input
                type="number"
                min={1}
                value={newExerciseSets}
                onChange={(e) => setNewExerciseSets(parseInt(e.target.value) || 1)}
                className="w-full h-12 px-4.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 text-xs font-bold text-center"
              />
            </div>

            {/* Repeticiones */}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block pl-[2px]">
                Reps
              </label>
              <input
                type="text"
                placeholder="Ej: 12"
                value={newExerciseReps}
                onChange={(e) => setNewExerciseReps(e.target.value)}
                className="w-full h-12 px-4.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 text-xs font-bold text-center"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddExerciseToRoutine}
            className="w-full h-12 px-5.5 border border-blue-500/30 hover:border-blue-500 text-blue-500 hover:bg-blue-500/5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer mt-3 active:scale-98"
          >
            <PlusCircle className="h-4 w-4" />
            Agregar Ejercicio a {activeMuscleGroup}
          </button>
        </div>
      </div>

      {/* Acciones del final */}
      <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)] w-[95%] mx-auto">
        <button
          onClick={handleSaveRoutine}
          className="flex-grow h-13 px-6.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer border-0 active:scale-98"
        >
          <Save className="h-4.5 w-4.5" />
          Guardar Rutina Completada
        </button>
        <button
          onClick={() => setCurrentView("dashboard")}
          className="px-10.5 h-13 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center justify-center active:scale-98"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}