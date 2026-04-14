import {
  LineChart,
  Line,
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
          R$ {payload[0].value.toLocaleString("pt-BR")}
        </p>
      </div>
    );
  }
  return null;
};

export const ContributionsChart = ({ data }) => {
  if (!data?.data?.length) {
    return <p className="text-gray-400">Sem dados de contribuições</p>;
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
        <LineChart data={data.data}>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="week"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* 🔥 Y AXIS PROFISSIONAL */}
          <YAxis
            domain={[0, (dataMax) => dataMax + 500]}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `R$ ${value}`}
            width={60}
          />

          <Tooltip content={<CustomTooltip />} />

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