import { ProfileProp, useApp } from "@/components/AppContext";
import React, { useState } from "react";
import { StyleSheet, Switch, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import DeleteModal from "@/app/DeleteModal";
import AuthModal from "@/app/AuthModal";
import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const [deleteMode, setDeleteMode] = useState<ProfileProp | null>(null);

  const {
    colors,
    isDarkMode,
    toggleDarkMode,
    auth,
    setAuth,
    isBiometric,
    toggleBiometric,
  } = useApp();

  const authenticateWithBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Put thing to sensor",
      fallbackLabel: "Use Passcode", // iOS only, customize fallback to system passcode
      disableDeviceFallback: true, // iOS only, allows fallback to system passcode
    });

    if (result.success) {
      await AsyncStorage.removeItem("jarvis");
      setAuth(null);
      router.replace("/");
      return true;
    } else {
      return false;
    }
  };

  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (hasHardware && isEnrolled && supportedTypes.length > 0) {
      // Biometrics are available and enrolled
      await authenticateWithBiometrics();
      return true;
    } else {
      // Biometrics are not available or not enrolled
      return false;
    }
  };

  interface CardProps {
    stateValue?: boolean;
    setStatevalue?: (value: boolean) => void;
    text?: string;
    fontSize?: number;
    fontWeight?: any;
    textColor?: string;
  }

  const Card = ({
    stateValue,
    setStatevalue,
    text = "Text goes here",
    fontSize = 30,
    fontWeight = "600",
  }: CardProps) => {
    return (
      <View
        style={[
          { flex: 1, maxHeight: 80, width: "100%", backgroundColor: colors.bg },
        ]}
      >
        <View style={styles.row}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: fontSize,
                fontWeight: fontWeight,
                color: colors.text,
              }}
            >
              {text}
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={stateValue ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setStatevalue}
              value={stateValue}
            />
          </View>
        </View>
      </View>
    );
  };

  const NotCard = ({
    onPress,
    text = "Text goes here",
    fontSize = 30,
    fontWeight = "600",
    textColor = colors.text,
  }: CardProps & { onPress?: (v: any) => any }) => {
    return (
      <TouchableOpacity
        style={[
          {
            flex: 1,
            maxHeight: 80,
            width: "100%",
            backgroundColor: colors.bg,
          },
        ]}
        onPress={onPress}
      >
        <View style={styles.row}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: fontSize,
                fontWeight: fontWeight,
                color: textColor,
              }}
            >
              {text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.bg,
        padding: 16,
        paddingBottom: 0,
        flex: 1,
        alignItems: "center",
      }}
    >
      {/*<AuthModal modalVisible={auth} setModalVisible={setAuth} isBiometric={isBiometric} />*/}

      <Header title={`Settings`} showBack={false} showRight={false} />

      <DeleteModal
        modalVisible={deleteMode}
        setModalVisible={setDeleteMode}
        user={auth}
      />
      <Card
        stateValue={isDarkMode}
        setStatevalue={toggleDarkMode}
        text="Toggle dark mode"
      />
      <Card
        stateValue={isBiometric}
        setStatevalue={toggleBiometric}
        text="Toggle biometrics"
      />
      <NotCard
        text={"Change password"}
        onPress={() => {
          checkBiometricSupport();
        }}
      />

      <NotCard
        text={"RESET"}
        textColor={colors.danger}
        onPress={() => {
          setDeleteMode({ action: "reset", text: "Reset" });
          router.replace("/");
        }}
      />

      <NotCard
        text={"LOG OUT"}
        textColor={colors.danger}
        onPress={() => {
          setAuth(null);
          router.replace("/");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 1)",
    padding: 30,
  },
  box: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  message: { opacity: 0.7, marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 10,
    borderRadius: 12,
  },
  cancel: { color: "#666" },
  ok: { color: "#007aff", fontWeight: "700" },
});
