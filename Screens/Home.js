import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Text, FlatList, View, Image, Button } from 'react-native';


const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"

const default_img = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"

export default function Home({ navigation, user }) {
    const [allJokes, setList] = useState([
         { Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_like: 0, Joke_img: default_img, Username: '', User_img: default_img, Comment_count: 0 },
    ]);

    const LoadJokes = async () => {
        try {
            let result = await fetch(url + "api/feed", {
                method: 'GET'
            });
            let data = [...await result.json()];
            await setList(data.reverse());
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        (async () => {
            await LoadJokes();
        })()
    }, [])

    useEffect( () => {
        const loader_jokes = navigation.addListener('focus', async () => {
            if (user !== undefined) {
                await LoadJokes();
                if (user.User_img.indexOf("?asid") == -1)
                    user.User_img = `${user.User_img}?t=${Date.now()}`
                navigation.navigate("TabStack", { user: user })
            }
        });
        return loader_jokes;
    }, [navigation])



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
        var User_img = user.User_img;
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
                        uri: (user.User_img.indexOf(`?asid`) == -1) ? `${user.User_img}?t=${Date.now()}` : user.User_img
                    }} style={styles.UserImg} />
                    <Text onPress={() => MoveToProfile(user)} style={styles.UserName}>{user.Username}</Text>
                </View>
                <TextInput onFocus={onFocus} placeholder="What's on your mind ?" />
            </View>
            <FlatList
                data={allJokes}
                keyExtractor={(item) => item.Id_user}
                renderItem={({ item }) => (
                    <View style={styles.list}>
                        <View style={styles.buttonGroup}>
                            <Image source={{ uri: (user.User_img.indexOf(`?asid`) == -1) ? `${user.User_img}?t=${Date.now()}` : user.User_img }} style={styles.UserImg} />
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
                                <Button onPress={() => MoveToJoke(item)} title={item.Comment_count + " Comment"} />
                            </View>
                        </View>
                    </View>
                )} />
        </View>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8
    },
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
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    buttons: {
        padding: 5,
    },
    UserImg: {
        width: 30,
        height: 30,
        borderWidth: 2,
        borderRadius: 110,
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
    }
});

