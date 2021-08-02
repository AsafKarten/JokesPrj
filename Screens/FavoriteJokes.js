import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, FlatList, View, Image, TouchableOpacity } from 'react-native';

const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"


export default function FavoriteJokes({ navigation, route }) {
    //var default_img = require('../assets/funny_icon.jpg')
    const [userId, setUserId] = useState(route.params.route.Id_user);
    const [user, setUser] = useState(route.params.route)
    const [listJokes, setList] = useState([
        // { Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_like: 0, Joke_img: default_img, Username: '', User_img: default_img, Comment_count: 0 },
    ]);

    useEffect(() => {
        (async () => {
            if (route !== undefined) {
                GetlikesJokes();
            }
        })()
    }, [])

    const GetlikesJokes = async () => {
        try {
            let result = await fetch(url + "api/your/likes/jokes", {
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
    const MoveToJoke = (item) => {
        var route = { user: user, item: item }
        console.log(route);
        navigation.navigate("Joke", { navigation: navigation, route: route });
    }

    const AddLike = async (item) => {
        var Id_joke = item.Id_joke;
        var Id_user = route.params.route.user.Id_user;
        var User_img = route.params.route.user.User_img;
        var Username = route.params.route.user.Username;

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
        console.log(Id_joke, Id_user, User_img, Username)
        console.log(data);
        GetlikesJokes();
    }
    const MoveToProfile = (item) => {
        if (item.Id_user == user.Id_user) {
            navigation.navigate("TabStack", { user: user });
        }
        else {
            var route = { user: user, item: item }
            navigation.navigate("FriendProfile", { navigation: navigation, route: route });
        }

    }


    return (
        <View style={styles.container}>
            <FlatList
                data={listJokes}
                keyExtractor={(item) => item.Id_joke}
                renderItem={({ item }) => (
                    <View style={styles.list}>
                        <View style={styles.buttonGroup}>
                            <Image source={{ uri: item.User_img }} style={styles.UserImg} />
                            <Text onPress={() => MoveToProfile(item)} style={styles.UserName}>{item.Username}</Text>
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
    //main container
    container: {
        flex: 1,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#c8cfc8',
    },
    //User posts style
    list: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 16,
        // marginRight:10,
        padding: 28,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: 'grey',
        backgroundColor: "#fcfff9",
        color: "black",
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
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        fontFamily: "sans-serif"
    },
    Body: {
        marginBottom: 8,
        fontSize: 16,
    },
    postTitle: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'left'
    },
    buttonGroup: {
        //flex: 3,
        flexDirection: 'row',
        // justifyContent: 'space-evenly',

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
})
