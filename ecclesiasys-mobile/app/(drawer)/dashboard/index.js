import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";


import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { api } from "../../../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get(
          "/painel-dashboard"
        );

        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDashboard();
  }, []);

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator
          size="large"
          color="#fff"
        />
      </View>
    );
  }

  const getIcon = (title) => {
    switch (title) {
      case "Membros":
      case "Novos membros":
        return (
          <Ionicons
            name="people"
            size={32}
            color="#fff"
          />
        );

      case "Eventos":
        return (
          <MaterialIcons
            name="event"
            size={32}
            color="#fff"
          />
        );

      case "Financeiro":
        return (
          <Ionicons
            name="trending-up"
            size={32}
            color="#fff"
          />
        );

      default:
        return (
          <Ionicons
            name="people"
            size={32}
            color="#fff"
          />
        );
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-900 p-5">
      {/* HEADER */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-white">
          Visão Geral da Igreja
        </Text>

        <Text className="mt-2 text-slate-300">
          Bem-vindo ao painel administrativo
        </Text>
      </View>

      {/* CARDS */}
      <View className="flex-row flex-wrap justify-between">
        {data.cards.map((card, index) => (
          <View
            key={index}
            className="mb-4 w-[48%] rounded-2xl bg-slate-800 p-4"
          >
            <View className="mb-4">
              {getIcon(card.title)}
            </View>

            <Text className="text-slate-400">
              {card.title}
            </Text>

            <Text className="mt-2 text-2xl font-bold text-white">
              {card.value}
            </Text>

            <Text className="mt-1 text-slate-500">
              {card.description}
            </Text>
          </View>
        ))}
      </View>

      {/* EXEMPLO GRÁFICOS */}
      <View className="mt-4 rounded-2xl bg-slate-800 p-5">
        <Text className="text-lg font-bold text-white">
          Gráficos
        </Text>

        <Text className="mt-2 text-slate-400">
          Aqui você pode adicionar gráficos futuramente.
        </Text>
      </View>
    </ScrollView>
  );
}