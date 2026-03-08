import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import EnhanceArtwork from '../assets/images/enhance.svg';

const CropFrame = ({highlighted, style}) => {
  return (
    <View
      style={[
        styles.cropFrame,
        highlighted ? styles.cropFrameActive : styles.cropFrameIdle,
        style,
      ]}
    />
  );
};

const SampleCard = ({source, style}) => {
  return (
    <View style={[styles.sampleCard, style]}>
      <Image resizeMode="cover" source={{uri: source}} style={styles.sampleImage} />
    </View>
  );
};

const EnhancePreview = ({enhancedImageUri, imageUri}) => {
  if (!imageUri) {
    return (
      <View style={styles.canvas}>
        <EnhanceArtwork height="100%" width="100%" />
      </View>
    );
  }

  const comparisonUri = enhancedImageUri ?? imageUri;

  return (
    <View style={styles.canvas}>
      <View style={styles.heroCard}>
        <Image resizeMode="cover" source={{uri: imageUri}} style={styles.heroImage} />
        {enhancedImageUri ? (
          <>
            <Image
              resizeMode="cover"
              source={{uri: enhancedImageUri}}
              style={styles.enhancedSlice}
            />
            <View style={styles.splitLine} />
          </>
        ) : (
          <View style={styles.imageOverlay} />
        )}

        <CropFrame highlighted={Boolean(enhancedImageUri)} style={styles.faceFocus} />
        <CropFrame highlighted={Boolean(enhancedImageUri)} style={styles.eyeFocus} />

        <View style={styles.detailPanel}>
          <Image
            resizeMode="cover"
            source={{uri: comparisonUri}}
            style={styles.detailImage}
          />
        </View>
      </View>

      <View style={styles.sampleWrap}>
        <SampleCard source={imageUri} style={styles.sampleFront} />
        <SampleCard source={comparisonUri} style={styles.sampleBack} />
      </View>

      <Svg style={styles.arrow} viewBox="0 0 118 154">
        <Path
          d="M16 12 C 64 20, 96 56, 86 118"
          fill="none"
          stroke="#2B2B2B"
          strokeDasharray="2 4"
          strokeLinecap="round"
          strokeWidth="2.2"
        />
        <Path d="M73 106 L87 118 L70 121 Z" fill="#111111" />
        <Circle cx="86" cy="133" fill="#111111" r="5.2" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    aspectRatio: 356 / 482,
    position: 'relative',
  },
  heroCard: {
    position: 'absolute',
    top: '1.5%',
    left: '3.65%',
    width: '94.4%',
    height: '69.7%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E9E2D5',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  enhancedSlice: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '39%',
    height: '52%',
  },
  splitLine: {
    position: 'absolute',
    top: '16%',
    left: '50%',
    width: 2,
    height: '68%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  cropFrame: {
    position: 'absolute',
    borderWidth: 2,
  },
  cropFrameIdle: {
    borderColor: '#FFFFFF',
  },
  cropFrameActive: {
    borderColor: '#F5F7FA',
  },
  faceFocus: {
    top: '23%',
    left: '35%',
    width: '13%',
    height: '40%',
  },
  eyeFocus: {
    top: '30%',
    left: '50%',
    width: '12%',
    height: '12%',
  },
  detailPanel: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '39%',
    height: '34%',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#7E5130',
  },
  detailImage: {
    ...StyleSheet.absoluteFillObject,
  },
  sampleWrap: {
    position: 'absolute',
    left: '2.5%',
    top: '56.4%',
    width: '32%',
    height: '22%',
  },
  sampleCard: {
    position: 'absolute',
    width: '68%',
    height: '78%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },
  sampleFront: {
    left: 0,
    top: '8%',
    transform: [{rotate: '-2deg'}],
  },
  sampleBack: {
    right: '8%',
    top: '16%',
    transform: [{rotate: '7deg'}],
  },
  sampleImage: {
    flex: 1,
  },
  arrow: {
    position: 'absolute',
    left: '34%',
    top: '68%',
    width: '33%',
    height: '30%',
  },
});

export default EnhancePreview;
