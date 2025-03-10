import { Tabs } from "expo-router";

export default function TutorTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Inicio" }} />
      <Tabs.Screen name="sessions" options={{ title: "Sesiones" }} />
      <Tabs.Screen name="../profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
