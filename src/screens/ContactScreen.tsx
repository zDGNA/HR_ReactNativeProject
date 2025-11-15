import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainTabParamList } from '../types/NavigationTypes';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type ContactScreenProps = BottomTabScreenProps<MainTabParamList, 'ContactScreen'>;

const ContactScreen: React.FC<ContactScreenProps> = ({ navigation, route }) => {

    return (
        <View style={styles.container}>
            <Text>Ini adalah Contact di dalam Tab Navigator.</Text>
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

export default ContactScreen;