export const DashboardCard = ({
  title,
  value,
  description,
  icon,
  trendIcon,
}) => {
  return (

    <div
      className="
        group relative overflow-hidden

        rounded-2xl border border-slate-200
        bg-white

        p-4 sm:p-5 lg:p-6

        shadow-sm transition-all duration-300

        hover:-translate-y-1
        hover:shadow-lg
        hover:border-slate-300
      "
    >

      {/* efeito decorativo */}
      <div
        className="
          absolute right-0 top-0

          h-24 w-24 rounded-full

          bg-slate-100/60 blur-2xl

          transition-all duration-500

          group-hover:scale-125
        "
      />

      <div className="relative z-10 flex items-start justify-between gap-4">

        {/* conteúdo */}
        <div className="min-w-0 flex-1">

          {/* título */}
          <p
            className="
              text-xs font-semibold uppercase tracking-wide
              text-slate-500
            "
          >
            {title}
          </p>

          {/* valor */}
          <h3
            className="
              mt-3

              break-words

              text-2xl font-bold text-slate-900

              sm:text-3xl
            "
          >
            {value}
          </h3>

          {/* descrição */}
          <div
            className="
              mt-5 flex items-center gap-2

              text-xs text-slate-600

              sm:text-sm
            "
          >

            <div className="text-emerald-600">
              {trendIcon}
            </div>

            <span className="line-clamp-2">
              {description}
            </span>

          </div>

        </div>

        {/* ícone */}
        <div
          className="
            flex h-14 w-14 shrink-0
            items-center justify-center

            rounded-2xl

            bg-gradient-to-br
            from-slate-800 to-slate-700

            text-white

            shadow-md

            transition-transform duration-300

            group-hover:scale-110

            sm:h-16 sm:w-16
          "
        >

          <div className="text-2xl sm:text-3xl">
            {icon}
          </div>

        </div>

      </div>

    </div>
  );
};