import { Dumbbell, Plus, Sun, Moon, User } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

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
      <div className="user-footer mt-auto pt-4 border-t border-[var(--border-color)] flex flex-col items-stretch gap-3">
        <Show when="signed-out">
          <div className="flex flex-col gap-2 w-full">
            <SignInButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all cursor-pointer shadow-xs border-0">
                Iniciar Sesión
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] rounded-lg border border-[var(--border-color)] transition-all cursor-pointer">
                Registrarse
              </button>
            </SignUpButton>
          </div>
        </Show>
        <Show when="signed-in">
          <div className="flex items-center gap-3.5 w-full">
            <UserButton />
            <div className="user-info truncate">
              <h4>Mi Perfil</h4>
              <p>Planificación Personal</p>
            </div>
          </div>
        </Show>
      </div>
    </aside>
  );
}
