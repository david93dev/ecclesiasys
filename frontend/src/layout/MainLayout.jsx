import { NavigateLinks } from "@/components/NavigateLinks";
import { ProfileHeader } from "@/components/ProfileHeader";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "@/assets/img/logo.png";
import { IoMdExit } from "react-icons/io";

export function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <SidebarProvider>
      <Sidebar className={"transition-all duration-500 ease-in-out"}>
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
              className="flex flex-col-reverse items-center justify-center gap-1 text-xs text-white hover:bg-white/30 p-1 rounded-sm"
            >
              Sair <IoMdExit size={22} />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <main className="w-full flex min-h-full flex-col items-center justify-start bg-slate-50 p-20">
          <SidebarTrigger
            className={
              "absolute top-6 left-4 transition-all duration-500 ease-out"
            }
          />
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
