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
  { month: "Jan", membros: 20 },
  { month: "Fev", membros: 25 },
  { month: "Mar", membros: 30 },
  { month: "Abr", membros: 35 },
  { month: "Mai", membros: 42 },
];

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg px-3 py-2 border text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-primary">
          {payload[0].value} membros
        </p>
      </div>
    );
  }
  return null;
};

export const MembersChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md h-[320px] border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Crescimento de Membros
        </h2>
        <span className="text-sm text-gray-400">
          Últimos 5 meses
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          
          {/* Grid suave */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* Eixo X */}
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Eixo Y */}
          <YAxis
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Linha */}
          <Line
            type="monotone"
            dataKey="membros"
            strokeWidth={3}
            dot={{ r: 4 }} // bolinhas nos pontos
            activeDot={{ r: 6 }} // destaque ao passar o mouse
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};