import React, { useState } from 'react';
import { Alert,Modal, TouchableOpacity, View, StyleSheet, TextInput, Button, Text } from 'react-native';
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


export default function EditProfile({ navigation, route }) {
    const [prevDetails, setPrev] = useState(route.params.route);
    const [Username, onChangeUsername] = useState(route.params.route.Username);
    const [Email, onChangeEmail] = useState(route.params.route.Email);
    const [Hash, onChangeHash] = useState(route.params.route.Hash);
    const [Salt, onChangeSalt] = useState(route.params.route.Salt);
    const [User_img, onChangeImage] = useState(route.params.route.User_img);
    const [Pass, onChangePass] = useState('');
    const [CPass, onChangeCPass] = useState('');
    const [shouldShow, setShouldShow] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const CheckUsername = async () => {
        try {
            if (Platform.OS !== 'web') {
                setShouldShow(true)
            }

            let result = await fetch(url + "api/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Username: Username
                })
            });
            let data = await result.json();
            console.log(data);
            if (data !== undefined) {
               console.log("fail");
               setModalVisible(true)
            }
            else{
                Edit()
            }
            



        } catch (e) {
            console.error(e);
        }
    }
    const Edit = async () => {
        console.log(route.params.route);
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
        if (!Pass == '') {
            if (Pass == CPass) {
                var salt = await bcrypt.genSaltSync(10);
                var hash = await bcrypt.hashSync(Pass, salt);
                onChangeHash(hash)
                onChangeSalt(salt)
            }
            else {
                Alert.alert("password dos not match confirm password!")
            }
        }

        try {
            await clearAsyncStorage()
            let result = await fetch(url + "api/edit/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_user: prevDetails.Id_user,
                    Username: Username,
                    Email: Email,
                    Hash: Hash,
                    Salt: Salt,
                    User_img: User_img,
                    Id_external: ''
                })

            });
              let data = await result.json();
              console.log(data);
                storeData(data);
                navigation.navigate("TabStack", { user: data });


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
    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Done');
        } catch (error) {
            console.log(error);
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
            <TouchableOpacity onPress={() => CheckUsername()}>
                <View style={styles.button}>
                    <Text style={styles.textBtn}>Save</Text>
                </View>
            </TouchableOpacity>


            {shouldShow ? (
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
                ) : null}
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
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        fontFamily: "sans-serif"
    },
    button: {
        alignItems: 'center',
        margin: 5,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#942bed"
    },
});