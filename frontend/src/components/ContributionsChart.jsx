import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { week: "Sem 1", valor: 800 },
  { week: "Sem 2", valor: 1200 },
  { week: "Sem 3", valor: 950 },
  { week: "Sem 4", valor: 1500 },
];

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg px-3 py-2 border text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-primary">
          R$ {payload[0].value.toLocaleString("pt-BR")}
        </p>
      </div>
    );
  }
  return null;
};

export const ContributionsChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md h-80 border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Contribuições Semanais
        </h2>
        <span className="text-sm text-gray-400">
          Últimas 4 semanas
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* Eixo X */}
          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Eixo Y */}
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `R$ ${value}`}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Linha */}
          <Line
            type="monotone"
            dataKey="valor"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};