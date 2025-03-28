import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "success" | "error" | "warning";
  outline?: boolean;
  width?: number;
  style?: ViewStyle;
  iconName?: string;
  iconOnly?: boolean;
  disabled?: boolean; // 🔹 Agregamos la propiedad
}

export default function CustomButton({ title, onPress, variant = "primary", outline = false, width, style, iconName, iconOnly, disabled = false }: ButtonProps) {
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
          alignSelf: "center",
          backgroundColor: disabled ? theme.colors.backgroundDark : outline ? "transparent" : theme.colors[variant], // 🔹 Cambia el color si está deshabilitado
          opacity: disabled ? 0.5 : 1, // 🔹 Reduce la opacidad si está deshabilitado
        },
        outline && styles.outline,
        style,
      ]}
      onPress={!disabled ? onPress : undefined} // 🔹 Deshabilita la acción si el botón está inactivo
      disabled={disabled} // 🔹 Aplica la propiedad disabled
    >
      {iconName && <Icon name={iconName} size={20} color={textColor} />}
      {!iconOnly && <Text style={[styles.text, { color: textColor }]}>{title}</Text>}
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
    flexDirection: "row",
  },
  text: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    marginLeft: 8,
  },
  outline: {
    backgroundColor: "transparent",
  },
});
