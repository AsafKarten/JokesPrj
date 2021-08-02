import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';

const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"

const default_img = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"

export default function Home({ navigation, user }) {
    const [allJokes, setList] = useState([
        //{ Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_like: 0, Joke_img: default_img, Username: '', User_img: default_img, Comment_count: 0 },
    ]);

    useEffect(() => {
        (async () => {
            await LoadJokes();
        })()
    }, [])

    useEffect(() => {
        const loader_jokes = navigation.addListener('focus', async () => {
            if (user !== undefined) {
                await LoadJokes();
                if (user.User_img.indexOf("?asid") == -1)
                    user.User_img = `${user.User_img}?t=${Date.now()}`
            }
            return loader_jokes;
        })
    }, [navigation])

    const LoadJokes = async () => {
        try {
            let result = await fetch(url + "api/feed", {
                method: 'GET'
            });
            let data = [...await result.json()];
            setList(data.reverse());
        } catch (error) {
            console.error(error)
        }
    }


    const MoveToProfile = (item) => {
        if (item.Id_user == user.Id_user) {
            navigation.navigate("Profile", { navigation: navigation, user: user });
        }
        else {
            var route = { user: user, item: item }
            navigation.navigate("FriendProfile", { navigation: navigation, route: route });
        }

    }
    const MoveToJoke = (item) => {
        var route = { user: user, item: item }
        navigation.navigate("Joke", { navigation: navigation, route: route });

    }
    const AddLike = async (item) => {
        var Id_joke = item.Id_joke;
        var Id_user = user.Id_user;
        var User_img = `${user.User_img}?t=${Date.now()}`;
        var Username = user.Username;
        try {
            let result = await fetch(url + "api/add/like", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_joke: Id_joke,
                    Id_user: Id_user,
                    User_img: User_img,
                    Username: Username
                })
            });
            let data = await result.json();
            LoadJokes();
        } catch (e) {
            console.error(e)
        }
    }

    const onFocus = () => {
        navigation.navigate("Post", { user: user })
    }

    return (
            <View style={styles.container}>
                <View >
                    <View style={styles.buttonGroup}>
                        <Image source={{
                            uri: (user.User_img.indexOf(`?asid`) == -1) ? `${user.User_img}?t=${Date.now()}` : `${user.User_img}?t=${Date.now()}`
                        }} style={styles.UserImg} />
                        <Text onPress={() => MoveToProfile(user)} style={styles.UserName}>{user.Username}</Text>
                    </View>
                    <TextInput onFocus={onFocus} placeholder="What's on your mind ?" style={styles.go_to_post} />
                </View>
                <FlatList
                    data={allJokes}
                    keyExtractor={(item) => item.Id_joke}
                    renderItem={({ item }) => (
                        <View style={styles.list}>
                            <View style={styles.buttonGroup}>
                                <Image source={{ uri: (item.User_img.indexOf(`?asid`) == -1) ? `${item.User_img}?t=${Date.now()}` : item.User_img }} style={styles.UserImg} />
                                <Text onPress={() => MoveToProfile(item)} style={styles.UserName}>{item.Username}</Text>
                            </View>

                            <Text style={styles.postTitle}>
                                {item.Joke_title}
                            </Text>
                            <Image source={{ uri: item.Joke_img }} style={styles.JokeImage} />

                            <Text style={styles.Body} onPress={() => MoveToJoke(item)}>
                                {item.Joke_body}
                            </Text>
                            <View style={styles.buttonGroup}>
                                <View style={styles.buttons}>
                                    <TouchableOpacity onPress={() => AddLike(item)}>
                                        <View style={styles.button_normal}>
                                            <Text style={styles.textBtn}>{item.Joke_like + " Like"}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.buttons}>
                                    <TouchableOpacity onPress={() => MoveToJoke(item)}>
                                        <View style={styles.button_normal}>
                                            <Text style={styles.textBtn}>{item.Comment_count + " Comment"}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )} />
            </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#c8cfc8',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    go_to_post: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    //botton normal
    button_normal: {
        alignItems: 'center',
        margin: 5,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#4d5b70"
    },
    //txt botton normal
    textBtn: {
        color: "white",
        fontWeight: "bold",
        fontFamily: "sans-serif"
    },
    //User posts style
    list: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 16,
        padding: 28,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: 'grey',
        backgroundColor: "#fcfff9",
        color: "black",
    },

    Body: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: "bold",
    },
    postTitle: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'left'
    },
    buttonGroup: {
        flexDirection: 'row'
    },
    buttons: {
        margin: 2,
        marginLeft: 8,
    },
    UserImg: {
        width: 60,
        height: 60,

        borderRadius: 100,
        borderRadius: 90,
        resizeMode: 'stretch',

    },
    UserName: {
        marginLeft: 5,
        paddingTop: 12,
        fontSize: 20,
        fontWeight: "bold",
    },
    JokeImage: {
        marginBottom: 8,
        marginTop: 8,
        width: 300,
        height: 250,
        resizeMode: 'stretch',

    },
    buttonStyle: {
        height: 30,
        padding: 10,
        marginTop: 5,
    },
});

