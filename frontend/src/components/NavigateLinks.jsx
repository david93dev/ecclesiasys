import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdPeople } from "react-icons/io";
import { MdOutlineWorkOutline, MdEventNote } from "react-icons/md";

export const NavigateLinks = () => {
  const baseClass =
    "flex items-center text-sm gap-2 rounded p-2 font-semibold transition bg-slate-700/20";

  const activeClass = "bg-white/20 text-white shadow";

  const inactiveClass = "text-white hover:bg-zinc-200 hover:text-gray-800";

  return (
    <nav className="mt-8 flex flex-col gap-2 p-2 ">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <LuLayoutDashboard size={22} />
        Dashboard
      </NavLink>

      <NavLink
        to="/members"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <IoMdPeople size={22} />
        Membros
      </NavLink>

      <NavLink
        to="/ministries"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <MdOutlineWorkOutline size={22} />
        Ministérios
      </NavLink>

      <NavLink
        to="/events"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <MdEventNote size={22} />
        Eventos
      </NavLink>
    </nav>
  );
};