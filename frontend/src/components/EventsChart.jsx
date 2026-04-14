import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

export const EventsChart = ({ data }) => {
  if (!data?.data?.length) {
    return <p className="text-gray-400">Sem dados de eventos</p>;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md h-80 border border-gray-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          {data.title}
        </h2>
        <span className="text-sm text-gray-400">
          {data.subtitle}
        </span>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data.data}>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* 🔥 Y FIXO E PROFISSIONAL */}
          <YAxis
            domain={[0, (dataMax) => dataMax + 3]} 
            tickCount={5}
            width={40}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="eventos"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};