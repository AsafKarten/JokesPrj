import React, { useState } from 'react';
import { Alert,TouchableOpacity, View, StyleSheet, TextInput, Button, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"

 const defaultImg = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"

var bcrypt = require('bcryptjs');

var rjxEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
//var rjxUsername = /^[a-z0-9_-]{3,16}$/
//var rjxPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,8}$/


export default function RegistrationNewUser({ navigation }) {
    const [Username, onChangeUsername] = useState();
    const [Email, onChangeEmail] = useState();
    const [Pass, onChangePass] = useState();
    const [CPass, onChangeCPass] = useState();

    const Register = async () => {
        let emailValid = rjxEmail.test(Email);
        // let usernameValid = rjxUsername.test(Username);
        // let passwordValid = rjxPass.test(Pass);
        if (!emailValid) {
            alert("Invalid address email");
            return;
        }
        // if (!usernameValid) {
        //     alert("Invalid username");
        //     return;
        // }
        // if (!passwordValid) {
        //     alert("Invalid password");
        //     return;
        // }
        if (Username == null || Username == "" || Pass == null || Pass == "" || Email == "" || Email == null || CPass == "" || CPass == null) {
            alert("Please fill in all details !")
            return
        }
        if (Pass != CPass) {
            alert("Password dose not match confirm password!")
            return
        }
        else {
            try {
                var salt = await bcrypt.genSaltSync(10);
                var hash = await bcrypt.hashSync(Pass, salt);
                let result = await fetch(url + "api/add/user", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Username: Username,
                        Email: Email,
                        Hash: hash,
                        Salt: salt,
                        User_img: defaultImg,
                        Id_external: ''
                    })

                });
                let data = await result.json();
                console.log(data);
                navigation.navigate("Login");
            } catch (e) {
                console.error(e)
            }
        }
    }

    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                onChangeText={onChangeUsername}
                value={Username}
                placeholder="Username"
                leftIcon={<Icon name='user' size={24} color='black' />}
            />
            <Input
                style={styles.input}
                onChangeText={onChangeEmail}
                value={Email}
                placeholder="Email"
                leftIcon={<MaterialIcons name="email" size={24} color="black" />}
            />
            <Input
                style={styles.input}
                onChangeText={onChangePass}
                value={Pass}
                secureTextEntry={true}
                placeholder="Password"
                leftIcon={<Icon name='lock' size={24} color='black' />}
            />
            <Input
                style={styles.input}
                onChangeText={onChangeCPass}
                secureTextEntry={true}
                value={CPass}
                placeholder="Confirm password"
                leftIcon={<Icon name='lock' size={24} color='black' />}
            />
            <TouchableOpacity onPress={() => Register()}>
                <View style={styles.button}>
                    <Text style={styles.textBtn}>Register</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: 200,
        fontWeight: "bold",
        textAlign: 'center',
        justifyContent: 'center',
        margin: 15
    },
    textBtn: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20
    },
    button: {
        alignItems: 'center',
        margin: 15,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "orange"
    },
});