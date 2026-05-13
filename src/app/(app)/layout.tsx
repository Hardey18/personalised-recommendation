import { Header } from "../../components/layout/Header";
import { MobileNav } from "../../components/layout/MobileNav";
import { Sidebar } from "../../components/layout/Sidebar";
import { AuthGuard } from "../../components/providers/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-cream-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}