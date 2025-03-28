import React, { useEffect } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import CustomButton from "./Button";
import { theme } from "../theme/theme";

interface MessageModalProps {
  visible: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function MessageModal({ visible, message, type, onClose }: MessageModalProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer); // Limpieza del temporizador
    }
  }, [visible, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, { borderColor: type === "success" ? theme.colors.success : theme.colors.error }]}>
          <Text style={[styles.message, { color: type === "success" ? theme.colors.success : theme.colors.error }]}>
            {message}
          </Text>
          <CustomButton title="Cerrar" onPress={onClose} variant={type} outline />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: theme.colors.backgroundLight,
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    borderWidth: 2,
  },
  message: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
    marginBottom: 16,
  },
});
