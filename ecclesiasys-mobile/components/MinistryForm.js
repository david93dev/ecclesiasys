import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const getMemberName = (member) => member?.name || member?.nome || "Sem nome";

export function MinistryForm({
  form,
  members,
  saving,
  submitLabel,
  submitIcon = "checkmark-circle",
  onChange,
  onSubmit,
}) {
  return (
    <>
      <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <FormField
          label="Nome do ministerio"
          required
          icon="albums"
          placeholder="Ex: Louvor"
          value={form.name}
          onChangeText={(value) => onChange("name", value)}
        />

        <View className="mb-5">
          <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Descricao *
          </Text>
          <View className="min-h-28 flex-row rounded-xl border border-slate-200 bg-slate-100 px-4 py-3">
            <Ionicons name="document-text" size={20} color="#64748b" />
            <TextInput
              className="ml-3 flex-1 text-base text-slate-900"
              placeholder="Descreva a atuacao do ministerio"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={form.description}
              onChangeText={(value) => onChange("description", value)}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Responsavel *
          </Text>

          <View className="rounded-xl border border-slate-200 bg-slate-100 p-2">
            {members.length === 0 ? (
              <View className="items-center justify-center py-6">
                <Ionicons name="person-outline" size={28} color="#94a3b8" />
                <Text className="mt-2 text-center text-sm text-slate-500">
                  Nenhum membro disponivel
                </Text>
              </View>
            ) : (
              <ScrollView className="max-h-56" nestedScrollEnabled>
                {members.map((member) => {
                  const selected = form.leader === member._id;

                  return (
                    <TouchableOpacity
                      key={member._id}
                      className={`mb-2 flex-row items-center rounded-lg border px-3 py-3 ${
                        selected
                          ? "border-slate-950 bg-white"
                          : "border-transparent bg-transparent"
                      }`}
                      activeOpacity={0.85}
                      onPress={() => onChange("leader", member._id)}
                    >
                      <View
                        className={`mr-3 size-9 items-center justify-center rounded-lg ${
                          selected ? "bg-amber-100" : "bg-white"
                        }`}
                      >
                        <Ionicons
                          name={selected ? "checkmark" : "person"}
                          size={18}
                          color={selected ? "#b45309" : "#64748b"}
                        />
                      </View>

                      <View className="min-w-0 flex-1">
                        <Text
                          className="text-sm font-semibold text-slate-800"
                          numberOfLines={1}
                        >
                          {getMemberName(member)}
                        </Text>
                        <Text className="text-xs text-slate-500" numberOfLines={1}>
                          {member.email || "Sem email"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>

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
                  onPress={() => onChange("status", option.value)}
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
