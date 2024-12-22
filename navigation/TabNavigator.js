import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Animated } from "react-native";
import HomeScreen from "../src/screens/HomeScreen.js";
import ProfileScreen from "../src/screens/ProfileScreen.js";
import SettingsScreen from "../src/screens/SettingsScreen.js";
import CartScreen from "../src/screens/CartScreen.js";
import { useTheme } from "../src/contexts/ThemeContext.js";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [headerOpacity, setHeaderOpacity] = useState(new Animated.Value(0)); // Animated opacity for header
  const { theme } = useTheme(); // Access theme context
  const isDarkMode = theme === "dark"; // Check if dark mode is active

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 1000, // Duration for animation
      useNativeDriver: true, // Enabling native driver for better performance
    }).start();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? "#76ff03" : "green", // Light green for dark mode
        tabBarInactiveTintColor: isDarkMode ? "#aaaaaa" : "gray", // Gray for dark mode
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#121212" : "#d9e4f5", // Dark or light mode background
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: "Shopping App",
          headerTitleAlign: "center",
          headerStyle: { 
            backgroundColor: isDarkMode ? "#1b1b1b" : "#1E2A78", // Dark header for dark mode
            opacity: headerOpacity,
            elevation: 5,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? "#333" : "#ddd",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 22,
            color: isDarkMode ? "#ffffff" : "#fff",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerTitle: "Your Cart",
          headerTitleAlign: "center",
          headerStyle: { 
            backgroundColor: isDarkMode ? "#1b1b1b" : "#1E2A78", 
            opacity: headerOpacity,
            elevation: 5,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? "#333" : "#ddd",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 22,
            color: isDarkMode ? "#ffffff" : "#fff",
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Your Profile",
          headerTitleAlign: "center",
          headerStyle: { 
            backgroundColor: isDarkMode ? "#1b1b1b" : "#1E2A78", 
            opacity: headerOpacity,
            elevation: 5,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? "#333" : "#ddd",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 22,
            color: isDarkMode ? "#ffffff" : "#fff",
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerTitle: "Settings",
          headerTitleAlign: "center",
          headerStyle: { 
            backgroundColor: isDarkMode ? "#1b1b1b" : "#1E2A78", 
            opacity: headerOpacity,
            elevation: 5,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? "#333" : "#ddd",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 22,
            color: isDarkMode ? "#ffffff" : "#fff",
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Styling with animated and smooth transitions
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9", // Light background for cart
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
});
