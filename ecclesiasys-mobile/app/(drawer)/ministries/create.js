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
import { MinistryForm } from "../../../components/MinistryForm";
import { memberService } from "../../../services/memberService";
import { ministryService } from "../../../services/ministryService";

const MINISTRIES_ROUTE = "/(drawer)/ministries";

const initialForm = {
  name: "",
  description: "",
  leader: "",
  status: "active",
};

export default function CreateMinistry() {
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
    if (!form.name.trim() || !form.description.trim() || !form.leader) {
      Alert.alert("Erro", "Nome, descricao e responsavel sao obrigatorios.");
      return;
    }

    try {
      setSaving(true);

      await ministryService.createMinistry({
        name: form.name.trim(),
        description: form.description.trim(),
        leader: form.leader,
        status: form.status,
      });

      Alert.alert("Sucesso", "Ministerio cadastrado com sucesso!");
      router.replace(MINISTRIES_ROUTE);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel cadastrar o ministerio.";

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
            onPress={() => router.replace(MINISTRIES_ROUTE)}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">
            Novo Ministerio
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            Preencha os dados abaixo para cadastrar
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
          <MinistryForm
            form={form}
            members={members}
            saving={saving}
            submitLabel="Cadastrar Ministerio"
            onChange={updateField}
            onSubmit={handleSave}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
