import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainTabParamList } from '../types/NavigationTypes';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type AboutScreenProps = BottomTabScreenProps<MainTabParamList, 'HomeScreen'>;

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation, route }) => {

    return (
        <View style={styles.container}>
            <Text>Ini adalah HomeScreen di dalam Tab Navigator.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default AboutScreen;