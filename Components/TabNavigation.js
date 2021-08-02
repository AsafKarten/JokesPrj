
import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Profile from '../Screens/Profile';
import Home from '../Screens/Home';
import Search from '../Screens/Search';
import Notifications from '../Screens/Notifications.js';

const Tab = createMaterialTopTabNavigator();

export default function TabStack({ route }) {
    const [search_route, setSearch] = useState();
    const user = route.params.user
    useEffect(() => {
        (async () => {
            await SerachRoute();
           
        })()
    }, [])


    const SerachRoute = () => {
        let search = '';
        let route = { user: user, search: search };
        let params = { route };

        setSearch({ params: params });
    }


    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                activeTintColor: '#FFFFFF',
                inactiveTintColor: '#F8F8F8',
                style: {
                    backgroundColor: '#942bed',
                },
                labelStyle: {
                    textAlign: 'center',
                },
                indicatorStyle: {
                    borderBottomColor: '#87B56A',
                    borderBottomWidth: 2,
                },
            }}>
            <Tab.Screen
                name="Home"
                options={{
                    tabBarLabel: 'Feed',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="home" size={24} color="black" />
                    ),
                }}>
                {props => <Home {...props} user={route.params.user} />}
            </Tab.Screen>
            <Tab.Screen
                name="Search"
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="search" color={color} size={24} />
                    ),
                }}>
                {props => <Search {...props} route={search_route} />}
            </Tab.Screen>
            <Tab.Screen
                name="Profile"
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="account" color={color} size={24} />
                    ),
                }}>
                {props => <Profile {...props} user={route.params.user} />}
            </Tab.Screen>

        </Tab.Navigator>
    );
}