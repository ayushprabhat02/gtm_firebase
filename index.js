import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import NavigationService from './src/NavigationService';
import messaging from '@react-native-firebase/messaging';

let notificationDisplay = false;

const displayNotification = async (title, body) => {
  try {
    const channelId = await notifee.createChannel({
      id: 'default-channel',
      name: 'Default Channel',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });
    if (AppState.currentState !== 'active' && !notificationDisplay) {
      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });
      notificationDisplay = true;
    }
  } catch (error) {
    console.log('----error------', error);
  }
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage) {
    const {title, body} = remoteMessage?.notification;
    await displayNotification(title, body);
  }
});

AppRegistry.registerComponent(appName, () => App);
