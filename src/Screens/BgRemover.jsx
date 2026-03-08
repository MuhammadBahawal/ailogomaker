import React, {useState} from 'react';
<<<<<<< HEAD
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
=======
import {Alert, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
import {SafeAreaView} from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import BgRemoverPreview from '../Components/BgRemoverPreview';
import GradientLayer from '../Components/GradientLayer';
<<<<<<< HEAD
import {
  pickerImageOptions,
  removePickedImageBackground,
} from '../utils/aiImageProcessing';
import {pickSingleImageWithConsent} from '../utils/photoPickerAccess';

const BgRemover = ({onBack}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [removedImageUri, setRemovedImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasSelectedImage = Boolean(selectedAsset?.uri);

  const handleSelectImage = async () => {
    if (isProcessing) {
      return;
    }

    try {
      const response = await pickSingleImageWithConsent(pickerImageOptions);

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

      if (!asset?.uri || !asset?.base64) {
        Alert.alert(
          'Upload failed',
          'Could not prepare the selected image for background removal.',
        );
        return;
      }

      setSelectedAsset(asset);
      setRemovedImageUri(null);
    } catch (error) {
      console.error('Image picker failed', error);
      Alert.alert('Upload failed', 'Could not open the image picker.');
    }
  };

  const handleRemoveBackground = async () => {
    if (!selectedAsset) {
      await handleSelectImage();
      return;
    }

    try {
      setIsProcessing(true);
      const result = await removePickedImageBackground(selectedAsset);
      setRemovedImageUri(result.uri);
    } catch (error) {
      console.error('Background removal failed', error);
      Alert.alert(
        'BG Remove failed',
        'The selected image could not be processed on this device.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const primaryLabel = !hasSelectedImage
    ? 'Upload Your Image'
    : isProcessing
      ? 'Removing...'
      : 'BG Remove';
=======

const BgRemover = ({onBack}) => {
  const [stage, setStage] = useState('upload');

  const handlePrimaryAction = () => {
    if (stage === 'upload') {
      setStage('ready');
      return;
    }

    if (stage === 'ready') {
      setStage('removed');
      return;
    }

    Alert.alert('Download', 'Background removed image export integration abhi connect nahi hui.');
  };

  const buttonLabelByStage = {
    upload: 'Upload Your Image',
    ready: 'BG Remove',
    removed: 'Download',
  };
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar animated barStyle="dark-content" />
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <ArrowLeftIcon color="#151515" height={20} width={20} />
          </Pressable>
          <Text style={styles.title}>BG Remove</Text>
        </View>

        <View style={styles.previewWrap}>
<<<<<<< HEAD
          <BgRemoverPreview
            imageUri={selectedAsset?.uri}
            removedImageUri={removedImageUri}
          />
        </View>

        <Pressable
          disabled={isProcessing}
          onPress={hasSelectedImage ? handleRemoveBackground : handleSelectImage}
          style={[styles.primaryButton, isProcessing && styles.buttonDisabled]}>
=======
          <BgRemoverPreview stage={stage} />
        </View>

        <Pressable onPress={handlePrimaryAction} style={styles.primaryButton}>
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
          <GradientLayer
            borderRadius={26}
            colors={['#F2A53B', '#D93D9E']}
            gradientId="bg-remover-primary"
          />
<<<<<<< HEAD
          <View style={styles.buttonContent}>
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" style={styles.loader} />
            ) : null}
            <Text style={styles.primaryLabel}>{primaryLabel}</Text>
          </View>
        </Pressable>

        {hasSelectedImage ? (
          <Pressable
            disabled={isProcessing}
            onPress={handleSelectImage}
            style={[styles.secondaryButton, isProcessing && styles.buttonDisabled]}>
            <Text style={styles.secondaryLabel}>Change Image</Text>
          </Pressable>
        ) : null}
=======
          <Text style={styles.primaryLabel}>{buttonLabelByStage[stage]}</Text>
        </Pressable>
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingTop: 6,
<<<<<<< HEAD
    paddingBottom: 22,
=======
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: '#151515',
  },
  previewWrap: {
    marginTop: 14,
    flex: 1,
  },
  primaryButton: {
    marginHorizontal: 8,
<<<<<<< HEAD
=======
    marginBottom: 26,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
<<<<<<< HEAD
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  loader: {
    marginRight: 8,
  },
=======
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
<<<<<<< HEAD
  },
  secondaryButton: {
    marginTop: 12,
    marginHorizontal: 8,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6B6A70',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '700',
=======
    zIndex: 1,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
});

export default BgRemover;
