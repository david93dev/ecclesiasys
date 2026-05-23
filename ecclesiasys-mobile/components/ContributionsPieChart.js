// components/ContributionsPieChart.js

import { View, Text } from "react-native";

import {
  PieChart,
} from "react-native-gifted-charts";

export function ContributionsPieChart({ data }) {
  if (!data?.data?.length) return null;

  const pieData = data.data.map((item, index) => ({
    value: item.value,
    text: item.name,
    color:
      index % 2 === 0
        ? "#06b6d4"
        : "#facc15",
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

      <PieChart
        data={pieData}
        donut
        radius={110}
        innerRadius={55}
        textColor="white"
        showText
        focusOnPress
      />
    </View>
  );
}