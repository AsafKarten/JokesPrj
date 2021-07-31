import 'react-native-gesture-handler';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../Screens/Login';
import Registration from '../Screens/Registration';
import Profile from '../Screens/Profile';
import FriendProfile from '../Screens/FriendProfile';
import Post from '../Screens/Post';
import Search from '../Screens/Search';
import Home from '../Screens/Home';
import JokeMap from './JokeMap';
import Joke from '../Screens/Joke';
import TabNavigation from './TabNavigation';
import FavoriteJokes from '../Screens/FavoriteJokes';
import EditProfile from '../Screens/EditProfile';

const Stack = createStackNavigator();
const StackNavigation = () => {

    return (
        <NavigationContainer >
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="TabStack" component={TabNavigation} options={{ title: 'Tab Stack' }} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Registration" component={Registration} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen name="FriendProfile" component={FriendProfile} />
                    <Stack.Screen name="Post" component={Post} />
                    <Stack.Screen name="Search" component={Search} />
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="JokeMap" component={JokeMap} />
                    <Stack.Screen name="Joke" component={Joke} />
                    <Stack.Screen name="FavoriteJokes" component={FavoriteJokes} />
                </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigation;