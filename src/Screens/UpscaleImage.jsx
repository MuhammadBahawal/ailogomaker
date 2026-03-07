import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import GradientLayer from '../Components/GradientLayer';
import UpscalePreview from '../Components/UpscalePreview';

const UpscaleImage = ({onBack}) => {
  const [hasUpscaledImage, setHasUpscaledImage] = useState(false);

  const handleUpload = () => {
    setHasUpscaledImage(true);
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Upscaled image export integration abhi connect nahi hui.');
  };

  const handleShare = async () => {
    await Share.share({
      message: 'Upscaled image is ready to share.',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar animated barStyle="light-content" />
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <Pressable onPress={onBack} style={styles.backButton}>
              <ArrowLeftIcon color="#FFFFFF" height={20} width={20} />
            </Pressable>
            <Text style={styles.title}>Upscale Image</Text>
          </View>

          <View style={styles.previewShell}>
            <UpscalePreview processed={hasUpscaledImage} />
          </View>

          {hasUpscaledImage ? (
            <View style={styles.actionStack}>
              <Pressable onPress={handleDownload} style={styles.primaryButton}>
                <GradientLayer
                  borderRadius={30}
                  colors={['#F2A53B', '#D93D9E']}
                  gradientId="upscale-download"
                />
                <Text style={styles.primaryLabel}>Download</Text>
              </Pressable>
              <Pressable onPress={handleShare} style={styles.secondaryButton}>
                <Text style={styles.secondaryLabel}>Share</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={handleUpload} style={styles.primaryButton}>
              <GradientLayer
                borderRadius={30}
                colors={['#F2A53B', '#D93D9E']}
                gradientId="upscale-upload"
              />
              <Text style={styles.primaryLabel}>Upload Your Image</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#161514',
  },
  screen: {
    flex: 1,
    backgroundColor: '#161514',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
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
    color: '#FFFFFF',
  },
  previewShell: {
    marginTop: 2,
  },
  actionStack: {
    marginTop: 18,
  },
  primaryButton: {
    marginTop: 18,
    marginHorizontal: 26,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    zIndex: 1,
  },
  secondaryButton: {
    marginTop: 12,
    marginHorizontal: 26,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#6B6A70',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
  },
});

export default UpscaleImage;
