import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  ActivityIndicator,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importing the Ionicons library
import { useNavigation } from "@react-navigation/native";
import { auth, signInWithEmailAndPassword } from "../firebase/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [modelMessage, setModelMessage] = useState("");
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0)); // Opacity animation
  const [scaleAnim, setScaleAnim] = useState(new Animated.Value(1)); // Scale animation for the icon
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme(); 
  const isDarkMode = theme === "dark";

  const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const Navigation = useNavigation();

  // Handle Sign-In action
  const handleSignIn = () => {
    if (!email || !password) {
      setModelMessage("Please enter both email and password.");
      setModelVisible(true);
      return false;
    } else if (!emailRegex.test(email)) {
      setModelMessage("Please enter a valid Gmail address.");
      setModelVisible(true);
      return false;
    } else if (!passwordRegex.test(password)) {
      setModelMessage(
        "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character."
      );
      setModelVisible(true);
      return false;
    } else {
      setIsLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
          setModelMessage("Signed In Successfully!");
          setModelVisible(true);  
          const user = userCredential.user;
          await AsyncStorage.setItem("isLogin", JSON.stringify(true));
          setEmail("");
          setPassword("");
            Navigation.navigate("Tabs", { screen: "Home" });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setModelMessage(errorMessage);
          setModelVisible(true);
        })
        .finally(() => {
          setIsLoading(false);
        })
    }
  };

  // Animating the form elements on screen load
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Animating the scale of the password visibility icon
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <LinearGradient
    colors={isDarkMode ? ["#121212", "#1E1E1E", "#333"] : ["#4C8BF5", "#4C8BF5", "#d9e4f5"]}
    style={styles.container}
  >
    <KeyboardAvoidingView
   
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Cartoon Image with Fade-In Animation */}
      <Animated.Image
        source={require("../../assets/welcome_back.png")}
        style={[styles.image, { opacity: fadeAnim }]}
      />

      {/* Sign-In Form with Fade-In Animation */}
      <Animated.View style={[styles.formContainer, { opacity: fadeAnim } , isDarkMode && { backgroundColor: "gray" }]}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={[styles.subtitle , isDarkMode && {color :"#444"}]}>Sign in to your account</Text>

        {/* Email Input */}
        <TextInput
           style={[
            styles.input,
            isDarkMode && { backgroundColor: "#444", color: "#fff" },
          ]}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
             style={[
              styles.input,
              isDarkMode && { backgroundColor: "#444", color: "#fff" },
            ]}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible} // Conditionally show password based on state
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility} // Toggle password visibility with animation
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"} // Change icon based on password visibility
                size={24}
                color="#999"
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {isLoading ? ( 
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
      )}
        {/* Footer */}
        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => Navigation.navigate("Sign Up")}
          >
            Sign In
          </Text>
        </Text>
      </Animated.View>

      <Modal
        visible={modelVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModelVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modelMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModelVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width : "100%",
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 250,
    height: 300,
    resizeMode: "contain",
    margin : "auto",
  },
  formContainer: {
    marginTop :20,
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  linkText: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
