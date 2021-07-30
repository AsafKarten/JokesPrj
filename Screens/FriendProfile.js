import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Image, Text, Platform, TextInput, View, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"

const default_img = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"


export default function FriendProfile({ navigation, route }) {

    const [profileJokes, setList] = useState([
        { Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_likes: 0, Joke_img: default_img, Username: '', User_img: default_img, Comment_count: 0 },
    ]);
    const [other_user, setOtherUser] = useState({ Id_user: 0, Username: '',Email:'', User_img: default_img, I_follow: 0, Follow_me: 0 });
    const [search, onChangeSearch] = useState();
    const friendId = route.params.route.item.Id_user
    const item = route.params.route.item;
    const user = route.params.route.user;
    useEffect(() => {
        (async () => {
            await GetFriendData();
            await LoadJokes();
        })()

    }, [])

    const GetFriendData = async () => {
        try {
            let result = await fetch(url + "api/get/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_user: item.Id_user
                })
            });
            let data = await result.json(); 
            setOtherUser(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    const SearchFunc = (search) => {
        if (search != "") {
            navigation.navigate("Search", { user: user, search: search });
            return;
        }
        navigation.navigate("Search", { user: user, search: search });
    }


    const FollowUser = async () => {
        let result = await fetch(url + "api/add/follow", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id_user: user.Id_user,
                Target_id: other_user.Id_user,
                Target_img: other_user.User_img,
                Target_username: other_user.Username,
                User_img: user.User_img,
                Username: user.Username
            })

        });
        let data = await result.json();
        await GetFriendData();
    }
    const LoadJokes = async () => {
        let result = await fetch(url + "api/profile/feed", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                id_user: friendId
            })

        });
        let data = [...await result.json()];
        await setList(data.reverse());
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
        await LoadJokes();
    }

    return (
        <View style={styles.container}>
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
                        <Text style={styles.username}>{other_user.username}</Text>
                    </View>
                    <View style={styles.imageHolder}>

                        <Image style={styles.profile_image} source={{ uri: `${other_user.User_img}?t=${Date.now()}` }} />
                    </View>
                    <View style={styles.buttonGroup}>
                        <View style={styles.buttons}>
                            <Button
                                title={other_user.Follow_me + " Followers"}
                                onPress={() => FollowUser()}
                            />
                        </View>
                    </View>
                    <View style={styles.profileFooter}></View>
                </View>
                <FlatList
                    data={profileJokes}
                    keyExtractor={(item) => item.Id_joke}
                    renderItem={({ item }) => (
                        <View style={styles.list}>
                            <View style={styles.buttonGroup}>
                                <Image source={{ uri: item.User_img }} style={styles.UserImg} />
                                <Text style={styles.UserName}>{item.Username}</Text>
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