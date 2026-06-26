import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { UserForm } from "../../../../components/UserForm";
import { userService } from "../../../../services/userService";

const SETTINGS_ROUTE = "/(drawer)/settings";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export default function CreateUser() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert("Erro", "Nome, email e senha sao obrigatorios.");
      return;
    }

    if (!isValidEmail(form.email)) {
      Alert.alert("Erro", "Digite um email valido.");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setSaving(true);

      await userService.createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      Alert.alert("Sucesso", "Usuario criado com sucesso!");
      router.replace(SETTINGS_ROUTE);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel criar o usuario.";

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
            onPress={() => router.replace(SETTINGS_ROUTE)}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">Novo Usuario</Text>
          <Text className="mt-1 text-sm text-slate-500">
            Gerencie permissoes e acesso
          </Text>
        </View>

        <UserForm
          form={form}
          saving={saving}
          submitLabel="Criar Usuario"
          onChange={updateField}
          onSubmit={handleSave}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
