// @ts-ignore

import React, { useState } from 'react';
import { Button, TextInput, View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";


function Login({ navigation }) {
  const [password, onChangePassword] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const infos = [email, password]
  const colors = useTheme().colors;

  return (
    <View style={{ backgroundColor: colors.card }}>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Main')}>
        <Text style={[styles.buttonText, { color: colors.text }]}>Go back</Text>
      </Pressable>
      <View style={styles.div}>
        <View style={[styles.fieldset, { borderColor: colors.text }]}>
        <Text style={[styles.legend, { backgroundColor: colors.card }, { color: colors.text }]}>Log in</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.text }]}
            placeholder="email"
            onChangeText={onChangeEmail}
            value={email}
            keyboardType='email-address'
            enterKeyHint='next'
          />

          <TextInput
            style={[styles.input, { borderColor: colors.text }]}
            placeholder="password"
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
            enterKeyHint='done'
          />

          <Pressable style={styles.button} onPress={() => Connexion(infos, navigation)} ><Text style={[styles.buttonText, { color: colors.text }]}>Log in</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

async function Connexion(infos, navigation) {
  const data = {
    "email": infos[0],
    "password": infos[1]
  }
  const req = await fetch('https://snapchat.epidoc.eu/user', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const res = await req.json();
  // Stockage id & token et redirection vers page d'acceuil
  RNSecureStorage.setItem("id", res.data._id, { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
  RNSecureStorage.setItem("token", res.data.token, { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
  RNSecureStorage.setItem("username", res.data.username, { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
  RNSecureStorage.setItem("profilePic", res.data.profilePicture, { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
  navigation.navigate('displayHome')
}

const styles = StyleSheet.create(
  {
    fieldset: {
      justifyContent: 'center',
      width: '80%',
      height: '50%',
      margin: 10,
      paddingHorizontal: 10,
      paddingBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      alignItems: 'center',
    },
    legend: {
      fontSize: 20,
      position: 'absolute',
      top: -15,
      left: 10,
      fontWeight: 'bold',
    },
    div: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center'
    },
    input: {
      width: '75%',
      height: 40,
      margin: 12,
      borderWidth: 1.5,
      padding: 10,
      borderRadius: 20,
      marginVertical: 20
    },
    button: {
      borderRadius: 20,
      width: 'fit-content',
      paddingHorizontal: 15,
      margin: 5,
      backgroundColor: "#fffc00",
      alignItems: 'center',
      paddingVertical: 10,
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 15,
    },
  })

export default Login;
