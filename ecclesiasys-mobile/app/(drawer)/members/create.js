import React, { useState } from "react";
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
import { router } from "expo-router";
import { memberService } from "../../../services/memberService";

export default function CreateMember() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.email) {
      Alert.alert("Erro", "Nome e E-mail são obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      await memberService.createMember({
        ...form,
        birthDate: form.birthDate
        ? new Date(form.birthDate.split("/").reverse().join("-"))
        : null,
      });

      Alert.alert("Sucesso", "Membro cadastrado com sucesso!");
      router.replace("/members");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cadastrar o membro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-900"
    >
      <ScrollView className="flex-1 p-6">
        <View className="mb-8">
          <Text className="text-white text-2xl font-bold">Novo Membro</Text>
          <Text className="text-slate-400 mt-1">Preencha os dados abaixo para cadastrar</Text>
        </View>

        <View className="space-y-4">
          <FormField
            label="Nome Completo *"
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
            label="Telefone"
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
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-slate-900 font-bold text-lg">Cadastrar Membro</Text>
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
