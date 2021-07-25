import 'react-native-gesture-handler';
import React from 'react';
import StackNavigation from './Components/StackNavigation'
import { StyleSheet } from 'react-native';

export default function App() {

  return (
    <StackNavigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
