import { Text } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackNavigationProp } from '../types/NavigationTypes';

const LoginScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logo}></View>
            </View>
            <View style={styles.body}>
                <View style={styles.form}>
                    <TextInput style={styles.formControl} placeholder='Username' />
                    <TextInput style={styles.formControl} placeholder='Password' secureTextEntry={true} />
                    <Pressable style=
                        {styles.button}
                        onPress={() =>
                            navigation.navigate('Main')}
                    >
                        <Text style={styles.label}>SIGN IN</Text>
                    </Pressable>
                    <Pressable style={{
                        ...styles.button,
                        backgroundColor: '#fda642ff',
                        borderColor: '#fb5607'
                    }}>
                        <Text style={{ ...styles.label, color: '#000000' }}>SIGN UP</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.footer}>
                <Text style={styles.textSecondary}>
                    Agung Dagna
                </Text>
                <Text style={styles.textSecondary}>
                    &copy; 2025
                </Text>
            </View>
        </SafeAreaView>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 140,
        height: 140,
        backgroundColor: 'blue',
        borderRadius: 140,
    },
    h1: {
        fontSize: 22,
        marginBottom: 15,
        fontWeight: "bold",
        color: "#333",
        textAlign: 'center',
    },
    body: {
        height: 400,
    },
    form: {
        flex: 1,
        padding: 30,
        rowGap: 20,
    },
    formControl: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#adb5bd',
        paddingHorizontal: 15,
        paddingVertical: 20,


    },
    button: {
        backgroundColor: '#05059cff',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#00000',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',

    },
    label: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16
    },
    footer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textSecondary: {
        fontWeight: 'bold',
        color: '#000000'
    },
});
export default LoginScreen;     