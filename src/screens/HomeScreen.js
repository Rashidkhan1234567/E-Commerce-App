import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function AnimatedSearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [widthAnim] = useState(new Animated.Value(300));
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const animatedValues = useRef([]).current;
  const navigation = useNavigation();
  const { addToCart , getCartCount } = useContext(CartContext);
  const { theme, toggleTheme } = useTheme(); 
  const isDarkMode = theme === "dark";
AsyncStorage.clear()
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  async function fetchData() {
    try {
      const data = await axios.get("https://fakestoreapi.com/products");
      setProducts(data.data);
      setFilteredProducts(data.data);
      initAnimations(data.data.length);
      startAnimations(data.data.length);
      const uniqueCategories = [
        "All",
        ...new Set(data.data.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const initAnimations = (count) => {
    for (let i = 0; i < count; i++) {
      animatedValues[i] = new Animated.Value(i % 2 === 0 ? -300 : 300);
    }
  };

  const startAnimations = (count) => {
    for (let i = 0; i < count; i++) {
      Animated.timing(animatedValues[i], {
        toValue: 0,
        duration: 800,
        delay: i * 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(widthAnim, {
      toValue: 350,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(widthAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const addToCart2 = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
    addToCart(product);
  };

  const handleCategorySelect = (category) => {
    if (category === "All") {
      setSelectedCategory(null);
      setFilteredProducts(products);
    } else {
      setSelectedCategory(category);
      setFilteredProducts(
        products.filter((product) => product.category === category)
      );
    }
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={[
        styles.card,
        { transform: [{ translateX: animatedValues[index] || 0 }] },
         isDarkMode && { backgroundColor: "gray" }
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, isDarkMode && {color : "#444"}]} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.priceRatingContainer}>
          <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, i) => (
              <FontAwesome
                key={i}
                name={i < Math.round(item.rating.rate) ? "star" : "star-o"}
                size={16}
                color="#FFD700"
                style={styles.starIcon}
              />
            ))}
            <Text style={[styles.ratingText, isDarkMode && {color : "#444"}]}>({item.rating.count})</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart2(item)}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
          <Ionicons
            name="cart-outline"
            size={20}
            color="#fff"
            style={styles.cartIcon}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
      colors={isDarkMode ? ["#121212", "#1E1E1E", "#333"] : ["#4C8BF5", "#fff9", "#fff"]}
      style={styles.container}
    >

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View style={[styles.searchContainer, { width: widthAnim }, isDarkMode && { backgroundColor: "gray" }]}>
          <Ionicons name="search" size={24} color="#fff" style={styles.icon} />
          <TextInput
            placeholder="Search Products..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={[styles.input, isDarkMode && { backgroundColor: "gray" }]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate("Cart")}
          >
            <Ionicons name="cart" size={24} color="#fff" />
            {getCartCount() > 0 && (
          <View style={styles.cartCounter}>
            <Text style={styles.cartCounterText}>{getCartCount()}</Text>
          </View>
        )}
          </TouchableOpacity>
        </Animated.View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1D73E8" />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
     </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    paddingTop: 30,
  },
  searchContainer: {
    height: 55,
    borderRadius: 30,
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: 25,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    height: 40,
    paddingVertical: 0,
  },
  cartButton: {
    position: "relative",
    marginLeft: 12,
  },
  cartCounter: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartCounterText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 15,
  },
  categoryButton: {
    marginRight: 10,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#E4E6EB",
  },
  selectedCategoryButton: {
    backgroundColor: "#4A90E2",
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
  cardDescription: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
  },
  priceRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 14,
    color: "#fff",
    marginRight: 10,
  },
  cartIcon: {
    marginTop: 3,
  },
});

