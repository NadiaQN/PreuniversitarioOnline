import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import CustomButton from "./Button";
import { theme } from "../theme/theme";

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonGroup}>
            <CustomButton
              title="Cancelar"
              onPress={onCancel}
              variant="error"
              outline
              style={styles.button}
            />
            <CustomButton
              title="Confirmar"
              onPress={onConfirm}
              variant="error"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: theme.colors.backgroundLight,
    padding: 20,
    borderRadius: 12,
    borderColor: theme.colors.error,
    borderWidth: 2,
    width: "80%",
  },
  message: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    color: theme.colors.error,
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    minWidth: 120,
  },
});
