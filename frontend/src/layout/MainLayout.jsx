import { NavigateLinks } from "@/components/NavigateLinks";
import { ProfileHeader } from "@/components/ProfileHeader";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

import { Outlet, useNavigate } from "react-router-dom";

import logo from "@/assets/img/logo.png";

import { IoMdExit } from "react-icons/io";

import { useAuth } from "@/hooks/useAuth";

// ✅ layout interno
function LayoutContent() {
  const navigate = useNavigate();

  const { open, isMobile, setOpenMobile } = useSidebar();

  const { logout } = useAuth();

  // ✅ logout
  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // ✅ fecha mobile ao navegar
  const handleNavigateMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {/* SIDEBAR */}
      <Sidebar
        collapsible="offcanvas"
        className="border-r transition-all duration-300"
      >
        <SidebarContent className="bg-linear-to-b from-slate-900 to-slate-800">
          {/* LOGO */}
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5 text-white">
            <div className="w-10 shrink-0">
              <img src={logo} alt="logo" className="w-full" />
            </div>

            <div className="text-2xl font-bold">
              Ecclesia
              <span className="text-amber-300">Sys</span>
            </div>
          </div>

          {/* LINKS */}
          <div onClick={handleNavigateMobile}>
            <NavigateLinks />
          </div>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="border-t border-white/10 bg-slate-800 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 overflow-hidden">
              <ProfileHeader />
            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg p-2 text-sm text-white transition hover:bg-white/10"
            >
              <IoMdExit size={20} />

              <span>Sair</span>
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* CONTEÚDO */}
      <SidebarInset className="transition-all duration-300">
        <main className="min-h-screen w-full bg-slate-50 px-4 py-20 sm:px-6 lg:px-10">
          {/* BOTÃO SIDEBAR */}
          <SidebarTrigger
            className={`fixed top-4 z-50 rounded-sm bg-white p-2.5 shadow-md transition-all duration-400 ease-out hover:shadow-lg ${
              isMobile ? "left-4" : open ? "left-65" : "left-4"
            } `}
          />

          {/* CONTEÚDO CENTRALIZADO */}
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center transition-all duration-300">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </>
  );
}

// ✅ provider principal
export function MainLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent />
    </SidebarProvider>
  );
}
