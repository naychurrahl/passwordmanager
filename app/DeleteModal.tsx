import { ProfileProp, useApp } from "@/components/AppContext";
import Heading from "@/components/Heading";
import Input from "@/components/Input";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DeleteModal({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: ProfileProp | null;
  setModalVisible: (value: ProfileProp | null) => void;
  user?: string | null;
}) {
  const db = useSQLiteContext();

  const { colors, auth, toggleRefresh } = useApp();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: colors.accent,
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
    cancel: { color: colors.text },
  });

  const handleDelete = async ({ id = "" }: ProfileProp) => {
    try {
      if (!modalVisible) {
        throw new Error("can not send empty text!");
      } else {
        await db.runAsync("DELETE FROM vault WHERE id = ?", [id]);
      }

      hide();
    } catch (error: any) {
      Alert.alert("Error!", error.message || "An error ocured!");
    }
  };

  const handlereset = async () => {
    try {
      if (!modalVisible) {
        throw new Error("can not send empty text!");
      } else {
        await db.runAsync("DROP TABLE vault");
        await db.runAsync(`
          CREATE TABLE  IF NOT EXISTS vault (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service TEXT NOT NULL,
            user TEXT NOT NULL,
            password TEXT NOT NULL
          );
          PRAGMA journal_mode = WAL;
        `);
        toggleRefresh();
      }

      hide();
    } catch (error: any) {
      Alert.alert("Error!", error.message || "An error ocured!");
    }
  };

  const hide = () => {
    setModalVisible(null);
  };
  //const hide = () => setOptions(null);

  useEffect(() => {
    if (!auth) {
      hide();
    }
  }, [auth]);

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
          <Heading innerText={`${modalVisible?.action === "reset" ? "RESET ALL" : "DELETE"} entry?`} />

          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.btn,
                { borderWidth: 1, backgroundColor: colors.accent },
              ]}
              onPress={() => {
                switch (modalVisible?.action) {
                  case "reset":
                    //console.log("all good");
                    handlereset();
                    break;
                  case "delete":
                    let id = modalVisible?.id ?? "";

                    if (id) {
                      handleDelete({ id: id });
                    }

                    break;

                  default:
                    break;
                }

                hide();
              }}
            >
              <Text style={styles.cancel}>
                {modalVisible?.text || "Delete"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.success }]}
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
