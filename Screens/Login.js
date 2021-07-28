import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
var isaac = require('isaac');


const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"

const facebookID = "948649482370973"


var bcrypt = require('bcryptjs');
bcrypt.setRandomFallback((len) => {
    const buf = new Uint8Array(len);
    return buf.map(() => Math.floor(isaac.random() * 256));
});


export default function Login({ navigation }) {
    const [Username, onChangeUsername] = useState()
    const [Pass, onChangePass] = useState();

    useEffect(() => {
        (async () => {
            // await getData();
        })()
    }, [])

    const getData = async () => {
        const data = await AsyncStorage.getItem('loggedUser')
        if (data !== undefined) {
            let user = JSON.parse(data)
            await updateLoggedUser(user.Username);
        }
        else {
            return;
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
            // if (data.User_img.indexOf("?asid") == -1)
            //     data.User_img = `${data.User_img}?t=${Date.now()}`;
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
            console.log('====================================');
            console.log(data);
            console.log('====================================');
            if (data.Id_external == 0) {
                let res = await addNewExternalUser(id, username, email, img)
                console.log('====================================');
                console.log("check res " + res);
                console.log('====================================');
                // try {
                //     var salt = bcrypt.genSaltSync(10);
                //     var hash = bcrypt.hashSync(id, salt);
                //     let result = await fetch(url + "api/add/user", {
                //         method: 'POST',
                //         headers: {
                //             'Content-Type': 'application/json; charset=UTF-8',
                //             'Accept': 'application/json'
                //         },
                //         body: JSON.stringify({
                //             Username: username,
                //             Email: email,
                //             Hash: hash,
                //             Salt: salt,
                //             User_img: img,
                //             Id_external: id
                //         })
                //     });
                //     let data = await result.json();
                //     console.log('====================================');
                //     console.log("after register first time " + data);
                //     console.log('====================================');
                //     let user = await updateLoggedUser(username);
                //     navigation.navigate("TabStack", { user: user });
                // } catch (error) {
                //     console.error(error)
                // }
            }
            else {
                if (data.Id_external == id) {
                    await updateLoggedUser(username);
                }
                else {
                    // TODO: Modal to change username
                    //ChangeUserName(id, username, email, img)
                }
            }
        } catch (error) {

        }
    }

    const addNewExternalUser = async (id, username, email, img) => {
        try {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(id, salt);
            let result = await fetch(url + "api/add/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Username: username,
                    Email: email,
                    Hash: hash,
                    Salt: salt,
                    User_img: img,
                    Id_external: id
                })
            });
            let data = await result.json();
            console.log('====================================');
            console.log("after register first time " + data);
            console.log('====================================');
            updateLoggedUser(username);
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
                appId: facebookID,
            });
            const { type, token } = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
                let res = await response.json();
                await RegistrationUser(res.id, res.name, res.email, res.picture.data.url)
            }
        } catch (message) {
            Alert.alert(`Facebook Login Error: ${message}`);
        }
    }


    const LoginNormal = async (Username, Pass) => {
        try {
            if (Username == null || Username == "" || Pass == null || Pass == "") {
                alert("Please fill in all details !")
                return
            }
            else {
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
            <View>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeUsername}
                    value={Username}
                    placeholder="Username"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePass}
                    value={Pass}
                    secureTextEntry={true}
                    placeholder="Password"
                />
                <TouchableOpacity onPress={() => LoginNormal(Username, Pass)}>
                    <View style={styles.button}>
                        <Text style={styles.textBtn}>Login</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.text}>Don't have an account yet ?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                    <View style={styles.button}>
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
        width: 200,
        borderWidth: 1,
        borderRadius: 8,
        fontWeight: "bold",
        textAlign: 'center',
        justifyContent: 'center',
        margin: 15
    },
    button: {
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
        color: "red",
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
    }
});

