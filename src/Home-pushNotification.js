import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  Button,
  useColorScheme,
  Alert,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Home = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const getFCMToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  };

  const onDisplayNotification = async (title, body) => {
    // Request permission (iOS only)
    await notifee.requestPermission();

    // Create a channel for Android
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    // Display the notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default', // This ID is used to handle taps
        },
      },
    });
  };

  // Handle notification click events when the app is in the foreground
  useEffect(() => {
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(
      ({type, detail}) => {
        if (type === EventType.PRESS) {
          console.log(
            'Notification clicked in foreground:',
            detail.notification,
          );
          navigation.navigate('Profile'); // Navigate to the Profile screen
        }
      },
    );

    return () => unsubscribeForegroundEvent();
  }, [navigation]);

  // Handle notification taps when the app is in the background or closed
  useEffect(() => {
    // Background state: App opened by tapping a notification
    const unsubscribeNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'App opened from background by notification:',
          remoteMessage,
        );
        navigation.navigate('Profile'); // Navigate to the Profile screen
      });

    // Killed state: Check if app was opened by a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'App opened from killed state by notification:',
            remoteMessage,
          );
          navigation.navigate('Profile'); // Navigate to the Profile screen
        }
      });

    return unsubscribeNotificationOpenedApp;
  }, [navigation]);

  useEffect(() => {
    getFCMToken();

    // Listen for foreground messages
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      const {title, body} = remoteMessage?.notification || {};
      console.log('Foreground message received:', title, body);
      onDisplayNotification(title, body); // Display the notification
    });

    return unsubscribeOnMessage;
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Push Notifications</Text>
          <Button
            title="Trigger Notification"
            onPress={() =>
              onDisplayNotification(
                'Test Notification',
                'This is a test message',
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
