import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { api } from "../../../services/api";
import { MembersChart } from "../../../components/MembersChart";
import { EventsChart } from "../../../components/EventsChart";
import { ContributionsPieChart } from "../../../components/ContributionsPieChart";
import { ContributionsChart } from "../../../components/ContributionsChart";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
};

const formatCardValue = (card) => {
  if (card?.title === "Financeiro") {
    return formatCurrency(card.value);
  }

  return card?.value || "0";
};

const getCardIcon = (title) => {
  switch (title) {
    case "Membros":
    case "Novos membros":
      return <Ionicons name="people" size={28} color="#ffffff" />;

    case "Eventos":
      return <MaterialIcons name="event" size={28} color="#ffffff" />;

    case "Financeiro":
      return <Ionicons name="trending-up" size={28} color="#ffffff" />;

    default:
      return <Ionicons name="analytics" size={28} color="#ffffff" />;
  }
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async ({ showRefresh = false } = {}) => {
    try {
      if (showRefresh) setRefreshing(true);

      const response = await api.get("/painel-dashboard");
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = useCallback(() => {
    fetchDashboard({ showRefresh: true });
  }, [fetchDashboard]);

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">Carregando painel</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#0f172a"
        />
      }
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-slate-950">
          Visao Geral da Igreja
        </Text>
        <Text className="mt-1 text-sm leading-5 text-slate-500">
          Bem-vindo ao painel administrativo. Aqui esta o resumo da sua comunidade.
        </Text>
      </View>

      <View className="mb-6 flex-row flex-wrap justify-between">
        {data.cards.map((card, index) => (
          <DashboardMetricCard key={`${card.title}-${index}`} card={card} />
        ))}
      </View>

      <View className="gap-5">
        <MembersChart data={data.chart} />
        <EventsChart data={data.eventsChart} />
        <ContributionsPieChart data={data.pieChart} />
        <ContributionsChart data={data.weeklyChart} />
      </View>
    </ScrollView>
  );
}

function DashboardMetricCard({ card }) {
  return (
    <View className="mb-4 w-[48%] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1 pr-2">
          <Text className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {card?.title}
          </Text>
          <Text className="mt-3 text-2xl font-bold text-slate-950" numberOfLines={2}>
            {formatCardValue(card)}
          </Text>
        </View>

        <View className="size-12 items-center justify-center rounded-2xl bg-slate-900">
          {getCardIcon(card?.title)}
        </View>
      </View>

      <View className="mt-5 flex-row items-center">
        <Ionicons name="trending-up" size={16} color="#059669" />
        <Text className="ml-2 flex-1 text-xs text-slate-600" numberOfLines={2}>
          {card?.description}
        </Text>
      </View>
    </View>
  );
}
