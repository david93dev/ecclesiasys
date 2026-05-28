export const DataTable = ({ columns, data }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* scroll horizontal mobile */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-175 border-collapse">
          {/* HEADER */}
          <thead className="bg-slate-200 text-left text-xs tracking-wide text-slate-600 uppercase sm:text-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-4 font-semibold whitespace-nowrap sm:px-6"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-t border-slate-100 transition-all duration-200 hover:bg-slate-50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-4 text-sm text-slate-700 sm:px-6 sm:text-[15px]"
                  >
                    <div className="wrap-break-word">
                      {col.render ? col.render(row) : row[col.key]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* footer opcional */}
      {data.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 sm:px-6 sm:text-sm">
          Total de registros:{" "}
          <span className="font-semibold">{data.length}</span>
        </div>
      )}
    </div>
  );
};
