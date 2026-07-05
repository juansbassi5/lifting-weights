"use client";

import { useState, useEffect } from "react";
import { Dumbbell, Plus, CheckCircle2, Sun, Moon } from "lucide-react";
import { Exercise, Routine, MuscleGroup, Month, WeeklyCompletion } from "@/types";

// Import modular components
import Sidebar from "@/components/Sidebar";
import MonthSelector from "@/components/MonthSelector";
import WeekTabs from "@/components/WeekTabs";
import RoutineCard from "@/components/RoutineCard";
import RoutineForm from "@/components/RoutineForm";

// Helper impure functions placed outside the component to satisfy React purity compiler rules
const WEEKS = [
  { id: "w1", name: "Semana 1" },
  { id: "w2", name: "Semana 2" },
  { id: "w3", name: "Semana 3" },
  { id: "w4", name: "Semana 4" }
];

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
}

// Rutinas por defecto para Mes 1 (compartidas para todas las semanas de este mes)
const DEFAULT_ROUTINES = (monthId: string): Routine[] => [
  {
    id: "default-rt-1",
    monthId,
    name: "Día 1",
    createdAt: new Date().toISOString(),
    exercises: [
      { id: "e1", name: "Press Inclinado c/manc", sets: 4, reps: "12", muscleGroup: "Pecho" },
      { id: "e2", name: "Press Plano", sets: 4, reps: "10", muscleGroup: "Pecho" },
      { id: "e3", name: "Aperturas Planas", sets: 3, reps: "10", muscleGroup: "Pecho" },
      { id: "e4", name: "Aperturas Inclinadas", sets: 3, reps: "10", muscleGroup: "Pecho" },
      { id: "e5", name: "Press Francés", sets: 3, reps: "12", muscleGroup: "Tríceps" },
      { id: "e6", name: "Press Francés una mano", sets: 3, reps: "12", muscleGroup: "Tríceps" },
      { id: "e7", name: "Extensiones en polea", sets: 3, reps: "10", muscleGroup: "Tríceps" }
    ]
  },
  {
    id: "default-rt-2",
    monthId,
    name: "Día 2",
    createdAt: new Date().toISOString(),
    exercises: [
      { id: "e8", name: "Silla de Extensión", sets: 3, reps: "12", muscleGroup: "Piernas" },
      { id: "e9", name: "Camilla", sets: 3, reps: "12", muscleGroup: "Piernas" },
      { id: "e10", name: "Sentadilla", sets: 4, reps: "10", muscleGroup: "Piernas" },
      { id: "e11", name: "Peso Muerto", sets: 3, reps: "10", muscleGroup: "Piernas" },
      { id: "e12", name: "Gemelos con Barra", sets: 4, reps: "15", muscleGroup: "Piernas" },
      { id: "e13", name: "Vuelos Laterales", sets: 3, reps: "10", muscleGroup: "Hombros" },
      { id: "e14", name: "Press Arnold", sets: 3, reps: "10", muscleGroup: "Hombros" },
      { id: "e15", name: "Pullface", sets: 3, reps: "12", muscleGroup: "Hombros" }
    ]
  },
  {
    id: "default-rt-3",
    monthId,
    name: "Día 3",
    createdAt: new Date().toISOString(),
    exercises: [
      { id: "e16", name: "Polea alta", sets: 3, reps: "6", muscleGroup: "Espalda" },
      { id: "e17", name: "Polea al pecho", sets: 3, reps: "6", muscleGroup: "Espalda" },
      { id: "e18", name: "Remo a Caballo", sets: 3, reps: "8", muscleGroup: "Espalda" },
      { id: "e19", name: "Remo a un brazo", sets: 3, reps: "8", muscleGroup: "Espalda" },
      { id: "e20", name: "Bíceps con W", sets: 3, reps: "10", muscleGroup: "Bíceps" },
      { id: "e21", name: "Bíceps b inclinado", sets: 3, reps: "8", muscleGroup: "Bíceps" },
      { id: "e22", name: "Bíceps en polea soga", sets: 3, reps: "10", muscleGroup: "Bíceps" }
    ]
  }
];

export default function Home() {
  const [months, setMonths] = useState<Month[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [completions, setCompletions] = useState<WeeklyCompletion[]>([]);
  const [selectedMonthId, setSelectedMonthId] = useState<string>("");
  const [selectedWeekId, setSelectedWeekId] = useState<string>("w1");
  const [isMounted, setIsMounted] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "create" | "edit">("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  // Estados para creación/edición de rutinas
  const [routineName, setRoutineName] = useState("");
  const [routineExercises, setRoutineExercises] = useState<Exercise[]>([]);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [activeMuscleGroup, setActiveMuscleGroup] = useState<MuscleGroup>("Pecho");
  
  // Estado para el ejercicio que se está agregando actualmente en el builder
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseSets, setNewExerciseSets] = useState(3);
  const [newExerciseReps, setNewExerciseReps] = useState("12");

  // Mensaje de éxito temporal
  const [notification, setNotification] = useState<{ message: string } | null>(null);

  // Inicializar localStorage y tema de manera segura
  useEffect(() => {
    const handle = setTimeout(() => {
      // 1. Cargar Meses
      const storedMonths = localStorage.getItem("lw_months_v3");
      let activeMonths: Month[] = [];
      if (storedMonths) {
        activeMonths = JSON.parse(storedMonths);
        setMonths(activeMonths);
      } else {
        activeMonths = [{ id: "m1", name: "Mes 1" }];
        setMonths(activeMonths);
        localStorage.setItem("lw_months_v3", JSON.stringify(activeMonths));
      }

      // Establecer mes activo
      const initialMonthId = activeMonths[0]?.id || "m1";
      setSelectedMonthId(initialMonthId);

      // 2. Cargar Rutinas
      const storedRoutines = localStorage.getItem("lw_routines_v5");
      if (storedRoutines) {
        setRoutines(JSON.parse(storedRoutines));
      } else {
        const defaultRts = DEFAULT_ROUTINES(initialMonthId);
        setRoutines(defaultRts);
        localStorage.setItem("lw_routines_v5", JSON.stringify(defaultRts));
      }

      // 3. Cargar Checkpoints / Completados
      const storedCompletions = localStorage.getItem("lw_completions_v2");
      if (storedCompletions) {
        setCompletions(JSON.parse(storedCompletions));
      }

      // 4. Cargar Tema
      const savedTheme = localStorage.getItem("lw_theme") as "dark" | "light" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === "light") {
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.remove("light");
        }
      }

      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(handle);
  }, []);

  // Guardar rutinas cuando cambien
  const saveRoutinesToStorage = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    localStorage.setItem("lw_routines_v5", JSON.stringify(newRoutines));
  };

  const showNotification = (message: string) => {
    setNotification({ message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Cambiar Tema
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("lw_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      showNotification("Modo Claro activado");
    } else {
      document.documentElement.classList.remove("light");
      showNotification("Modo Oscuro activado");
    }
  };

  // --- Funciones de Meses ---

  const handleAddMonth = () => {
    const name = prompt("Escribe el nombre del mes (Ej: Mes 2 o Julio):");
    if (!name || !name.trim()) return;

    const newMonth: Month = {
      id: "m-" + Date.now(),
      name: name.trim()
    };
    const updatedMonths = [...months, newMonth];
    setMonths(updatedMonths);
    localStorage.setItem("lw_months_v3", JSON.stringify(updatedMonths));
    setSelectedMonthId(newMonth.id);
    setSelectedWeekId("w1");
    showNotification(`Mes "${newMonth.name}" creado`);
  };

  const handleDeleteMonth = (id: string) => {
    if (months.length === 1) {
      showNotification("Debes tener al menos un mes guardado");
      return;
    }
    const monthToDelete = months.find((m) => m.id === id);
    if (!monthToDelete) return;

    if (confirm(`¿Estás seguro de que deseas eliminar el mes "${monthToDelete.name}" y todas sus rutinas asociadas?`)) {
      const updatedMonths = months.filter((m) => m.id !== id);
      const updatedRoutines = routines.filter((r) => r.monthId !== id);
      const updatedCompletions = completions.filter((c) => c.monthId !== id);
      
      setMonths(updatedMonths);
      localStorage.setItem("lw_months_v3", JSON.stringify(updatedMonths));
      saveRoutinesToStorage(updatedRoutines);
      setCompletions(updatedCompletions);
      localStorage.setItem("lw_completions_v2", JSON.stringify(updatedCompletions));
      
      // Seleccionar el primer mes disponible
      setSelectedMonthId(updatedMonths[0].id);
      setSelectedWeekId("w1");
      showNotification("Mes eliminado");
    }
  };

  // --- Funciones de Checkpoints ---

  const handleToggleCheckpoint = (routineId: string) => {
    const existingIndex = completions.findIndex(
      (c) =>
        c.monthId === selectedMonthId &&
        c.weekId === selectedWeekId &&
        c.routineId === routineId
    );

    let updatedCompletions: WeeklyCompletion[];

    if (existingIndex > -1) {
      const isCurrentCompleted = completions[existingIndex].completed;
      if (isCurrentCompleted) {
        // Remover el completado
        updatedCompletions = completions.filter((_, idx) => idx !== existingIndex);
      } else {
        // Toggle a completado (seguridad)
        updatedCompletions = completions.map((c, idx) =>
          idx === existingIndex ? { ...c, completed: true } : c
        );
      }
    } else {
      // Registrar completado nuevo
      const newCompletion: WeeklyCompletion = {
        monthId: selectedMonthId,
        weekId: selectedWeekId,
        routineId,
        completed: true
      };
      updatedCompletions = [...completions, newCompletion];
    }

    setCompletions(updatedCompletions);
    localStorage.setItem("lw_completions_v2", JSON.stringify(updatedCompletions));

    const wasCompleted = updatedCompletions.some(
      (c) =>
        c.monthId === selectedMonthId &&
        c.weekId === selectedWeekId &&
        c.routineId === routineId &&
        c.completed
    );
    showNotification(wasCompleted ? "Día completado esta semana! 💪" : "Checkpoint removido");
  };

  // --- Funciones de Rutina ---

  const handleStartCreate = () => {
    setEditingRoutineId(null);
    setRoutineName("");
    setRoutineExercises([]);
    setActiveMuscleGroup("Pecho");
    setNewExerciseName("");
    setNewExerciseSets(3);
    setNewExerciseReps("12");
    setCurrentView("create");
  };

  const handleStartEdit = (routine: Routine) => {
    setEditingRoutineId(routine.id);
    setRoutineName(routine.name);
    setRoutineExercises([...routine.exercises]);
    setActiveMuscleGroup("Pecho");
    setNewExerciseName("");
    setNewExerciseSets(3);
    setNewExerciseReps("12");
    setCurrentView("edit");
  };

  const handleAddExerciseToRoutine = () => {
    if (!newExerciseName.trim()) {
      showNotification("Escribe el nombre del ejercicio");
      return;
    }

    const newExercise: Exercise = {
      id: generateId("ex"),
      name: newExerciseName.trim(),
      sets: newExerciseSets,
      reps: newExerciseReps.trim() || "12",
      muscleGroup: activeMuscleGroup
    };

    setRoutineExercises([...routineExercises, newExercise]);
    
    // Resetear formulario de ejercicio
    setNewExerciseName("");
  };

  const handleRemoveExercise = (id: string) => {
    setRoutineExercises(routineExercises.filter((e) => e.id !== id));
  };

  const handleSaveRoutine = () => {
    if (!routineName.trim()) {
      showNotification("El nombre de la rutina es requerido");
      return;
    }

    let updatedRoutines: Routine[];

    if (currentView === "edit" && editingRoutineId) {
      updatedRoutines = routines.map((r) =>
        r.id === editingRoutineId
          ? {
              ...r,
              name: routineName.trim(),
              exercises: routineExercises
            }
          : r
      );
      showNotification("Rutina actualizada");
    } else {
      const newRoutine: Routine = {
        id: generateId("rt"),
        monthId: selectedMonthId,
        name: routineName.trim(),
        exercises: routineExercises,
        createdAt: new Date().toISOString()
      };
      updatedRoutines = [...routines, newRoutine];
      showNotification("Rutina creada");
    }

    saveRoutinesToStorage(updatedRoutines);
    setCurrentView("dashboard");
  };

  const handleDeleteRoutine = (id: string) => {
    if (confirm("¿Eliminar esta rutina? Se perderán todos sus checkpoints.")) {
      const updated = routines.filter((r) => r.id !== id);
      saveRoutinesToStorage(updated);
      
      // Limpiar completados asociados
      const updatedCompletions = completions.filter((c) => c.routineId !== id);
      setCompletions(updatedCompletions);
      localStorage.setItem("lw_completions_v2", JSON.stringify(updatedCompletions));

      showNotification("Rutina eliminada");
    }
  };

  // --- Filtros de Visualización del Dashboard ---
  const activeMonthName = months.find((m) => m.id === selectedMonthId)?.name || "Mes 1";
  const activeWeekName = WEEKS.find((w) => w.id === selectedWeekId)?.name || "Semana 1";
  
  // Rutinas asociadas al mes activo (las mismas se muestran en las 4 semanas)
  const monthRoutines = routines.filter((r) => r.monthId === selectedMonthId);

  // Helper para verificar si un día/rutina está completado en la semana activa
  const isRoutineCompleted = (routineId: string) => {
    return completions.some(
      (c) =>
        c.monthId === selectedMonthId &&
        c.weekId === selectedWeekId &&
        c.routineId === routineId &&
        c.completed
    );
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center bg-[#11131b] min-h-screen text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <Dumbbell className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-slate-400 font-medium">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        toggleTheme={toggleTheme}
        handleStartCreate={handleStartCreate}
      />

      {/* TOAST CONTAINER FOR NOTIFICATIONS */}
      {notification && (
        <div className="toast-container">
          <div className="toast border border-blue-500/30 flex items-center gap-3 py-3 px-5">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 animate-bounce" />
            <span className="font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header mb-6">
          <div className="header-title">
            <h2 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              {currentView === "dashboard" && "Rutinas Planificadas"}
              {(currentView === "create" || currentView === "edit") && "Diseñador de Rutina"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1.5 leading-relaxed">
              {currentView === "dashboard" && `Rendimiento mensual para el ${activeMonthName} / ${activeWeekName}.`}
              {currentView === "create" && `Agregando rutina para el ${activeMonthName}.`}
              {currentView === "edit" && `Modificando rutina del ${activeMonthName}.`}
            </p>
          </div>

          <div className="sm:flex items-center gap-3 hidden">
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-slate-400 hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all cursor-pointer flex items-center justify-center"
              title="Cambiar tema visual"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-blue-600" />}
            </button>
          </div>
        </header>

        {/* 1. DASHBOARD VIEW (Months & Weeks Selector & Shared Routines Columns) */}
        {currentView === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* MONTH SELECTOR & CREATOR (TOP PILLS) */}
            <MonthSelector
              months={months}
              selectedMonthId={selectedMonthId}
              setSelectedMonthId={setSelectedMonthId}
              handleAddMonth={handleAddMonth}
              handleDeleteMonth={handleDeleteMonth}
            />

            {/* FULL-WIDTH CREAR RUTINA BUTTON */}
            <button
              onClick={handleStartCreate}
              className="w-full h-14 px-8 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] rounded-xl font-bold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <Plus className="h-5 w-5 text-blue-500" />
              Crear Nueva Rutina para {activeMonthName}
            </button>

            {/* WEEKS TABS SELECTOR */}
            <WeekTabs
              selectedWeekId={selectedWeekId}
              setSelectedWeekId={setSelectedWeekId}
            />

            <div className="h-[30px] shrink-0" />

            {monthRoutines.length === 0 ? (
              <div className="text-center py-20 card border border-dashed border-[var(--border-color)] rounded-xl space-y-4 bg-[var(--bg-card)]/30">
                <Dumbbell className="h-10 w-10 text-[var(--text-muted)] mx-auto animate-bounce" />
                <h4 className="text-base font-bold">No tienes ninguna rutina registrada en este mes</h4>
                <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">Crea tus días de entrenamiento para verlos reflejados en las 4 semanas.</p>
                <button
                  onClick={handleStartCreate}
                  className="px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  Configurar rutina
                </button>
              </div>
            ) : (
              /* SIDE-BY-SIDE COLUMNS (Routines are identical, checkpoint states are unique per week) */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {monthRoutines.map((routine) => (
                  <RoutineCard
                    key={routine.id}
                    routine={routine}
                    isDone={isRoutineCompleted(routine.id)}
                    handleToggleCheckpoint={handleToggleCheckpoint}
                    handleStartEdit={handleStartEdit}
                    handleDeleteRoutine={handleDeleteRoutine}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2 & 3. CREATE & EDIT ROUTINE VIEW */}
        {(currentView === "create" || currentView === "edit") && (
          <RoutineForm
            currentView={currentView}
            activeMonthName={activeMonthName}
            routineName={routineName}
            setRoutineName={setRoutineName}
            routineExercises={routineExercises}
            setRoutineExercises={setRoutineExercises}
            activeMuscleGroup={activeMuscleGroup}
            setActiveMuscleGroup={setActiveMuscleGroup}
            newExerciseName={newExerciseName}
            setNewExerciseName={setNewExerciseName}
            newExerciseSets={newExerciseSets}
            setNewExerciseSets={setNewExerciseSets}
            newExerciseReps={newExerciseReps}
            setNewExerciseReps={setNewExerciseReps}
            handleAddExerciseToRoutine={handleAddExerciseToRoutine}
            handleRemoveExercise={handleRemoveExercise}
            handleSaveRoutine={handleSaveRoutine}
            setCurrentView={setCurrentView}
          />
        )}
      </main>
    </div>
  );
}
