import { useApp } from "@/components/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

// create a component
const TabsLayout = () => {
  const { colors } = useApp();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopWidth: 1,
          borderTopColor: colors.accent,
          height: 100,
          paddingTop: 20,
        },
        tabBarLabelStyle: {
          fontSize: 20,
          fontWeight: "900",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

//make this component available to the app
export default TabsLayout;
