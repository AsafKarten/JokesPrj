import React, { useState, useEffect } from 'react';
import { Alert, Modal, View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import Loader from '../Components/Loader.js';
var isaac = require('isaac');

const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"

var bcrypt = require('bcryptjs');
bcrypt.setRandomFallback((len) => {
    const buf = new Uint8Array(len);
    return buf.map(() => Math.floor(isaac.random() * 256));
});

export default function Login({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [Username, onChangeUsername] = useState()
    const [badUsername, setBadUsername] = useState();
    const [exEmail, setExEmail] = useState();
    const [exId, setExId] = useState();
    const [exImg, setExImg] = useState();
    const [new_username, onChangeNewUsername] = useState()
    const [Pass, onChangePass] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            await getData();
        })()
    }, [])

    const getData = async () => {
        const data = await AsyncStorage.getItem('loggedUser')
        if (data !== undefined) {
            let user = JSON.parse(data)
            await updateLoggedUser(user.Username);
        }
        else {
            navigation.navigate("Login");
        }
    }


    const storeData = async (data) => {
        try {
            const loggedUser = JSON.stringify(data);
            await AsyncStorage.setItem('loggedUser', loggedUser)
        } catch (e) {
            console.error(e)
        }
    }

    const updateLoggedUser = async (username) => {
        try {
            await clearAsyncStorage()
            let result = await fetch(url + "api/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Username: username
                })
            });
            let data = await result.json();
            if (data.User_img.indexOf("?asid") == -1)
                data.User_img = `${data.User_img}?t=${Date.now()}`;
            storeData(data);
            navigation.navigate("TabStack", { user: data });
        } catch (e) {
            console.error(e);
        }
    }

    const RegistrationUser = async (id, username, email, img) => {
        try {
            let result = await fetch(url + "api/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Username: username
                })
            });
            let data = await result.json();
            if (data.Id_user == 0) {
                let res = await addNewExternalUser(id, username, email, img)
            }
            else {
                try {
                    let result = await fetch(url + "api/get/externalUser", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            Id_external: id
                        })
                    });
                    let user_data = await result.json();
                    if (user_data.Id_external == id) {
                        await updateLoggedUser(user_data.Username);
                    }
                    else {
                        setBadUsername(username);
                        setExEmail(email);
                        setExImg(img);
                        setExId(id)
                        setModalVisible(!modalVisible);
                    }
                } catch (error) {
                    console.error(error);
                }

            }
        } catch (error) {
            console.error(error);
        }
    }

    const HideModal = () => {
        addNewExternalUser(exId, new_username, exEmail, exImg)
        setModalVisible(!modalVisible);
        onChangeNewUsername('');
    }

    const addNewExternalUser = async (id, username, email, img) => {
        try {
            let id_external = id
            let username_external = username
            let email_external = email
            let img_external = img
            let new_salt = bcrypt.genSaltSync(10);
            let new_hash = bcrypt.hashSync(id, new_salt);
            let result = await fetch(url + "api/add/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Username: username_external,
                    Email: email_external,
                    Hash: new_hash,
                    Salt: new_salt,
                    User_img: img_external,
                    Id_external: id_external
                })
            });
            let data = await result.json();
            await updateLoggedUser(username_external);
        } catch (error) {
            console.error(error)
        }
    }


    const LogInWithGoogle = async () => {
        try {
            const config = {
                iosClientId: `134638348384-9nlcaf7dgmu0f5eiu02brqqqtgtmo440.apps.googleusercontent.com`,
                androidClientId: `134638348384-qbaq5p76aahk007c7jr7b638fbpgqb6n.apps.googleusercontent.com`,
                scopes: ['profile', 'email']
            };
            const { type, accessToken } = await Google.logInAsync(config);
            if (type === 'success') {
                let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                let res = await userInfoResponse.json();
                console.log(res);
                await RegistrationUser(res.id, res.name, res.email, res.picture)
            }
        } catch (message) {
            Alert.alert(`Google Login Error: ${message}`);
        }
    }

    const LogInWithFacebook = async () => {
        try {
            await Facebook.initializeAsync({
                appId: '948649482370973',
            });
            const {
                type,
                token,
                expirationDate,
                permissions,
                declinedPermissions,
            } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
                let res = await response.json();
                await RegistrationUser(res.id, res.name, res.email, res.picture.data.url)
            }
        } catch (message) {
            Alert.alert(`Facebook Login Error: ${message}`);
        }
    }

    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Done');
        } catch (error) {
            console.log(error);
        }
    }

    const LoginNormal = async (Username, Pass) => {
        try {
            if (Username == null || Username == "" || Pass == null || Pass == "") {
                alert("Please fill in all details !")
                return
            }
            else {
                await clearAsyncStorage();
                let result = await fetch(url + "api/user", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Username: Username,
                    })
                });
                let data = await result.json();
                setLoading(false);
                console.log('====================================');
                console.log(Pass);
                console.log('====================================');
                console.log(data.Hash);
                console.log('====================================');
                console.log('====================================');
                var correct = bcrypt.compareSync(Pass, data.Hash)
                if (!correct) {
                    Alert.alert("Wrong details,check your details");
                    return;
                }
                else {
                    if (data.User_img.indexOf("?asid") == -1)
                        data.User_img = `${data.User_img}?t=${Date.now()}`;
                    storeData(data);

                    navigation.navigate("TabStack", { user: data });

                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Loader loading={loading} />
            <Input
                style={styles.input}
                onChangeText={onChangeUsername}
                value={Username}
                placeholder="Username"
                autoFocus={true}
                leftIcon={<Icon name='user' size={24} color='black' />}
            />
            <Input
                style={styles.input}
                onChangeText={onChangePass}
                value={Pass}
                secureTextEntry={true}
                placeholder="Password"
                autoFocus={true}
                leftIcon={<Icon name='lock' size={24} color='black' />}
            />
            <TouchableOpacity onPress={() => LoginNormal(Username, Pass)}>
                <View style={styles.button_normal}>
                    <Text style={styles.textBtn}>Login</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.text}>Don't have an account yet ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <View style={styles.button_normal}>
                    <Text style={styles.textBtn}>Sign up!</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.line} />
            <Text style={styles.textOption} >Other login options</Text>
            <TouchableOpacity onPress={() => LogInWithFacebook()}>
                <View style={styles.buttonFB}>
                    <Text style={styles.textFB}>Facebook</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => LogInWithGoogle()} >
                <View style={styles.buttonGoogle}>
                    <Text style={styles.textGo}>Google</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>The username {badUsername} already exists, please choose another username</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChangeNewUsername}
                                value={new_username}
                                placeholder="new username"
                            />
                            <TouchableOpacity onPress={() => HideModal()}>
                                <View style={styles.button_normal}>
                                    <Text style={styles.textBtn}>Save</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: 100,
        fontWeight: "bold",
        textAlign: 'center',
        alignItems: 'center',
        margin: 10
    },
    button_normal: {
        alignItems: 'center',
        margin: 15,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "orange"
    },
    textBtn: {
        color: "white",
        fontWeight: "bold",
    },
    text: {
        color: "brown",
        fontWeight: "bold",
        alignItems: 'center',
        textAlign: 'center',
    },
    buttonFB: {
        alignItems: 'center',
        margin: 15,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#3b5998"
    },
    textFB: {
        color: "white",
        fontWeight: "bold",
    },
    buttonGoogle: {
        alignItems: 'center',
        margin: 15,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "red"
    },
    textGo: {
        color: "white",
        fontWeight: "bold",
    },
    line: {
        margin: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        textAlign: 'center',
        alignItems: 'center',
    },
    textOption: {
        margin: 5,
        color: "brown",
        fontWeight: "bold",
        alignItems: 'center',
        textAlign: 'center',
    },
    //Modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

