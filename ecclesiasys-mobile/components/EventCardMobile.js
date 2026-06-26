import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const formatDate = (date) => {
  if (!date) return "Sem data";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

const getResponsibleName = (event) => event.responsible?.name || "Sem responsavel";

export function EventCardMobile({ event, onPress, onEdit, onDelete }) {
  return (
    <TouchableOpacity
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View className="h-36 bg-slate-100">
        {event.bannerUrl ? (
          <Image
            source={{ uri: event.bannerUrl }}
            className="size-full"
            resizeMode="cover"
          />
        ) : (
          <View className="size-full items-center justify-center">
            <Ionicons name="image-outline" size={34} color="#94a3b8" />
          </View>
        )}
      </View>

      <View className="border-b border-slate-100 bg-slate-50 p-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-base font-bold text-slate-900" numberOfLines={1}>
              {event.title}
            </Text>
            <Text className="mt-1 text-sm text-slate-500" numberOfLines={2}>
              {event.description || "Sem descricao"}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              className="size-9 items-center justify-center rounded-lg bg-white"
              activeOpacity={0.8}
              onPress={onEdit}
            >
              <MaterialIcons name="edit" size={18} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity
              className="size-9 items-center justify-center rounded-lg bg-red-50"
              activeOpacity={0.8}
              onPress={onDelete}
            >
              <MaterialIcons name="delete-outline" size={19} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="gap-3 p-4">
        <InfoPill icon="calendar" label="Data" value={formatDate(event.date)} />
        <InfoPill icon="person" label="Responsavel" value={getResponsibleName(event)} />
        <InfoPill
          icon="people"
          label="Participantes"
          value={`${event.participants?.length || 0} participante${
            (event.participants?.length || 0) === 1 ? "" : "s"
          }`}
        />
      </View>
    </TouchableOpacity>
  );
}

function InfoPill({ icon, label, value }) {
  return (
    <View className="flex-row items-center rounded-xl bg-slate-50 px-3 py-3">
      <View className="mr-3 size-10 items-center justify-center rounded-lg bg-slate-200">
        <Ionicons name={icon} size={18} color="#475569" />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </Text>
        <Text className="mt-0.5 text-sm font-semibold text-slate-700" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}
