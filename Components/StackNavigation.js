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
                <Stack.Screen name="TabStack" component={TabNavigation} options={{
                    title: 'Jokes App', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="Login" component={Login} options={{
                    title: 'Login', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="Registration" component={Registration} options={{
                    title: 'Registration', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="Profile" component={Profile} options={{
                    title: 'My Profile', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="EditProfile" component={EditProfile} options={{
                    title: 'Edit Profile', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="FriendProfile" component={FriendProfile} options={{
                    title: 'Friend Profile', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="Post" component={Post} options={{
                    title: 'Post Joke', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="Search" component={Search} options={{
                    title: 'Search Joke', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="Home" component={Home} options={{
                    title: 'Feed', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="JokeMap" component={JokeMap} options={{
                    title: 'Results Search', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="Joke" component={Joke} options={{
                    title: 'Joke', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
                <Stack.Screen name="FavoriteJokes" component={FavoriteJokes} options={{
                    title: 'Favorite Jokes', headerStyle: {
                        backgroundColor: '#4d5b70',
                    },
                    headerTintColor: '#fff',
                }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigation;