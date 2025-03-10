import { Tabs } from "expo-router";

export default function StudentTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Inicio" }} />
      <Tabs.Screen name="courses" options={{ title: "Cursos" }} />
      <Tabs.Screen name="../profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
