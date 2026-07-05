import { Plus } from "lucide-react";
import { Month } from "@/types";

interface MonthSelectorProps {
  months: Month[];
  selectedMonthId: string;
  setSelectedMonthId: (id: string) => void;
  handleAddMonth: () => void;
  handleDeleteMonth: (id: string) => void;
}

export default function MonthSelector({
  months,
  selectedMonthId,
  setSelectedMonthId,
  handleAddMonth,
  handleDeleteMonth,
}: MonthSelectorProps) {
  return (
    <div className="card !p-4 border border-[var(--border-color)] flex items-center gap-3 bg-[var(--bg-card)]/50">
      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mr-2">
        Meses:
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {months.map((m) => (
          <div key={m.id} className="relative group">
            <button
              onClick={() => {
                setSelectedMonthId(m.id);
              }}
              className={`px-5 py-2.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                selectedMonthId === m.id
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {m.name}
            </button>
            {months.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMonth(m.id);
                }}
                className="absolute -top-2 -right-2 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                title="Eliminar mes"
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddMonth}
          className="h-[38px] w-[38px] rounded-lg border border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
          title="Agregar nuevo mes"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
