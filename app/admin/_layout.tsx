import React from "react";
import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../../theme/colors";

export default function AdminTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDark,
        tabBarStyle: { backgroundColor: colors.backgroundLight },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Icon name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Usuarios",
          tabBarIcon: ({ color, size }) => <Icon name="account-group-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Cursos",
          tabBarIcon: ({ color, size }) => <Icon name="book-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tutors"
        options={{
          title: "Tutores",
          tabBarIcon: ({ color, size }) => <Icon name="school-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="../profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <Icon name="account-circle-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
