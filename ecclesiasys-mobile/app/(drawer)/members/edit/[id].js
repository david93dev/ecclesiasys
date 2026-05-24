import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { memberService } from "../../../../services/memberService";

export default function EditMember() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
      birthDate: "",
    });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchMember() {
      try {
        const data = await memberService.getMemberById(id);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          birthDate: data.birthDate || "",
        });
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os dados do membro.");
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchMember();
  }, [id]);

  const handleUpdate = async () => {
  if (!form.name || !form.email) {
    Alert.alert("Erro", "Name e E-mail são obrigatórios.");
    return;
  }

  try {
    setSaving(true);

    await memberService.updateMember(id, {
      ...form,
      birthDate: form.birthDate
        ? new Date(form.birthDate.split("/").reverse().join("-"))
        : null,
    });

    Alert.alert("Sucesso", "Membro atualizado com sucesso!");
    router.replace(`/members/${id}`);
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Não foi possível atualizar o membro.");
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-900"
    >
      <ScrollView className="flex-1 p-6">
        <View className="mb-8">
          <Text className="text-white text-2xl font-bold">Editar Membro</Text>
          <Text className="text-slate-400 mt-1">Altere os dados desejados abaixo</Text>
        </View>

        <View className="space-y-4">
          <FormField
            label="name Completo *"
            icon="person"
            placeholder="Ex: João Silva"
            value={form.name}
            onChangeText={(val) => setForm({ ...form, name: val })}
          />

          <FormField
            label="E-mail *"
            icon="mail"
            placeholder="exemplo@email.com"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(val) => setForm({ ...form, email: val })}
          />

          <FormField
            label="phone"
            icon="call"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(val) => setForm({ ...form, phone: val })}
          />


          <FormField
            label="Data de Nascimento"
            icon="calendar"
            placeholder="DD/MM/AAAA"
            value={form.birthDate}
            onChangeText={(val) => setForm({ ...form, birthDate: val })}
          />

          
        </View>

        <TouchableOpacity
          className="bg-amber-500 h-14 rounded-xl items-center justify-center mt-8 mb-12 shadow-lg"
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-slate-900 font-bold text-lg">Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, icon, ...props }) {
  return (
    <View className="mb-4">
      <Text className="text-slate-400 mb-2 ml-1 text-xs font-bold uppercase">{label}</Text>
      <View className="bg-slate-800 flex-row items-center px-4 rounded-xl border border-slate-700">
        <Ionicons name={icon} size={20} color="#94a3b8" />
        <TextInput
          className="flex-1 h-12 ml-3 text-white"
          placeholderTextColor="#475569"
          {...props}
          style={props.multiline ? { height: 80, textAlignVertical: 'top', paddingTop: 10 } : { height: 48 }}
        />
      </View>
    </View>
  );
}
