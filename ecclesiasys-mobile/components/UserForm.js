import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const roles = [
  { label: "Usuario", value: "user", icon: "person" },
  { label: "Administrador", value: "admin", icon: "shield-checkmark" },
];

export function UserForm({
  form,
  saving,
  isEditing = false,
  submitLabel,
  submitIcon = "checkmark-circle",
  onChange,
  onSubmit,
}) {
  return (
    <>
      <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <FormField
          label="Nome"
          required
          icon="person"
          placeholder="Nome do usuario"
          value={form.name}
          onChangeText={(value) => onChange("name", value)}
        />

        <FormField
          label="Email"
          required
          icon="mail"
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => onChange("email", value)}
        />

        <FormField
          label={isEditing ? "Senha opcional" : "Senha"}
          required={!isEditing}
          icon="lock-closed"
          placeholder={isEditing ? "Digite para alterar a senha" : "Digite a senha"}
          secureTextEntry
          value={form.password}
          onChangeText={(value) => onChange("password", value)}
        />

        <View>
          <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Nivel de acesso *
          </Text>
          <View className="gap-2">
            {roles.map((role) => {
              const selected = form.role === role.value;

              return (
                <TouchableOpacity
                  key={role.value}
                  className={`flex-row items-center rounded-xl border px-4 py-3 ${
                    selected
                      ? "border-slate-950 bg-slate-950"
                      : "border-slate-200 bg-slate-100"
                  }`}
                  activeOpacity={0.85}
                  onPress={() => onChange("role", role.value)}
                >
                  <Ionicons
                    name={role.icon}
                    size={19}
                    color={selected ? "#fbbf24" : "#64748b"}
                  />
                  <Text
                    className={`ml-3 text-sm font-semibold ${
                      selected ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {role.label}
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
        onPress={onSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fbbf24" />
        ) : (
          <>
            <Ionicons name={submitIcon} size={20} color="#fbbf24" />
            <Text className="ml-2 text-base font-bold text-white">
              {submitLabel}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </>
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
