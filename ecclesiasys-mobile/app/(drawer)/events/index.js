import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { EventCardMobile } from "../../../components/EventCardMobile";
import { eventService } from "../../../services/eventService";

const CREATE_EVENT_ROUTE = "/(drawer)/events/create";
const getEventDetailsRoute = (eventId) => `/(drawer)/events/${eventId}`;
const getEditEventRoute = (eventId) => `/(drawer)/events/edit/${eventId}`;

const months = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchEvents = useCallback(async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);

      const data = await eventService.getEvents();
      setEvents(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Nao foi possivel carregar os eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents({ showLoading: false });
    setRefreshing(false);
  }, [fetchEvents]);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const today = new Date();
  const monthName = months[today.getMonth()];

  const eventsByYear = useMemo(() => {
    return events.filter((event) => {
      const date = new Date(event.date);
      return date.getFullYear() === currentYear;
    });
  }, [events, currentYear]);

  const currentMonthEvents = useMemo(() => {
    return eventsByYear.filter((event) => {
      const date = new Date(event.date);
      return date.getMonth() === today.getMonth();
    });
  }, [eventsByYear, today]);

  const groupedEvents = useMemo(() => {
    return months.map((month, index) => ({
      month,
      index,
      events: eventsByYear.filter((event) => new Date(event.date).getMonth() === index),
    }));
  }, [eventsByYear]);

  const handleDelete = (event) => {
    Alert.alert(
      "Excluir evento",
      `Deseja realmente excluir ${event.title || "este evento"}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await eventService.deleteEvent(event._id);
              await fetchEvents({ showLoading: false });
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Nao foi possivel excluir o evento.");
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">Carregando eventos</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 96 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0f172a"
          />
        }
      >
        <View className="mb-6 gap-4">
          <View>
            <Text className="text-2xl font-bold text-slate-950">Eventos</Text>
            <Text className="mt-1 text-sm text-slate-500">
              Gerencie os eventos da igreja
            </Text>
          </View>

          <TouchableOpacity
            className="h-11 flex-row items-center justify-center rounded-lg bg-slate-950 px-4"
            activeOpacity={0.85}
            onPress={() => router.push(CREATE_EVENT_ROUTE)}
          >
            <Ionicons name="add" size={18} color="#fbbf24" />
            <Text className="ml-2 text-sm font-semibold text-white">
              Novo Evento
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-5">
          <Text className="text-xl font-bold text-slate-900">
            Eventos desse mes: {monthName}
          </Text>
        </View>

        {currentMonthEvents.length === 0 ? (
          <View className="mb-6 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12">
            <Ionicons name="calendar-outline" size={46} color="#cbd5e1" />
            <Text className="mt-3 text-base font-semibold text-slate-500">
              Nenhum evento cadastrado
            </Text>
          </View>
        ) : (
          <View className="mb-8 gap-5">
            {currentMonthEvents.map((event) => (
              <EventCardMobile
                key={event._id}
                event={event}
                onPress={() => router.push(getEventDetailsRoute(event._id))}
                onEdit={() => router.push(getEditEventRoute(event._id))}
                onDelete={() => handleDelete(event)}
              />
            ))}
          </View>
        )}

        <View className="mb-6 flex-row items-center justify-between">
          <TouchableOpacity
            className="size-11 items-center justify-center rounded-xl border border-slate-200 bg-white"
            activeOpacity={0.85}
            onPress={() => setCurrentYear((year) => year - 1)}
          >
            <MaterialIcons name="keyboard-arrow-left" size={30} color="#334155" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-slate-900">{currentYear}</Text>

          <TouchableOpacity
            className="size-11 items-center justify-center rounded-xl border border-slate-200 bg-white"
            activeOpacity={0.85}
            onPress={() => setCurrentYear((year) => year + 1)}
          >
            <MaterialIcons name="keyboard-arrow-right" size={30} color="#334155" />
          </TouchableOpacity>
        </View>

        <View className="mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-slate-900">
              Calendario de Eventos
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Eventos organizados por mes
            </Text>
          </View>

          <View className="flex-row items-center rounded-xl bg-slate-100 px-3 py-2">
            <Ionicons name="calendar" size={16} color="#475569" />
            <Text className="ml-2 text-sm font-semibold text-slate-700">
              {eventsByYear.length}
            </Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4 pb-2">
            {groupedEvents.map(({ month, index, events: monthEvents }) => {
              const isCurrent = today.getMonth() === index;

              return (
                <View
                  key={month}
                  className={`w-80 overflow-hidden rounded-2xl border bg-white shadow-sm ${
                    isCurrent ? "border-slate-400" : "border-slate-200"
                  }`}
                >
                  <View
                    className={`flex-row items-center justify-between px-4 py-4 ${
                      isCurrent ? "bg-slate-950" : "bg-slate-50"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`mr-3 size-10 items-center justify-center rounded-xl ${
                          isCurrent ? "bg-white/15" : "bg-slate-200"
                        }`}
                      >
                        <Text
                          className={`text-sm font-bold ${
                            isCurrent ? "text-white" : "text-slate-700"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </Text>
                      </View>
                      <View>
                        <Text
                          className={`text-base font-bold ${
                            isCurrent ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {month}
                        </Text>
                        <Text
                          className={`text-xs ${
                            isCurrent ? "text-white/70" : "text-slate-500"
                          }`}
                        >
                          {monthEvents.length} evento
                          {monthEvents.length === 1 ? "" : "s"}
                        </Text>
                      </View>
                    </View>

                    <Ionicons
                      name="calendar"
                      size={18}
                      color={isCurrent ? "#cbd5e1" : "#94a3b8"}
                    />
                  </View>

                  <View className="gap-3 p-4">
                    {monthEvents.length === 0 ? (
                      <View className="items-center justify-center rounded-2xl border border-dashed border-slate-200 py-10">
                        <Ionicons name="calendar-outline" size={34} color="#cbd5e1" />
                        <Text className="mt-2 text-sm text-slate-500">
                          Nenhum evento
                        </Text>
                      </View>
                    ) : (
                      monthEvents.map((event) => (
                        <TouchableOpacity
                          key={event._id}
                          className="rounded-xl bg-slate-50 p-3"
                          activeOpacity={0.85}
                          onPress={() => router.push(getEventDetailsRoute(event._id))}
                        >
                          <Text
                            className="text-sm font-bold text-slate-800"
                            numberOfLines={1}
                          >
                            {event.title}
                          </Text>
                          <Text className="mt-1 text-xs text-slate-500">
                            {new Intl.DateTimeFormat("pt-BR").format(
                              new Date(event.date)
                            )}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
