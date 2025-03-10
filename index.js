import {AppRegistry, AppState} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import NavigationService from './src/NavigationService';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);
