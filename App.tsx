import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import React, {useEffect} from 'react';
import {Linking, PermissionsAndroid, StyleSheet} from 'react-native';
import Home from './src/Home';
import NavigationService from './src/NavigationService';
import Profile from './src/Profile';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const NAVIGATION_IDS = ['home', 'profile'];

function buildDeepLinkFromNotificationData(data): string | null {
  console.log('------data----------', data);
  const navigationId = data?.navigationId;
  if (!NAVIGATION_IDS.includes(navigationId)) {
    console.warn('Unverified navigationId', navigationId);
    return null;
  }
  if (navigationId === 'home') {
    return 'myapp://home';
  }
  const notificationId = data?.notificationId;
  if (navigationId === 'profile') {
    return `myapp://profile/${notificationId}`;
  }
  console.warn('Missing postId');
  return null;
}

const linking = {
  enabled: 'auto' /* Automatically generate paths for all screens */,
  prefixes: ['myapp://'],
  initialRouteName: 'Home',
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:id',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (typeof url === 'string') {
      return url;
    }
    //getInitialNotification: When the application is opened from a quit state.
    const message = await messaging().getInitialNotification();
    const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
    if (typeof deeplinkURL === 'string') {
      return deeplinkURL;
    }
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    const linkingSubscription = Linking.addEventListener('url', onReceiveURL);

    //onNotificationOpenedApp: When the application is running, but in the background.
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      const url = buildDeepLinkFromNotificationData(remoteMessage.data);
      if (typeof url === 'string') {
        listener(url);
      }
    });

    return () => {
      linkingSubscription.remove();
      unsubscribe();
    };
  },
};

const Stack = createNativeStackNavigator();

const App = () => {
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
      console.log('---token---', token);
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    // Clear initial notification to prevent unwanted navigation
    messaging()
      .getInitialNotification()
      .then(message => {
        if (message) {
          console.log('Clearing initial notification:', message);
        }
      });

    // Setup Notifee Notification Channel
    async function setupChannel() {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
    setupChannel();

    // Handle foreground notifications
    const unsubscribeMessage = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);

      if (remoteMessage?.notification) {
        // Show a local notification
        await notifee.displayNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher',
            importance: AndroidImportance.HIGH,
          },
          data: remoteMessage.data, // Pass the data explicitly
        });
      }
    });

    // Handle user tapping on Notifee notifications
    const unsubscribeNotifee = notifee.onForegroundEvent(({type, detail}) => {
      console.log('--detail--', detail);
      if (type === EventType.PRESS) {
        console.log('User tapped the notification:', detail);
        const deepLink = buildDeepLinkFromNotificationData(
          detail?.notification?.data,
        );
        if (deepLink) {
          Linking.openURL(deepLink);
        }
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeNotifee();
    };
  }, []);

  return (
    <NavigationContainer
      ref={ref => NavigationService.setTopLevelNavigator(ref)}
      linking={linking}>
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
