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
          {payload[0].value} membros
        </p>
      </div>
    );
  }
  return null;
};

export const MembersChart = ({ data }) => {
  if (!data) return null;

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
            dataKey="month"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, (dataMax) => dataMax + 16]} 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="membros"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};