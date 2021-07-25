import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function Header(props) {

    return (
        <View style={styles.header}>
            <Text style={styles.text}>{props.title}</Text>
        </View>
    );
};

// Header.defaultProps = {
//     title: 'Jokes',
// }

const styles = StyleSheet.create({
    header: {
        height: 30,
        width: "100%",
        backgroundColor: 'orange',
        textAlign: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 20,
    }
});