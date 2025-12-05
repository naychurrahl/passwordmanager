import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProfileProp, useApp } from "@/components/AppContext";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import { useSQLiteContext } from "expo-sqlite";

export default function WriteModal({
  modalVisible,
  setModalVisible,
  user = null,
}: {
  modalVisible: ProfileProp | null;
  setModalVisible: (value: ProfileProp | null) => void;
  user?: string | null;
}) {
  const { colors, toggleRefresh } = useApp();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: colors.decent,
      padding: 30,
    },
    box: {
      backgroundColor: colors.bg,
      padding: 20,
      borderRadius: 12,
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
  });

  const db = useSQLiteContext();

  const handleWrite = async ({
    service = "",
    user = "",
    password = "",
  }: ProfileProp) => {
    try {
      if (!modalVisible) {
        throw new Error("can not send empty text!");
      } else {
        await db.runAsync(
          "INSERT INTO vault (service, user, password) VALUES ( ?, ?, ?)",
          service,
          user,
          password
        );
      }

      hide();
    } catch (error: any) {
      Alert.alert("Error!", error.message || "An error ocured!");
    }
  };

  const handleUpdate = async ({
    id,
    service = "",
    user = "",
    password = "",
  }: ProfileProp & { id: string }) => {
    try {
      if (!modalVisible) {
        throw new Error("can not send empty text!");
      } else {
        await db.runAsync(
          "UPDATE vault SET service = ?, user = ?, password = ? WHERE id = ?",
          [service, user, password, id]
        );
      }

      hide();
    } catch (error: any) {
      Alert.alert("Error!", error.message || "An error ocured!");
    }
  };

  const hide = () => {
    toggleRefresh();
    setModalVisible(null);
  };
  //const hide = () => setOptions(null);

  useEffect(() => {
    if (!user) {
      hide();
    }
  }, [user]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible ? true : false}
      onRequestClose={hide}
      style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Heading innerText={`${modalVisible?.action} entry`} />

          <Input
            icon="server"
            placeholder="Service Name"
            value={modalVisible?.service}
            onChangeText={(x) =>
              setModalVisible({
                password: modalVisible?.password,
                service: x,
                user: modalVisible?.user,
                passwordVisibility: modalVisible?.passwordVisibility,
                action: modalVisible?.action,
                id: modalVisible?.id,
              })
            }
          />

          <Input
            icon="person"
            placeholder="username"
            value={modalVisible?.user}
            onChangeText={(x) =>
              setModalVisible({
                password: modalVisible?.password,
                service: modalVisible?.service,
                user: x,
                passwordVisibility: modalVisible?.passwordVisibility,
                action: modalVisible?.action,
                id: modalVisible?.id,
              })
            }
          />

          <Input
            icon={modalVisible?.passwordVisibility ? "eye-off" : "eye"}
            placeholder={
              modalVisible?.passwordVisibility ? "password" : "********"
            }
            value={modalVisible?.password || ""}
            onChangeText={(x) =>
              setModalVisible({
                password: x,
                service: modalVisible?.service,
                user: modalVisible?.user,
                passwordVisibility: modalVisible?.passwordVisibility,
                action: modalVisible?.action,
                id: modalVisible?.id,
              })
            }
            secureTextEntry={!modalVisible?.passwordVisibility}
            onPressIcon={() =>
              setModalVisible({
                password: modalVisible?.password,
                service: modalVisible?.service,
                user: modalVisible?.user,
                passwordVisibility: !modalVisible?.passwordVisibility,
                action: modalVisible?.action,
                id: modalVisible?.id,
              })
            }
          />

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, { borderWidth: 1, borderColor: colors.success }]}
              onPress={() => {
                let id = modalVisible?.id ?? "";
                let user = modalVisible?.user ?? "";
                let service = modalVisible?.service ?? "";
                let password = modalVisible?.password ?? "";

                hide();

                if (!service && !password && !user) {
                  return;
                }

                /* if (!service) {
                  service = "";
                }

                if (!user) {
                  user = "";
                }

                if (!password) {
                  password = "";
                } */

                modalVisible?.action === "create"
                  ? handleWrite({
                      user: user,
                      service: service,
                      password: password,
                    })
                  : handleUpdate({
                      id: id,
                      user: user,
                      service: service,
                      password: password,
                    });

                //options.onCancel?.();
              }}
            >
              <Text style={styles.cancel}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.accent }]}
              onPress={() => {
                hide();
                //options.onCancel?.();
              }}
            >
              <Text style={styles.cancel}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
