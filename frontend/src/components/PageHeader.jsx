import { Button } from "@/components/ui/button";
import { GoPlus } from "react-icons/go";

export const PageHeader = ({ title, description, buttonLabel, onClick }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          {title}
        </h2>

        <p className="text-muted-foreground">{description}</p>
      </div>

      {buttonLabel && (
        <Button
          className={"bg-slate-800 p-5 hover:bg-slate-700 flex items-center"}
          onClick={onClick}
        >
          <GoPlus />
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
