import { colors } from "@/theme/colors";
import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { PaperProvider } from "react-native-paper";

export default function TutorTabs() {
  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDark,
          tabBarStyle: { backgroundColor: colors.backgroundLight },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="horarios"
          options={{
            title: "Disponibilidad",
            tabBarIcon: ({ color, size }) => (
              <Icon name="calendar-clock" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="sessions"
          options={{
            title: "Sesiones",
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-group" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => (
              <Icon name="account" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
