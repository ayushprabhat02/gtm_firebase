import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import analytics from '@react-native-firebase/analytics'; // Import Firebase Analytics

const App = () => {
  const loginFun = async () => {
    await analytics().logLogin({
      method: 'google',
    });
    console.log('logFun');
    await analytics().logEvent('Login_Event', {
      loginId: 'test_1234',
    });
  };

  const customFunc = async () => {
    await analytics().logEvent('Modify_Event', {
      id: 'sufhsidu_39847923',
      item: 'product 1',
      description: 'sports, cricket', // Convert array to string
      sizes: '9',
    });
    console.log('customFunc');
  };

  const editFun = async () => {
    await analytics().logEvent('Edit_Event', {
      editId: 'product 1',
    });
    console.log('customFunc');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Button title="login event" onPress={loginFun} />
      <Button title="custom event" onPress={customFunc} />
      <Button title="Edit event" onPress={editFun} />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
