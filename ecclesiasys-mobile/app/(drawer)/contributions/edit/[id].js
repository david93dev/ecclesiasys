import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ContributionForm } from "../../../../components/ContributionForm";
import { contributionService } from "../../../../services/contributionService";
import { memberService } from "../../../../services/memberService";

const getContributionDetailsRoute = (contributionId) =>
  `/(drawer)/contributions/${contributionId}`;

const formatDateForInput = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

const parseDateInput = (value) => {
  const [day, month, year] = value.split("/");

  if (!day || !month || !year) return value;

  return `${year}-${month}-${day}`;
};

const normalizeAmount = (amount) => Number(String(amount).replace(",", "."));

export default function EditContribution() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    member: "",
    amount: "",
    type: "tithe",
    date: "",
    note: "",
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contribution, membersData] = await Promise.all([
          contributionService.getContributionById(id),
          memberService.getMembers(),
        ]);

        setForm({
          member: contribution.member?._id || contribution.member || "",
          amount: String(contribution.amount || ""),
          type: contribution.type || "tithe",
          date: formatDateForInput(contribution.date),
          note: contribution.note || "",
        });
        setMembers(membersData || []);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Nao foi possivel carregar a contribuicao.");
        router.replace(getContributionDetailsRoute(id));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    const amount = normalizeAmount(form.amount);

    if (!form.member || !form.amount || !form.type || !form.date) {
      Alert.alert("Erro", "Membro, valor, tipo e data sao obrigatorios.");
      return;
    }

    if (!amount || amount <= 0) {
      Alert.alert("Erro", "Valor deve ser maior que zero.");
      return;
    }

    try {
      setSaving(true);

      await contributionService.updateContribution(id, {
        member: form.member,
        amount,
        type: form.type,
        date: parseDateInput(form.date),
        note: form.note.trim(),
      });

      Alert.alert("Sucesso", "Contribuicao atualizada com sucesso!");
      router.replace(getContributionDetailsRoute(id));
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel atualizar a contribuicao.";

      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6">
          <TouchableOpacity
            className="mb-5 h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white"
            activeOpacity={0.8}
            onPress={() => router.replace(getContributionDetailsRoute(id))}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">
            Editar Contribuicao
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            Altere os dados desejados abaixo
          </Text>
        </View>

        <ContributionForm
          form={form}
          members={members}
          saving={saving}
          submitLabel="Salvar Alteracoes"
          submitIcon="save"
          onChange={updateField}
          onSubmit={handleUpdate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
