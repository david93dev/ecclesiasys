import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Dízimos", value: 2700 },
  { name: "Doações", value: 1800 },
];

const COLORS = ["#06b6d4", "#facc15"]; // roxo e verde (pode ajustar ao seu tema)

// Tooltip customizado
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg px-3 py-2 border text-sm">
        <p className="font-semibold">{payload[0].name}</p>
        <p className="text-primary">
          R$ {payload[0].value.toLocaleString("pt-BR")}
        </p>
      </div>
    );
  }
  return null;
};

export const ContributionsPieChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md h-80 border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Dízimos vs Doações
        </h2>
        <span className="text-sm text-gray-400">
          Distribuição atual
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={50} // deixa estilo donut 🔥
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};