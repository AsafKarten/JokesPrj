import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View,Text } from 'react-native';
import { Input } from 'react-native-elements';
import Loader from '../Components/Loader'

const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"

const Search = ({ navigation, route }) => {
    const [searchTitle, onChangeTitle] = useState('');
    const user = route.params.route.user

    useEffect(() => {
        console.log(route);
        (async () => {
            if (route.params.route.search !== undefined) {
                onChangeTitle(route.params.route.search)

            }
            //SearchJoke(searchTitle);
        })()
    }, []);

    const LoadSearch = () => {
        SearchJoke(searchTitle);
    }

    const SearchJoke = async (searchTitle) => {
        if (searchTitle == null) { return; }
        else {
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
                var route = { user: user, jokeList: data, searchTitle: searchTitle };
                console.log(route);
                navigation.navigate("JokeMap", { navigation: navigation, route: route });
            } catch (e) {
                console.error(e)
            }
        }
    }

    return (
        <View>
            <Input
                style={styles.input}
                onChangeText={onChangeTitle}
                value={searchTitle}
                placeholder="Search"
            />
            {/* <Text>Filter by :</Text> */}
            {/* <View>
                <ButtonGroup
                    buttons={buttons}
                    onPress={updateIndex()}
                    selectedIndex={}
                    containerStyle={{ height: 40 }}
                    buttonContainerStyle={{ backgroundColor: 'cadetblue' }}
                    textStyle={{ color: '#fff' }}
                />
            </View> */}
            <TouchableOpacity onPress={() => LoadSearch(searchTitle)}>
                <View style={styles.button_normal}>
                    <Text style={styles.textBtn}>Search</Text>
                </View>
            </TouchableOpacity>
        </View>
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
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        fontFamily: "sans-serif"
    },
});

export default Search;
