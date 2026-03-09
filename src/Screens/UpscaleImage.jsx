import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import GradientLayer from '../Components/GradientLayer';
import UpscalePreview from '../Components/UpscalePreview';
import {pickSingleImageWithConsent} from '../utils/photoPickerAccess';

const imagePickerOptions = {
  assetRepresentationMode: 'compatible',
  mediaType: 'photo',
  quality: 1,
  selectionLimit: 1,
};

const PRIMARY_BUTTON_HEIGHT = 56;
const CHANGE_BUTTON_HEIGHT = 44;
const BUTTON_STACK_GAP = 12;

const UpscaleImage = ({onBack}) => {
  const insets = useSafeAreaInsets();
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const hasSelectedImage = Boolean(selectedImageUri);
  const headerTop = insets.top + 10;
  const buttonBottom = Math.max(insets.bottom, 18) + 8;
  const changeButtonBottom = buttonBottom + PRIMARY_BUTTON_HEIGHT + BUTTON_STACK_GAP;
  const bottomOverlayHeight = hasSelectedImage
    ? changeButtonBottom + CHANGE_BUTTON_HEIGHT + 24
    : buttonBottom + PRIMARY_BUTTON_HEIGHT + 18;

  const handleSelectImage = async () => {
    try {
      const response = await pickSingleImageWithConsent(imagePickerOptions);

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert(
          'Upload failed',
          response.errorMessage ?? 'Something went wrong while selecting the image.',
        );
        return;
      }

      const asset = response.assets?.[0];

      if (!asset?.uri) {
        Alert.alert(
          'Upload failed',
          'Could not load a preview for the selected image.',
        );
        return;
      }

      setSelectedImageUri(asset.uri);
    } catch (error) {
      const errorMessage = error?.message ?? String(error);

      console.error('Image picker failed', errorMessage);
      Alert.alert('Upload failed', 'Could not open the image picker.');
    }
  };

  const handleClearImage = () => {
    setSelectedImageUri(null);
  };

  const handleUpscale = () => {
    Alert.alert('Upscale Image', 'Upscale processing is not connected yet.');
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar animated backgroundColor="transparent" barStyle="light-content" translucent />
      <View style={styles.screen}>
        <UpscalePreview
          bottomInset={bottomOverlayHeight}
          onClearImage={handleClearImage}
          selectedImageUri={selectedImageUri}
          topInset={headerTop + 40}
        />

        <View style={[styles.headerRow, {top: headerTop}]}>
          <Pressable hitSlop={10} onPress={onBack} style={styles.backButton}>
            <ArrowLeftIcon color="#FFFFFF" height={18} width={18} />
          </Pressable>
          <Text style={styles.title}>Upscale Image</Text>
        </View>

        <Pressable
          onPress={selectedImageUri ? handleUpscale : handleSelectImage}
          style={[styles.primaryButton, {bottom: buttonBottom}]}>
          <GradientLayer
            borderRadius={28}
            colors={['#F2A53B', '#D93D9E']}
            gradientId="upscale-primary"
          />
          <Text style={styles.primaryLabel}>
            {hasSelectedImage ? 'Upscale Image' : 'Upload Your Image'}
          </Text>
        </Pressable>

        {hasSelectedImage ? (
          <Pressable
            onPress={handleSelectImage}
            style={[styles.changeButton, {bottom: changeButtonBottom}]}>
            <Text style={styles.changeButtonLabel}>Change Image</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  screen: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerRow: {
    position: 'absolute',
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 6,
  },
  primaryButton: {
    position: 'absolute',
    left: 18,
    right: 18,
    height: PRIMARY_BUTTON_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '700',
    zIndex: 1,
  },
  changeButton: {
    position: 'absolute',
    alignSelf: 'center',
    minWidth: 156,
    paddingHorizontal: 22,
    height: CHANGE_BUTTON_HEIGHT,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.78)',
    backgroundColor: 'rgba(11, 11, 11, 0.36)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  changeButtonLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
});

export default UpscaleImage;
