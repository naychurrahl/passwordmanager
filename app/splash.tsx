import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "@/components/AppContext";

export default function Splash() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const [displayedText, setDisplayedText] = useState("");
  const fullText = "DarkRealm";

  useEffect(() => {
    // --- Fade + glow ---
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ),
    ]).start();

    // --- Typing effect ---
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 120);

    // --- Redirect after ---
    const timer = setTimeout(() => {
      router.replace("/");
    }, 4000);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timer);
    };
  }, []);

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#7e22ce", "#a855f7"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.Image
        source={require("@/assets/images/icon.png")}
        style={[
          styles.logo,
          {
            shadowColor: glowColor,
            shadowRadius: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 20],
            }),
          },
        ]}
        resizeMode="contain"
      />

      <Text style={styles.title}>{displayedText}</Text>
      <Text style={styles.subtitle}>Summoning darkness...</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    tintColor: "#a855f7",
  },
  title: {
    color: "#c084fc",
    fontSize: 28,
    fontWeight: "700",
    textShadowColor: "#9333ea",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontFamily: "serif",
  },
  subtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 10,
    letterSpacing: 1.5,
  },
});
