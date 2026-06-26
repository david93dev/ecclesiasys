// components/MembersChart.js

import { View, Text } from "react-native";

import {
  LineChart,
} from "react-native-gifted-charts";

export function MembersChart({ data }) {
  if (!data?.data?.length) return null;

  const chartData = data.data.map((item) => ({
    value: item.membros,
    label: item.month,
  }));

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <View className="mb-5">
        <Text className="text-lg font-bold text-slate-950">
          {data.title}
        </Text>

        <Text className="text-slate-500">
          {data.subtitle}
        </Text>
      </View>

      <LineChart
        data={chartData}
        thickness={3}
        color="#fbbf24"
        hideDataPoints={false}
        curved
        areaChart
        startFillColor="#fbbf24"
        endFillColor="#fbbf24"
        startOpacity={0.4}
        endOpacity={0.05}
        yAxisColor="#cbd5e1"
        xAxisColor="#cbd5e1"
        rulesColor="#e2e8f0"
        backgroundColor="#ffffff"
        textColor="#334155"
        yAxisTextStyle={{ color: "#64748b" }}
        xAxisLabelTextStyle={{ color: "#64748b" }}
      />
    </View>
  );
}
