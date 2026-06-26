// components/EventsChart.js

import { View, Text } from "react-native";

import {
  BarChart,
} from "react-native-gifted-charts";

export function EventsChart({ data }) {
  if (!data?.data?.length) return null;

  const chartData = data.data.map((item) => ({
    value: item.eventos,
    label: item.month,
    frontColor: "#38bdf8",
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

      <BarChart
        data={chartData}
        barWidth={28}
        spacing={24}
        roundedTop
        hideRules={false}
        xAxisColor="#cbd5e1"
        yAxisColor="#cbd5e1"
        rulesColor="#e2e8f0"
        yAxisTextStyle={{
          color: "#64748b",
        }}
        xAxisLabelTextStyle={{
          color: "#64748b",
        }}
      />
    </View>
  );
}
