import React, { useCallback, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";
import { ContributionForm } from "../../../components/ContributionForm";
import { contributionService } from "../../../services/contributionService";
import { memberService } from "../../../services/memberService";

const CONTRIBUTIONS_ROUTE = "/(drawer)/contributions";

const initialForm = {
  member: "",
  amount: "",
  type: "tithe",
  date: "",
  note: "",
};

const parseDateInput = (value) => {
  const [day, month, year] = value.split("/");

  if (!day || !month || !year) return value;

  return `${year}-${month}-${day}`;
};

const normalizeAmount = (amount) => Number(String(amount).replace(",", "."));

export default function CreateContribution() {
  const [form, setForm] = useState(initialForm);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchMembers() {
        try {
          setLoadingMembers(true);
          const data = await memberService.getMembers();
          setMembers(data || []);
        } catch (error) {
          console.error(error);
          Alert.alert("Erro", "Nao foi possivel carregar os membros.");
        } finally {
          setLoadingMembers(false);
        }
      }

      fetchMembers();
    }, [])
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
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

      await contributionService.createContribution({
        member: form.member,
        amount,
        type: form.type,
        date: parseDateInput(form.date),
        note: form.note.trim(),
      });

      Alert.alert("Sucesso", "Contribuicao cadastrada com sucesso!");
      router.replace(CONTRIBUTIONS_ROUTE);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel cadastrar a contribuicao.";

      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
  };

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
            onPress={() => router.replace(CONTRIBUTIONS_ROUTE)}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">
            Nova Contribuicao
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            Preencha os dados financeiros abaixo
          </Text>
        </View>

        {loadingMembers ? (
          <View className="items-center justify-center rounded-2xl border border-slate-200 bg-white py-14">
            <ActivityIndicator size="large" color="#0f172a" />
            <Text className="mt-3 text-sm text-slate-500">
              Carregando membros
            </Text>
          </View>
        ) : (
          <ContributionForm
            form={form}
            members={members}
            saving={saving}
            submitLabel="Cadastrar Contribuicao"
            onChange={updateField}
            onSubmit={handleSave}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
