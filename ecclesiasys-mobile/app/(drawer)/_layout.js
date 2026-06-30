import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/img/logo.png";

const drawerLinks = [
  {
    name: "dashboard/index",
    label: "Dashboard",
    icon: "home",
  },
  {
    name: "members/index",
    label: "Membros",
    icon: "people",
  },
  {
    name: "events/index",
    label: "Eventos",
    icon: "calendar",
  },
  {
    name: "contributions/index",
    label: "Contribuições",
    icon: "cash",
  },
  {
    name: "ministries/index",
    label: "Ministérios",
    icon: "albums",
  },
  {
    name: "settings/index",
    label: "Configurações",
    icon: "settings",
  },
];

function CustomDrawerContent(props) {
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();
  const activeRouteName = props.state.routes[props.state.index]?.name;

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <View className="flex-1 bg-slate-950">
      <View className="border-b border-white/10 px-5 py-6">
        <View className="flex-row items-center">
          <View className="mr-3 size-11 items-center justify-center overflow-hidden rounded-xl bg-white/5">
            <Image
              source={logo}
              style={{ width: 32, height: 32, maxWidth: 32, maxHeight: 32 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-1">
            <Text className="text-xl font-bold text-white">
              Ecclesia<Text className="text-amber-300">Sys</Text>
            </Text>
            <Text className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Painel administrativo
            </Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 12 }}
      >
        <Text className="mb-2 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Gestao
        </Text>

        <View className="gap-1">
          {drawerLinks.map((item) => {
            const isActive = activeRouteName === item.name;

            return (
              <TouchableOpacity
                key={item.name}
                className={`h-12 flex-row items-center rounded-lg px-3 ${
                  isActive ? "bg-white" : "bg-transparent"
                }`}
                activeOpacity={0.85}
                onPress={() => props.navigation.navigate(item.name)}
              >
                <View
                  className={`mr-3 size-8 items-center justify-center rounded-md ${
                    isActive ? "bg-amber-100" : "bg-white/5"
                  }`}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={isActive ? "#b45309" : "#94a3b8"}
                  />
                </View>

                <Text
                  className={`flex-1 text-sm font-semibold ${
                    isActive ? "text-slate-950" : "text-slate-300"
                  }`}
                >
                  {item.label}
                </Text>

                {isActive && <View className="size-1.5 rounded-full bg-amber-500" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      <View
        className="border-t border-white/10 px-3 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="flex-row items-center rounded-xl bg-white/5 p-2.5">
          <View className="mr-3 size-9 items-center justify-center rounded-lg bg-amber-100">
            <Ionicons name="person" size={18} color="#b45309" />
          </View>

          <View className="min-w-0 flex-1">
            <Text className="text-sm font-semibold text-white" numberOfLines={1}>
              {user?.name || "Usuario"}
            </Text>
            <Text className="text-xs text-slate-500" numberOfLines={1}>
              {user?.email || "Sessao ativa"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="size-9 items-center justify-center rounded-lg"
            activeOpacity={0.8}
          >
            <MaterialIcons name="logout" size={21} color="#fca5a5" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function Layout() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0f172a",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "700",
        },
        drawerStyle: {
          backgroundColor: "#020617",
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} className="mr-4">
              <MaterialIcons name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <Drawer.Screen
        name="members/index"
        options={{
          title: "Membros",
        }}
      />

      <Drawer.Screen
        name="members/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Detalhes do Membro",
        }}
      />

      <Drawer.Screen
        name="members/create"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo Membro",
        }}
      />

      <Drawer.Screen
        name="members/edit/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar Membro",
        }}
      />

      <Drawer.Screen
        name="events/index"
        options={{
          title: "Eventos",
        }}
      />

      <Drawer.Screen
        name="events/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Detalhes do Evento",
        }}
      />

      <Drawer.Screen
        name="events/create"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo Evento",
        }}
      />

      <Drawer.Screen
        name="events/edit/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar Evento",
        }}
      />

      <Drawer.Screen
        name="contributions/index"
        options={{
          title: "Contribuicoes",
        }}
      />

      <Drawer.Screen
        name="contributions/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Detalhes da Contribuicao",
        }}
      />

      <Drawer.Screen
        name="contributions/create"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova Contribuicao",
        }}
      />

      <Drawer.Screen
        name="contributions/edit/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar Contribuicao",
        }}
      />

      <Drawer.Screen
        name="ministries/index"
        options={{
          title: "Ministerios",
        }}
      />

      <Drawer.Screen
        name="ministries/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Detalhes do Ministerio",
        }}
      />

      <Drawer.Screen
        name="ministries/create"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo Ministerio",
        }}
      />

      <Drawer.Screen
        name="ministries/edit/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar Ministerio",
        }}
      />

      <Drawer.Screen
        name="settings/index"
        options={{
          title: "Configurações",
        }}
      />

      <Drawer.Screen
        name="settings/users/create"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo Usuario",
        }}
      />

      <Drawer.Screen
        name="settings/users/edit/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar Usuario",
        }}
      />
    </Drawer>
  );
}
