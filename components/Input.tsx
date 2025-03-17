import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function CustomInput({ label, placeholder, value, onChangeText, secureTextEntry }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { 
            borderColor: isFocused ? theme.colors.primary : theme.colors.border,
          }
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textDark}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    backgroundColor: theme.colors.textLight,
  },
});
