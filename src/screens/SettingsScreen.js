import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db, deleteDoc, signOut } from "../firebase/firebaseConfig.js";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [fadeAnim] = useState(new Animated.Value(0));
  const [appVersion, setAppVersion] = useState("1.0.0");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const checkLoginStatus = async () => {
      const user = auth.currentUser; // Firebase ka current user
      setIsLoggedIn(user || false);
    };
    setInterval(() => {
      checkLoginStatus();
    }, 100);
  }, [fadeAnim]);

  const handleEmergency = () => {
    Alert.alert("Emergency Use Only", "This action is irreversible. Proceed?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => AsyncStorage.clear() },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => Logout() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "This action is irreversible. Proceed?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => deleteAccount() },
    ]);
  };
  const Logout = async () => {
    try {
      await signOut(auth);
      Alert.alert("SignOut Successfully!", "You have been logged out.", [
        { text: "Done", style: "default" },
        {
          text: "Yes",
          onPress: () => {
            setIsLoggedIn(false);
          },
        },
      ]);
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "There was a problem signing out. Please try again.");
    }
  };
  
  const deleteAccount = async () => {
    try {
      await auth.currentUser.delete();
      await deleteDoc(doc(db, "userdata", auth.currentUser.uid));
      Alert.alert("Account Deleted Successfully!", [
        { text: "Done", style: "Done" },
        {
          text: "Done",
          onPress: () => {
            setIsLoggedIn(false);
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <LinearGradient
      colors={
        isDarkMode
          ? ["#121212", "#1E1E1E", "#333"]
          : ["#4C8BF5", "#4C8BF5", "#d9e4f5"]
      }
      style={styles.gradientBackground}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Theme Toggle */}
        <View
          style={[
            styles.themeToggleContainer,
            { backgroundColor: isDarkMode ? "#333" : "#FFFFFF90" },
          ]}
        >
          <Text style={[styles.label, { color: isDarkMode ? "#FFF" : "#000" }]}>
            Dark Mode
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#4C8BF5" }}
            thumbColor={isDarkMode ? "#FFF" : "#000"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>

        {/* Privacy Policies */}
        <View style={styles.privacyContainer}>
          <Text
            style={[
              styles.privacyText,
              { color: isDarkMode ? "#CCC" : "#000" },
            ]}
          >
            By using this app, you agree to our Privacy Policies and Terms of
            Use.
          </Text>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text
            style={[
              styles.versionText,
              { color: isDarkMode ? "#CCC" : "#000" },
            ]}
          >
            App Version: {appVersion}
          </Text>
        </View>

        {/* Show Buttons Only If User Is Logged In */}
        {isLoggedIn && (
          <>
            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>

            {/* Delete Account Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={handleEmergency}>
          <Text style={styles.buttonText}>Emergency</Text>
        </TouchableOpacity>
        {/* Footer */}
        <View style={styles.footer}>
          <Text
            style={[styles.footerText, { color: isDarkMode ? "#FFF" : "#000" }]}
          >
            © 2024 Rashid Khan. All rights reserved.
          </Text>
          <Text
            style={[styles.followText, { color: isDarkMode ? "#FFF" : "#000" }]}
          >
            Follow me on:
          </Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => openLink("https://www.instagram.com/leovibesx/")}
            >
              <FontAwesome name="instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openLink("http://github.com/rashidkhan1234567/")}
              style={{ marginHorizontal: 20 }}
            >
              <FontAwesome name="github" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                openLink("https://www.linkedin.com/in/rashid-khan-4213ab299/")
              }
            >
              <FontAwesome name="linkedin" size={24} color="#0077B5" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  themeToggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  privacyContainer: {
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  versionText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  logoutButton: {
    backgroundColor: "#3A6ABF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#D9534F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  followText: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
