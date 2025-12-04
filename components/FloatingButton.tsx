import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface FABProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
}

export default function FloatingButton({ onPress, icon = "add", label }: FABProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.fab}>
        <Ionicons name={icon} size={28} color="#fff" />
        {label ? <Text style={styles.label}>{label}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1e90ff",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  label: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
