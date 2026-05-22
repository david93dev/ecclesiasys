import { Drawer } from "expo-router/drawer";

import { router } from "expo-router";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import { TouchableOpacity } from "react-native";

import { useAuth } from "../../hooks/useAuth";

export default function Layout() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();

    router.replace("/login");
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f172a",
        },

        headerTintColor: "#fff",

        drawerStyle: {
          backgroundColor: "#0f172a",
        },

        drawerActiveTintColor: "#fbbf24",

        drawerInactiveTintColor: "#cbd5e1",
      }}
    >
      <Drawer.Screen
        name="dashboard/index"
        options={{
          drawerLabel: "Dashboard",

          title: "Dashboard",

          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),

          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                marginRight: 16,
              }}
            >
              <MaterialIcons
                name="logout"
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer>
  );
}