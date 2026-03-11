import React from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdPeople } from "react-icons/io";
import { MdOutlineWorkOutline } from "react-icons/md";
import { MdEventNote } from "react-icons/md";

export const NavigateLinks = () => {
  return (
    <nav className="flex flex-col gap-2 p-2 text-white mt-8">
      <a
        href="/dashboard"
        className="flex items-center gap-2 rounded p-2 font-semibold hover:bg-zinc-200 hover:text-gray-800!"
      >
        <LuLayoutDashboard size={22} />
        Dashboard
      </a>

      <a
        href="/members"
        className="flex items-center gap-2 rounded p-2 font-semibold hover:bg-zinc-200 hover:text-gray-800!"
      >
        <IoMdPeople size={22} />
        Membros
      </a>

      <a
        href="/ministries"
        className="flex items-center gap-2 rounded p-2 font-semibold hover:bg-zinc-200 hover:text-gray-800!"
      >
        <MdOutlineWorkOutline size={22} />
        Ministérios
      </a>

      <a
        href="/events"
        className="flex items-center gap-2 rounded p-2 font-semibold hover:bg-zinc-200 hover:text-gray-800!"
      >
        <MdEventNote size={22} />
        Eventos
      </a>
    </nav>
  );
};
