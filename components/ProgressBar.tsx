import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface SimpleProgressBarProps {
  progress: number; // de 0 a 1
}

export default function SimpleProgressBar({ progress }: SimpleProgressBarProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
});
