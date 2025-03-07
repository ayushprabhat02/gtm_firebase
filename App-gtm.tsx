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
      loginId: 'test_5678',
    });
  };

  const customFunc = async () => {
    await analytics().logEvent('Modify_Event', {
      id: 'sufhsidu_39847923',
      item: 'product 1',
      description: 'sports, cricket', // Convert array to string
      sizes: '9',
    });
    console.log('Modify_Event');
  };

  const editFun = async () => {
    await analytics().logEvent('Edit_Event', {
      editId: 'product 1',
    });
    console.log('Edit_Event');
  };

  const testFun = async () => {
    await analytics().logEvent('Test_Event', {
      editId: 'Test 1',
    });
    console.log('TestFun');
  };

  const localFun = async () => {
    await analytics().logEvent('Local_Event');
    console.log('Local_Event');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="login event" onPress={loginFun} />
      <Button title="Edit event" onPress={editFun} />
      <Button title="Test event" onPress={testFun} />
      <Button title="Local event" onPress={localFun} />
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
