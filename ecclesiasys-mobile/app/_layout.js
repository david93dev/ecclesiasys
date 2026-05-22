import "../global.css";

import { Stack } from "expo-router";

import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../contexts/AuthContext";

export default function Layout() {
  return (
    <>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
           <Stack.Screen
            name="login/index"
            options={{
              headerShown: false,
            }}
          />
            <Stack.Screen
            name="(drawer)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>

      <StatusBar style="auto" />
    </>
  );
}
