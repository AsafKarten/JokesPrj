import React, { useState } from 'react';
import { Alert, TouchableOpacity, View, StyleSheet, TextInput, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"

const defaultImg = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"

var bcrypt = require('bcryptjs');

var rjxEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
var rjxPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/


export default function RegistrationNewUser({ navigation }) {
    const [Username, onChangeUsername] = useState();
    const [Email, onChangeEmail] = useState();
    const [Pass, onChangePass] = useState();
    const [CPass, onChangeCPass] = useState();

    const Register = async () => {
        let emailValid = rjxEmail.test(Email);
        let passwordValid = rjxPass.test(Pass);
        if (Username == null || Username == "" || Pass == null || Pass == "" || Email == "" || Email == null || CPass == "" || CPass == null) {
            Alert.alert("Empty fields", "Please fill in all details !")
            return
        }
        if (Pass != CPass) {
            Alert.alert("Incorrect Password", "Password dose not match confirm password !")
            return
        }
        if (!emailValid) {
            Alert.alert("Invalid email address", "Please enter a valid email address.");
            return;
        }
        if (!passwordValid) {
            Alert.alert("Invalid password", "Please enter a valid password again (Password length must be at least 6 characters, including uppercase, lowercase and numbers.)");
            return;
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
            <Text style={styles.Title}>Sign up!</Text>
            <Text style={styles.Title}>So we can laugh at you :)</Text>
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
    Title: {
        marginTop: 10,
        fontSize: 24,
        color: 'orange',
        fontWeight: 'bold',
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
        backgroundColor: "#942bed"
    },
});