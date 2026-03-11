export const DataTable = ({ columns, data }) => {
  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <table className="w-full border-collapse">
        {/* Cabeçalho */}
        <thead className="bg-slate-200 text-left text-sm text-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-4 font-semibold">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Corpo */}
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-t transition hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.key} className="p-4">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
