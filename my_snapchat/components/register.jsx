import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, Text, View, Pressable, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

async function Insertion(infos, navigation) {
  const data = {
    "email": infos[1],
    "username": infos[0],
    "password": infos[2]
  }
  const req = await fetch('https://snapchat.epidoc.eu/user', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const res = await req.json();

  if (req.status == 200) {
    Alert.alert("Registered successfully!");
    //Connection automatique après une inscription réussie V
    const data = {
      "email": infos[1],
      "password": infos[2]
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
  } else {
    Alert.alert(res.data);
  }
}



const Register = ({ navigation }) => {
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const infos = [username, email, password];
  const colors = useTheme().colors;

  return (
    <SafeAreaView style={{ backgroundColor: colors.card }}>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Main')}>
        <Text style={[styles.buttonText, { color: colors.text }]}>Go back</Text>
      </Pressable>
      <View style={styles.div}>
        <View style={[styles.fieldset, { borderColor: colors.text }]}>
          <Text style={[styles.legend, { backgroundColor: colors.card }, { color: colors.text }]}>Sign up</Text>
          <Text style={[styles.label, { color: colors.text }]}>
            Username :
          </Text>
          <TextInput
            style={[styles.input, { borderColor: colors.text }]}
            onChangeText={onChangeUsername}
            value={username}
            enterKeyHint='next'
          />
          <Text style={[styles.label, { color: colors.text }]}>
            Email :
          </Text>
          <TextInput
            style={[styles.input, { borderColor: colors.text }]}
            onChangeText={onChangeEmail}
            value={email}
            keyboardType='email-address'
            enterKeyHint='next'
          />
          <Text style={[styles.label, { color: colors.text }]}>
            Password :
          </Text >
          <TextInput
            style={[styles.input, { borderColor: colors.text }]}
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={true}
            enterKeyHint='done'
          />
          <Pressable style={styles.button} onPress={() => Insertion(infos, navigation)}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Register</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
    label: {
      fontSize: 15
    },
    input: {
      width: '75%',
      height: 40,
      margin: 12,
      borderWidth: 1.5,
      padding: 10,
      borderRadius: 20
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
  });

export default Register;