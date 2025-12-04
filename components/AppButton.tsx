import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function AppButton({ title, width = '50%', onPress }: { title: string; width?: any, onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.button, {width: width}]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

});
