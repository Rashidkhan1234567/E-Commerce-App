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
  Modal,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Importing the Ionicons library
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
const {
  createUserWithEmailAndPassword,
  auth,
  setDoc,
  doc,
  db,
} = require("../firebase/firebaseConfig");
import { LinearGradient } from "expo-linear-gradient";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [modelMessage, setModelMessage] = useState("");
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0)); // Opacity animation
  const [scaleAnim, setScaleAnim] = useState(new Animated.Value(1)); // Scale animation for the icon
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSignUp = () => {
      if (!name || !email || !phone || !password || !confirmPassword) {
        setModelMessage("Please fill all fields.");
        setModelVisible(true);
        return false;
      } else if (name.split(" ").length > 20) {
        setModelMessage("Name should not exceed 20 words.");
        setModelVisible(true);
        return false;
      } else if (!emailRegex.test(email)) {
        setModelMessage("Please enter a valid Gmail address.");
        setModelVisible(true);
        return false;
      } else if (!/^\d{11}$/.test(phone)) {
        setModelMessage("Phone number should be 10 digits.");
        setModelVisible(true);
        return false;
      } else if (!passwordRegex.test(password)) {
        setModelMessage(
          "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character."
        );
        setModelVisible(true);
        return false;
      } else if (password !== confirmPassword) {
        setModelMessage("Passwords do not match.");
        setModelVisible(true);
        return false;
      } else {
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          await AsyncStorage.setItem("isLogin", JSON.stringify(true));
            const user = userCredential.user;
            const data = {
              name,
              email,
              phone,
              gender,
            };
            await setDoc(doc(db,"userdata", user.uid), data);
            setModelMessage("Signed Up Successfully!");
            setModelVisible(true);
            setName("");
            setEmail("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");
            setGender("male");
            setTimeout(() => {
              setIsLoading(false);
              navigation.navigate("Tabs", { screen: "Home" });
            }, 2000);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setModelMessage(errorMessage);
            setModelVisible(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
    
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
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
      colors={
        isDarkMode ? ["#121212", "#1E1E1E", "#333"] : ["#4C8BF5", "#4C8BF5", "#d9e4f5"]
      }
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Cartoon Image */}
          <Animated.Image
            source={require("../../assets/Welcome.png")} // Replace with your image
            style={[styles.image, { opacity: fadeAnim }]}
          />

          {/* Form Container */}
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: fadeAnim },
              isDarkMode && { backgroundColor: "#444" },
            ]}
          >
            <Text style={styles.title}>Create an Account</Text>
            <Text style={[styles.subtitle, isDarkMode && { color: "#ccc" }]}>
              Sign up to get started
            </Text>

            {/* Form Inputs */}
            <TextInput
              style={[
                styles.input,
                isDarkMode && { backgroundColor: "#555", color: "#fff" },
              ]}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[
                styles.input,
                isDarkMode && { backgroundColor: "#555", color: "#fff" },
              ]}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[
                styles.input,
                isDarkMode && { backgroundColor: "#555", color: "#fff" },
              ]}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  isDarkMode ? styles.genderButtonDark : styles.genderButtonLight,
                  gender === "male" && styles.selectedGender,
                ]}
                onPress={() => setGender("male")}
              >
                <Text style={styles.genderText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  isDarkMode ? styles.genderButtonDark : styles.genderButtonLight,
                  gender === "female" && styles.selectedGender,
                ]}
                onPress={() => setGender("female")}
              >
                <Text style={styles.genderText}>Female</Text>
              </TouchableOpacity>
            </View>
            {/* Password Inputs */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  isDarkMode && { backgroundColor: "#555", color: "#fff" },
                ]}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={togglePasswordVisibility}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#999"
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  isDarkMode && { backgroundColor: "#555", color: "#fff" },
                ]}
                placeholder="Confirm Password"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={toggleConfirmPasswordVisibility}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <Ionicons
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#999"
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>

         
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

            {/* Sign-Up Button */}
            {isLoading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Sign In")}
              >
                Sign In
              </Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingHorizontal: 20, // Consistent padding
      paddingBottom: 20, // Extra space at the bottom for better scrolling
    },
    image: {
      width: "80%", // Makes it responsive
      height: 200,
      resizeMode: "contain",
      marginBottom: 20,
    },
    formContainer: {
      width: "100%", // Adjusts to the container width
      maxWidth: 400, // Restricts maximum width for large screens
      marginTop: -20, // Use numeric values directly
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
    genderContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    genderButtonLight: {
      flex: 1,
      padding: 10,
      backgroundColor: "#f9f9f9",
      marginHorizontal: 5,
      borderRadius: 10,
      alignItems: "center",
    },
    genderButtonDark: {
      flex: 1,
      padding: 10,
      backgroundColor: "#d3d3d3",
      marginHorizontal: 5,
      borderRadius: 10,
      alignItems: "center",
    },
    selectedGender: {
      backgroundColor: "#4CAF50",
    },
    genderText: {
      fontSize: 16,
      color: "#333",
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
  