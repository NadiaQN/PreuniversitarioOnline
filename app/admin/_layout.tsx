import { Tabs } from "expo-router";

export default function AdminTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: "Inicio" }} />
      <Tabs.Screen name="users" options={{ title: "Usuarios" }} />
      <Tabs.Screen name="courses" options={{ title: "Cursos" }} />
      <Tabs.Screen name="tutors" options={{ title: "Tutores" }} />
      <Tabs.Screen name="../profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}

