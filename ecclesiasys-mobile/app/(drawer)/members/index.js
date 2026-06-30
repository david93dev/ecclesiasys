import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { memberService } from "../../../services/memberService";

const CREATE_MEMBER_ROUTE = "/(drawer)/members/create";
const getMemberDetailsRoute = (memberId) => `/(drawer)/members/${memberId}`;
const getEditMemberRoute = (memberId) => `/(drawer)/members/edit/${memberId}`;
const TABLE_MIN_WIDTH = 792;

const formatPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return phone || "-";
};

const getMemberName = (member) => member.name || member.nome || "-";

export default function MembersList() {
  const { width } = useWindowDimensions();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchMembers = useCallback(async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);

      const data = await memberService.getMembers();
      setMembers(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel carregar os membros.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMembers({ showLoading: false });
    setRefreshing(false);
  }, [fetchMembers]);

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [fetchMembers])
  );

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const name = getMemberName(member).toLowerCase();
      const email = String(member.email || "").toLowerCase();
      const query = search.toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);
      const matchesStatus = !status || member.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [members, search, status]);

  const handleDelete = (member) => {
    Alert.alert(
      "Excluir membro",
      `Deseja realmente excluir ${getMemberName(member)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await memberService.deleteMember(member._id);
              await fetchMembers({ showLoading: false });
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Nao foi possivel excluir o membro.");
            }
          },
        },
      ]
    );
  };

  const tableWidth = Math.max(width - 32, TABLE_MIN_WIDTH);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">Carregando membros</Text>
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
              Gestao de Membros
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Cadastre, edite e gerencie os membros
            </Text>
          </View>

          <TouchableOpacity
            className="h-11 flex-row items-center justify-center rounded-lg bg-slate-950 px-4"
            activeOpacity={0.85}
            onPress={() => router.push(CREATE_MEMBER_ROUTE)}
          >
            <Ionicons name="add" size={18} color="#fbbf24" />
            <Text className="ml-2 text-sm font-semibold text-white">
              Novo Membro
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <View className="mb-4">
            <Text className="mb-1.5 text-sm font-semibold text-slate-600">
              Buscar por nome
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
          {filteredMembers.length === 0 ? (
            <View className="items-center justify-center px-6 py-14">
              <Ionicons name="people-outline" size={56} color="#cbd5e1" />
              <Text className="mt-4 text-base font-semibold text-slate-600">
                Nenhum membro encontrado
              </Text>
              <Text className="mt-1 text-center text-sm text-slate-400">
                Ajuste os filtros ou cadastre um novo membro.
              </Text>
            </View>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ width: tableWidth }}>
                  <View className="h-12 flex-row items-center bg-slate-200 px-4">
                    <Text
                      className="text-xs font-bold uppercase tracking-wide text-slate-600"
                      style={{ flex: 180 }}
                    >
                      Nome
                    </Text>
                    <Text
                      className="text-xs font-bold uppercase tracking-wide text-slate-600"
                      style={{ flex: 220 }}
                    >
                      Email
                    </Text>
                    <Text
                      className="text-xs font-bold uppercase tracking-wide text-slate-600"
                      style={{ flex: 150 }}
                    >
                      Telefone
                    </Text>
                    <Text
                      className="text-xs font-bold uppercase tracking-wide text-slate-600"
                      style={{ flex: 100 }}
                    >
                      Status
                    </Text>
                    <Text
                      className="text-xs font-bold uppercase tracking-wide text-slate-600"
                      style={{ flex: 110 }}
                    >
                      Acoes
                    </Text>
                  </View>

                  {filteredMembers.map((member) => (
                    <TouchableOpacity
                      key={member._id}
                      className="min-h-16 flex-row items-center border-t border-slate-100 px-4 py-3"
                      activeOpacity={0.75}
                      onPress={() => router.push(getMemberDetailsRoute(member._id))}
                    >
                      <Text
                        className="pr-4 text-sm font-semibold text-slate-800"
                        style={{ flex: 180 }}
                        numberOfLines={2}
                      >
                        {getMemberName(member)}
                      </Text>
                      <Text
                        className="pr-4 text-sm text-slate-600"
                        style={{ flex: 220 }}
                        numberOfLines={2}
                      >
                        {member.email || "-"}
                      </Text>
                      <Text
                        className="text-sm text-slate-600"
                        style={{ flex: 150 }}
                      >
                        {formatPhone(member.phone)}
                      </Text>
                      <View style={{ flex: 100 }}>
                        <View
                          className={`self-start rounded-full px-3 py-1 ${
                            member.status === "inactive"
                              ? "bg-red-100"
                              : "bg-green-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              member.status === "inactive"
                                ? "text-red-700"
                                : "text-green-700"
                            }`}
                          >
                            {member.status === "inactive" ? "inativo" : "ativo"}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-3" style={{ flex: 110 }}>
                        <TouchableOpacity
                          className="size-9 items-center justify-center rounded-lg bg-slate-100"
                          activeOpacity={0.8}
                          onPress={(event) => {
                            event.stopPropagation();
                            router.push(getEditMemberRoute(member._id));
                          }}
                        >
                          <MaterialIcons name="edit" size={18} color="#475569" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="size-9 items-center justify-center rounded-lg bg-red-50"
                          activeOpacity={0.8}
                          onPress={(event) => {
                            event.stopPropagation();
                            handleDelete(member);
                          }}
                        >
                          <MaterialIcons name="delete-outline" size={19} color="#dc2626" />
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
                    {filteredMembers.length}
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
