import React, { useState , useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db, doc, getDoc, updateDoc } from "../firebase/firebaseConfig";
import { useTheme } from "../contexts/ThemeContext";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("123-456-7890");
  const [gender, setGender] = useState("Male");
  const [avatar, setAvatar] = useState(require("../../assets/avatar.png"));
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // For animation
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [edit, setEdit] = useState(true); // Track login state
  const navigation = useNavigation();
  const { theme} = useTheme();

  useEffect(() => {
    setInterval(() => {
      checkLogin();
    }, 1000);
}, []); 

const checkLogin = async () => {
  try {
    const user = auth.currentUser; 
    if (user) {
      const uid = user?.uid;
      const docRef = doc(db, "userdata", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setGender(data.gender);
        setIsLoggedIn(true);
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("User is not logged in.");
    }
  } catch (error) {
    console.error("Error reading user data:", error);
  }
};

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need permission to access your gallery.");
      return;
    }

    // Open the image picker if permission granted
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result); // Check result for debugging
      setAvatar(result.uri); // Set the selected image as avatar
    }
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEdit(!edit);
  };
  const saveProfile = async () => {
    try {
      if (!auth.currentUser) {
        alert("User is not authenticated.");
        return;
      }
  
      const uid = auth.currentUser.uid; // Ensure user is authenticated
      const washingtonRef = doc(db, "userdata", uid);
  
      await updateDoc(washingtonRef, {
        name: name,
        email: email,
        phone: phone,
        gender: gender,
      });
  
      alert("Profile updated successfully!");
      setIsEditing(!isEditing);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
  };

  const openLoginModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = () => {
    // setIsLoggedIn(true); // Simulate login
    navigation.navigate("Drawer");
    setModalVisible(false); // Close the login modal
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Simulate logout
  };
  const isDarkMode = theme === "dark";

  return (
      <LinearGradient
  colors={isDarkMode ? ["#121212", "#1E1E1E", "#333"] : ["#4C8BF5", "#d9e4f5"]}
  style={styles.container}
>
      <View style={[styles.profileCard , isDarkMode && {backgroundColor : "#333" , borderColor : "royalblue"}]}>
        {/* Avatar Section */}
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatar ? (
            <Image
              source={typeof avatar === "string" ? { uri: avatar } : avatar}
              style={styles.avatar}
            />
          ) : (
            <Text style={styles.avatarText}>Pick an Avatar</Text>
          )}
        </TouchableOpacity>

        {/* Edit Button (only if user is logged in) */}
        {isLoggedIn && (
          <TouchableOpacity style={styles.editButton} onPress={isEditing ? saveProfile : toggleEdit}>
            <Text style={styles.editButtonText}>
              {isEditing ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Profile Details */}
        <Text style={[styles.label , isDarkMode && {color : "royalblue"}]}>Name:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        ) : (
          <Text style={[styles.text, isDarkMode && {color : "#fff"}]}>{name}</Text>
        )}
        <View style={styles.line}></View>
        <Text style={[styles.label , isDarkMode && {color : "royalblue"}]}>Email:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
          />
        ) : (
          <Text style={[styles.text, isDarkMode && {color : "#fff"}]}>{email}</Text>
        )}
        <View style={styles.line}></View>

        <Text style={[styles.label , isDarkMode && {color : "royalblue"}]}>Phone:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
          />
        ) : (
          <Text style={[styles.text, isDarkMode && {color : "#fff"}]}>{phone}</Text>
        )}
        <View style={styles.line}></View>

        <Text style={[styles.label , isDarkMode && {color : "royalblue"}]}>Gender:</Text>
        {isEditing ? (
          <Picker
            selectedValue={gender}
            style={styles.input}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        ) : (
          <Text style={[styles.text, isDarkMode && {color : "#fff"}]}>{gender}</Text>
        )}
        <View style={styles.line}></View>

        {/* Login Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                You need to log in to update your profile.
              </Text>
              <Pressable style={styles.modalButton} onPress={handleLogin}>
                <Text style={styles.modalButtonText}>Log In</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Modal>
      </View>

      {/* Simulate Login Button (for testing purposes) */}
      {!isLoggedIn && (
        <TouchableOpacity style={styles.loginButton} onPress={openLoginModal}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      )}
</LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#edf2f4", // Light theme for background
  },
  profileCard: {
    width: "90%",
    padding: 20,
    backgroundColor: "#ffffff",
    borderColor: "#4C8BF5", // Blue border color
    borderWidth: 2,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 12, // For Android shadow
    overflow: "hidden",
    position: "relative",
  },
  avatarContainer: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#edf6f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6, // Inner shadow effect
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderWidth: 2,
    borderColor : "royalblue",
  },
  avatarText: {
    fontSize: 14,
    color: "#555",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4C8BF5", // Blue theme
    marginBottom: 5,
  },
  input: {
    height: 45,
    backgroundColor: "#edf6f9",
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: "#333", // Dark text for better contrast
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#4C8BF5", // Blue theme
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  line: {
    width: "90%",
    height: 1,
    backgroundColor: "#d3d3d3",
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#4C8BF5",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#4C8BF5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
