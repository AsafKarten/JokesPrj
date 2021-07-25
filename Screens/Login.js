import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import Header from '../Components/Header';
import * as Facebook from 'expo-facebook';
import * as GoogleSignIn from 'expo-google-sign-in';
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

    const imageUpload = async (user) => {
        try {
            let imgUri = user.User_img
            let picName = user.Username
            let userId = user.Id_user
            let res = await fetch(url + "api/uploadpicture", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    uri: imgUri,
                    name: picName,
                    folder: userId,
                    type: 'jpg',
                })
            });
            let result = await res.json();
            console.log('====================================');
            console.log("image upload 4 " + result);
            console.log('====================================');
            let data = updateLoggedUser(userId);
            console.log('====================================');
            console.log("image get obj 5 " + data);
            console.log('====================================');
            storeData(data);
            navigation.navigate("TabStack", { user: data });
        } catch (e) {
            console.error(e);
        }
    }

    const updateLoggedUser = async (userId) => {
        try {
            let result = await fetch(url + "api/user/id", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_user: userId,
                })
            });
            let data = await result.json();
            return data;
        } catch (e) {
            console.error(e);
        }
    }



    const RegistrationUser = async (user) => {
        let id = user.id;
        let name = user.username;
        let email = user.email;
        let image = user.picture.data.url
        try {
            var salt = await bcrypt.genSaltSync(10);
            var hash = await bcrypt.hashSync(id, salt);
            let result = await fetch(url + "api/add/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Username: name,
                    Email: email,
                    Hash: hash,
                    Salt: salt,
                    User_img: image
                })
            });
            let data = await result.json();
            console.log('====================================');
            console.log("image first obj " + data);
            console.log('====================================');
            let user = updateLoggedUser(data.Id_user);
            console.log('====================================');
            console.log("image second obj " + user);
            console.log('====================================');
            imageUpload(user)
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
                RegistrationUser(res)
                //Alert.alert('Logged in!', `Hi ${res.name}!\n EMAIL ${res.email}  `);
                //Alert.alert(Logged in!', Hi NAME: res. name}! nEMAIL res. email nPICTURE res. picture nRES JSON. stringify res)}
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
        <View>
            <Header title="Jokes" />
            <View >
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
                    <Button title="Login" onPress={() => LoginNormal(Username, Pass)} />
                    <Text style={styles.text}>Don't have an account yet ?</Text>
                    <TouchableOpacity onPress={() => LoginNormal(Username, Pass)}>
                        <View >
                            <Text >Login</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                        <View >
                            <Text >Sign up!</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => LogInWithFacebook()}>
                        <View  >
                            <Text >Facebook</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => LogInWithGoogle()} class>
                        <View >
                            <Text >Google</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: "#ecf0f1",
    // },
    // input: {
    //     marginTop: 100,
    //     height: 30,
    //     width: 150,
    //     marginTop: 40,
    //     borderWidth: 2,
    //     borderRadius: 8,
    //     fontWeight: "bold",
    //     textAlign: 'center',
    // },
    // button: {
    //     marginTop: 40,
    //     borderRadius: 4,
    //     padding: 10,
    //     backgroundColor: "orange"
    // },
    // buttonFB: {
    //     marginTop: 40,
    //     borderRadius: 4,
    //     padding: 10,
    //     backgroundColor: "#3b5998"
    // },
    // buttonGoogle: {
    //     marginTop: 40,
    //     borderRadius: 4,
    //     padding: 10,
    //     backgroundColor: "red"
    // },
    // textBtn: {
    //     color: "white",
    //     fontWeight: "normal",
    // },
    // text: {
    //     marginTop: 10,
    //     color: "red",
    //     fontWeight: "bold",
    // }
});
