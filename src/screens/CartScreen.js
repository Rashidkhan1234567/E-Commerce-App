// Import aur Context
import React, { useContext, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { CartContext } from "../contexts/CartContext";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

export default function CartScreen() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isOrderModalVisible, setOrderModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToOrder, setItemToOrder] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { theme} = useTheme(); 
  const isDarkMode = theme === "dark";

  // Count duplicates in cart
  const getItemCounts = () => {
    const counts = {};
    cartItems.forEach((item) => {
      counts[item.id] = (counts[item.id] || 0) + 1;
    });
    return counts;
  };

  const itemCounts = getItemCounts();
  const uniqueItems = Object.values(
    cartItems.reduce((acc, item) => {
      if (!acc[item.id]) acc[item.id] = item;
      return acc;
    }, {})
  );

  // Delete handlers
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    removeFromCart(itemToDelete.id);
    setDeleteModalVisible(false);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
  };

  // Order handlers
  const handleOrderClick = (item) => {
    setItemToOrder(item);
    setOrderModalVisible(true);
  };

  const confirmOrder = () => {
    setLoading(true);
    setOrderModalVisible(false);
    setTimeout(() => {
      setLoading(false);
      alert("Sorry, your order is out of stock!");
    }, 3000);
  };

  const cancelOrder = () => {
    setOrderModalVisible(false);
  };

  // Render cart item
  const renderItem = ({ item }) => (
    <View style={[styles.card , isDarkMode && {backgroundColor : "gray" , borderWidth:1,borderColor:"royalblue"}]}>
      {itemCounts[item.id] > 1 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCounts[item.id]}</Text>
        </View>
      )}
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={[styles.cardPrice, isDarkMode && {color : "royalblue"}]}>${item.price.toFixed(2)}</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.orderButton} onPress={() => handleOrderClick(item)}>
            <Text style={styles.buttonText}>Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteClick(item)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    
<LinearGradient
  colors={isDarkMode ? ["#121212", "#1E1E1E", "#333"] : ["#4C8BF5", "#d9e4f5"]}
  style={styles.container}
>
      {uniqueItems.length === 0 ? (
        <View style={styles.imgcen}>
        <Image source={require("../../assets/empty-removebg-preview.png")}/>
        <Text style={[styles.emptyCartText , isDarkMode && {color : "white"}]}>No items in the cart!</Text>
        </View>
      ) : (
        <FlatList
          data={uniqueItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}

      {/* Delete Modal */}
      <Modal isVisible={isDeleteModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Are you sure you want to delete this item?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={cancelDelete}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Order Modal */}
      <Modal isVisible={isOrderModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Are you sure you want to place the order?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={cancelOrder}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={confirmOrder}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Animation */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Processing your request...</Text>
        </View>
      )}
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:20,
    backgroundColor: "#f9f9f9",
    width:"100%"
  },
  emptyCartText: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    marginTop: 50,
  },
  imgcen:{
    width:"100%",
    height:"100%",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    flexDirection: "row",
    marginStart:20,
    marginEnd :20,
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  badge: {
    position: "absolute",
    top: -5,
    left: -5,
    backgroundColor: "#4A90E2",
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    width: 80, // Adjusted width
    height: 40, // Adjusted height
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  orderButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    width: 80, // Adjusted width
    height: 40, // Adjusted height
    justifyContent: "center", // Center the text vertically
    alignItems: "center", // Center the text horizontally
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  cardPrice: {
    fontSize: 14,
    color: "#4A90E2",
    marginVertical: 5,
  },
 
  orderButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalButton: {
    backgroundColor: "#4A90E2",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "#fff",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
});
