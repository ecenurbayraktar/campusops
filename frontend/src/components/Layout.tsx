import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Topbar />

        <main className="min-w-0 px-6 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;