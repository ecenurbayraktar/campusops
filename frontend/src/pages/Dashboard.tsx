import { ArrowUpRight, Sparkles } from "lucide-react";

function Dashboard() {
  return (
    <section>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-[#8C919A]">
            Thursday, August 6
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#1D1F23]">
            Good morning, Ece.
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-[#737880]">
            Here is the latest overview of students, academic units and system
            activity across CampusOps.
          </p>
        </div>

        <button
          type="button"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#202225] px-5 text-sm font-semibold text-white transition hover:bg-[#303236]"
        >
          View full report
          <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="mt-8 rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_12px_40px_rgba(22,27,34,0.05)]">
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#D9FF3F] px-3 py-1.5 text-xs font-semibold text-[#202225]">
              <Sparkles size={14} />
              Dashboard foundation
            </span>

            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-[#1D1F23]">
              CampusOps admin workspace is ready.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#777C84]">
              Sidebar, navigation and content layout are now installed. The
              next step will add KPI cards, analytics and recent activity.
            </p>
          </div>

          <div className="hidden h-16 w-16 items-center justify-center rounded-3xl bg-[#202225] text-[#D9FF3F] sm:flex">
            <Sparkles size={27} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="h-52 rounded-[28px] border border-dashed border-black/10 bg-white/55" />
        <div className="h-52 rounded-[28px] border border-dashed border-black/10 bg-white/55" />
        <div className="h-52 rounded-[28px] border border-dashed border-black/10 bg-white/55" />
      </div>
    </section>
  );
}

export default Dashboard;