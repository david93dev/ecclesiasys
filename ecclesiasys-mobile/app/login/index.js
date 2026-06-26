import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useState } from "react";

import { router } from "expo-router";

import { useAuth } from "../../hooks/useAuth";

import logo from "../../assets/img/logo.png";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await login(email, password);
      return router.replace("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Nao foi possivel conectar ao servidor";

      Alert.alert("Erro", message);
      console.log(error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 p-5">
      <View className="w-full rounded-2xl bg-white p-6">
        <View className="mb-6 flex-row items-end justify-center border-b border-slate-200 pb-4">
          <Image
            source={logo}
            className="mr-2.5 h-10 w-10"
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold text-gray-900">
            Ecclesia<Text className="text-amber-400">Sys</Text>
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-center text-3xl font-bold text-gray-800">
            Login
          </Text>

          <Text className="mt-1 text-center text-gray-500">
            Acesse sua conta
          </Text>
        </View>

        <View className="mb-5">
          <Text className="mb-2 font-semibold text-gray-700">Email</Text>

          <TextInput
            placeholder="Digite seu email"
            className="rounded-xl bg-slate-100 px-4 py-3.5 text-base"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-5">
          <Text className="mb-2 font-semibold text-gray-700">Senha</Text>

          <TextInput
            placeholder="Digite sua senha"
            className="rounded-xl bg-slate-100 px-4 py-3.5 text-base"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          className="mt-2.5 rounded-xl bg-gray-900 py-4"
          onPress={handleLogin}
        >
          <Text className="text-center text-lg font-bold text-white">
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
