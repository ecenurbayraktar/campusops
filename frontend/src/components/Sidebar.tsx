import {
  BarChart3,
  BookOpen,
  Building2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Students",
    icon: GraduationCap,
  },
  {
    label: "Staff",
    icon: Users,
  },
  {
    label: "Departments",
    icon: Building2,
  },
  {
    label: "Courses",
    icon: BookOpen,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "AI Copilot",
    icon: Sparkles,
  },
  {
    label: "Audit Logs",
    icon: ShieldCheck,
  },
];

function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-white/10 bg-[#202225] px-5 py-6 text-white">
      <div className="flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D9FF3F] text-[#202225]">
          <GraduationCap size={24} strokeWidth={2.2} />
        </div>

        <div>
          <h1 className="text-xl font-semibold tracking-tight">CampusOps</h1>
          <p className="text-xs text-white/50">Admin Workspace</p>
        </div>
      </div>

      <div className="my-7 h-px bg-white/10" />

      <nav className="flex flex-1 flex-col gap-1.5">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.18em] text-white/35">
          Workspace
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                item.active
                  ? "bg-[#D9FF3F] text-[#202225]"
                  : "text-white/65 hover:bg-white/7 hover:text-white"
              }`}
            >
              <Icon
                size={19}
                strokeWidth={item.active ? 2.4 : 2}
                className={
                  item.active
                    ? "text-[#202225]"
                    : "text-white/45 group-hover:text-white"
                }
              />

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/7 hover:text-white"
        >
          <Settings size={19} className="text-white/45" />
          Settings
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/7 hover:text-white"
        >
          <LogOut size={19} className="text-white/45" />
          Sign out
        </button>
      </div>

      <div className="mt-4 rounded-3xl bg-white/6 p-4">
        <p className="text-sm font-medium">Campus AI</p>
        <p className="mt-1 text-xs leading-5 text-white/45">
          Ask questions and access campus insights.
        </p>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#202225] transition hover:bg-[#D9FF3F]"
        >
          Open Copilot
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;