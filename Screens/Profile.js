import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Image, Text, Platform, TextInput, View, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"



export default function Profile({ navigation, user }) {
    // var default_img = require('../assets/funny_icon.jpg')
    const [userId, setUserId] = useState();
    const [username, setUserName] = useState();
    const [image, setImage] = useState();
    const [search, onChangeSearch] = useState();
    const [comment, onChangeComment] = useState();
    const [profileJokes, setList] = useState([
        // { Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_likes: 0, Joke_img: '', Username: '', User_img: '', Comment_count: 0 },
    ]);
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    const dateTime = date + ' ' + time;

    useEffect(() => {
        (async () => {
            if (user !== undefined) {
                setUserName(user.Username)
                setImage(user.User_img)
                setUserId(user.Id_user)
                LoadJokes(user.Id_user)
            }
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })()
    }, [])

    useEffect(() => {
        const loaderjokes = navigation.addListener('focus', () => {
            if (user !== undefined) {
                LoadJokes(user.Id_user)
            }
        });
        return loaderjokes;
    }, [navigation])

    const storeData = async (data) => {
        try {
            const loggedUser = JSON.stringify(data);
            await AsyncStorage.setItem('loggedUser', loggedUser)
        } catch (e) {
            console.error(e)
        }
    }

    const clearOldLoggedUser = async () => {
        try {
            await AsyncStorage.clear();
            console.log('Done');
        } catch (error) {
            console.log(error);
        }
    };

    const AddProfilPicture = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7
            });
            if (!result.cancelled) {
                setImage(result.uri);
                imageUpload(result.uri, username);
            }
        } catch (e) {
            console.error(e);
        }

    }

    const imageUpload = async (imgUri, picName) => {
        try {
            let res = await fetch(url + "api/uploadpicture", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    uri: imgUri.split(',')[1],
                    name: picName,
                    folder: userId,
                    type: 'jpg',
                })
            });
            let data = await res.json();
            console.log('====================================');
            console.log(data);
            console.log('====================================');
            updateLoggedUser();

        } catch (e) {
            console.error(e);
        }
    }

    const updateLoggedUser = async () => {
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
            // const loggedUser = await AsyncStorage.getItem('loggedUser')
            // _mergeData(data, loggedUser)
            clearOldLoggedUser();//to remove item from async storage
            storeData(data);
        } catch (e) {
            console.error(e);
        }
    }


    const LikeJokes = (user) => {
        navigation.navigate("FavoriteJokes", { navigation: navigation, route: user });
    }

    const AddJoke = () => {
        console.log(user);
        if (user.UserImg == null || user.UserImg == '') {
            user.UserImg = image;
        }
        navigation.navigate("Post", { user: user });
    }

    const SearchFunc = (search) => {
        var route = { user: user, search: search };
        navigation.navigate("Search", { navigation: navigation, route: route });
    }

    const LoadJokes = async (userId) => {
        try {
            let result = await fetch(url + "api/profile/feed", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_user: userId
                })

            });
            let data = [...await result.json()];
            setList(data.reverse());
        } catch (e) {
            console.error(e);
        }

    }
    const AddComment = async (Id_joke) => {
        try {
            let result = await fetch(url + "api/add/comment", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_joke: Id_joke,
                    Id_user: userId,
                    Comment_body: comment,
                    Comment_Date: dateTime,
                    User_img: image,
                    Username: username
                })

            });
            let data = await result.json();
            onChangeComment('');
        } catch (e) {
            console.error(e)
        }
    }
    const MoveToJoke = (item) => {
        var route = { user: user, item: item }
        console.log(route);
        navigation.navigate("Joke", { navigation: navigation, route: route });
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={styles.search_holder}>
                    <TextInput style={styles.search}
                        onChangeText={onChangeSearch}
                        value={search}
                        placeholder="Search friends/jokes" />
                    <FontAwesome style={styles.serach_icon} onPress={() => SearchFunc(search)} name="search" size={24} color="grey" />
                </View>
                <View style={styles.profileHolder}>
                    <View style={styles.profileHeader}>
                        <Text style={styles.username}>{username}</Text>
                    </View>

                    <View style={styles.imageHolder}>
                        <Image style={styles.profile_image} source={{ uri: image }} />
                        <AntDesign style={styles.add_icon} onPress={AddProfilPicture} name="camera" size={24} color="grey" fontWeight={'bold'} />
                    </View>
                    <View style={styles.addTextHolder}>
                        <Text style={styles.addText}>Add a funny piture of yourself</Text>
                    </View>
                    <View style={styles.buttonGroup}>
                        <View style={styles.buttons}>
                            <Button
                                title="Jokes you like"
                                onPress={() => LikeJokes(user)}
                            /></View>
                        <View style={styles.buttons}>
                            <Button
                                title="Followers"
                            //onPress={() => AddJoke()}
                            /></View>
                        <View style={styles.buttons}>

                            <Button
                                title="Following"
                            //onPress={() => AddJoke()}
                            /></View>

                    </View>
                    <View style={styles.profileFooter}>
                        <Button
                            title="Add new Joke"
                            onPress={() => AddJoke()}
                        />
                    </View>
                </View>

                <FlatList
                    data={profileJokes}
                    keyExtractor={(item) => item.Id_user}
                    renderItem={({ item }) => (
                        <View style={styles.list}>
                            <View style={styles.buttonGroup}>
                                <Image source={{ uri: item.User_img }} style={styles.UserImg} />
                                <Text style={styles.UserName}>{item.Username}</Text>
                            </View>

                            <Text style={styles.postTitle}>
                                {item.Joke_title}
                            </Text>

                            <Image onPress={() => MoveToJoke(item)} source={{ uri: item.Joke_img }} style={styles.JokeImage} />

                            <Text style={styles.Body} onPress={() => MoveToJoke(item)}>
                                {item.Joke_body}
                            </Text>
                            <View style={styles.buttonGroup}>
                                <View style={styles.buttons}>
                                    <Button style={styles.buttons} title={item.Joke_like + " Like"} />
                                </View>
                                <View style={styles.buttons}>
                                    <Button onPress={() => AddComment(item.Id_joke)} title="Comment" />
                                </View>
                            </View>
                        </View>
                    )} />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    //main container
    container: {
        flex: 1,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    //search holder
    search_holder: {
        alignItems: 'center',
        margin: 8,
        flexDirection: 'row-reverse',
        height: 26,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: 'grey',
    },
    search: {
        fontWeight: 'bold',
        flexDirection: 'row',
        alignItems: 'stretch',

    },
    serach_icon: {

    },
    //Profile part
    profileHolder: {
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18,
        margin: 8,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: 'grey',
    },
    profileHeader: {
        textAlign: 'center',
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    username: {
        color: 'orange',
        fontSize: 25,
        fontWeight: 'bold',
        padding: 10,
    },
    imageHolder: {
        // flexDirection: 'row',
        // alignItems: 'flex-end'
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8

    },
    profile_image: {
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 90,
        borderColor: 'orange',
        resizeMode: 'stretch',

    },
    addTextHolder: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    addText: {
        fontSize: 16,
    },
    profileFooter: {
        margin: 5,
        padding: 5,
    },

    //User posts style
    list: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 16,
        padding: 8,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: 'grey',
        backgroundColor: "white",
        color: "black",
    },

    Body: {
        fontSize: 16,
    },
    postTitle: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'left'
    },
    buttonGroup: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-evenly',

    },
    buttons: {
        margin: 2
    },
    UserImg: {
        width: 30,
        height: 30,
        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 90,
        borderColor: 'orange',
        resizeMode: 'stretch',

    },
    UserName: {
        marginLeft: 5,
        fontWeight: "bold",
    },
    JokeImage: {
        width: 250,
        height: 250,
        resizeMode: 'stretch',

    },


});