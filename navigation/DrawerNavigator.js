import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SignInScreen from "../src/screens/SignInScreen.js"; 
import SignUpScreen from "../src/screens/SignUpScreen.js"; 

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
      <Drawer.Navigator initialRouteName="Sign In">
        <Drawer.Screen name="Sign In" component={SignInScreen} options={{headerShown : false}}/>
        <Drawer.Screen name="Sign Up" component={SignUpScreen} options={{headerShown : false}}/>
      </Drawer.Navigator>
  );
}
