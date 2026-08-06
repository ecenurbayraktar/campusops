import { Bell, ChevronDown, Search } from "lucide-react";

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex min-h-24 items-center justify-between gap-6 border-b border-black/5 bg-[#F6F7F9]/95 px-6 py-4 backdrop-blur-xl lg:px-8">
      <div className="shrink-0">
        <p className="text-sm font-medium text-[#838891]">Admin Console</p>

        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1D1F23]">
          Dashboard
        </h2>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <div className="relative hidden xl:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C919A]"
          />

          <input
            type="search"
            placeholder="Search students, courses..."
            className="h-12 w-72 rounded-2xl border border-black/5 bg-white pl-11 pr-4 text-sm text-[#1D1F23] outline-none transition placeholder:text-[#A0A5AD] focus:border-[#BCD52B] focus:ring-4 focus:ring-[#D9FF3F]/20"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white text-[#4E535B] transition hover:bg-[#EEF1F4]"
        >
          <Bell size={20} />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#D9FF3F] ring-2 ring-white" />
        </button>

        <button
          type="button"
          className="flex h-12 shrink-0 items-center gap-3 rounded-2xl border border-black/5 bg-white px-3 pr-4 transition hover:bg-[#EEF1F4]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#202225] text-xs font-semibold text-white">
            EN
          </div>

          <div className="hidden text-left 2xl:block">
            <p className="text-sm font-semibold text-[#1D1F23]">
              Ece Nur Bayraktar
            </p>
            <p className="text-xs text-[#8C919A]">Administrator</p>
          </div>

          <ChevronDown size={16} className="text-[#8C919A]" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;