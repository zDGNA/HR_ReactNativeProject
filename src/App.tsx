import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from './types/NavigationTypes';
import { UserProvider } from './context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from "./screens/HomeScreen";
import ContactScreen from "./screens/ContactScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DivisionScreen from "./screens/DivisionScreen";
import EmployeeScreen from "./screens/EmployeeScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

type HomeStackParamList = {
    Home: undefined;
    Division: undefined;
    Employee: { id?: string } | undefined;
};

type RootStackParamList = {
    Login: undefined;
    Main: undefined;
};

const HomeStackNav = createNativeStackNavigator<HomeStackParamList>();
const RootStackNav = createNativeStackNavigator<RootStackParamList>();

const HomeStack = () => {
    return (
        <HomeStackNav.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStackNav.Screen name="Home" component={HomeScreen as unknown as React.ComponentType<any>} />
            <HomeStackNav.Screen
                name="Division"
                component={DivisionScreen as unknown as React.ComponentType<any>}
            />
            <HomeStackNav.Screen
                name="Employee"
                component={EmployeeScreen as unknown as React.ComponentType<any>}
            />
        </HomeStackNav.Navigator>
    );
};

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
                component={HomeStack as unknown as React.ComponentType<any>}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Contact"
                component={ContactScreen as unknown as React.ComponentType<any>}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="call-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name={"Profile" as keyof MainTabParamList}
                component={ProfileScreen as unknown as React.ComponentType<any>}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="people-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const RootStack = () => {
    return (
        <RootStackNav.Navigator screenOptions={{ headerShown: false }}>
            <RootStackNav.Screen name="Login" component={LoginScreen as unknown as React.ComponentType<any>} />
            <RootStackNav.Screen name="Main" component={MainTab as unknown as React.ComponentType<any>} />
        </RootStackNav.Navigator>
    );
};

const App = () => {
    return (
        <UserProvider>
            <NavigationContainer>
                <RootStack />
            </NavigationContainer>
        </UserProvider>
    );
};

export default App;