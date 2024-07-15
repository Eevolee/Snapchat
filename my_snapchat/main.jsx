import React from 'react';
import { StyleSheet, Text, View, Pressable, Alert, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';

function Main({ navigation }) {
    const colors = useTheme().colors;

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <Image
                style={styles.logo}
                source={require('./assets/logo.png')}
            />
            <Text style={[styles.titleText, { color: colors.text }]}>My Snapchat</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Log in</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Sign up</Text>
            </Pressable>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 150,
        width: 150,
        display: 'flex',
        alignSelf: 'center'
    },
    titleText: {
        marginVertical: 20,
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        opacity: 1,
        borderRadius: 20,
        width: '75%',
        margin: 5,
        backgroundColor: '#FFFC00',
        alignItems: 'center',
        paddingVertical: 15,
    },
    buttonText: {
        fontWeight: 'bold',
        color: "black",
        fontSize: 20,
    },
});

export default Main;