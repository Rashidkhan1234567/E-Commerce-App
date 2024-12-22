import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator"; 
import DrawerNavigator from "./DrawerNavigator"; 

const Stack = createStackNavigator();

const linking = {
  prefixes: ["http://localhost:8081/"],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: "HomeScreen",  
          Cart: "CartScreen",
          Profile: "ProfileScreen",
          Settings: "SettingsScreen",
        },
      },
      Drawer: {
        screens: {
          SignUp : "SignUpScreen",
          SignIn: "SignInScreen",
        },
      },
    },
  },
};
  

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tab Navigation */}
        <Stack.Screen name="Tabs" component={TabNavigator} />

        {/* Drawer Navigation */}
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
