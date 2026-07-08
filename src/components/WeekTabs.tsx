interface WeekTabsProps {
  selectedWeekId: string;
  setSelectedWeekId: (id: string) => void;
}

const WEEKS = [
  { id: "w1", name: "Semana 1" },
  { id: "w2", name: "Semana 2" },
  { id: "w3", name: "Semana 3" },
  { id: "w4", name: "Semana 4" }
];

export default function WeekTabs({ selectedWeekId, setSelectedWeekId }: WeekTabsProps) {
  return (
    <div className="flex bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5 my-4">
      {WEEKS.map((w) => (
        <button
          key={w.id}
          onClick={() => setSelectedWeekId(w.id)}
          className={`flex-1 h-9 px-4 text-sm font-extrabold tracking-wider rounded-lg border transition-all cursor-pointer text-center flex items-center justify-center ${
            selectedWeekId === w.id
              ? "bg-[var(--primary-glow)] border-[var(--primary)] text-[var(--primary)] shadow-sm"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
          }`}
        >
          {w.name}
        </button>
      ))}
    </div>
  );
}
