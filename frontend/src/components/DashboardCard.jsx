export const DashboardCard = ({
  title,
  value,
  description,
  icon,
  trendIcon,
}) => {
  return (
    <div className="flex w-70 items-center justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      
      <div className="space-y-4">
        <p className="text-xs font-medium text-slate-500">{title}</p>

        <span className="text-4xl font-bold text-slate-900">{value}</span>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          {trendIcon}
          {description}
        </div>
      </div>

      <div className="rounded-xl bg-slate-800 p-3 text-white">
        {icon}
      </div>

    </div>
  );
};