import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Text, View, Pressable, Alert, Image, Modal, ScrollView, BackHandler } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';

async function getUsername() {
    return (await RNSecureStorage.getItem("username"))
}
async function getProfilePic() {
    return (await RNSecureStorage.getItem("profilePic"))
}

async function changeInfo(element, value) {
    const token = await RNSecureStorage.getItem("token");
    const data = {
        [element]: value
    }
    const req = await fetch('https://snapchat.epidoc.eu/user', {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    const res = await req.json();
    if (req.status == 200) {
        Alert.alert(`Changed ${element}`)
    } else {
        Alert.alert(res.data);
    }
}

async function searchUser(username) {
    const results = [];
    const token = await RNSecureStorage.getItem("token");
    const req = await fetch('https://snapchat.epidoc.eu/user', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    const res = await req.json();

    res.data.forEach((user) => {
        if (username === '' || user.username === username.username) {
            results.push(user);
        }
    })
    return (results)
}

async function addFriend(id) {
    const token = await RNSecureStorage.getItem("token");
    const data = {
        "friendId": id
    }
    const req = await fetch('https://snapchat.epidoc.eu/user/friends', {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    const res = await req.json();

    if (req.status == 200) {
        Alert.alert("Friend added!")
    } else {
        Alert.alert(res.data);
    }
}

async function deleteFriend(id) {
    const token = await RNSecureStorage.getItem("token");
    const data = {
        "friendId": id
    }
    const req = await fetch('https://snapchat.epidoc.eu/user/friends', {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    const res = await req.json();

    if (req.status == 200) {
        Alert.alert("Removed friend")
    } else {
        Alert.alert(res.data);
    }
}

async function searchFriends() {
    const friends = [];
    const token = await RNSecureStorage.getItem("token");
    const req = await fetch('https://snapchat.epidoc.eu/user/friends', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    res = await req.json();
    res.data.forEach((friend) => {
        friends.push(friend);
    })
    return (friends);
}

function disconnect(navigation) {
    RNSecureStorage.clear();
    navigation.navigate('Main');
}

function DisplayHome({ navigation }) {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    const colors = useTheme().colors;
    const dark = useTheme().dark;
    const [username, onChangeUsername] = React.useState('');
    const [settingsmodalVisible, setsettingsModalVisible] = React.useState(false);
    const [loggedUsername, onChangeLoggedUsername] = React.useState('');
    const [loggedPic, onChangeLoggedPic] = React.useState(require('../assets/logo.png'))
    const [usersFound, onChangeUsersFound] = React.useState([]);
    const [searchmodalVisible, setsearchModalVisible] = React.useState(false);
    const [friendsmodalVisible, setfriendsModalVisible] = React.useState(false);
    const [loggedFriends, onChangeLoggedFriends] = React.useState([]);
    const [changeNameValue, onChangeNameValue] = React.useState('');
    const [changeMailValue, onChangeMailValue] = React.useState('');
    const [changePassValue, onChangePassValue] = React.useState('');

    (async () => {
        onChangeLoggedUsername(await getUsername());
    })();
    (async () => {
        if (await getProfilePic()) {
            onChangeLoggedPic(await getProfilePic());
        }
    })();

    return (
        <SafeAreaView style={[styles.container
            , { backgroundColor: colors.card }]}>
            <View style={[styles.searchbar
                , { borderColor: colors.text }]}>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholderTextColor={colors.text}
                    placeholder='Search users'
                    onChangeText={onChangeUsername}
                    value={username}
                    enterKeyHint='search'
                    onSubmitEditing={async (event) => { onChangeUsersFound(await searchUser({ username })); onChangeUsername(''); setsearchModalVisible(true) }}
                />
                {dark ? <Image
                    style={[styles.glass, { tintColor: colors.text }]}
                    source={require('../assets/glass.png')}
                /> : <Image
                    style={[styles.glass]}
                    source={require('../assets/glass.png')}
                />}
            </View>
            <View style={styles.user}>
                <Image
                    style={[styles.profilePic, { borderColor: colors.text }]}
                    source={loggedPic}
                ></Image>
                <Text style={[styles.profileName, { color: colors.text }]}>{loggedUsername}<Pressable style={[styles.cogwheelBtn]} onPress={() => setsettingsModalVisible(true)}>{dark ? <Image
                    style={[styles.cogwheel, { tintColor: colors.text }]}
                    source={require('../assets/cogwheel.png')}
                /> : <Image
                    style={[styles.cogwheel]}
                    source={require('../assets/cogwheel.png')}
                />}</Pressable></Text>


                <Pressable style={styles.profileFriends}
                    onPress={async () => { onChangeLoggedFriends(await searchFriends()); setfriendsModalVisible(true) }}
                >
                    <Text style={[{ color: colors.text }, { textDecorationLine: 'underline' }]}>Friends: {loggedFriends.length}</Text>
                </Pressable>
            </View>
            <View style={styles.bottomBtnContainer}>
                <Pressable style={[styles.bottomBtn, { borderColor: colors.text }]} onPress={() => setsettingsModalVisible(true)}><Image
                    style={[styles.chatIcon]}
                    source={require('../assets/chat.png')}
                /></Pressable>
                <Pressable style={[styles.bottomBtn, { borderColor: colors.text }]} onPress={() => navigation.navigate('CameraView')}><Image
                    style={[styles.cameraIcon]}
                    source={require('../assets/camera.png')}
                /></Pressable>
            </View>

            <View style={styles.modalContainer}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={settingsmodalVisible}
                    onRequestClose={() => {
                        setsettingsModalVisible(!settingsmodalVisible);
                    }}>
                    <View style={[styles.modalView, { borderColor: colors.text }, { backgroundColor: colors.card }]}>
                        <Pressable
                            style={[styles.closeModal]}
                            onPress={() => setsettingsModalVisible(!settingsmodalVisible)}>
                            <Text style={[styles.textModal, { color: colors.text }]}>X</Text>
                        </Pressable>

                        <View style={[styles.setting, { borderColor: colors.text }]}>
                            <Text style={[styles.textModal, { color: colors.text }]}>Update profile pic</Text>
                        </View>

                        <View style={[styles.setting, { borderColor: colors.text }]}>
                            <Text style={[styles.textModal, { color: colors.text }]}>Update username</Text>
                            <View style={[styles.searchbar, {width: '100%'}]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={changeNameValue}
                                    onChangeText={onChangeNameValue}
                                    onSubmitEditing={() => { changeInfo('username', changeNameValue); onChangeNameValue('') }}
                                >
                                </TextInput>
                            </View>
                        </View>

                        <View style={[styles.setting, { borderColor: colors.text }]}>
                            <Text style={[styles.textModal, { color: colors.text }]}>Update email</Text>
                            <View style={[styles.searchbar, {width: '100%'}]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={changeMailValue}
                                    onChangeText={onChangeMailValue}
                                    onSubmitEditing={() => { changeInfo('email', changeMailValue); onChangeMailValue('') }}
                                >
                                </TextInput>
                            </View>
                        </View>
                        <View style={[styles.setting, { borderColor: colors.text }]}>
                            <Text style={[styles.textModal, { color: colors.text }]}>Update password</Text>
                            <View style={[styles.searchbar, {width: '100%'}]}>
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    value={changePassValue}
                                    onChangeText={onChangePassValue}
                                    onSubmitEditing={() => { changeInfo('password', changePassValue); onChangePassValue('') }}
                                >
                                </TextInput>
                            </View>
                        </View>

                        <Pressable style={[styles.setting, { borderColor: colors.text }]} onPress={() => disconnect(navigation)}>
                            <Text style={[styles.textModal, { color: colors.text }]}>Log out</Text>
                        </Pressable>

                    </View>
                </Modal>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={searchmodalVisible}
                    onRequestClose={() => {
                        setsearchModalVisible(!searchmodalVisible);
                    }}>
                    <ScrollView style={[styles.modalScrollView, { borderColor: colors.text }, { backgroundColor: colors.card }]}>
                        <Pressable
                            style={[styles.closeModal]}
                            onPress={() => setsearchModalVisible(!searchmodalVisible)}>
                            <Text style={[styles.textModal, { color: colors.text }]}>X</Text>
                        </Pressable>

                        {usersFound.map((user) => {

                            return (
                                <View key={user._id} style={styles.userContainer}>
                                    <Text style={[styles.textModal, { color: colors.text }]}>{user.username}</Text>
                                    <Pressable style={styles.addBtn}><Text style={{ color: colors.text }} onPress={() => addFriend(user._id)}>Add</Text></Pressable>
                                </View>
                            )
                        })}

                    </ScrollView>
                </Modal>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={friendsmodalVisible}
                    onRequestClose={() => {
                        setfriendsModalVisible(!friendsmodalVisible);
                    }}>
                    <ScrollView style={[styles.modalScrollView, { borderColor: colors.text }, { backgroundColor: colors.card }]}>
                        <Pressable
                            style={[styles.closeModal]}
                            onPress={() => setfriendsModalVisible(!friendsmodalVisible)}>
                            <Text style={[styles.textModal, { color: colors.text }]}>X</Text>
                        </Pressable>

                        {loggedFriends.map((user) => {

                            return (
                                <View key={user._id + 1} style={styles.userContainer}>
                                    <Text style={[styles.textModal, { color: colors.text }]}>{user.username}</Text>
                                    <Pressable style={styles.addBtn}><Text style={{ color: colors.text }} onPress={() => deleteFriend(user._id)}>X</Text></Pressable>
                                </View>
                            )
                        })}

                    </ScrollView>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            width: '100%',
            height: '100%',
        },
        searchbar: {
            alignSelf: 'center',
            width: '75%',
            height: 40,
            margin: 12,
            borderWidth: 1.5,
            borderRadius: 20,
            justifySelf: 'center',
        },
        input: {
            width: '80%',
            height: '100%',
            right: '-10%',
        },

        glass: {
            top: '-80%',
            left: '2%',
            width: 20,
            height: 20,
        },
        user: {
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: "15%"
        },
        cogwheelBtn: {
        },
        cogwheel: {
            bottom: -6,
            width: 30,
            height: 30,
        },
        profilePic: {
            borderWidth: 2,
            borderRadius: 100,
            width: 150,
            height: 150
        },
        profileName: {
            alignSelf: 'center',
            fontSize: 25,
        },
        profileFriends: {
            alignSelf: 'center',
        },
        modalContainer: {
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalView: {
            height: '50%',
            width: '60%',
            margin: 'auto',
            border: 1,
            padding: 15,
            alignItems: 'center',
            justifySelf: 'center',
            alignSelf: 'center'
        },
        modalScrollView: {
            height: '40%',
            width: '60%',
            margin: 'auto',
            border: 1,
            borderRadius: 20,
            padding: 15,
            // alignItems: 'center',
            justifySelf: 'center',
            alignSelf: 'center'
        },
        userContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            justifyContent: 'space-between',
            padding: 15
        },
        closeModal: {
            left: "50%",
        },
        setting: {
            borderWidth: 1.5,
            width: '115%',
            height: '24%',
            justifyContent: 'center',
            padding: 5
        },
        textModal: {
            fontSize: 20,
        },

        bottomBtnContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '110%',
            height: '100%',
            bottom: '-93%',
            left: '-2%',
            // backgroundColor: 'red'
        },
        bottomBtn: {
            backgroundColor: '#fffc00',
            width: 100,
            height: 100,
            borderWidth: 1.5,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center'
        },
        addBtn: {
            backgroundColor: '#fffc00',
            borderRadius: 10,
            padding: 5
        },
        chatIcon: {
            width: 50,
            height: 50,

        },
        cameraIcon: {
            width: 50,
            height: 50,

        }
    });

export default DisplayHome;