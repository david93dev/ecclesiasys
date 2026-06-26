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
import { MinistryForm } from "../../../../components/MinistryForm";
import { memberService } from "../../../../services/memberService";
import { ministryService } from "../../../../services/ministryService";

const getMinistryDetailsRoute = (ministryId) => `/(drawer)/ministries/${ministryId}`;

export default function EditMinistry() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    name: "",
    description: "",
    leader: "",
    status: "active",
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ministry, membersData] = await Promise.all([
          ministryService.getMinistryById(id),
          memberService.getMembers(),
        ]);

        setForm({
          name: ministry.name || "",
          description: ministry.description || "",
          leader: ministry.leader?._id || ministry.leader || "",
          status: ministry.status || "active",
        });
        setMembers(membersData || []);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Nao foi possivel carregar o ministerio.");
        router.replace(getMinistryDetailsRoute(id));
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
    if (!form.name.trim() || !form.description.trim() || !form.leader) {
      Alert.alert("Erro", "Nome, descricao e responsavel sao obrigatorios.");
      return;
    }

    try {
      setSaving(true);

      await ministryService.updateMinistry(id, {
        name: form.name.trim(),
        description: form.description.trim(),
        leader: form.leader,
        status: form.status,
      });

      Alert.alert("Sucesso", "Ministerio atualizado com sucesso!");
      router.replace(getMinistryDetailsRoute(id));
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel atualizar o ministerio.";

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
          Carregando ministerio
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
            onPress={() => router.replace(getMinistryDetailsRoute(id))}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">
            Editar Ministerio
          </Text>
          <Text className="mt-1 text-sm text-slate-500">
            Altere os dados desejados abaixo
          </Text>
        </View>

        <MinistryForm
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
