import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memberService } from "../../../services/memberService";

const MEMBERS_ROUTE = "/(drawer)/members";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  status: "active",
};

const parseBirthDate = (value) => {
  if (!value) return null;

  const [day, month, year] = value.split("/");

  if (!day || !month || !year) return value;

  return new Date(`${year}-${month}-${day}`);
};

export default function CreateMember() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      Alert.alert("Erro", "Nome, email e telefone sao obrigatorios.");
      return;
    }

    try {
      setLoading(true);

      await memberService.createMember({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ""),
        birthDate: parseBirthDate(form.birthDate),
        status: form.status,
      });

      Alert.alert("Sucesso", "Membro cadastrado com sucesso!");
      router.replace(MEMBERS_ROUTE);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel cadastrar o membro.";

      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
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
            onPress={() => router.replace(MEMBERS_ROUTE)}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">Novo Membro</Text>
          <Text className="mt-1 text-sm text-slate-500">
            Preencha os dados abaixo para cadastrar
          </Text>
        </View>

        <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <FormField
            label="Nome completo"
            required
            icon="person"
            placeholder="Ex: Joao Silva"
            value={form.name}
            onChangeText={(value) => updateField("name", value)}
          />

          <FormField
            label="Email"
            required
            icon="mail"
            placeholder="exemplo@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(value) => updateField("email", value)}
          />

          <FormField
            label="Telefone"
            required
            icon="call"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(value) => updateField("phone", value)}
          />

          <FormField
            label="Data de nascimento"
            icon="calendar"
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={form.birthDate}
            onChangeText={(value) => updateField("birthDate", value)}
          />

          <View>
            <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Status
            </Text>
            <View className="flex-row gap-2">
              {[
                { label: "Ativo", value: "active" },
                { label: "Inativo", value: "inactive" },
              ].map((option) => {
                const selected = form.status === option.value;

                return (
                  <TouchableOpacity
                    key={option.value}
                    className={`flex-1 rounded-xl border px-4 py-3 ${
                      selected
                        ? "border-slate-950 bg-slate-950"
                        : "border-slate-200 bg-slate-100"
                    }`}
                    activeOpacity={0.85}
                    onPress={() => updateField("status", option.value)}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
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
        </View>

        <TouchableOpacity
          className="mt-6 h-14 flex-row items-center justify-center rounded-xl bg-slate-950"
          activeOpacity={0.85}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fbbf24" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fbbf24" />
              <Text className="ml-2 text-base font-bold text-white">
                Cadastrar Membro
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, required = false, icon, ...props }) {
  return (
    <View className="mb-5">
      <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
        {required ? " *" : ""}
      </Text>
      <View className="h-12 flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-4">
        <Ionicons name={icon} size={20} color="#64748b" />
        <TextInput
          className="ml-3 flex-1 text-base text-slate-900"
          placeholderTextColor="#94a3b8"
          {...props}
        />
      </View>
    </View>
  );
}
