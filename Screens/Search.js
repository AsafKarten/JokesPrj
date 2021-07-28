import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';


const urlLocal = "http://localhost:52763/"
const url = "http://ruppinmobile.tempdomain.co.il/site27/"

const Search = ({ navigation, route }) => {
    const [searchTitle, onChangeTitle] = useState();
    const user = route.params.route.user
    useEffect(() => {
        (async () => {
            if (route.params.route.search !== undefined) {
                onChangeTitle(route.params.route.search)
            }
            SearchJoke(searchTitle);
        })()
    }, []);

    const LoadSearch = () => {
        console.log(searchTitle);
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
            <TextInput
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
            <Button
                title="search"
                onPress={() => LoadSearch(searchTitle)}
            />
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

});

export default Search;
