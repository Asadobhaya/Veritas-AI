import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Decorative orbs */}
      <div className="glow-orb w-96 h-96 bg-violet-500 top-0 left-64" />
      <div className="glow-orb w-64 h-64 bg-coral-500 bottom-1/3 right-0" />

      <Sidebar />

      {/* Main content area */}
      <div className="main-with-sidebar" style={{ marginLeft: "256px" }}>
        <Header />
        <main className="p-6 pb-24 md:pb-6 min-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
