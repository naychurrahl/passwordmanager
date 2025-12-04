import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Input({
  label = "",
  icon = "person",
  placeholder = "",
  value = "",
  onChangeText,
  secureTextEntry = false,
  color = "#111",
  borderColor = "#333",
  textColor = "#f5f5f5",
  placeholderColor = "#888",
  iconColor = "#888",
  rounded = true,
  error,
  style,
  onPressIcon,
}: {
  label?: string;
    icon?: any;
    placeholder?: string;
    value?: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    color?: string;
    borderColor?: string;
    textColor?: string;
    placeholderColor?: string;
    iconColor?: string;
    rounded?: boolean;
    error?: string;
    style?: object | object[];
    onPressIcon?: any;
}) {
  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: color,
            borderColor: error ? "#ff3b30" : borderColor,
            borderRadius: rounded ? 12 : 4,
          },
        ]}
      >
        <TouchableOpacity
          onPress={ onPressIcon }
          activeOpacity={0.1}
        >
          {icon && (
            <Ionicons
              name={ icon }
              size={18}
              color={error ? "#ff3b30" : iconColor}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 4,
  },
});
