import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

const backgroundImage = require('../assets/images/upscaleBackground.jpg');
const leftSampleImage = require('../assets/images/upscaleblackShade.png');
const rightSampleImage = require('../assets/images/upscaleNormal.png');

const CLOSE_BUTTON_SIZE = 32;

const UpscalePreview = ({
  bottomInset = 112,
  onClearImage,
  selectedImageUri,
  topInset = 96,
}) => {
  const {width, height} = useWindowDimensions();
  const sampleWidth = Math.min(width * 0.3, 112);
  const sampleHeight = Math.round(sampleWidth * 1.15);
  const hasSelectedImage = Boolean(selectedImageUri);
  const usableHeight = Math.max(height - topInset - bottomInset, 280);
  const selectedCardWidth = Math.min(width - 32, 384);
  const selectedCardHeight = Math.min(
    Math.round(selectedCardWidth * 1.2),
    Math.max(usableHeight - 28, 260),
  );
  const previewCardTop = hasSelectedImage
    ? topInset + Math.max((usableHeight - selectedCardHeight) * 0.18, 8)
    : topInset + Math.max(usableHeight * 0.08, 18);
  const leftSampleTop = topInset + usableHeight * 0.54;
  const rightSampleTop = topInset + usableHeight * 0.68;

  return (
    <View style={styles.wrap}>
      <Image resizeMode="cover" source={backgroundImage} style={styles.backgroundImage} />

      {hasSelectedImage ? (
        <View
          style={[
            styles.previewCardShell,
            {
              width: selectedCardWidth,
              height: selectedCardHeight,
              marginTop: previewCardTop,
            },
          ]}>
          <Pressable
            hitSlop={8}
            onPress={onClearImage}
            style={styles.closeButton}>
            <Text style={styles.closeButtonLabel}>X</Text>
          </Pressable>
          <View style={styles.previewCard}>
            <Image
              resizeMode="contain"
              source={{uri: selectedImageUri}}
              style={styles.uploadedImage}
            />
          </View>
        </View>
      ) : (
        <>
          <View
            style={[
              styles.sampleCard,
              styles.leftSampleWrap,
              {
                width: sampleWidth,
                height: sampleHeight,
                top: leftSampleTop,
              },
            ]}>
            <Image
              resizeMode="cover"
              source={leftSampleImage}
              style={styles.sampleImage}
            />
          </View>
          <View
            style={[
              styles.sampleCard,
              styles.rightSampleWrap,
              {
                width: sampleWidth,
                height: sampleHeight,
                top: rightSampleTop,
              },
            ]}>
            <Image
              resizeMode="cover"
              source={rightSampleImage}
              style={styles.sampleImage}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    overflow: 'hidden',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  previewCardShell: {
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    padding: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.26,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    elevation: 9,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    borderRadius: CLOSE_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(12, 12, 12, 0.56)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  closeButtonLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '700',
  },
  previewCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  sampleCard: {
    position: 'absolute',
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },
  leftSampleWrap: {
    left: 14,
    transform: [{rotate: '-12deg'}],
  },
  rightSampleWrap: {
    right: 14,
    transform: [{rotate: '9deg'}],
  },
  sampleImage: {
    width: '100%',
    height: '100%',
  },
});

export default UpscalePreview;
