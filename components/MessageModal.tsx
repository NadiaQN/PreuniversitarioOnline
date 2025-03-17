import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { theme } from "../theme/theme";
import CustomButton from "./Button";

interface MessageModalProps {
  visible: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function MessageModal({ visible, message, type, onClose }: MessageModalProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent visible={show} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, type === "success" ? styles.success : styles.error]}>
          <Text style={styles.text}>{message}</Text>
          <CustomButton title="Cerrar" onPress={onClose} variant={type} />
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    width: "40%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.textLight,
    borderWidth: 2,
  },
  text: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    textAlign: "center",
    marginBottom: 12,
  },
  success: { borderColor: theme.colors.success },
  error: { borderColor: theme.colors.error },
});
