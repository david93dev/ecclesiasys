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
    <View className="mb-5 rounded-2xl bg-slate-800 p-5">
      <View className="mb-5">
        <Text className="text-lg font-bold text-white">
          {data.title}
        </Text>

        <Text className="text-slate-400">
          {data.subtitle}
        </Text>
      </View>

      <BarChart
        data={chartData}
        barWidth={28}
        spacing={24}
        roundedTop
        hideRules={false}
        xAxisColor="#64748b"
        yAxisColor="#64748b"
        rulesColor="#334155"
        yAxisTextStyle={{
          color: "#cbd5e1",
        }}
        xAxisLabelTextStyle={{
          color: "#cbd5e1",
        }}
      />
    </View>
  );
}