import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../theme/theme";

interface CustomPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const CustomPicker = ({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder = "Selecciona una opción",
}: CustomPickerProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor={theme.colors.primary}
        >
          <Picker.Item label={placeholder} value="" enabled={false} />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    marginBottom: 8,
    color: theme.colors.textDark,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.textLight,
    overflow: "hidden",
    height: Platform.OS === "ios" ? 48 : 52,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 48 : 52,
    paddingHorizontal: 12,
  },
});

export default CustomPicker;
