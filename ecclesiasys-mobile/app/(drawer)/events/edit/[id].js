import React, { useEffect, useState } from "react";
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
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { EventForm } from "../../../../components/EventForm";
import { eventService } from "../../../../services/eventService";
import { memberService } from "../../../../services/memberService";

const getEventDetailsRoute = (eventId) => `/(drawer)/events/${eventId}`;

const formatDateForInput = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

const parseDateInput = (value) => {
  const [day, month, year] = value.split("/");

  if (!day || !month || !year) return value;

  return `${year}-${month}-${day}`;
};

const buildEventFormData = (form) => {
  const data = new FormData();

  data.append("title", form.title.trim());
  data.append("description", form.description.trim());
  data.append("date", parseDateInput(form.date));
  data.append("responsible", form.responsible);

  if (form.banner?.uri) {
    data.append("banner", {
      uri: form.banner.uri,
      name: form.banner.fileName || "event-banner.jpg",
      type: form.banner.mimeType || "image/jpeg",
    });
  }

  return data;
};

export default function EditEvent() {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    responsible: "",
    banner: null,
    bannerUrl: "",
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [event, membersData] = await Promise.all([
          eventService.getEventById(id),
          memberService.getMembers(),
        ]);

        setForm({
          title: event.title || "",
          description: event.description || "",
          date: formatDateForInput(event.date),
          responsible: event.responsible?._id || event.responsible || "",
          banner: null,
          bannerUrl: event.bannerUrl || "",
        });
        setMembers(membersData || []);
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Nao foi possivel carregar o evento.");
        router.replace(getEventDetailsRoute(id));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const pickBanner = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permissao necessaria", "Permita acesso as imagens do aparelho.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [16, 9],
    });

    if (!result.canceled) {
      updateField("banner", result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.date || !form.responsible) {
      Alert.alert("Erro", "Titulo, descricao, data e responsavel sao obrigatorios.");
      return;
    }

    try {
      setSaving(true);

      await eventService.updateEvent(id, buildEventFormData(form));

      Alert.alert("Sucesso", "Evento atualizado com sucesso!");
      router.replace(getEventDetailsRoute(id));
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        "Nao foi possivel atualizar o evento.";

      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#0f172a" />
        <Text className="mt-3 text-sm text-slate-500">Carregando evento</Text>
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
            onPress={() => router.replace(getEventDetailsRoute(id))}
          >
            <Ionicons name="arrow-back" size={20} color="#334155" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-slate-950">Editar Evento</Text>
          <Text className="mt-1 text-sm text-slate-500">
            Altere os dados desejados abaixo
          </Text>
        </View>

        <EventForm
          form={form}
          members={members}
          saving={saving}
          submitLabel="Salvar Alteracoes"
          submitIcon="save"
          onChange={updateField}
          onPickBanner={pickBanner}
          onClearBanner={() => updateField("banner", null)}
          onSubmit={handleUpdate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
