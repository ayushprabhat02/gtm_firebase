import {CommonActions} from '@react-navigation/native';

let navigator = null;

function setTopLevelNavigator(navigationRef) {
  navigator = navigationRef;
}

function navigate(routeName, params) {
  navigator.navigate(routeName, params);
}

function goBack() {
  navigator?.dispatch(CommonActions.goBack());
}

export default {
  setTopLevelNavigator,
  navigate,
  goBack,
};
