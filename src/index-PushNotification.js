import {AppRegistry, AppState} from 'react-native';
import App from '../App';
import {name as appName} from '../app.json';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import NavigationService from './NavigationService';
import messaging from '@react-native-firebase/messaging';

let notificationDisplay = false;

const displayNotification = async (title, body) => {
  try {
    const channelId = await notifee.createChannel({
      vibration: true,
      sound: 'default',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [300, 500],
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

const foregroundMessageHandler = async remoteMessage => {
  if (remoteMessage) {
    const {title, body} = remoteMessage?.notification;
    await displayNotification(title, body);
    NavigationService.navigate('Profile');
  }
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  if (remoteMessage) {
    const {title, body} = remoteMessage?.notification;
    await displayNotification(title, body);
    NavigationService.navigate('Profile');
  }
});

messaging()
  .getInitialNotification()
  .then(async remoteMessage => {
    if (remoteMessage) {
      const {title, body} = remoteMessage?.notification;
      await displayNotification(title, body);
      NavigationService.navigate('Profile');
    }
  });

AppRegistry.registerComponent(appName, () => App);

notifee.onForegroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.DISMISSED:
      console.log('user dismissed notification');
      break;
    case EventType.PRESS:
      setTimeout(() => {
        NavigationService.navigate('Profile');
      }, 1000);
      console.log('User Pressed Notification', detail.notification);
      break;
  }
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.DISMISSED:
      console.log('user dismissed notification');
      break;
    case EventType.PRESS:
      setTimeout(() => {
        NavigationService.navigate('Profile');
      }, 1000);
      console.log('User Pressed Notification', detail.notification);
      break;
  }
});
