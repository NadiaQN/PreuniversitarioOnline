import { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { mockUsers } from "../mocks/users";
import { UserRole } from "../models/User";
import CustomButton from "../components/Button";
import CustomInput from "../components/Input";
import { theme } from "../theme/theme";

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
      <CustomInput label="Usuario" placeholder="Ingrese su usuario" value={username} onChangeText={setUsername} />
      <CustomInput label="Contraseña" placeholder="Ingrese su contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomButton title="Ingresar" onPress={handleLogin} />
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
});


