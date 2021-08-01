import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View,Text } from 'react-native';
import { Input } from 'react-native-elements';

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
        <View style={styles.container}>
            <Input
                style={styles.input}
                onChangeText={onChangeTitle}
                value={searchTitle}
                placeholder="Search"
            />
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
        alignSelf:'center',
        width:350,
        maxWidth:400,
        flex: 1,
        alignItems: 'center',
        textAlign:'center',
        marginHorizontal:30,
        //justifyContent: 'center',
    },
    input: {
        //justifyContent:'center',
        marginTop:20,
        alignSelf:'center',
        width:200,
        maxWidth:400,
        height: 40,
        margin: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'center',
    },
    //botton normal
    button_normal: {
        alignSelf:'center',
        width:200,
        
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
