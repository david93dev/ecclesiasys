import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";

export const PageHeader = ({ title, description, buttonLabel, onClick }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* TEXTOS */}
      <div className="space-y-1">
        <h2 className="scroll-m-20 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h2>

        <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">
          {description}
        </p>
      </div>

      {/* BOTÃO */}
      {buttonLabel && (
        <Button
          onClick={onClick}
          className="flex w-full items-center justify-center gap-2 bg-slate-800 px-4 py-5 text-sm font-medium hover:bg-slate-700 sm:w-auto sm:px-5"
        >
          <GoPlus size={18} />

          <span className="whitespace-nowrap">{buttonLabel}</span>
        </Button>
      )}
    </div>
  );
};
