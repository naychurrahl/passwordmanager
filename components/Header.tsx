// components/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  showBack?: boolean;
  showRight?: boolean;
  rightIcon?: any;
}

const Header: React.FC<HeaderProps> = ({
  title = "My App",
  onBackPress,
  onRightPress,
  showBack = true,
  showRight = true,
  rightIcon = "log-out-outline",
}) => {
  return (
    <View style={styles.container}>
      {/* Left: Back Arrow (optional) */}
      {showBack ? (
        <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      {/* Middle: Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right: Settings Gear (optional) */}
      {showRight ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconContainer}>
          <Ionicons name={rightIcon} size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 32, // keeps title centered even if icon hidden
  },
});

export default Header;
