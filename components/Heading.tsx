import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface HeadingProps {
  innerText?: string;
  onPress?: (value: any) => void;
  color?: string;
  fontSize?: any;
  fontWeight?: any;
}

const Heading = ({
  innerText = "create entry",
  onPress,
  color = "#5f5252ff",
  fontSize = 24,
  fontWeight = "600",
}: HeadingProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Text style={{ color: color, fontSize: fontSize, fontWeight: fontWeight }}>
          {innerText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Heading;
