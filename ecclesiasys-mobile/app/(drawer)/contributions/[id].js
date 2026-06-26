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
import { contributionService } from "../../../services/contributionService";

const CONTRIBUTIONS_ROUTE = "/(drawer)/contributions";
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
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export default function ContributionDetails() {
  const { id } = useLocalSearchParams();
  const [contribution, setContribution] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContribution = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contributionService.getContributionById(id);
      setContribution(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel carregar a contribuicao.");
      router.replace(CONTRIBUTIONS_ROUTE);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchContribution();
    }, [fetchContribution])
  );

  const handleDelete = () => {
    Alert.alert(
      "Excluir contribuicao",
      "Tem certeza que deseja excluir esta contribuicao? Esta acao nao pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await contributionService.deleteContribution(id);
              Alert.alert("Sucesso", "Contribuicao excluida com sucesso.");
              router.replace(CONTRIBUTIONS_ROUTE);
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Nao foi possivel excluir a contribuicao.");
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
          Carregando contribuicao
        </Text>
      </View>
    );
  }

  if (!contribution) return null;

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <TouchableOpacity
        onPress={() => router.replace(CONTRIBUTIONS_ROUTE)}
        className="mb-5 size-10 items-center justify-center rounded-lg border border-slate-200 bg-white"
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color="#334155" />
      </TouchableOpacity>

      <View className="mb-5 items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <View className="mb-4 size-24 items-center justify-center rounded-full border-4 border-amber-400 bg-slate-100">
          <Ionicons name="cash" size={46} color="#b45309" />
        </View>

        <Text className="text-center text-3xl font-bold text-slate-950">
          {formatCurrency(contribution.amount)}
        </Text>
        <Text className="mt-1 text-center text-sm text-slate-500">
          {typeLabels[contribution.type] || contribution.type}
        </Text>
      </View>

      <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Text className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Informacoes financeiras
        </Text>

        <InfoRow icon="person" label="Membro" value={contribution.member?.name} />
        <Divider />
        <InfoRow icon="mail" label="Email" value={contribution.member?.email} />
        <Divider />
        <InfoRow
          icon="calendar"
          label="Data"
          value={formatDate(contribution.date)}
        />
      </View>

      <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Observacao
        </Text>
        <Text className="text-base leading-6 text-slate-700">
          {contribution.note || "Nao informado"}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="h-14 flex-1 flex-row items-center justify-center rounded-xl bg-slate-950"
          activeOpacity={0.85}
          onPress={() => router.push(getEditContributionRoute(id))}
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
