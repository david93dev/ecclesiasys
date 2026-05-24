import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { memberService } from "../../../services/memberService";

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await memberService.getMembers();
      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os membros.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await memberService.getMembers();
      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, [])
  );

  useEffect(() => {
    if (search === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter((member) =>
        (member.nome && member.nome.toLowerCase().includes(search.toLowerCase())) ||
        (member.email && member.email.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredMembers(filtered);
    }
  }, [search, members]);

  const renderMember = ({ item }) => (
    <TouchableOpacity
      className="bg-slate-800 p-4 rounded-xl mb-3 flex-row items-center justify-between"
      onPress={() => router.push(`/members/${item._id}`)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View className="bg-slate-700 w-12 h-12 rounded-full items-center justify-center mr-4">
          <Ionicons name="person" size={24} color="#fbbf24" />
        </View>
        <View style={{ flex: 1 }}>
          <Text className="text-white font-bold text-lg">{item.nome}</Text>
          <Text className="text-slate-400 text-sm">{item.email}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#64748b" />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900 p-4">
      {/* Search Bar */}
      <View className="bg-slate-800 flex-row items-center px-4 rounded-xl mb-4 h-12">
        <Ionicons name="search" size={20} color="#94a3b8" />
        <TextInput
          className="flex-1 ml-2 text-white"
          placeholder="Buscar membro..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search !== "" && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Members List */}
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderMember}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fbbf24" />
        }
        ListEmptyComponent={
          <View className="items-center justify-center mt-10">
            <Ionicons name="people-outline" size={64} color="#475569" />
            <Text className="text-slate-400 mt-4 text-lg">
              Nenhum membro encontrado.
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-amber-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/members/create")}
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={32} color="#0f172a" />
      </TouchableOpacity>
    </View>
  );
}
