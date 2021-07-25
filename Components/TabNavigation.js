
import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Profile from '../Screens/Profile';
import Home from '../Screens/Home';
import Notifications from '../Screens/Notifications.js';

const Tab = createMaterialTopTabNavigator();

export default function TabStack({ route }) {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBarOptions={{
                activeTintColor: '#FFFFFF',
                inactiveTintColor: '#F8F8F8',
                style: {
                    backgroundColor: '#633689',
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
                //component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="home" color="black" size={24} />
                    ),
                }}>
                {props => <Home {...props} user={route.params.user} />}
                </Tab.Screen>
            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    tabBarLabel: 'Updates',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="bell" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                //component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="account" color={color} size={24} />
                    ),
                }}>
                {props => <Profile {...props} user={route.params.user} />}
            </Tab.Screen>


        </Tab.Navigator>
    );
}