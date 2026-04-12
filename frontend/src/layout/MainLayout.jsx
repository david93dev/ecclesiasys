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

// 🔥 Componente interno (usa o contexto do sidebar)
function LayoutContent() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Sidebar>
        <SidebarContent className="bg-linear-to-b from-slate-900 to-slate-800 shadow-sm">
          {/* Logo */}
          <div className="mx-2 flex w-[90%] items-end gap-2 border-b p-4 text-white">
            <div className="w-9">
              <img src={logo} alt="logo" />
            </div>

            <div className="text-2xl font-bold">
              Ecclesia<span className="text-amber-300">Sys</span>
            </div>
          </div>

          {/* Links */}
          <NavigateLinks />
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t bg-slate-800 px-4">
          <div className="flex items-center justify-between">
            <ProfileHeader />

            <button
              onClick={handleLogout}
              className="flex flex-col-reverse items-center justify-center gap-1 rounded-sm p-1 text-xs text-white hover:bg-white/30"
            >
              Sair <IoMdExit size={22} />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <main className="flex min-h-full w-full flex-col items-center justify-start bg-slate-50 p-20">
          {/* 🔥 Botão que acompanha o sidebar */}
          <SidebarTrigger
            className={`fixed top-6 z-50 rounded-md bg-white p-2 shadow-md transition-all duration-300 ${open ? "left-67" : "left-8"} `}
          />

          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}

// 🔥 Componente principal com Provider
export function MainLayout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
