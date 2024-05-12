import Toast from 'react-native-toast-message';

export const showError = (message) => {
  Toast.show({
    type: 'error',
    text1: 'Error !',
    text2: message
  });
};
export const showInfo = (message) => {
  Toast.show({
    type: 'info',
    text1: message || 'This is an info message'
  });
};
export const showSuccess = (message) => {
  Toast.show({
    type: 'success',
    text1: 'Success! ',
    text2: message
  });
};
export const showWarning = (message) => {
  Toast.show({
    type: 'warningToast',
    text1: 'Warning !',
    text2: message
  });
};

