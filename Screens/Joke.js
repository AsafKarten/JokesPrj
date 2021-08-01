import React, { useState, useEffect } from 'react';
import { Alert, Modal, TextInput, TouchableHighlight, StyleSheet, Text, FlatList, View, Image, Button } from 'react-native';
import { Input } from 'react-native-elements';

const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"


export default function Joke({ navigation, route }) {
    console.log(route.params.route.user);
    console.log(route.params.route.item);
    const [allLikes, setLikes] = useState([
        // { Comment_id: 0, Id_Joke: 0, Id_user: 0, Comment_body: '', Comment_date: dateTime, User_img: default_img, Username: '' },
    ]);
    const [allComments, setComments] = useState([

    ]);
    const joke = route.params.route.item
    const user = route.params.route.user
    const [modalVisible, setModalVisible] = useState(false);
    const [comment, onChangeComment] = useState('');
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes();
    const dateTime = date + ' ' + time;

    useEffect(() => {
        (async () => {
            await LoadLikes();
            await LoadComments()
        })()
    }, [])



    const MoveToProfile = () => {
        if (joke.Id_user == user.Id_user) {
            navigation.navigate("TabStack", { user: user });
        }
        else {
            var route = { user: user, item: joke }
            navigation.navigate("FriendProfile", { navigation: navigation, route: route });
        }

    }
    const MoveToProfileFromComment = (item) => {
        if (item.Id_user == user.Id_user) {
            navigation.navigate("TabStack", { user: user });
        }
        else {
            var route = { user: user, item: item }
            navigation.navigate("FriendProfile", { navigation: navigation, route: route });
        }

    }

    const AddLike = async (joke) => {
        var Id_joke = joke.Id_joke;
        var Id_user = user.Id_user;
        var User_img = user.User_img;
        var Username = user.Username;

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

    }
    const LoadLikes = async () => {
        try {
            let result = await fetch(url + "api/get/likes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_joke: joke.Id_joke,
                    Id_user: joke.Id_user,
                    Joke_title: joke.Joke_title,
                    Joke_body: joke.Joke_body,
                    Username: joke.Username,
                    User_img: joke.user_img,
                    Joke_img: joke.Joke_img
                })
            });
            let data = [...await result.json()];
            setLikes(data);
        } catch (e) {
            console.error(e)
        }
    }
    const LoadComments = async () => {
        try {
            let result = await fetch(url + "api/get/Comments", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_joke: joke.Id_joke,
                    Id_user: joke.Id_user,
                    Joke_title: joke.Joke_title,
                    Joke_body: joke.Joke_body,
                    Joke_like: joke.Joke_like,
                    Username: joke.Username,
                    User_img: joke.user_img,
                    Joke_img: joke.Joke_img,
                    Comment_count: joke.Comment_count
                })
            });
            let data = [...await result.json()];
            setComments(data);
        } catch (e) {
            console.error(e)
        }
    }

    const AddComment = async () => {
        try {
            if (comment == "") {
                Alert.alert("cant submit an empty comment")
            }
            else {
                let result = await fetch(url + "api/add/comment", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Id_joke: joke.Id_joke,
                        Id_user: user.Id_user,
                        Comment_body: comment,
                        Comment_Date: dateTime,
                        User_img: user.User_img,
                        Username: user.Username
                    })
                });
                let data = await result.json();
                LoadComments();
                onChangeComment("")
            }
        } catch (e) {
            console.error(e)
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <View style={styles.buttonGroup}>
                    <Image onPress={() => MoveToProfile()} source={{ uri: joke.User_img }} style={styles.UserImg} />
                    <Text onPress={() => MoveToProfile()} style={styles.UserName}>{joke.Username}</Text>
                </View>

                <Text style={styles.postTitle}>
                    {joke.Joke_title}
                </Text>

                <Image source={{ uri: joke.Joke_img }} style={styles.JokeImage} />

                <Text style={styles.Body}>
                    {joke.Joke_body}
                </Text>
                <View style={styles.buttonGroup}>
                    {/* <View style={styles.buttons}> */}
                    <Text style={styles.LikeText} onPress={() => { setModalVisible(true) }}>View likes</Text>
                    <Button onPress={() => AddLike(joke)} style={styles.buttons} title={joke.Joke_like + " Like"} />
                    {/* </View> */}
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeComment}
                        value={comment}
                        placeholder="comment"
                    />
                    {/* <View style={styles.buttons}> */}
                    <Button onPress={() => AddComment()} title="Comment" />
                    {/* </View> */}

                </View>
            </View>

            <FlatList
                data={allComments}
                keyExtractor={(item) => item.Comment_id}
                renderItem={({ item }) => (
                    <View style={styles.list}>
                        <View style={styles.buttonGroup}>
                            <Image source={{ uri: item.User_img }} style={styles.UserImg} />
                            <Text onPress={() => MoveToProfileFromComment(item)} style={styles.UserName}>{item.Username}</Text>
                        </View>
                        <Text style={styles.postTitle}>
                            {item.Comment_body}
                        </Text>

                        <Text style={styles.Body}>
                            {item.Comment_date}
                        </Text>
                    </View>
                )} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Like list</Text>
                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                        <FlatList
                            data={allLikes}
                            keyExtractor={(item) => item.Like_id}
                            renderItem={({ item }) => (
                                <View style={styles.list}>
                                    <View style={styles.LikeCubes}>
                                        <Image source={{ uri: item.User_img }} style={styles.ModalUserImg} />
                                        <Text style={styles.ModalUserName}>{item.Username}</Text>
                                    </View>
                                </View>
                            )} />

                    </View>
                </View>
            </Modal>
        </View>

    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 20,
    },
    postTitle: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'right'
    },
    buttonGroup: {
        //alignItems: 'flex-start',
        flexDirection: 'row',
        //justifyContent:'space-evenly',
    },
    buttons: {
        padding: 5,
        marginLeft: 8,
    },
    LikeText: {
        color: 'grey',
        fontSize: 16,
        marginLeft: 8,
        marginRight: 8,
    },
    input: {
        marginLeft: 8,
        height: 20,
        width: 120,
        fontSize: 16,
        //padding: 8,
    },
    UserImg: {
        width: 60,
        height: 60,

        borderRadius: 100,
        borderWidth: 2,
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
        width: 350,
        height: 300,
        resizeMode: 'stretch',
    },
    //modal style
    centeredView: {
        flex: 1,
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {

        margin: 20,
        marginBottom: 100,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontSize: 20,
        textAlign: 'center',
    },
    LikeCubes: {
        //alignItems: 'flex-start',
        flexDirection: 'row',
        width: 200,

        //justifyContent:'space-evenly',
    },
    ModalUserName: {
        marginLeft: 35,
        marginRight: 5,
        paddingTop: 12,
        fontSize: 20,
        fontWeight: "bold",
    },
    ModalUserImg: {
        width: 60,
        height: 60,
        marginRight: 10,
        marginLeft: 8,

        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 90,
        resizeMode: 'stretch',
    },


});