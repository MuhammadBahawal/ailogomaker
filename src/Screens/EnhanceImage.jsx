import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import EnhancePreview from '../Components/EnhancePreview';
import GradientLayer from '../Components/GradientLayer';

const EnhanceImage = ({onBack}) => {
  const [hasEnhancedImage, setHasEnhancedImage] = useState(false);

  const handleUpload = () => {
    setHasEnhancedImage(true);
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Enhanced image export integration abhi connect nahi hui.');
  };

  const handleShare = async () => {
    await Share.share({
      message: 'Enhanced image is ready to share.',
    });
  };

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
            <EnhancePreview processed={hasEnhancedImage} />
          </View>

          {hasEnhancedImage ? (
            <View style={styles.actionStack}>
              <Pressable onPress={handleDownload} style={styles.primaryButton}>
                <GradientLayer
                  borderRadius={30}
                  colors={['#F2A53B', '#D93D9E']}
                  gradientId="enhance-download"
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
                gradientId="enhance-upload"
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
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0C8CFF',
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
  actionStack: {
    marginTop: 14,
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
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '700',
    zIndex: 1,
  },
  secondaryButton: {
    marginTop: 12,
    marginHorizontal: 46,
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

export default EnhanceImage;
