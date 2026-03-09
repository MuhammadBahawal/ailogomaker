import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import EnhancePreview from '../Components/EnhancePreview';
import GradientLayer from '../Components/GradientLayer';
import {enhancePickedImage, pickerImageOptions} from '../utils/aiImageProcessing';
import {pickSingleImageWithPrompt} from '../utils/photoPickerAccess';

const EnhanceImage = ({onBack}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [enhancedImageUri, setEnhancedImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasSelectedImage = Boolean(selectedAsset?.uri);

  const handleSelectImage = async () => {
    if (isProcessing) {
      return;
    }

    try {
      const response = await pickSingleImageWithPrompt(pickerImageOptions);

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
          'Could not prepare the selected image for enhancement.',
        );
        return;
      }

      setSelectedAsset(asset);
      setEnhancedImageUri(null);
    } catch (error) {
      console.error('Image picker failed', error);
      Alert.alert('Upload failed', 'Could not open the image picker.');
    }
  };

  const handleEnhanceImage = async () => {
    if (!selectedAsset) {
      await handleSelectImage();
      return;
    }

    try {
      setIsProcessing(true);
      const result = await enhancePickedImage(selectedAsset);
      setEnhancedImageUri(result.uri);
    } catch (error) {
      console.error('Enhance image failed', error);
      Alert.alert(
        'Enhance failed',
        'The selected image could not be enhanced on this device.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const primaryLabel = !hasSelectedImage
    ? 'Upload Image'
    : isProcessing
      ? 'Enhancing...'
      : 'Enhance Image';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar animated barStyle="dark-content" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable onPress={onBack} style={styles.backButton}>
              <ArrowLeftIcon color="#141414" height={20} width={20} />
            </Pressable>
            <Text style={styles.title}>Enhance Image</Text>
          </View>

          <View style={styles.previewShell}>
            <EnhancePreview
              enhancedImageUri={enhancedImageUri}
              imageUri={selectedAsset?.uri}
            />
          </View>

          <Pressable
            disabled={isProcessing}
            onPress={hasSelectedImage ? handleEnhanceImage : handleSelectImage}
            style={[styles.primaryButton, isProcessing && styles.buttonDisabled]}>
            <GradientLayer
              borderRadius={30}
              colors={['#F2A53B', '#D93D9E']}
              gradientId="enhance-primary"
            />
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
              <GradientLayer
                borderRadius={29}
                colors={['#F2A53B', '#D93D9E']}
                gradientId="enhance-secondary"
              />
              <Text style={styles.secondaryLabel}>Change Image</Text>
            </Pressable>
          ) : null}
        </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 28,
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
    marginRight: 6,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: '#151515',
  },
  previewShell: {
    marginTop: 24,
    marginHorizontal: 6,
  },
  primaryButton: {
    marginTop: 18,
    marginHorizontal: 46,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 12,
    marginHorizontal: 46,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    zIndex: 1,
  },
});

export default EnhanceImage;
