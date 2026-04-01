import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", eventos: 2 },
  { month: "Fev", eventos: 4 },
  { month: "Mar", eventos: 3 },
  { month: "Abr", eventos: 5 },
  { month: "Mai", eventos: 8 },
];

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg px-3 py-2 border text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-primary">
          {payload[0].value} eventos
        </p>
      </div>
    );
  }
  return null;
};

export const EventsChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md h-[320px] border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Eventos por Mês
        </h2>
        <span className="text-sm text-gray-400">
          Últimos 5 meses
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          
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

          {/* Tooltip bonito */}
          <Tooltip content={<CustomTooltip />} />

          {/* Barras */}
          <Bar
            dataKey="eventos"
            radius={[8, 8, 0, 0]} // borda arredondada
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};