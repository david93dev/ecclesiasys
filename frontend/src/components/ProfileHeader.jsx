import React from "react";

export const ProfileHeader = ({ name = "Pastor Fulano", role = "Administrador" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      
      {/* Avatar */}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-white shadow">
        {initials}
      </div>

      {/* Info */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-white">{name}</span>
        <span className="text-xs text-slate-300">{role}</span>
      </div>

    </div>
  );
};