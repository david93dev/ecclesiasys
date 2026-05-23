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
        color="#fbbf24"
        hideDataPoints={false}
        curved
        areaChart
        startFillColor="#fbbf24"
        endFillColor="#fbbf24"
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