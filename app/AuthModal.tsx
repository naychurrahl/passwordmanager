import AppButton from "@/components/AppButton";
import Input from "@/components/Input";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthModal({
  modalVisible,
  setModalVisible,
  isBiometric = true,
}: {
  modalVisible: string | null;
    setModalVisible: (value: string | null) => void;
    isBiometric?: boolean;
}) {
  const [password, setPassword] = useState<string>();
  
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);

  const handleLogin = async (bio: boolean = false) => {
    if (password || bio) {

      const key = await AsyncStorage.getItem("jarvis");
      
      if (key) {
        if (JSON.parse(key) === password || bio) {
          
          setModalVisible(JSON.stringify(Date.now() + 9000));
        }
      } else {
        if (!password) {
          Alert.alert("", "Kindly set a password!");
          return;
        }
        await AsyncStorage.setItem("jarvis", JSON.stringify(password));
        setModalVisible(JSON.stringify(Date.now() + 9000));
      }
    }

    setPassword(undefined);
  };

  const hide = () => {
    setModalVisible(null);
  };

  const authenticateWithBiometrics = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Put thing to sensor",
      //fallbackLabel: "Use Passcode", // iOS only, customize fallback to system passcode
      disableDeviceFallback: true, // iOS only, allows fallback to system passcode
    });

    if (result.success) {
      // User authenticated successfully
      //console.log("Biometric authentication successful!");
      handleLogin(true);
      return true;
    } else {
      // Authentication failed or was canceled
      //console.log("Biometric authentication failed or canceled:", result.error);
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

  useEffect(() => {
    if (!modalVisible && isBiometric) {
      checkBiometricSupport();
    }
    
  }, [ modalVisible]);

  return (
    <Modal
      transparent={false}
      animationType="fade"
      visible={modalVisible ? false : true}
      onRequestClose={hide}
      style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
    >
      <View style={[styles.overlay]}>
        <View style={styles.box}>
          <Input
            icon={passwordVisibility ? "eye-off" : "eye"}
            placeholder={passwordVisibility ? "password" : "********"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisibility}
            onPressIcon={() => setPasswordVisibility(!passwordVisibility)}
          />

          <AppButton
            title="Submit"
            onPress={() => {
              handleLogin(false);
            }}
          />
        </View>
      </View>
    </Modal>
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
