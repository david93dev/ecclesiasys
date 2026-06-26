import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { userService } from "../../../services/userService";

const CREATE_USER_ROUTE = "/(drawer)/settings/users/create";
const getEditUserRoute = (userId) => `/(drawer)/settings/users/edit/${userId}`;

const roleLabels = {
  admin: "Administrador",
  user: "Usuario",
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [permissionDenied, setPermissionDenied] = useState(false);

  const fetchUsers = useCallback(async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true);
      setPermissionDenied(false);

      const data = await userService.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        setPermissionDenied(true);
      } else {
        Alert.alert("Erro", "Nao foi possivel carregar os usuarios.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers({ showLoading: false });
    setRefreshing(false);
  }, [fetchUsers]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers])
  );

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const query = search.toLowerCase();
      return (
        String(item.name || "").toLowerCase().includes(query) ||
        String(item.email || "").toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const handleDelete = (item) => {
    Alert.alert(
      "Excluir usuario",
      `Deseja realmente excluir ${item.name || "este usuario"}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await userService.deleteUser(item._id);
              await fetchUsers({ showLoading: false });
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Erro",
                error.response?.data?.message || "Nao foi possivel excluir o usuario."
              );
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
        <Text className="mt-3 text-sm text-slate-500">
          Carregando configuracoes
        </Text>
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
        <View className="mb-6">
          <Text className="text-2xl font-bold text-slate-950">Configuracoes</Text>
          <Text className="mt-1 text-sm text-slate-500">
            Gerencie as configuracoes do sistema
          </Text>
        </View>

        <View className="mb-6 flex-row border-b border-slate-200">
          <View className="border-b-2 border-slate-950 px-1 pb-3">
            <Text className="text-sm font-bold text-slate-950">
              Usuarios do Sistema
            </Text>
          </View>
        </View>

        {permissionDenied ? (
          <View className="items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 shadow-sm">
            <View className="mb-4 size-16 items-center justify-center rounded-2xl bg-red-50">
              <Ionicons name="lock-closed" size={32} color="#dc2626" />
            </View>
            <Text className="text-center text-lg font-bold text-slate-900">
              Acesso restrito
            </Text>
            <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
              Apenas administradores podem gerenciar usuarios do sistema.
            </Text>
            {user?.email && (
              <Text className="mt-4 text-center text-xs font-semibold text-slate-400">
                Sessao atual: {user.email}
              </Text>
            )}
          </View>
        ) : (
          <>
            <View className="mb-6 gap-4">
              <View>
                <Text className="text-xl font-bold text-slate-900">
                  Usuarios do Sistema
                </Text>
                <Text className="mt-1 text-sm text-slate-500">
                  Gerencie permissoes e acessos
                </Text>
              </View>

              <TouchableOpacity
                className="h-11 flex-row items-center justify-center rounded-lg bg-slate-950 px-4"
                activeOpacity={0.85}
                onPress={() => router.push(CREATE_USER_ROUTE)}
              >
                <Ionicons name="add" size={18} color="#fbbf24" />
                <Text className="ml-2 text-sm font-semibold text-white">
                  Adicionar Usuario
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <Text className="mb-1.5 text-sm font-semibold text-slate-600">
                Buscar usuario
              </Text>
              <View className="h-12 flex-row items-center rounded-xl border border-slate-200 bg-slate-100 px-3">
                <Ionicons name="search" size={18} color="#64748b" />
                <TextInput
                  className="ml-2 flex-1 text-base text-slate-900"
                  placeholder="Buscar usuario..."
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
            </View>

            <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {filteredUsers.length === 0 ? (
                <View className="items-center justify-center px-6 py-14">
                  <Ionicons name="people-outline" size={56} color="#cbd5e1" />
                  <Text className="mt-4 text-base font-semibold text-slate-600">
                    Nenhum usuario encontrado
                  </Text>
                  <Text className="mt-1 text-center text-sm text-slate-400">
                    Ajuste a busca ou adicione um novo usuario.
                  </Text>
                </View>
              ) : (
                <>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="w-[720px]">
                      <View className="h-12 flex-row items-center bg-slate-200 px-4">
                        <Text className="w-[190px] text-xs font-bold uppercase tracking-wide text-slate-600">
                          Nome
                        </Text>
                        <Text className="w-[230px] text-xs font-bold uppercase tracking-wide text-slate-600">
                          Email
                        </Text>
                        <Text className="w-[160px] text-xs font-bold uppercase tracking-wide text-slate-600">
                          Nivel
                        </Text>
                        <Text className="w-[110px] text-xs font-bold uppercase tracking-wide text-slate-600">
                          Acoes
                        </Text>
                      </View>

                      {filteredUsers.map((item) => (
                        <View
                          key={item._id}
                          className="min-h-16 flex-row items-center border-t border-slate-100 px-4 py-3"
                        >
                          <Text
                            className="w-[190px] pr-4 text-sm font-semibold text-slate-800"
                            numberOfLines={2}
                          >
                            {item.name}
                          </Text>
                          <Text
                            className="w-[230px] pr-4 text-sm text-slate-600"
                            numberOfLines={2}
                          >
                            {item.email}
                          </Text>
                          <View className="w-[160px]">
                            <View
                              className={`self-start rounded-full px-3 py-1 ${
                                item.role === "admin"
                                  ? "bg-purple-100"
                                  : "bg-slate-100"
                              }`}
                            >
                              <Text
                                className={`text-xs font-bold ${
                                  item.role === "admin"
                                    ? "text-purple-700"
                                    : "text-slate-700"
                                }`}
                              >
                                {roleLabels[item.role] || item.role}
                              </Text>
                            </View>
                          </View>
                          <View className="w-[110px] flex-row gap-3">
                            <TouchableOpacity
                              className="size-9 items-center justify-center rounded-lg bg-slate-100"
                              activeOpacity={0.8}
                              onPress={() => router.push(getEditUserRoute(item._id))}
                            >
                              <MaterialIcons name="edit" size={18} color="#475569" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              className="size-9 items-center justify-center rounded-lg bg-red-50"
                              activeOpacity={0.8}
                              onPress={() => handleDelete(item)}
                            >
                              <MaterialIcons
                                name="delete-outline"
                                size={19}
                                color="#dc2626"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>

                  <View className="border-t border-slate-100 bg-slate-50/80 px-4 py-3">
                    <Text className="text-sm text-slate-500">
                      Total de registros:{" "}
                      <Text className="font-bold text-slate-700">
                        {filteredUsers.length}
                      </Text>
                    </Text>
                  </View>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
