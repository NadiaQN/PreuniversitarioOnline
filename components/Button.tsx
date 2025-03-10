import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { sizes } from "../theme/sizes";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "success" | "error" | "warning";
}

export default function CustomButton({ title, onPress, variant = "primary" }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, styles[variant]]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "80%",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    fontSize: sizes.md,
    fontFamily: fonts.bold,
    color: colors.textLight,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  error: {
    backgroundColor: colors.error,
  },
  warning: {
    backgroundColor: colors.warning,
  },
});
