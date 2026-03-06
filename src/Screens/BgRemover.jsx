import React, {useState} from 'react';
import {Alert, Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ArrowLeftIcon from '../assets/icons/arrow-left.svg';
import BgRemoverPreview from '../Components/BgRemoverPreview';
import GradientLayer from '../Components/GradientLayer';

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
          <BgRemoverPreview stage={stage} />
        </View>

        <Pressable onPress={handlePrimaryAction} style={styles.primaryButton}>
          <GradientLayer
            borderRadius={26}
            colors={['#F2A53B', '#D93D9E']}
            gradientId="bg-remover-primary"
          />
          <Text style={styles.primaryLabel}>{buttonLabelByStage[stage]}</Text>
        </Pressable>
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
    marginBottom: 26,
    height: 52,
    borderRadius: 26,
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
});

export default BgRemover;
