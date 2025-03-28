import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { theme } from "../theme/theme";

interface CustomInputProps extends TextInputProps {
  label: string;
}

export default function CustomInput({ label, multiline = false, style, ...props }: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput, style]}
        placeholderTextColor={theme.colors.textDark}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    backgroundColor: theme.colors.textLight,
  },
  multilineInput: {
    height: 100, // 🔹 Ajustamos la altura para inputs multiline
    textAlignVertical: "top",
    paddingTop: 8 // 🔹 Alineamos el texto arriba
  },
});
