import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../theme/theme";
import { useDevice } from "../hooks/useDevice";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "success" | "error" | "warning";
  outline?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  iconName?: string;
  iconOnly?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  outline = false,
  fullWidth = false,
  style,
  iconName,
  iconOnly,
}: ButtonProps) {
  const { isMobile } = useDevice();

  const textColor = outline ? theme.colors[variant] : theme.colors.textLight;
  const borderColor = outline ? theme.colors[variant] : "transparent";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor,
          height: 48,
          minWidth: iconOnly ? 48 : "auto",
          width: fullWidth ? "100%" : "auto",
          paddingHorizontal: iconOnly ? 12 : 16,
        },
        outline ? styles.outline : styles[variant],
        style,
      ]}
      onPress={onPress}
    >
      {iconName && <Icon name={iconName} size={20} color={textColor} />}
      {!iconOnly && (
        <Text numberOfLines={1} style={[styles.text, { color: textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 2,
  },
  text: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    marginLeft: 8,
  },
  primary: { backgroundColor: theme.colors.primary },
  success: { backgroundColor: theme.colors.success },
  error: { backgroundColor: theme.colors.error },
  warning: { backgroundColor: theme.colors.warning },
  outline: {
    backgroundColor: "transparent",
  },
});
