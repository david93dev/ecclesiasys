import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { memberService } from "../../../services/memberService";

export default function MemberDetails() {
  const { id } = useLocalSearchParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const data = await memberService.getMemberById(id);
      setMember(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do membro.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMember();
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert(
      "Excluir Membro",
      "Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await memberService.deleteMember(id);
              Alert.alert("Sucesso", "Membro excluído com sucesso.");
              router.replace("/members");
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível excluir o membro.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  if (!member) return null;

  return (
    <ScrollView className="flex-1 bg-slate-900">

      <TouchableOpacity
        onPress={() => router.replace("/members")}
        className="flex-row items-center px-4 pt-6 pb-2"
      >
      <Ionicons name="arrow-back" size={24} color="#ffffff" />
      <Text className="text-white text-base ml-2 font-semibold">
        Voltar
      </Text>
    </TouchableOpacity>

      {/* Header Profile */}
      <View className="items-center py-10 bg-slate-800 rounded-b-[40px]">
        <View className="bg-slate-700 w-24 h-24 rounded-full items-center justify-center mb-4 border-4 border-amber-500">
          <Ionicons name="person" size={48} color="#fbbf24" />
        </View>
        <Text className="text-white text-2xl font-bold">{member.name}</Text>
        
      </View>

      <View className="p-6">
        <Text className="text-slate-500 font-bold uppercase mb-4 tracking-widest text-xs">
          Informações de Contato
        </Text>

        <View className="bg-slate-800 rounded-2xl p-4 mb-6">
          <InfoRow icon="mail" label="E-mail" value={member.email} />
          <Divider />
          <InfoRow icon="call" label="Telefone" value={member.phone || "Não informado"} />
          <Divider />
          <InfoRow icon="calendar" label="Data de Nascimento" value={member.birthDate || "Não informado"} />
        </View>


        {/* Actions */}
        <View className="flex-row justify-between mb-10">
          <TouchableOpacity
            className="flex-1 bg-slate-800 h-14 rounded-xl flex-row items-center justify-center mr-2"
            onPress={() => router.push(`/members/edit/${id}`)}
          >
            <MaterialIcons name="edit" size={20} color="#fbbf24" />
            <Text className="text-white font-bold ml-2">Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-red-900/30 h-14 rounded-xl flex-row items-center justify-center ml-2 border border-red-500/50"
            onPress={handleDelete}
          >
            <MaterialIcons name="delete" size={20} color="#ef4444" />
            <Text className="text-red-500 font-bold ml-2">Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View className="flex-row items-center py-2">
      <View className="bg-slate-700 p-2 rounded-lg mr-3">
        <Ionicons name={icon} size={18} color="#94a3b8" />
      </View>
      <View>
        <Text className="text-slate-500 text-xs">{label}</Text>
        <Text className="text-white text-base">{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View className="h-[1px] bg-slate-700 my-2 ml-10" />;
}
