import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
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
      const response = await login(email, password);

      return router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha inválidos");
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />

          <Text style={styles.logoText}>
            Ecclesia<Text style={styles.logoHighlight}>
              Sys
            </Text>
          </Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Login
          </Text>

          <Text style={styles.subtitle}>
            Acesse sua conta
          </Text>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            placeholder="Digite seu email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Senha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Senha
          </Text>

          <TextInput
            placeholder="Digite sua senha"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  form: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },

  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },

  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },

  logoHighlight: {
    color: "#fbbf24",
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f2937",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 4,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});