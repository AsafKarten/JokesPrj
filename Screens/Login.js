import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import Header from '../Components/Header';
import * as Facebook from 'expo-facebook';
import * as GoogleSignIn from 'expo-google-sign-in';
import AsyncStorage from '@react-native-async-storage/async-storage';
var isaac = require('isaac');


const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"
const defaultImg = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"

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
            await getData();
        })()
    }, [])

    const getData = async () => {
        try {
            const data = await AsyncStorage.getItem('loggedUser')
            if (data != null) {
                return navigation.navigate("TabStack", { user: JSON.parse(data) })
            }
            //return navigation.navigate("Login");
        } catch (e) {
            console.error(e)
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
            if (data.Id_user != 0) {
                navigation.navigate("TabStack", { user: data });
            } else {
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
                        User_img: img
                    })
                });
                let data = await result.json();
                updateLoggedUser(username);
            }
        } catch (e) {
            console.error(e)
        }
    }

    const LogInWithFacebook = async () => {
        try {
            await Facebook.initializeAsync({
                appId: facebookID,
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
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
                let res = await response.json();
                RegistrationUser(res.id, res.name, res.email, res.picture.data.url)
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
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
                <TouchableOpacity onPress={() => LogInWithGoogle()} class>
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
