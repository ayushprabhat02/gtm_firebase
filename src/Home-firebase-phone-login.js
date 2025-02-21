import {StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

const Home = ({navigation}) => {
  //state
  const [phone, setPhone] = useState();
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  console.log('------user------', JSON.stringify(user));
  console.log('------phone-----', phone);
  //function
  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log('Invalid code.');
      Alert.alert('Invalid code');
    }
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const logoutHandler = async () => {
    try {
      await auth().signOut();
    } catch {
      console.log('signout error');
    } finally {
      user(null);
    }
  };

  // sideEffect
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    if (!confirm) {
      return (
        <>
          <TextInput
            value={phone}
            onChangeText={text => setPhone(text)}
            style={{borderWidth: 1, margin: 20}}
            inputMode="numeric"
            maxLength={10}
          />
          <Button
            title="Phone Number Sign In"
            onPress={() => signInWithPhoneNumber('+91 9988776655')}
          />
        </>
      );
    }
    return (
      <View style={{padding: 20}}>
        <TextInput
          value={code}
          onChangeText={text => setCode(text)}
          style={{borderWidth: 1}}
        />
        <Button title="Confirm Code" onPress={() => confirmCode()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}</Text>
      <Button title="Logout" onPress={logoutHandler} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
