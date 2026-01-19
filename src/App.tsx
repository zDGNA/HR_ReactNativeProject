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
    Division: { selectedDept?: any } | undefined;
    Employee: {
        divisionId: string;
        divisionName: string;
        divisionIcon: string;
        divisionColor: string;
        employeeCount: number;
    };
};

type RootStackParamList = {
    LoginScreen: undefined;
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
            <HomeStackNav.Screen name="Home" component={HomeScreen as any} />
            <HomeStackNav.Screen
                name="Division"
                component={DivisionScreen as any}
            />
            <HomeStackNav.Screen
                name="Employee"
                component={EmployeeScreen as any}
            />
        </HomeStackNav.Navigator>
    );
};

const MainTab = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#1d04d9ff",
                tabBarInactiveTintColor: "#94a3b8",
                tabBarStyle: {
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 60,
                    borderTopWidth: 1,
                    borderTopColor: '#e2e8f0',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack as any}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Contact"
                component={ContactScreen as any}
                options={{
                    tabBarLabel: 'Contact',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="call-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen as any}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const RootStack = () => {
    return (
        <RootStackNav.Navigator screenOptions={{ headerShown: false }}>
            <RootStackNav.Screen
                name="LoginScreen"
                component={LoginScreen as any}
            />
            <RootStackNav.Screen
                name="Main"
                component={MainTab as any}
            />
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