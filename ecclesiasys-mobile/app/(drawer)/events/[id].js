import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { eventService } from "../../../services/eventService";

const EVENTS_ROUTE = "/(drawer)/events";
const getEditEventRoute = (eventId) => `/(drawer)/events/edit/${eventId}`;

const formatDate = (date) => {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel carregar os detalhes do evento.");
      router.replace(EVENTS_ROUTE);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchEvent();
    }, [fetchEvent])
  );

  const handleDelete = () => {
    Alert.alert(
      "Excluir evento",
      "Tem certeza que deseja excluir este evento? Esta acao nao pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await eventService.deleteEvent(id);
              Alert.alert("Sucesso", "Evento excluido com sucesso.");
              router.replace(EVENTS_ROUTE);
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Nao foi possivel excluir o evento.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">Carregando evento</Text>
      </View>
    );
  }

  if (!event) return null;

  const participants = event.participants || [];

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <TouchableOpacity
        onPress={() => router.replace(EVENTS_ROUTE)}
        className="mb-5 size-10 items-center justify-center rounded-lg border border-slate-200 bg-white"
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color="#334155" />
      </TouchableOpacity>

      <View className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <View className="h-48 bg-slate-100">
          {event.bannerUrl ? (
            <Image
              source={{ uri: event.bannerUrl }}
              className="size-full"
              resizeMode="cover"
            />
          ) : (
            <View className="size-full items-center justify-center">
              <Ionicons name="image-outline" size={42} color="#94a3b8" />
            </View>
          )}
        </View>

        <View className="p-5">
          <Text className="text-2xl font-bold text-slate-950">{event.title}</Text>
          <Text className="mt-2 text-base leading-6 text-slate-600">
            {event.description || "Sem descricao"}
          </Text>
        </View>
      </View>

      <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Text className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Informacoes do evento
        </Text>

        <InfoRow icon="calendar" label="Data" value={formatDate(event.date)} />
        <Divider />
        <InfoRow
          icon="person"
          label="Responsavel"
          value={event.responsible?.name}
        />
        <Divider />
        <InfoRow
          icon="mail"
          label="Email do responsavel"
          value={event.responsible?.email}
        />
        <Divider />
        <InfoRow
          icon="people"
          label="Participantes"
          value={`${participants.length} participante${
            participants.length === 1 ? "" : "s"
          }`}
        />
      </View>

      {participants.length > 0 && (
        <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Text className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            Participantes
          </Text>

          {participants.map((participant, index) => (
            <View key={participant._id || index}>
              <InfoRow
                icon="person"
                label={participant.email || "Participante"}
                value={participant.name}
              />
              {index < participants.length - 1 && <Divider />}
            </View>
          ))}
        </View>
      )}

      <View className="flex-row gap-3">
        <TouchableOpacity
          className="h-14 flex-1 flex-row items-center justify-center rounded-xl bg-slate-950"
          activeOpacity={0.85}
          onPress={() => router.push(getEditEventRoute(id))}
        >
          <MaterialIcons name="edit" size={20} color="#fbbf24" />
          <Text className="ml-2 text-base font-bold text-white">Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="h-14 flex-1 flex-row items-center justify-center rounded-xl border border-red-200 bg-red-50"
          activeOpacity={0.85}
          onPress={handleDelete}
        >
          <MaterialIcons name="delete-outline" size={20} color="#dc2626" />
          <Text className="ml-2 text-base font-bold text-red-600">Excluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View className="flex-row items-center py-3">
      <View className="mr-3 size-10 items-center justify-center rounded-lg bg-slate-100">
        <Ionicons name={icon} size={19} color="#64748b" />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </Text>
        <Text className="mt-0.5 text-base font-semibold text-slate-800" numberOfLines={2}>
          {value || "Nao informado"}
        </Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-slate-100" style={{ marginLeft: 52 }} />;
}
