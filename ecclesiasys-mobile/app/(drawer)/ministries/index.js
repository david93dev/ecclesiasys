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
import { ministryService } from "../../../services/ministryService";

const CREATE_MINISTRY_ROUTE = "/(drawer)/ministries/create";
const getMinistryDetailsRoute = (ministryId) => `/(drawer)/ministries/${ministryId}`;
const getEditMinistryRoute = (ministryId) =>
  `/(drawer)/ministries/edit/${ministryId}`;

const getLeaderName = (ministry) => ministry.leader?.name || "Sem lider";
const getStatusLabel = (status) => (status === "inactive" ? "inativo" : "ativo");

export default function MinistriesList() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchMinistries = useCallback(async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);

      const data = await ministryService.getMinistries();
      setMinistries(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel carregar os ministerios.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMinistries({ showLoading: false });
    setRefreshing(false);
  }, [fetchMinistries]);

  useFocusEffect(
    useCallback(() => {
      fetchMinistries();
    }, [fetchMinistries])
  );

  const filteredMinistries = useMemo(() => {
    return ministries.filter((ministry) => {
      const query = search.toLowerCase();
      const matchesSearch =
        String(ministry.name || "").toLowerCase().includes(query) ||
        String(ministry.description || "").toLowerCase().includes(query) ||
        getLeaderName(ministry).toLowerCase().includes(query);
      const matchesStatus = !status || ministry.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [ministries, search, status]);

  const handleDelete = (ministry) => {
    Alert.alert(
      "Excluir ministerio",
      `Deseja realmente excluir ${ministry.name || "este ministerio"}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await ministryService.deleteMinistry(ministry._id);
              await fetchMinistries({ showLoading: false });
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Nao foi possivel excluir o ministerio.");
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
          Carregando ministerios
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
              Gestao de Ministerios
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Cadastre e gerencie os ministerios da igreja
            </Text>
          </View>

          <TouchableOpacity
            className="h-11 flex-row items-center justify-center rounded-lg bg-slate-950 px-4"
            activeOpacity={0.85}
            onPress={() => router.push(CREATE_MINISTRY_ROUTE)}
          >
            <Ionicons name="add" size={18} color="#fbbf24" />
            <Text className="ml-2 text-sm font-semibold text-white">
              Novo Ministerio
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-semibold text-slate-600">
              Buscar por ministerio
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
          </View>

          <Text className="mb-1.5 text-sm font-semibold text-slate-600">
            Status
          </Text>
          <View className="flex-row gap-2">
            {[
              { label: "Todos", value: "" },
              { label: "Ativo", value: "active" },
              { label: "Inativo", value: "inactive" },
            ].map((option) => {
              const selected = status === option.value;

              return (
                <TouchableOpacity
                  key={option.label}
                  className={`rounded-full border px-4 py-2 ${
                    selected
                      ? "border-slate-950 bg-slate-950"
                      : "border-slate-200 bg-slate-100"
                  }`}
                  activeOpacity={0.85}
                  onPress={() => setStatus(option.value)}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selected ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {filteredMinistries.length === 0 ? (
            <View className="items-center justify-center px-6 py-14">
              <Ionicons name="albums-outline" size={56} color="#cbd5e1" />
              <Text className="mt-4 text-base font-semibold text-slate-600">
                Nenhum ministerio encontrado
              </Text>
              <Text className="mt-1 text-center text-sm text-slate-400">
                Ajuste os filtros ou cadastre um novo ministerio.
              </Text>
            </View>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="w-[720px]">
                  <View className="h-12 flex-row items-center bg-slate-200 px-4">
                    <Text className="w-[190px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Ministerio
                    </Text>
                    <Text className="w-[190px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Responsavel
                    </Text>
                    <Text className="w-[120px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Membros
                    </Text>
                    <Text className="w-[100px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Status
                    </Text>
                    <Text className="w-[110px] text-xs font-bold uppercase tracking-wide text-slate-600">
                      Acoes
                    </Text>
                  </View>

                  {filteredMinistries.map((ministry) => (
                    <TouchableOpacity
                      key={ministry._id}
                      className="min-h-16 flex-row items-center border-t border-slate-100 px-4 py-3"
                      activeOpacity={0.75}
                      onPress={() => router.push(getMinistryDetailsRoute(ministry._id))}
                    >
                      <Text
                        className="w-[190px] pr-4 text-sm font-semibold text-slate-800"
                        numberOfLines={2}
                      >
                        {ministry.name || "-"}
                      </Text>
                      <Text
                        className="w-[190px] pr-4 text-sm text-slate-600"
                        numberOfLines={2}
                      >
                        {getLeaderName(ministry)}
                      </Text>
                      <Text className="w-[120px] text-sm text-slate-600">
                        {ministry.members?.length || 0}
                      </Text>
                      <View className="w-[100px]">
                        <View
                          className={`self-start rounded-full px-3 py-1 ${
                            ministry.status === "inactive"
                              ? "bg-red-100"
                              : "bg-green-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              ministry.status === "inactive"
                                ? "text-red-700"
                                : "text-green-700"
                            }`}
                          >
                            {getStatusLabel(ministry.status)}
                          </Text>
                        </View>
                      </View>
                      <View className="w-[110px] flex-row gap-3">
                        <TouchableOpacity
                          className="size-9 items-center justify-center rounded-lg bg-slate-100"
                          activeOpacity={0.8}
                          onPress={(event) => {
                            event.stopPropagation();
                            router.push(getEditMinistryRoute(ministry._id));
                          }}
                        >
                          <MaterialIcons name="edit" size={18} color="#475569" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="size-9 items-center justify-center rounded-lg bg-red-50"
                          activeOpacity={0.8}
                          onPress={(event) => {
                            event.stopPropagation();
                            handleDelete(ministry);
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
                    {filteredMinistries.length}
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
