import { ProfileProp, useApp } from "@/components/AppContext";
import Header from "@/components/Header";
import Heading from "@/components/Heading";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WriteModal from "@/app/WriteModal";
import { useSQLiteContext } from "expo-sqlite";
import FloatingButton from "@/components/FloatingButton";
import DeleteModal from "@/app/DeleteModal";
import AuthModal from "@/app/AuthModal";


export default function Index() {

  const { colors, auth, setAuth, isBiometric, refresh, toggleRefresh } = useApp();

  //toggleRefresh();

  interface VaultRow {
    id: string;
    service: string;
    user: string;
    password: string;
  }

  interface DataProps {
    userName: string;
    password: string;
    id: string;
  }

  interface InfoProps {
    service: string;
    data: DataProps[];
  }

  interface BoxProps {
    cards: InfoProps[];
    setWriteMode: (value: ProfileProp | null) => void;
    setDeleteMode: (value: ProfileProp | null) => void;
  }

  const Box = ({ cards, setWriteMode, setDeleteMode }: BoxProps) => {
    return (
      <SectionList
        sections={cards}
        renderItem={({ item, section: { service } }) => (
          <Card
            userName={item.userName}
            password={item.password}
            service={service}
            setWriteMode={setWriteMode}
            setDeleteMode={setDeleteMode}
            id={item.id}
          />
        )}
        renderSectionHeader={({ section: { service } }) => (
          <Heading
            innerText={service}
            onPress={() => setWriteMode({ action: "create", service: service })}
          />
        )}
        style={{
          flex: 1,
        }}
        ListEmptyComponent={() => (
          <>
            <TouchableOpacity
              onPress={() => {
                //router.replace("/");
                setWriteMode({ action: "create" });
              }}
            >
              <Text
                style={{ fontSize: 60, color: colors.text, alignSelf: "center" }}
              >
                Add +
              </Text>
            </TouchableOpacity>
          </>
        )}
      />
    );
  };

  interface CardProps {
    bgColor?: string;
    fontSize?: number;
    userName?: string;
    password?: string;
    service?: string;
    setWriteMode: (value: ProfileProp | null) => void;
    setDeleteMode: (value: ProfileProp | null) => void;
    id?: string;
  }

  const Card = ({
    bgColor = "",
    fontSize = 16,
    userName = "Bitcoin",
    password = "0.02 BTC",
    service = "Service",
    setWriteMode,
    setDeleteMode,
    id,
  }: CardProps) => {
    return (
      <View
        style={{
          flexDirection: "row",
          height: 85,
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
          borderRadius: 16,
          gap: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            //router.replace("/");
            setWriteMode({
              service: service,
              user: userName,
              password: password,
              action: "update",
              id: id,
            });
          }}
          style={{
            flex: 1,
            gap: 4,
          }}
        >
          <View
            style={{
              flex: 1,
              gap: 4,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: fontSize,
                  fontWeight: "600",
                }}
              >
                {userName}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text, fontSize: fontSize }}>
                {password}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View
          style={{
            gap: 12,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            backgroundColor: colors.danger,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setDeleteMode({
                id: id,
              });
            }}
          >
            <Ionicons
              name={"remove-circle-outline"}
              size={24}
              color={colors.text}
              style={{ alignSelf: "flex-end" }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //

  const db = useSQLiteContext();

  const [writeMode, setWriteMode] = useState<ProfileProp | null>(null);

  const [deleteMode, setDeleteMode] = useState<ProfileProp | null>(null);

  //const [auth, setAuth] = useState<string | null>(null);

  const [info, setInfo] = useState<InfoProps[]>([]);

  const fetchInfo = async () => {
    try {
      if (!auth) {
        setInfo([]);
        return;
      }

      ////////////////////////////////////////////////////////////////////////////////

      const rows = await db.getAllAsync<VaultRow>("SELECT * FROM vault");

      const result: InfoProps[] = [];
      const servicesIndex: Record<string, number> = {}; // to track where each service sits

      for (const row of rows) {
        const { id, service, user, password } = row;

        if (servicesIndex[service] === undefined) {
          // create new service group
          servicesIndex[service] = result.length;
          result.push({
            service,
            data: [],
          });
        }

        // push into the correct service group
        result[servicesIndex[service]].data.push({
          id,
          userName: user,
          password,
        });
      }

      setInfo(result);

      ////////////////////////////////////////////////////////////////////////////////

      //const messages: any = await db.getAllAsync("SELECT * FROM vault");

      //setInfo(messages);
      /* setInfo([
        {
          id: "1",
          service: "Facebook",
          data: [
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
          ],
        },
        {
          id: "2",
          service: "Twitter",
          data: [{ userName: "adegbox", password: "Gbogboro1234" }],
        },
        {
          id: "3",
          service: "Facebook",
          data: [
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
          ],
        },
        {
          id: "4",
          service: "Twitter",
          data: [{ userName: "adegbox", password: "Gbogboro1234" }],
        },
        {
          id: "5",
          service: "Facebook",
          data: [
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
          ],
        },
        {
          id: "6",
          service: "Twitter",
          data: [{ userName: "adegbox", password: "Gbogboro1234" }],
        },
        {
          id: "7",
          service: "Facebook",
          data: [
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
            { userName: "ade", password: "Gboro1234" },
          ],
        },
        {
          id: "8",
          service: "Twitter",
          data: [{ userName: "adegbox", password: "Gbogboro1234" }],
        },
      ]); */
    } catch (error: any) {}
  };

  const handleLogout = () => {
    setAuth(null);
  };

  useEffect(() => {
    fetchInfo();
  }, [refresh, auth]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.bg,
        padding: 16,
        paddingBottom: 0,
        flex: 1,
      }}
    >
      <AuthModal modalVisible={auth} setModalVisible={setAuth} isBiometric={ isBiometric } />

      <Header
        title={`Son of a Bisshh`}
        showBack={false}
        rightIcon={"log-out-outline"}
        onRightPress={handleLogout}
      />

      <WriteModal
        modalVisible={writeMode}
        setModalVisible={setWriteMode}
        user={auth}
      />

      <DeleteModal
        modalVisible={deleteMode}
        setModalVisible={setDeleteMode}
        user={auth}
      />

      <Box
        cards={info}
        setWriteMode={setWriteMode}
        setDeleteMode={setDeleteMode}
      />

      <FloatingButton onPress={() => setWriteMode({ action: "create" })} />
    </SafeAreaView>
  );
}
