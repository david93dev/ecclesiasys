import { useAuth } from "@/hooks/useAuth";

export const ProfileHeader = () => {
  const { user } = useAuth();
  const name = user?.name || "Usuário";
  const email = user?.email || "email@exemplo.com";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-950">
        {initials}
      </div>
      <div className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-semibold text-white">{name}</span>
        <span className="mt-0.5 block truncate text-[0.7rem] text-slate-500">{email}</span>
      </div>
    </div>
  );
};
