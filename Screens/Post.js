import React, { useState, } from 'react';
import { Alert, Platform, StyleSheet, Image, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';



const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"


export default function Post({ navigation, route }) {
    const [Joke_title, onChangeJokeTitle] = useState("");
    const [Joke_body, onChangeJokeBody] = useState("")
    const [userId, setUserId] = useState(route.params.user.Id_user);
    const [user_img, setUserImg] = useState(route.params.user.User_img);
    const [post_img, setPostImg] = useState();
    const [image_data, setImgData] = useState();

    const PostJoke = async () => {
        if (Joke_title == "" || Joke_body == "") {
            Alert.alert("Empty fields", "Please fill in all details !")
            return
        }
        else {
            try {
                let result = await fetch(url + "api/new/joke", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Id_user: userId,
                        Joke_title: Joke_title,
                        Joke_body: Joke_body,
                        Username: route.params.user.Username,
                        User_img: user_img,
                    })
                });
                let data = await result.json();
                let id_joke = data
                console.log(data);
                if (Platform.OS !== 'web') {
                    imageUploadA(id_joke)
                }
                else {
                    imageUpload(id_joke)
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    const imageUpload = async (id_joke) => {
        try {
            let res = await fetch(url + "api/uploadjokeimage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    uri: image_data.split(',')[1],
                    name: Joke_title,
                    folder: id_joke,
                    type: 'jpg',
                })
            });
            let data = await res.json();
            await setPostImg(`${data.path}?t=${Date.now()}`)
            navigation.navigate("TabStack", { user: route.params.user });
        } catch (e) {
            console.error(e);
        }
    }

    const imageUploadA = async (id_joke) => {
        console.log(image_data);
        console.log(Joke_title);
        console.log(id_joke);
        try {
            let res = await fetch(url + "api/uploadjokeimage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    uri: image_data,
                    name: Joke_title,
                    folder: id_joke,
                    type: 'jpg',
                })
            });
            let data = await res.json();
            await setPostImg(`${data.path}?t=${Date.now()}`)
            console.log(data);
            navigation.navigate("TabStack", { user: route.params.user });

        } catch (e) {
            console.error(e);
        }
    }

    const GalleryPicture = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7
            });
            if (!result.cancelled) {
                if (Platform.OS !== 'web') {
                    var content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                    result.uri = content
                    await setImgData(content)
                }
                else {
                    await setImgData(result.uri)
                }
            }
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Make a new Joke :) </Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangeJokeTitle}
                value={Joke_title}
                placeholder="Title"
            />
            <TextInput
                style={styles.input}
                onChangeText={onChangeJokeBody}
                value={Joke_body}
                placeholder="Body"
            />
            <View style={styles.meme}>
                <Text style={styles.text}>Add meme   </Text>
                <View style={styles.imageHolder}>
                    <AntDesign style={styles.add_icon} onPress={GalleryPicture} name="upload" size={24} color="grey" fontWeight={'bold'} />
                </View>
            </View>
            <Image style={styles.post_image} source={{ uri: post_img }} />
            <TouchableOpacity onPress={() => PostJoke()}>
                <View style={styles.button}>
                    <Text style={styles.textBtn}>Post</Text>
                </View>
            </TouchableOpacity >
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffe5'
    },
    title: {
        margin: 30,
        color: '#4d5b70',
        fontWeight: "bold",
        fontSize: 22
    },
    meme: {
        flexDirection:'row',
    },
    input: {
        height: 40,
        width: 260,
        margin: 12,
        borderWidth: 2,
        borderRadius: 8,
        textAlign: 'center',
        fontWeight: "bold"
    },
    imageHolder: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30

    },
    post_image: {
        marginTop: 20,
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: 'black',
        resizeMode: 'stretch',
    },
    button: {
        marginTop: 20,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#4d5b70",
    },
    textBtn: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 22,
    },
    text: {
        marginTop: 30,
        color: '#4d5b70',
        fontWeight: "bold",
        fontSize: 22
    }
});

