import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button, Image } from 'react-native';
import Header from './Header';

const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"

export default function JokeMap({ navigation, route }) {
    //var default_img = require('../assets/funny_icon.jpg')
    const [searchJokes, setResults] = useState([{
        Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_likes: 0, Joke_img: '', Username: '', User_img: '', Comment_count: 0
    },
    ]);
    const [user, setUser] = useState(route.params.route.user);

    useEffect(() => {
        (async () => {
            if (route.params.route.jokeList !== undefined) {
                setResults(route.params.route.jokeList)
            }
            else {
                console.log("no data found");
            }
        })()
    }, []);

    const MoveToJoke = (item) => {
        var route = { user: user, item: item }
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
        LoadJokes(route.params.route.searchTitle);
    }

    const LoadJokes = async (searchTitle) => {
        try {
            let result = await fetch(url + "api/search/jokes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Joke_title: searchTitle
                })
            });
            let data = [...await result.json()];
            setResults(data.reverse());
            console.log(searchJokes);
        } catch (e) {
            console.error(e)
        }
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
        <View >
            <Header title="Results search" />
            <View style={styles.container}>
                <FlatList
                    data={searchJokes}
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

                            <Image source={{ uri: item.Joke_img }} style={styles.JokeImage} />

                            <Text style={styles.Body} onPress={() => MoveToJoke(item)}>
                                {item.Joke_body}
                            </Text>
                            <View style={styles.buttonGroup}>
                                <View style={styles.buttons}>
                                    <Button onPress={() => AddLike(item)} style={styles.buttons} title={item.Joke_like + " Like"} />
                                </View>
                                <View style={styles.buttons}>
                                    <Button onPress={() => MoveToJoke(item)} title="Comment" />
                                </View>
                            </View>
                        </View>
                    )} />
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    //FlatList new
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
