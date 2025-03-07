import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Alert, Platform, StyleSheet} from 'react-native';
import Home from './src/Home';
import Profile from './src/Profile';
import NavigationService from './src/NavigationService';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const [notificationData, setNotificationData] = useState();
  console.log('-notificationData-----', notificationData);

  // enable permission on android/ios and generate device token
  const requestNotificationPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      // console.log('---token---', token);
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    // Handle background notification click
    messaging().onNotificationOpenedApp((remoteMessage: any) => {
      setNotificationData(remoteMessage);
      NavigationService.navigate('Profile');
      console.log('remote notification detail 1', remoteMessage);
    });

    // Handle app opened from quit state
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log('------getInitialNotification---', remoteMessage);

        if (remoteMessage) {
          const lastNotificationId = await AsyncStorage.getItem(
            'lastNotificationId',
          );
          console.log('---lastNotificationId-----', lastNotificationId);

          if (lastNotificationId !== remoteMessage.messageId) {
            setNotificationData(remoteMessage);
            await AsyncStorage.setItem(
              'lastNotificationId',
              remoteMessage.messageId,
            );
            NavigationService.navigate('Profile');

            // ✅ Clear stored notification ID after short delay to prevent re-navigation
            setTimeout(() => {
              AsyncStorage.removeItem('lastNotificationId');
            }, 2000);
          }
        }
      })
      .catch(error => {
        console.log('Error fetching initial notification:', error);
      });
  }, []);

  // Foreground notification reciving
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // display on notifee
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }, []);

  // notifee to display in notification dropdown
  const onDisplayNotification = async (remoteMessage: any) => {
    // setNotificationData(remoteMessage);

    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default-channel',
      name: 'Default Channel',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default', // This ID is used to handle taps
        },
      },
    });
  };

  // handle click on background notifcaiton
  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      const lastNotificationId = await AsyncStorage.getItem(
        'lastNotificationId',
      );
      if (lastNotificationId !== detail.notification.id) {
        await AsyncStorage.setItem(
          'lastNotificationId',
          detail.notification.id,
        );
        NavigationService.navigate('Profile');

        // ✅ Clear notification ID after short delay
        setTimeout(() => {
          AsyncStorage.removeItem('lastNotificationId');
        }, 2000);
      }
    }
  });

  // handle click on foreground notification
  notifee.onForegroundEvent(async ({type, detail}) => {
    switch (type) {
      case EventType.PRESS:
        NavigationService.navigate('Profile');

        // ✅ Clear notification ID after short delay
        setTimeout(() => {
          AsyncStorage.removeItem('lastNotificationId');
        }, 2000);
        // }
        break;
    }
  });

  return (
    <NavigationContainer
      ref={ref => NavigationService.setTopLevelNavigator(ref)}>
      <Stack.Navigator screenOptions={{}}>
        <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
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
