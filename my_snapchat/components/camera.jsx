import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, Pressable, Alert, Image, Modal, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useCameraDevice, Camera, useCameraPermission, useCameraFormat } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';


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




// const requestReadPerm = async () => {
//     try {
//         const readGranted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
//         if (readGranted === PermissionsAndroid.RESULTS.GRANTED) {
//             console.log('Read granted');
//             return (true)
//         } else {
//             Alert.alert('You need to allow permission for that');
//         }
//     } catch (err) {
//         Alert.alert(err);
//     }
// };

// name: photo.fileName,
//     type: photo.type,
//     uri:
//       Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
// {uri: imagePath,name: 'photo.png',filename :'imageName.png',type: 'image/png'}
// { name: 'images_data', filename: item.filename, data: RNFetchBlob.wrap(item.uri) }

// async function sendPic(id, img, duration) {
//     const token = await RNSecureStorage.getItem("token");
//     const data = {
//         "to": id,
//         "image": img,
//          "duration": duration
//     }
//     const req = await fetch('https://snapchat.epidoc.eu/snap', {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data),
//     })
//     const res = await req.json();

//     if (req.status == 200) {
//         Alert.alert("Friend added!")
//     } else {
//         Alert.alert(res.data);
//     }
// }

const CameraView = ({ navigation }) => {
    const colors = useTheme().colors;
    const dark = useTheme().dark;
    const [side, flipSide] = React.useState('front');
    const device = useCameraDevice(side)
    const format = useCameraFormat(device, [
        { photoAspectRatio: 16 / 9 },
        { photoResolution: { width: 3048, height: 2160 } },
        { fps: 60 }
      ])
    const camera = useRef(null);
    const { hasPermission, requestPermission } = useCameraPermission();
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [friendsmodalVisible, setfriendsModalVisible] = React.useState(false);
    const [galleryModalVisible, setGalleryModalVisible] = React.useState(false);
    const [loggedFriends, onChangeLoggedFriends] = React.useState([]);
    const [photos, setPhotos] = useState([]);
    const [duration, onChangeDuration] = React.useState(10)

    if (!hasPermission) requestPermission();
    if (device == null) Alert.alert('No camera detected');

    function getGallery() {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
        })
            .then(r => {
                setPhotos(r.edges);
            })
            .catch((err) => {
                //Error Loading Images
            });
    }


    return (
        <View style={styles.container}>
            <Pressable style={styles.goBack} onPress={() => navigation.navigate('displayHome')}>
                {dark ? <Image
                    style={[styles.arrow, { tintColor: colors.text }]}
                    source={require('../assets/arrow.png')}
                /> : <Image
                    style={[styles.arrow]}
                    source={require('../assets/arrow.png')}
                />}
            </Pressable>
            <Camera
                ref={camera}
                style={[{ width: '100%' }, { height: '100%' }]}
                device={device}
                format={format}
                isActive={true}
                photo={true}
            />
            <Pressable style={styles.galleryBtn} onPress={() => { getGallery(); setGalleryModalVisible(true) }}
            >
                {dark ? <Image
                    style={[styles.flip, { tintColor: colors.text }]}
                    source={require('../assets/gallery.png')}
                /> : <Image
                    style={[styles.flip]}
                    source={require('../assets/gallery.png')}
                />}
            </Pressable>
            <Pressable style={styles.shutterBtn} onPress={async () => {
                const photo = await camera.current.takePhoto();
                if (photo) {
                    setCapturedPhoto(`file://${photo.path}`);
                    setPreviewModalVisible(!previewModalVisible);
                }

            }}>
                {dark ? <Image
                    style={[styles.shutter, { tintColor: colors.text }]}
                    source={require('../assets/shutter.png')}
                /> : <Image
                    style={[styles.shutter]}
                    source={require('../assets/shutter.png')}
                />}
            </Pressable>
            <Pressable style={styles.flipBtn} onPress={() => side === 'front' ? flipSide('back') : flipSide('front')}>
                {dark ? <Image
                    style={[styles.flip, { tintColor: colors.text }]}
                    source={require('../assets/flip.png')}
                /> : <Image
                    style={[styles.flip]}
                    source={require('../assets/flip.png')}
                />}
            </Pressable>


            <View style={styles.modalContainer}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={previewModalVisible}
                    onRequestClose={() => {
                        setPreviewModalVisible(!previewModalVisible);
                    }}>
                    <View style={[styles.modalView, { borderColor: colors.text }, { backgroundColor: colors.text }]}>
                        <Pressable
                            style={[styles.goBack]}
                            onPress={() => setPreviewModalVisible(!previewModalVisible)}>
                            {dark ? <Image
                                style={[styles.arrow, { tintColor: colors.text }]}
                                source={require('../assets/arrow.png')}
                            /> : <Image
                                style={[styles.arrow]}
                                source={require('../assets/arrow.png')}
                            />}
                        </Pressable>

                        <View style={styles.duration}>
                            {dark ? <Image
                                style={[styles.clock, { tintColor: colors.text }]}
                                source={require('../assets/clock.png')}
                            /> : <Image
                                style={[styles.clock]}
                                source={require('../assets/clock.png')}
                            />}
                            <Pressable style={[styles.durationBtn]}
                                onPress={() => { onChangeDuration(3); Alert.alert(`Duration set to: 3`) }}
                            >
                                {dark ? <Image
                                    style={[styles.clock, { tintColor: colors.text }]}
                                    source={require('../assets/3.png')}
                                /> : <Image
                                    style={[styles.clock]}
                                    source={require('../assets/3.png')}
                                />}
                            </Pressable>
                            <Pressable style={[styles.durationBtn]}
                                onPress={() => { onChangeDuration(5); Alert.alert(`Duration set to: 5`) }}
                            >
                                {dark ? <Image
                                    style={[styles.clock, { tintColor: colors.text }]}
                                    source={require('../assets/5.png')}
                                /> : <Image
                                    style={[styles.clock]}
                                    source={require('../assets/5.png')}
                                />}
                            </Pressable>
                            <Pressable style={[styles.durationBtn]}
                                onPress={() => { onChangeDuration(10); Alert.alert(`Duration set to: 10`) }}
                            >
                                {dark ? <Image
                                    style={[styles.clock2, { tintColor: colors.text }]}
                                    source={require('../assets/10.png')}
                                /> : <Image
                                    style={[styles.clock2]}
                                    source={require('../assets/10.png')}
                                />}
                            </Pressable>
                        </View>

                        <Image style={[{ height: '100%' }, { width: '100%' }]} source={{ uri: capturedPhoto }} />

                        <Pressable style={styles.saveBtn} onPress={
                            async () => {
                                await CameraRoll.save(capturedPhoto, {
                                    type: 'photo',
                                })

                            }
                        }>
                            {dark ? <Image
                                style={[styles.save, { tintColor: colors.text }]}
                                source={require('../assets/save.png')}
                            /> : <Image
                                style={[styles.save]}
                                source={require('../assets/save.png')}
                            />}
                        </Pressable>

                        <Pressable style={styles.sendBtn} onPress={async () => { onChangeLoggedFriends(await searchFriends()); setfriendsModalVisible(true) }}
                        >
                            {dark ? <Image
                                style={[styles.send, { tintColor: colors.text }]}
                                source={require('../assets/send.png')}
                            /> : <Image
                                style={[styles.send]}
                                source={require('../assets/send.png')}
                            />}
                        </Pressable>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={friendsmodalVisible}
                        onRequestClose={() => {
                            setfriendsModalVisible(!friendsmodalVisible);
                        }}>
                        <ScrollView style={[styles.modalScrollView, { borderColor: colors.text }, { backgroundColor: colors.card }]}>
                            <Pressable
                                style={[styles.closeSendModal]}
                                onPress={() => setfriendsModalVisible(!friendsmodalVisible)}>
                                <Text style={[styles.textModal, { color: colors.text }]}>X</Text>
                            </Pressable>

                            {loggedFriends.map((user) => {

                                return (
                                    <View key={user._id + 1} style={styles.userContainer}>
                                        <Text style={[styles.textModal, { color: colors.text }]}>{user.username}</Text>
                                        <Pressable style={styles.addBtn}><Text style={{ color: colors.text }} onPress={() => deleteFriend(user._id)}>Send</Text></Pressable>
                                    </View>
                                )
                            })}

                        </ScrollView>
                    </Modal>
                </Modal>


            </View>
            <View style={[styles.galleryModal, { backgroundColor: 'red' }]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={galleryModalVisible}
                    onRequestClose={() => {
                        setGalleryModalVisible(!galleryModalVisible);
                    }}>
                    <View style={[styles.galleryScrollContainer]}>
                        <Pressable style={styles.scrollerBack}
                            onPress={() => setGalleryModalVisible(!galleryModalVisible)}><Text style={[styles.textModal, { color: colors.text }]}>Back</Text></Pressable>
                        <ScrollView style={styles.galleryScrollView}
                            contentContainerStyle={styles.galleryScrollViewContent}
                            horizontal={true}>
                            {photos.map((p, i) => {
                                return (
                                    <Pressable
                                        onPress={() => {
                                            setCapturedPhoto(p.node.image.uri);
                                            setPreviewModalVisible(!previewModalVisible);
                                        }}
                                        key={i}
                                    >
                                        <Image
                                            style={styles.galleryImg}
                                            source={{ uri: p.node.image.uri }}
                                        /></Pressable>
                                );
                            })}
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            width: '100%',
            height: '100%',
            display: 'flex'
        },
        goBack: {
            position: 'absolute',
            zIndex: 1,
            transform: [{ rotate: '180deg' }],
            padding: 10
        },
        scrollerBack: {
            backgroundColor: '#fffc00',
            width: '100%',
            alignItems: 'center'
        },
        arrow: {
            width: 40,
            height: 40,
        },
        duration: {
            // position: 'absolute',
            alignSelf: 'flex-end',
            flex: 1,
            zIndex: 1,
            flexDirection: 'row'
        },
        galleryBtn: {
            zIndex: 1,
            flex: 1,
            flexDirection: 'column-reverse',
            alignSelf: 'flex-start',
        },
        clock: {
            width: 40,
            height: 40,
        },
        clock2: {
            width: 25,
            height: 25,
            top: '16%'
        },
        durationBtn: {
            width: 40,
            height: 40,
        },
        flipBtn: {
            zIndex: 1,
            flex: 1,
            flexDirection: 'column-reverse',
            alignSelf: 'flex-end',
        },
        flip: {
            width: 50,
            height: 50,
        },
        shutterBtn: {
            zIndex: 1,
            flex: 1,
            flexDirection: 'column-reverse',
            alignSelf: 'center',
        },
        shutter: {
            width: 80,
            height: 80,
        },
        modalContainer: {
            height: '100%',
            width: '100%',

            display: 'flex'
        },
        modalView: {
            height: '100%',
            width: '100%',
            margin: 'auto',
            padding: 5,
            justifySelf: 'center',
            alignSelf: 'center',
        },
        modalScrollView: {
            height: 'auto',
            width: '60%',
            margin: 'auto',
            border: 1,
            borderRadius: 20,
            padding: 15,
            // alignItems: 'center',
            justifySelf: 'center',
            alignSelf: 'center'
        },
        closeModal: {
            position: 'absolute',
            zIndex: 1,
            margin: 10
        },
        closeSendModal: {
            zIndex: 1,
            margin: 10
        },
        galleryScrollContainer: {
            top: '73%',
        },
        galleryScrollViewContent: {
            justifyContent: 'flex-start',
        },
        galleryModal: {
            height: '100%',
            width: '100%',
            zIndex: 1,
        },
        galleryImg: {
            width: 150,
            height: 200,
        },
        textModal: {
            fontSize: 20,
        },
        userContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            justifyContent: 'space-between',
            padding: 10
        },
        addBtn: {
            backgroundColor: '#fffc00',
            borderRadius: 10,
            padding: 5
        },
        saveBtn: {
            zIndex: 1,
            flex: 1,
            flexDirection: 'column-reverse',
            alignSelf: 'flex-start',
        },
        save: {
            width: 50,
            height: 50,
            margin: 15
        },
        sendBtn: {
            zIndex: 1,
            flex: 1,
            flexDirection: 'column-reverse',
            alignSelf: 'flex-end',
        },
        send: {
            width: 60,
            height: 60,
            margin: 15
        }
    })

export default CameraView;