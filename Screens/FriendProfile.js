import React, { useState, useEffect } from 'react';
import { Button,Modal,TouchableHighlight, StyleSheet, Image,TouchableOpacity, Text, Platform, TextInput, View, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native';


const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"

const default_img = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"


export default function FriendProfile({ navigation, route }) {

    const [profileJokes, setList] = useState([
        { Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_likes: 0, Joke_img: default_img, Username: '', User_img: default_img, Comment_count: 0 },
    ]);
    const [other_user, setOtherUser] = useState({ Id_user: 0, Username: '', Email: '', User_img: default_img, I_follow: 0, Follow_me: 0 });
    const [search, onChangeSearch] = useState();
    const friendId = route.params.route.item.Id_user
    const item = route.params.route.item;
    const user = route.params.route.user;
    const [followMeList, setFollowMeList] = useState();
    const [modalFollowMeVisible, setFM_ModalVisible] = useState(false);
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const loaderjokes = navigation.addListener('focus', () => {
            GetFriendData();
            LoadJokes();
            LoadFollowMeList(other_user.Id_user);
            if(Platform.OS !== 'web') {
                setShouldShow(true)
            }
        });
        
        return loaderjokes;
    }, [navigation])




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
    const LoadFollowMeList = async (id_user) => {
        try {
            let result = await fetch(url + "api/your/followers", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Id_user: id_user
                })
            });
            let data = [...await result.json()];
            setFollowMeList(data);
            console.log(data);
        } catch (e) {
            console.error(e)
        }
    }

    const SearchFunc = (search) => {

        var route = { user: user, search: search };
        navigation.navigate("Search", { navigation: navigation, route: route });
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
            <ScrollView>
                {/* <View style={styles.container}> */}

                <View style={styles.search_holder}>
                    <TextInput style={styles.search}
                        //onChangeText={onChangeSearch}
                        onFocus={()=>SearchFunc(search)}
                        value={search}
                        placeholder="Search friends/jokes" />
                    <FontAwesome style={styles.serach_icon} onPress={() => SearchFunc(search)} name="search" size={24} color="grey" />
                </View>
                <View style={styles.profileHolder}>
                    {/* <View style={styles.profileHeader}> */}
                    <Text style={styles.username}>{other_user.Username}</Text>
                    {/* </View> */}
                    {/* <View style={styles.imageHolder}> */}

                    <Image style={styles.profile_image} source={{ uri: `${other_user.User_img}?t=${Date.now()}` }} />
                    {/* </View> */}
                    {/* <View style={styles.buttonGroup}> */}
                    <View style={styles.buttons}>
                        <TouchableOpacity
                         onLongPress={() => FollowUser()}
                         onPressIn={()=> setFM_ModalVisible(true)}
                         >
                             
                            <View style={styles.button_normal}>
                                <Text style={styles.textBtn}>{other_user.Follow_me + " Followers"}</Text>
                            </View>
                        </TouchableOpacity>
                        <Button
                            title={other_user.Follow_me + " Followers"}
                            onPress={() => FollowUser()}
                        />
                    </View>
                    {/* </View> */}
                    {/* <View style={styles.profileFooter}></View> */}
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
                {/* </View> */}
                {shouldShow ? (
                 
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalFollowMeVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>followers</Text>
                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                                        onPress={() => {
                                            setFM_ModalVisible(!modalFollowMeVisible);
                                        }}>
                                        <Text style={styles.textStyle}>Hide Modal</Text>
                                    </TouchableHighlight>
                                    <FlatList
                                        data={followMeList}
                                        keyExtractor={(item) => item.Follow_id}
                                        renderItem={({ item }) => (
                                            <View style={styles.list}>
                                                <View style={styles.ModalCube}>
                                                    <Image onPress={() => MoveToProfile(item)} source={{ uri: item.User_img }} style={styles.ModalUserImg} />
                                                    <Text onPress={() => MoveToProfile(item)} style={styles.ModalUserName}>{item.Username}</Text>
                                                </View>
                                            </View>
                                        )} />
                                </View>
                            </View>
                        </Modal>
                  
                ) : null}
                </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    //main container
    //main container
    container: {
        flex: 1,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //search holder
    search_holder: {
        alignItems: 'flex-start',
        margin: 8,
        height: 46,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 50,
        borderColor: 'grey',
    },
    search: {
        fontWeight: 'bold',
        marginRight: 12,
        marginLeft: 8,
        marginTop: 6,

        padding: 2,
        width: 280,
        fontSize: 20,


    },
    serach_icon: {
        padding: 2,
        marginTop: 7,
        marginLeft: 12,

    },
    //Profile part
    profileHolder: {
        flexWrap: 'wrap',
        //flex: 1,
        //justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 30,
        paddingHorizontal: 90,
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
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 10,

    },
    profile_image: {
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 90,
        // borderColor: 'orange',
        resizeMode: 'stretch',
        marginBottom: 10,

    },
    addTextHolder: {
        // justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    addText: {
        fontSize: 16,
    },
     //botton normal
     button_normal: {
        alignItems: 'center',
        margin: 15,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#633689"
    },
    profileFooter: {

        alignSelf: 'center',
        textAlign: 'center',
        margin: 5,
        //justifyContent: 'center',
        alignItems: 'center',
    },
    //Profile part
    // profileHolder: {
    //     flexWrap: 'wrap',
    //     //flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     alignSelf:'center',
    //     textAlign:'center',
    //     padding: 18,
    //     margin: 8,
    //     borderWidth: 1,
    //     borderRadius: 9,
    //     borderColor: 'grey',
    // },
    // profileHeader: {
    //     textAlign: 'center',
    //     margin: 5,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // username: {
    //     color: 'orange',
    //     fontSize: 25,
    //     fontWeight: 'bold',
    // },
    // imageHolder: {
    //     // flexDirection: 'row',
    //     // alignItems: 'flex-end'
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: 8

    // },
    // profile_image: {
    //     width: 120,
    //     height: 120,
    //     borderRadius: 100,
    //     borderWidth: 2,
    //     borderRadius: 90,
    //     resizeMode: 'stretch',

    // },
    // addTextHolder: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     textAlign: 'center',
    // },
    // addText: {
    //     fontSize: 16,
    // },
    // profileFooter: {
    //     margin: 5,
    //     padding: 5,
    // },

    list: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 16,
        padding: 28,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: 'grey',
        backgroundColor: "white",
        color: "black",
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
      //modal style
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
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
        textAlign: 'center',
    },
    ModalUserImg: {
        width: 33,
        height: 33,

        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 90,
        resizeMode: 'stretch',
    },
    ModalUserName: {
        marginLeft: 5,
        fontWeight: "bold",
    },
    ModalCube: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },

   
});