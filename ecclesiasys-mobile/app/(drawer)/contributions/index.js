import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { contributionService } from "../../../services/contributionService";

const CREATE_CONTRIBUTION_ROUTE = "/(drawer)/contributions/create";
const getContributionDetailsRoute = (contributionId) =>
  `/(drawer)/contributions/${contributionId}`;
const getEditContributionRoute = (contributionId) =>
  `/(drawer)/contributions/edit/${contributionId}`;

const typeLabels = {
  tithe: "Dizimo",
  offering: "Oferta",
  missions: "Missoes",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));

const formatDate = (date) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

const getMemberName = (contribution) => contribution.member?.name || "-";

export default function ContributionsList() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchContributions = useCallback(async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);

      const data = await contributionService.getContributions();
      setContributions(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel carregar as contribuicoes.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContributions({ showLoading: false });
    setRefreshing(false);
  }, [fetchContributions]);

  useFocusEffect(
    useCallback(() => {
      fetchContributions();
    }, [fetchContributions])
  );

  const filteredContributions = useMemo(() => {
    return contributions.filter((contribution) => {
      const query = search.toLowerCase();
      const memberName = getMemberName(contribution).toLowerCase();
      const type = typeLabels[contribution.type]?.toLowerCase() || "";

      return memberName.includes(query) || type.includes(query);
    });
  }, [contributions, search]);

  const total = useMemo(() => {
    return filteredContributions.reduce(
      (sum, contribution) => sum + Number(contribution.amount || 0),
      0
    );
  }, [filteredContributions]);

  const handleDelete = (contribution) => {
    Alert.alert(
      "Excluir contribuicao",
      `Deseja realmente excluir a contribuicao de ${getMemberName(contribution)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await contributionService.deleteContribution(contribution._id);
              await fetchContributions({ showLoading: false });
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Nao foi possivel excluir a contribuicao.");
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">
          Carregando contribuicoes
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0f172a"
          />
        }
      >
        <View className="mb-6 gap-4">
          <View>
            <Text className="text-2xl font-bold text-slate-950">
              Contribuicoes
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Gerencie dizimos e ofertas
            </Text>
          </View>

          <TouchableOpacity
            className="h-11 flex-row items-center justify-center rounded-lg bg-slate-950 px-4"
            activeOpacity={0.85}
            onPress={() => router.push(CREATE_CONTRIBUTION_ROUTE)}
          >
            <Ionicons name="add" size={18} color="#fbbf24" />
            <Text className="ml-2 text-sm font-semibold text-white">
              Nova Contribuicao
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Text className="mb-1.5 text-sm font-semibold text-slate-600">
            Buscar por membro
          </Text>
          <View className="h-12 flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-3">
            <Ionicons name="search" size={18} color="#64748b" />
            <TextInput
              className="ml-2 flex-1 text-base text-slate-900"
              placeholder="Digite o nome..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
            {search !== "" && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-4 rounded-xl bg-slate-950 px-4 py-3">
            <Text className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total filtrado
            </Text>
            <Text className="mt-1 text-2xl font-bold text-white">
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredContributions.length === 0 ? (
            <View className="items-center justify-center px-6 py-14">
              <Ionicons name="cash-outline" size={56} color="#cbd5e1" />
              <Text className="mt-4 text-base font-semibold text-slate-600">
                Nenhuma contribuicao encontrada
              </Text>
              <Text className="mt-1 text-center text-sm text-slate-400">
                Ajuste a busca ou registre uma nova contribuicao.
              </Text>
            </View>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="w-[760px]">
                  <View className="h-12 flex-row items-center bg-slate-200 px-4">
                    <Text className="w-[190px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Membro
                    </Text>
                    <Text className="w-[140px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Valor
                    </Text>
                    <Text className="w-[130px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Tipo
                    </Text>
                    <Text className="w-[150px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Data
                    </Text>
                    <Text className="w-[110px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Acoes
                    </Text>
                  </View>

                  {filteredContributions.map((contribution) => (
                    <TouchableOpacity
                      key={contribution._id}
                      className="min-h-16 flex-row items-center border-t border-slate-100 px-4 py-3"
                      activeOpacity={0.75}
                      onPress={() =>
                        router.push(getContributionDetailsRoute(contribution._id))
                      }
                    >
                      <Text
                        className="w-[190px] pr-4 text-sm font-semibold text-slate-800"
                        numberOfLines={2}
                      >
                        {getMemberName(contribution)}
                      </Text>
                      <Text className="w-[140px] text-sm font-semibold text-slate-800">
                        {formatCurrency(contribution.amount)}
                      </Text>
                      <View className="w-[130px]">
                        <View className="self-start rounded-full bg-amber-100 px-3 py-1">
                          <Text className="text-xs font-bold text-amber-700">
                            {typeLabels[contribution.type] || contribution.type}
                          </Text>
                        </View>
                      </View>
                      <Text className="w-[150px] text-sm text-slate-600">
                        {formatDate(contribution.date)}
                      </Text>
                      <View className="w-[110px] flex-row gap-3">
                        <TouchableOpacity
                          className="size-9 items-center justify-center rounded-lg bg-slate-100"
                          activeOpacity={0.8}
                          onPress={(event) => {
                            event.stopPropagation();
                            router.push(getEditContributionRoute(contribution._id));
                          }}
                        >
                          <MaterialIcons name="edit" size={18} color="#475569" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="size-9 items-center justify-center rounded-lg bg-red-50"
                          activeOpacity={0.8}
                          onPress={(event) => {
                            event.stopPropagation();
                            handleDelete(contribution);
                          }}
                        >
                          <MaterialIcons
                            name="delete-outline"
                            size={19}
                            color="#dc2626"
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View className="border-t border-slate-100 bg-slate-50/80 px-4 py-3">
                <Text className="text-sm text-slate-500">
                  Total de registros:{" "}
                  <Text className="font-bold text-slate-700">
                    {filteredContributions.length}
                  </Text>
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
