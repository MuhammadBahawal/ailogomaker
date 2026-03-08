import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

const PHOTO_PICKER_CONSENT_KEY = '@ai-logo-maker/photo-picker-consent-v1';

let hasPhotoPickerConsent = false;
let consentRequestPromise = null;

const persistConsent = async () => {
  hasPhotoPickerConsent = true;

  try {
    await AsyncStorage.setItem(PHOTO_PICKER_CONSENT_KEY, 'accepted');
  } catch (error) {
    console.warn('Could not persist photo picker consent', error);
  }
};

export const ensurePhotoPickerConsent = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (hasPhotoPickerConsent) {
    return true;
  }

  if (consentRequestPromise) {
    return consentRequestPromise;
  }

  consentRequestPromise = (async () => {
    try {
      const storedConsent = await AsyncStorage.getItem(PHOTO_PICKER_CONSENT_KEY);

      if (storedConsent === 'accepted') {
        hasPhotoPickerConsent = true;
        return true;
      }
    } catch (error) {
      console.warn('Could not read photo picker consent', error);
    }

    return new Promise(resolve => {
      let settled = false;

      const finish = async accepted => {
        if (settled) {
          return;
        }

        settled = true;

        if (accepted) {
          await persistConsent();
        }

        resolve(accepted);
      };

      Alert.alert(
        'Allow Photo Access',
        'We use Android system photo picker and only access the single image you choose. Your full gallery is not shared with the app.',
        [
          {
            text: 'Not Now',
            style: 'cancel',
            onPress: () => {
              finish(false).catch(error => {
                console.warn('Could not finish declined photo picker consent', error);
              });
            },
          },
          {
            text: 'Continue',
            onPress: () => {
              finish(true).catch(error => {
                console.warn('Could not finish accepted photo picker consent', error);
              });
            },
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {
            finish(false).catch(error => {
              console.warn('Could not dismiss photo picker consent', error);
            });
          },
        },
      );
    });
  })();

  try {
    return await consentRequestPromise;
  } finally {
    consentRequestPromise = null;
  }
};

export const pickSingleImageWithConsent = async options => {
  const hasConsent = await ensurePhotoPickerConsent();

  if (!hasConsent) {
    return {
      didCancel: true,
    };
  }

  return launchImageLibrary(options);
};
