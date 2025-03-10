import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../theme/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "success" | "error" | "warning";
  outline?: boolean;
  width?: number; // Opción para forzar un tamaño específico
  style?: ViewStyle;
}

export default function CustomButton({ title, onPress, variant = "primary", outline = false, width, style }: ButtonProps) {
  // Definir colores dinámicos
  const textColor = outline ? theme.colors[variant] : theme.colors.textLight;
  const borderColor = outline ? theme.colors[variant] : "transparent";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor,
          height: 48,
          width: width ?? "auto",
          paddingHorizontal: 16,
          flexGrow: width ? 0 : 1,
        },
        outline ? styles.outline : styles[variant],
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  text: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
  },
  primary: { backgroundColor: theme.colors.primary },
  success: { backgroundColor: theme.colors.success },
  error: { backgroundColor: theme.colors.error },
  warning: { backgroundColor: theme.colors.warning },
  outline: {
    backgroundColor: "transparent",
  },
});




