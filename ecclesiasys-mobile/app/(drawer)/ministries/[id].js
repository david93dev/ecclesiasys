import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { ministryService } from "../../../services/ministryService";

const MINISTRIES_ROUTE = "/(drawer)/ministries";
const getEditMinistryRoute = (ministryId) =>
  `/(drawer)/ministries/edit/${ministryId}`;

const getLeaderName = (ministry) => ministry?.leader?.name || "Sem lider";

export default function MinistryDetails() {
  const { id } = useLocalSearchParams();
  const [ministry, setMinistry] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMinistry = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ministryService.getMinistryById(id);
      setMinistry(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel carregar os detalhes do ministerio.");
      router.replace(MINISTRIES_ROUTE);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchMinistry();
    }, [fetchMinistry])
  );

  const handleDelete = () => {
    Alert.alert(
      "Excluir ministerio",
      "Tem certeza que deseja excluir este ministerio? Esta acao nao pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await ministryService.deleteMinistry(id);
              Alert.alert("Sucesso", "Ministerio excluido com sucesso.");
              router.replace(MINISTRIES_ROUTE);
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Nao foi possivel excluir o ministerio.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">
          Carregando ministerio
        </Text>
      </View>
    );
  }

  if (!ministry) return null;

  const isInactive = ministry.status === "inactive";
  const members = ministry.members || [];

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <View className="mb-5 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.replace(MINISTRIES_ROUTE)}
          className="size-10 items-center justify-center rounded-lg border border-slate-200 bg-white"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#334155" />
        </TouchableOpacity>

        <View
          className={`rounded-full px-3 py-1 ${
            isInactive ? "bg-red-100" : "bg-green-100"
          }`}
        >
          <Text
            className={`text-xs font-bold ${
              isInactive ? "text-red-700" : "text-green-700"
            }`}
          >
            {isInactive ? "inativo" : "ativo"}
          </Text>
        </View>
      </View>

      <View className="mb-5 items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <View className="mb-4 size-24 items-center justify-center rounded-full border-4 border-amber-400 bg-slate-100">
          <Ionicons name="albums" size={44} color="#b45309" />
        </View>

        <Text className="text-center text-2xl font-bold text-slate-950">
          {ministry.name}
        </Text>
        <Text className="mt-1 text-center text-sm text-slate-500">
          Dados do ministerio
        </Text>
      </View>

      <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Text className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Informacoes gerais
        </Text>

        <InfoRow icon="person" label="Responsavel" value={getLeaderName(ministry)} />
        <Divider />
        <InfoRow
          icon="mail"
          label="Email do responsavel"
          value={ministry.leader?.email}
        />
        <Divider />
        <InfoRow
          icon="people"
          label="Participantes"
          value={`${members.length} membro${members.length === 1 ? "" : "s"}`}
        />
      </View>

      <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Descricao
        </Text>
        <Text className="text-base leading-6 text-slate-700">
          {ministry.description || "Nao informado"}
        </Text>
      </View>

      {members.length > 0 && (
        <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Membros do ministerio
          </Text>

          {members.map((member, index) => (
            <View key={member._id || index}>
              <InfoRow icon="person" label={member.email || "Membro"} value={member.name} />
              {index < members.length - 1 && <Divider />}
            </View>
          ))}
        </View>
      )}

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="h-14 flex-1 flex-row items-center justify-center rounded-xl bg-slate-950"
          activeOpacity={0.85}
          onPress={() => router.push(getEditMinistryRoute(id))}
        >
          <MaterialIcons name="edit" size={20} color="#fbbf24" />
          <Text className="ml-2 text-base font-bold text-white">Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="h-14 flex-1 flex-row items-center justify-center rounded-xl border border-red-200 bg-red-50"
          activeOpacity={0.85}
          onPress={handleDelete}
        >
          <MaterialIcons name="delete-outline" size={20} color="#dc2626" />
          <Text className="ml-2 text-base font-bold text-red-600">Excluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View className="flex-row items-center py-3">
      <View className="mr-3 size-10 items-center justify-center rounded-lg bg-slate-100">
        <Ionicons name={icon} size={19} color="#64748b" />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </Text>
        <Text className="mt-0.5 text-base font-semibold text-slate-800" numberOfLines={2}>
          {value || "Nao informado"}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-slate-100" style={{ marginLeft: 52 }} />;
}
