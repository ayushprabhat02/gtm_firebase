import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Home = ({nDeviceToken}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      <Text>{nDeviceToken}</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
