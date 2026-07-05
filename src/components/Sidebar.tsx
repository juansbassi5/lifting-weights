import { Dumbbell, Plus, Sun, Moon, User } from "lucide-react";

interface SidebarProps {
  currentView: "dashboard" | "create" | "edit";
  setCurrentView: (view: "dashboard" | "create" | "edit") => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  handleStartCreate: () => void;
}

export default function Sidebar({
  currentView,
  setCurrentView,
  theme,
  toggleTheme,
  handleStartCreate,
}: SidebarProps) {
  return (
    <aside>
      <div className="brand">
        <div className="brand-logo">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
        <span className="brand-title">LiftingWeights</span>
      </div>

      <nav className="flex flex-col gap-2.5">
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`nav-item flex items-center gap-3.5 px-4.5 py-3.5 rounded-lg text-sm font-semibold transition-all ${
            currentView === "dashboard" ? "active" : ""
          }`}
        >
          <Dumbbell className="h-5 w-5 flex-shrink-0" />
          <span>Mis Rutinas</span>
        </button>

        <button
          onClick={handleStartCreate}
          className={`nav-item flex items-center gap-3.5 px-4.5 py-3.5 rounded-lg text-sm font-semibold transition-all ${
            currentView === "create" ? "active" : ""
          }`}
        >
          <Plus className="h-5 w-5 flex-shrink-0" />
          <span>Nueva Rutina</span>
        </button>

        <button
          onClick={toggleTheme}
          className="nav-item flex items-center gap-3.5 px-4.5 py-3.5 rounded-lg text-sm font-semibold transition-all border border-dashed border-[var(--border-color)] mt-6"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-400 flex-shrink-0" />
          ) : (
            <Moon className="h-5 w-5 text-blue-500 flex-shrink-0" />
          )}
          <span>Tema: {theme === "dark" ? "Claro" : "Oscuro"}</span>
        </button>
      </nav>

      {/* User Footer section in Sidebar */}
      <div className="user-footer mt-auto pt-4 border-t border-[var(--border-color)]">
        <div className="avatar flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="user-info truncate">
          <h4>Mi Perfil</h4>
          <p>Planificación Personal</p>
        </div>
      </div>
    </aside>
  );
}
