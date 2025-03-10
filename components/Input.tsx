import React from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/fonts";
import { sizes } from "../theme/sizes";

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function CustomInput({ label, placeholder, value, onChangeText, secureTextEntry }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textDark}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    marginBottom: 10,
  },
  label: {
    fontSize: sizes.sm,
    fontFamily: fonts.bold,
    color: colors.textDark,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    backgroundColor: colors.textLight,
    color: colors.textDark,
    fontSize: sizes.md,
    fontFamily: fonts.regular,
  },
});
