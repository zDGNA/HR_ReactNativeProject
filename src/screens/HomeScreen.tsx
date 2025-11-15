import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { MainTabParamList } from '../types/NavigationTypes';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from "react-native-safe-area-context";
import BrandComponents from "../components/BrandComponents";
import NavigationItemComponents from "../components/NavigationItemComponents";

type HomeScreenProps = BottomTabScreenProps<MainTabParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <BrandComponents />
                </View>

                {/* Navigation Section */}
                {/* Memanggil komponen item navigasi tunggal empat kali */}
                <View style={styles.navigation}>
                    <NavigationItemComponents title="Home" icon="home-outline" />
                    <NavigationItemComponents title="Cart" icon="cart-outline" />
                    <NavigationItemComponents title="Favorite" icon="heart-outline" />
                    <NavigationItemComponents title="Profile" icon="person-outline" />
                </View>

                {/* Order Section */}
                <View style={styles.order}>
                    <Text style={styles.h1}>Order</Text>
                    <ScrollView
                        contentContainerStyle={{ flexDirection: "row", gap: 20 }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={styles.orderItem}>
                            <View style={styles.orderItemImage}></View>
                            <View style={styles.orderItemDescription}></View>
                        </View>
                        <View style={styles.orderItem}>
                            <View style={styles.orderItemImage}></View>
                            <View style={styles.orderItemDescription}></View>
                        </View>
                    </ScrollView>
                </View>

                {/* Favorite Section */}
                <View style={styles.favorite}>
                    <Text style={styles.h1}>Favorite</Text>
                    <View style={styles.bannerContainer}></View>
                </View>

                {/* Food Section */}
                <View style={styles.food}>
                    <Text style={styles.h1}>Food</Text>
                    <View>
                        <View style={styles.foodItem}>
                            <View style={styles.foodItemImage}></View>
                            <View style={styles.foodItemDescription}></View>
                        </View>
                        <View style={styles.foodItem}>
                            <View style={styles.foodItemImage}></View>
                            <View style={styles.foodItemDescription}></View>
                        </View>
                        <View style={styles.foodItem}>
                            <View style={styles.foodItemImage}></View>
                            <View style={styles.foodItemDescription}></View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    h1: {
        fontSize: 22,
        marginBottom: 15,
        fontWeight: "bold",
        color: "#333",
    },
    container: {
        backgroundColor: "#082374ff",
        flex: 1,
    },
    header: {
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#082374ff",
        height: 160,
    },
    navigation: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#f5f5f5",
        paddingVertical: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    order: {
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    orderItem: {
        flexDirection: "row",
        backgroundColor: "#B0B0B0",
        width: 280,
        height: 100,
        marginRight: 10,
    },
    orderItemImage: {
        backgroundColor: "#9E9E9E",
        width: 100,
        height: 100,
    },
    orderItemDescription: {
        backgroundColor: "#757575",
        flex: 1,
    },
    favorite: {
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    bannerContainer: {
        backgroundColor: "silver",
        height: 100,
        borderRadius: 20,
    },
    food: {
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    foodItem: {
        flexDirection: "row",
        backgroundColor: "#B0B0B0",
        width: 280,
        height: 100,
        marginBottom: 10,
    },
    foodItemImage: {
        backgroundColor: "#9E9E9E",
        width: 100,
        height: 100,
    },
    foodItemDescription: {
        backgroundColor: "#757575",
        flex: 1,
    },
});

export default HomeScreen;