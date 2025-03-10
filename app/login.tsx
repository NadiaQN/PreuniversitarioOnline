import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { mockUsers } from "../mocks/users";
import { UserRole } from "../models/User";
import { theme } from "../theme/theme"; // Importamos el theme centralizado

// Mapeo de roles a rutas fijas
const roleRoutes: Record<UserRole, "/admin/dashboard" | "/tutor/dashboard" | "/student/dashboard"> = {
  admin: "/admin/dashboard",
  tutor: "/tutor/dashboard",
  student: "/student/dashboard",
};

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const user = Object.values(mockUsers).find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      Alert.alert("Inicio de sesión exitoso", `Bienvenido, ${user.role}`);
      router.replace(roleRoutes[user.role]);
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor={theme.colors.textDark}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={theme.colors.textDark}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Ingresar" color={theme.colors.primary} onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.backgroundLight,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: theme.colors.textLight,
    color: theme.colors.textDark,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
  },
  buttonContainer: {
    width: "80%",
    borderRadius: 5,
    overflow: "hidden",
  },
});

