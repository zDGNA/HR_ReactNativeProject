import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from './types/NavigationTypes';
import Ionicons from "@react-native-vector-icons/ionicons";

import HomeScreen from "./screens/HomeScreen";
import ContactScreen from "./screens/ContactScreen";
import LoginScreen from "./screens/LoginScreen";
import AboutScreen from "./screens/AboutScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator();


// --- Bagian Tab (Main screen setelah login)
const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "blue",
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Contact"
                component={ContactScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="call-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="About"
                component={AboutScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="people-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};


// --- Stack utama (Login → MainTab)
const RootStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainTab} />
        </Stack.Navigator>
    );
};


// --- Entry point utama aplikasi
const App = () => {
    return (
        <NavigationContainer>
            <RootStack />
        </NavigationContainer>
    );
};

export default App;
