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
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { UserForm } from "../../../../../components/UserForm";
import { userService } from "../../../../../services/userService";

const SETTINGS_ROUTE = "/(drawer)/settings";

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export default function EditUser() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchUser() {
        try {
          setLoading(true);
          const users = await userService.getUsers();
          const selectedUser = users.find((item) => item._id === id);

          if (!selectedUser) {
            Alert.alert("Erro", "Usuario nao encontrado.");
            router.replace(SETTINGS_ROUTE);
            return;
          }

          setForm({
            name: selectedUser.name || "",
            email: selectedUser.email || "",
            password: "",
            role: selectedUser.role || "user",
          });
        } catch (error) {
          console.error(error);
          Alert.alert("Erro", "Nao foi possivel carregar o usuario.");
          router.replace(SETTINGS_ROUTE);
        } finally {
          setLoading(false);
        }
      }

      fetchUser();
    }, [id])
  );

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      Alert.alert("Erro", "Nome e email sao obrigatorios.");
      return;
    }

    if (!isValidEmail(form.email)) {
      Alert.alert("Erro", "Digite um email valido.");
      return;
    }

    if (form.password && form.password.length < 6) {
      Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setSaving(true);

      await userService.updateUser(id, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      Alert.alert("Sucesso", "Usuario atualizado com sucesso!");
      router.replace(SETTINGS_ROUTE);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel atualizar o usuario.";

      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">Carregando usuario</Text>
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
            onPress={() => router.replace(SETTINGS_ROUTE)}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">Editar Usuario</Text>
          <Text className="mt-1 text-sm text-slate-500">
            Altere permissoes e acesso
          </Text>
        </View>

        <UserForm
          form={form}
          saving={saving}
          isEditing
          submitLabel="Salvar Alterações"
          submitIcon="save"
          onChange={updateField}
          onSubmit={handleUpdate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
