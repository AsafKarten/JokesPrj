import React, { useState, useRef } from 'react';
import { StyleSheet, Alert, Image, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ActionSheet from 'react-native-actionsheet';


const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"


export default function Post({ navigation, route }) {
    let actionSheet = useRef();
    var optionArray = ['take a photo', 'choose from a gallery', 'Cancel'];
    const [Joke_title, onChangeJokeTitle] = useState("");
    const [Joke_body, onChangeJokeBody] = useState("")
    const [userId, setUserId] = useState(route.params.user.Id_user);
    const [user_img, setUserImg] = useState(route.params.user.User_img);
    const [post_img, setPostImg] = useState();

    const PostJoke = async () => {
        if (Joke_title == "" || Joke_body == "") {
            alert("Please fill in all details !")
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
                        Joke_img: post_img
                    })
                });
                let data = await result.json();
                navigation.navigate("TabStack", { user: route.params.user });
            } catch (e) {
                console.error(e);
            }
        }
    }
    const checkDevice = async () => {
        if (Platform.OS === 'web') {
            await GalleryPicture();
        }
        else {
            await showActionSheet();
        }
    }

    const showActionSheet = () => {
        actionSheet.current.show();
    };

    const takePicture = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.1
            });
            if (!result.cancelled) {
                if (Platform.OS !== 'web') {
                    const content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                    result.uri = content
                    await setPostImg(result.uri);
                }
                else {
                    Alert.alert("no live picture on web")
                }
            }
        } catch (e) {
            console.error(e);
        }
    }


    const GalleryPicture = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7
            });
            if (!result.cancelled) {
                if (Platform.OS !== 'web') {
                    var content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                    result.uri = content
                    console.log('====================================');
                    console.log(result);
                    console.log('====================================');
                    await setPostImg(content);
                } else {
                    await setPostImg(result.uri.split(',')[1]);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }


    return (
        <View style={styles.container}>
            <Text></Text>
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
            <View style={styles.imageHolder}>
                <Text style={styles.text}>Add mim :) </Text>
                <AntDesign style={styles.add_icon} onPress={checkDevice} name="upload" size={24} color="grey" fontWeight={'bold'} />
                <Image style={styles.post_image} source={{ uri: post_img }} />
            </View>
            <TouchableOpacity onPress={() => PostJoke()}>
                <View style={styles.button}>
                    <Text style={styles.textBtn}>Post</Text>
                </View>
            </TouchableOpacity >
            <ActionSheet
                ref={actionSheet}
                // Title of the Bottom Sheet
                title={'Choose from where to upload a funny picture '}
                // Options Array to show in bottom sheet
                options={optionArray}
                // Define cancel button index in the option array
                // This will take the cancel option in bottom
                // and will highlight it
                cancelButtonIndex={2}
                // Highlight any specific option
                destructiveButtonIndex={1}
                onPress={(index) => {
                    if (index == 0) {
                        takePicture();
                    }
                    else if (index == 1) {
                        GalleryPicture();
                    }
                }}
            />
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'center',
    },
    imageHolder: {
        // flexDirection: 'row',
        // alignItems: 'flex-end'
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10

    },
    post_image: {
        marginTop: 20,
        width: 300,
        height: 300,
        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 50,

        resizeMode: 'stretch',
    },
    button: {
        marginTop: 20,

        borderRadius: 4,
        padding: 10,
        backgroundColor: "orange"
    },
    textBtn: {
        color: "white",
        fontWeight: "normal",
    }
});

