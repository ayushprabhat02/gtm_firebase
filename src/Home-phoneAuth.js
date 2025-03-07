// import {StyleSheet, Text, View, TextInput, Button, Alert} from 'react-native';
// import React, {useState, useEffect} from 'react';
// import auth from '@react-native-firebase/auth';

// const Home = ({navigation}) => {
//   //state
//   const [phone, setPhone] = useState();
//   const [confirm, setConfirm] = useState(null);
//   const [code, setCode] = useState('');
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   //function
//   async function signInWithPhoneNumber(phoneNumber) {
//     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//     setConfirm(confirmation);
//   }

//   async function confirmCode() {
//     try {
//       await confirm.confirm(code);
//     } catch (error) {
//       console.log('Invalid code.');
//       Alert.alert('Invalid code');
//     }
//   }

//   // Handle user state changes
//   function onAuthStateChanged(user) {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   }

//   const logoutHandler = async () => {
//     try {
//       await auth().signOut();
//     } catch {
//       console.log('signout error');
//     } finally {
//       user(null);
//     }
//   };

//   // sideEffect
//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//   }, []);

//   if (initializing) return null;

//   if (!user) {
//     if (!confirm) {
//       return (
//         <>
//           <TextInput
//             value={phone}
//             onChangeText={text => setPhone(text)}
//             style={{borderWidth: 1, margin: 20, padding: 10, fontSize: 20}}
//             inputMode="numeric"
//             maxLength={10}
//           />
//           <Button
//             title="Phone Number Sign In"
//             onPress={() => signInWithPhoneNumber('+91 9988776655')}
//           />
//         </>
//       );
//     }
//     return (
//       <View style={{padding: 20}}>
//         <TextInput
//           value={code}
//           onChangeText={text => setCode(text)}
//           style={{borderWidth: 1, padding: 20}}
//         />
//         <Button title="Confirm Code" onPress={() => confirmCode()} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text>Welcome {user?.email}</Text>
//       <Button title="Logout" onPress={logoutHandler} />
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
// });

import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, BackHandler} from 'react-native';
import auth from '@react-native-firebase/auth';

const Home = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [user, setUser] = useState(null);

  // Step 1: Send OTP
  const sendOTP = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setConfirm(confirmation);
      Alert.alert('OTP Sent!', 'Check your phone for the verification code.');
    } catch (error) {
      console.log('Error', error.message);
    }
  };

  // Step 2: Verify OTP and Exit App
  const verifyOTP = async () => {
    try {
      const result = await confirm.confirm(code);
      setUser(result.user);
      Alert.alert('Success', 'You are logged in!');
      setTimeout(() => {
        BackHandler.exitApp(); // Closes the app after login
      }, 1000);
    } catch (error) {
      Alert.alert('Invalid OTP', 'Please enter the correct code.');
    }
  };

  return (
    <View style={{padding: 20}}>
      {user ? (
        <>
          <Text>Welcome, {user.phoneNumber}</Text>
        </>
      ) : confirm ? (
        <>
          <Text>Enter OTP:</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{borderWidth: 1, padding: 10, marginVertical: 10}}
          />
          <Button title="Verify OTP" onPress={verifyOTP} />
        </>
      ) : (
        <>
          <Text>Enter Phone Number:</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 9988776655"
            style={{borderWidth: 1, padding: 10, marginVertical: 10}}
            maxLength={10}
          />
          <Button title="Send OTP" onPress={sendOTP} />
        </>
      )}
    </View>
  );
};

export default Home;
