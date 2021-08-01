import React, { useState, useEffect, useRef } from 'react';
import { Alert, Modal, TouchableHighlight, Platform, Button, StyleSheet, Image, Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActionSheet from 'react-native-actionsheet';
import * as FileSystem from 'expo-file-system';
import { ScrollView } from 'react-native';
import Loader from '../Components/Loader';

const url = "http://ruppinmobile.tempdomain.co.il/site27/"
const urlLocal = "http://localhost:52763/"

const default_img = "http://ruppinmobile.tempdomain.co.il/site27/Assets/funny_icon.jpg"

export default function Profile({ navigation, user }) {
    let actionSheet = useRef();
    var optionArray = ['take a photo', 'choose from a gallery', 'Cancel'];
    const [shouldShow, setShouldShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(user.Id_user);
    const [username, setUserName] = useState('');
    const [image, setImage] = useState(user.User_img);
    const [search, onChangeSearch] = useState('');
    const [profileJokes, setList] = useState([
        { Id_joke: 0, Id_user: 0, Joke_title: '', Joke_body: '', Joke_likes: 0, Joke_img: default_img, Username: '', User_img: default_img, Comment_count: 0 },
    ]);
    const [iFollowList, setIFollowList] = useState();
    const [followMeList, setFollowMeList] = useState();
    const [modalIFollowVisible, setIF_ModalVisible] = useState(false);
    const [modalFollowMeVisible, setFM_ModalVisible] = useState(false);

    useEffect(() => {
        (async () => {
            if (user !== undefined) {
                setUserName(user.Username)
                if (user.User_img.indexOf("?asid") == -1)
                    setImage(`${user.User_img}?t=${Date.now()}`)
                setUserId(user.Id_user)
                LoadJokes(user.Id_user)
                LoadIFollowList(user.Id_user)
                LoadFollowMeList(user.Id_user)
            }
            if (Platform.OS !== 'web') {
                setShouldShow(true)
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Sorry, we need media permissions to make this work!');
                }
            }
        })()
    }, [])

    useEffect(() => {
        const loaderjokes = navigation.addListener('focus', () => {
            if (user !== undefined) {
                setUserName(user.Username)
                LoadJokes(user.Id_user)
                LoadIFollowList(user.Id_user)
                LoadFollowMeList(user.Id_user)
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

    const checkDevice = async () => {
        if (Platform.OS === 'web') {
            await GalleryPicture();
        }
        else {
            showActionSheet();
        }
    }

    const showActionSheet = () => {
        actionSheet.current.show();
    };

    const takePicture = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.1
            });
            if (!result.cancelled) {
                if (Platform.OS !== 'web') {
                    const content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                    result.uri = content
                    await imageUploadA(result.uri, username)
                }
                else {
                    await imageUpload(result.uri, username);
                }
            }
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
                    setLoading(true);
                    var content = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
                    result.uri = content
                    await imageUploadA(result.uri, username)
                }
                else {
                    setLoading(true);
                    await imageUpload(result.uri, username);
                }
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
            if (data.path.indexOf("?asid") == -1)
                setImage(`${data.path}?t=${Date.now()}`)
            await updateLoggedUser(userId);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const imageUploadA = async (imgUri, picName) => {
        try {
            let res = await fetch(url + "api/uploadpicture", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    uri: imgUri,
                    name: picName,
                    folder: userId,
                    type: 'jpg',
                })
            });
            let data = await res.json();
            //if (data.path.indexOf("?asid") == -1)
            await setImage(`${data.path}?t=${Date.now()}`)
            await updateLoggedUser(userId);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    }

    const updateLoggedUser = async (userId) => {
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
            if (data.User_img.indexOf("?asid") == -1)
                data.User_img = `${data.User_img}?t=${Date.now()}`;
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

    const SearchFunc = () => {
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

    const MoveToJoke = (item) => {
        var route = { user: user, item: item }
        navigation.navigate("Joke", { navigation: navigation, route: route });
    }
    const Edit = () => {
        navigation.navigate("EditProfile", { navigation: navigation, route: user });
    }

    const LoadIFollowList = async (id_user) => {
        try {
            let result = await fetch(url + "api/i/follow", {
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
            setIFollowList(data);
        } catch (e) {
            console.error(e)
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
        } catch (e) {
            console.error(e)
        }
    }

    const MoveToProfile = (item) => {
        //for i follow
        if (item.Id_user == user.Id_user) {
            item.Id_user = item.Target_id
            var route = { user: user, item: item }
            navigation.navigate("FriendProfile", { navigation: navigation, route: route });
        }
        //for follow me
        else {
            var route = { user: user, item: item }
            navigation.navigate("FriendProfile", { navigation: navigation, route: route });
        }

    }


    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.search_holder}>
                    <TextInput style={styles.search}
                        onFocus={() => SearchFunc(search)}
                        onChangeText={onChangeSearch}
                        value={search}

                        //onPress={SearchFunc(search)}
                        placeholder="Search friends/jokes" />
                    <FontAwesome style={styles.serach_icon} onPress={() => SearchFunc(search)} name="search" size={24} color="grey" />
                </View>
                <View style={styles.profileHolder}>

                    <Text style={styles.username}>{username}</Text>

                    <Image style={styles.profile_image} source={{ uri: image }} />
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={checkDevice}>
                        <Text style={styles.buttonTextStyle}>
                            <AntDesign style={styles.add_icon} name="camera" size={24} color="grey" fontWeight={'bold'} />
                        </Text>
                    </TouchableOpacity>
                    {shouldShow ? (
                        <Loader loading={loading} />
                    ) : null}
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={Edit}>
                        <Text style={styles.buttonTextStyle}>
                            <AntDesign style={styles.add_icon} name="edit" size={24} color="grey" fontWeight={'bold'} />
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.addText}>Add a funny piture of yourself</Text>

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity onPress={() => LikeJokes(user)}>
                            <View style={styles.button_normal}>
                                <Text style={styles.textBtn}>Jokes you like</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFM_ModalVisible(true)}>
                            <View style={styles.button_normal}>
                                <Text style={styles.textBtn}>Followers</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIF_ModalVisible(true)}>
                            <View style={styles.button_normal}>
                                <Text style={styles.textBtn}>Following</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => AddJoke()}>
                        <View style={styles.button_normal}>
                            <Text style={styles.textBtn}>Add new Joke</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
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
                {shouldShow ? (
                    <View>
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

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalIFollowVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>people you follow</Text>
                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                                        onPress={() => {
                                            setIF_ModalVisible(!modalIFollowVisible);
                                        }}>
                                        <Text style={styles.textStyle}>Close</Text>
                                    </TouchableHighlight>
                                    <FlatList
                                        data={iFollowList}
                                        keyExtractor={(item) => item.Follow_id}
                                        renderItem={({ item }) => (
                                            <View style={styles.list}>
                                                <View style={styles.ModalCube}>
                                                    <Image onPress={() => MoveToProfile(item)} source={{ uri: item.Target_img }} style={styles.ModalUserImg} />
                                                    <Text onPress={() => MoveToProfile(item)} style={styles.ModalUserName}>{item.Target_username}</Text>
                                                </View>
                                            </View>
                                        )} />
                                </View>
                            </View>
                        </Modal>
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
                                        <Text style={styles.textStyle}>Close</Text>
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
                    </View>
                ) : null}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    //botton normal
    button_normal: {
        alignItems: 'center',
        margin: 5,
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#942bed"
    },
    //txt botton normal
    textBtn: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
        fontFamily: "sans-serif"
    },
    search: {
        fontWeight: 'bold',
        marginRight: 12,
        marginLeft: 8,
        marginTop: 6,
        padding: 2,
        width: 280,
        fontSize: 20
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
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
        marginTop: 8

    },
    profile_image: {
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 2,
        borderRadius: 90,
        // borderColor: 'orange',
        resizeMode: 'stretch',

    },
    addTextHolder: {
        // justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    addText: {
        fontSize: 16,
    },
    profileFooter: {

        alignSelf: 'center',
        textAlign: 'center',
        margin: 5,
        //justifyContent: 'center',
        alignItems: 'center',
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
    buttonTextStyle: {
        color: 'white',
        textAlign: 'center',
    },
    camera: {
        flex: 1
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    buttonSetType: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    btnTakePicture: {
        borderRadius: 50,
        backgroundColor: '#fff'
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