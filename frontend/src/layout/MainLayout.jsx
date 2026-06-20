import { Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { NavigateLinks } from "@/components/NavigateLinks";
import { ProfileHeader } from "@/components/ProfileHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/img/logo.png";

function LayoutContent() {
  const navigate = useNavigate();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleNavigateMobile = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <>
      <Sidebar
        collapsible="offcanvas"
        className="border-r border-slate-800 transition-all duration-300"
      >
        <SidebarHeader className="border-b border-white/10 bg-slate-950 p-0">
          <div className="flex h-20 items-center gap-3 px-5 text-white">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
              <img src={logo} alt="Logo EcclesiaSys" className="size-8" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold tracking-tight">
                Ecclesia<span className="text-amber-300">Sys</span>
              </div>
              <p className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-slate-500">
                Painel administrativo
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-slate-950">
          <div onClick={handleNavigateMobile}>
            <NavigateLinks />
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 bg-slate-950 p-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5">
            <div className="min-w-0 flex-1">
              <ProfileHeader />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-400/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/60"
              aria-label="Sair do sistema"
              title="Sair do sistema"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="transition-all duration-300">
        <main className="min-h-screen w-full bg-slate-50 px-4 py-20 sm:px-6 lg:px-10">
          <SidebarTrigger
            className={`fixed top-5 z-50 size-10 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-100 hover:shadow-md ${
              isMobile ? "left-4" : open ? "left-[16.75rem]" : "left-4"
            }`}
            aria-label={open ? "Recolher menu lateral" : "Abrir menu lateral"}
            title={open ? "Recolher menu" : "Abrir menu"}
          />

          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center transition-all duration-300">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </>
  );
}

export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent />
    </SidebarProvider>
  );
}
