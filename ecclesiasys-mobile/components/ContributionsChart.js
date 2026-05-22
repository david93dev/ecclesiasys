// components/ContributionsChart.js

import { View, Text } from "react-native";

import {
  LineChart,
} from "react-native-gifted-charts";

export function ContributionsChart({ data }) {
  if (!data?.data?.length) return null;

  const chartData = data.data.map((item) => ({
    value: item.valor,
    label: item.week,
  }));

  return (
    <View className="mb-5 rounded-2xl bg-slate-800 p-5">
      <View className="mb-5">
        <Text className="text-lg font-bold text-white">
          {data.title}
        </Text>

        <Text className="text-slate-400">
          {data.subtitle}
        </Text>
      </View>

      <LineChart
        data={chartData}
        thickness={3}
        color="#22c55e"
        curved
        areaChart
        startFillColor="#22c55e"
        endFillColor="#22c55e"
        startOpacity={0.4}
        endOpacity={0.05}
        yAxisColor="#64748b"
        xAxisColor="#64748b"
        rulesColor="#334155"
        backgroundColor="#1e293b"
        textColor="#fff"
      />
    </View>
  );
}