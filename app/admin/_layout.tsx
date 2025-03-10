import { Tabs } from "expo-router";

export default function AdminTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Inicio" }} />
      <Tabs.Screen name="../profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
