import React from 'react';
<<<<<<< HEAD
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
=======
import {StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import FlatPreview from '../assets/previews/flat-preview.svg';
import SoftPreview from '../assets/previews/soft-preview.svg';

const CropFrame = ({borderColor, style}) => {
  return <View style={[styles.cropFrame, {borderColor}, style]} />;
};

const SampleCard = ({backgroundColor, children, style}) => {
  return (
    <View style={[styles.sampleCard, style]}>
      <View style={[styles.sampleSurface, {backgroundColor}]}>{children}</View>
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    </View>
  );
};

<<<<<<< HEAD
const EnhancePreview = ({enhancedImageUri, imageUri}) => {
  if (!imageUri) {
    return (
      <View style={styles.canvas}>
        <EnhanceArtwork height="100%" width="100%" />
      </View>
    );
  }

  const comparisonUri = enhancedImageUri ?? imageUri;
=======
const EnhancePreview = ({processed = false}) => {
  const focusColor = processed ? '#0C8CFF' : '#FFFFFF';
  const detailGlow = processed ? 'rgba(248, 180, 88, 0.18)' : 'rgba(129, 76, 37, 0.26)';
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6

  return (
    <View style={styles.canvas}>
      <View style={styles.heroCard}>
<<<<<<< HEAD
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
=======
        <View style={styles.heroBackdrop} />
        <View style={styles.heroGlow} />
        <View style={styles.hatBrim} />
        <View style={styles.hatTop} />
        <View style={styles.hairShape} />
        <View style={styles.faceShadow} />
        <View style={styles.face} />
        <View style={styles.neck} />
        <View style={styles.sweater} />
        <View style={styles.sweaterShade} />
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
        <View style={styles.nose} />
        <View style={styles.lip} />
        <View style={styles.splitLine} />
        <CropFrame borderColor={focusColor} style={styles.faceFocus} />
        <CropFrame borderColor={focusColor} style={styles.eyeFocus} />
        <View style={[styles.detailPanel, {borderColor: focusColor}]}>
          <View style={[styles.detailPanelGlow, {backgroundColor: detailGlow}]} />
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
        </View>
      </View>

      <View style={styles.sampleWrap}>
<<<<<<< HEAD
        <SampleCard source={imageUri} style={styles.sampleFront} />
        <SampleCard source={comparisonUri} style={styles.sampleBack} />
=======
        <SampleCard backgroundColor="#183B59" style={styles.sampleFront}>
          <SoftPreview height={66} width={52} />
        </SampleCard>
        <SampleCard backgroundColor="#6F4C2E" style={styles.sampleBack}>
          <FlatPreview height={58} width={44} />
        </SampleCard>
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
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
<<<<<<< HEAD
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
=======
    alignItems: 'center',
  },
  heroCard: {
    width: '100%',
    height: 484,
    borderRadius: 10,
    backgroundColor: '#E9E2D5',
    overflow: 'hidden',
    position: 'relative',
  },
  heroBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E9E2D5',
  },
  heroGlow: {
    position: 'absolute',
    top: 152,
    left: 84,
    width: 164,
    height: 164,
    borderRadius: 82,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  hatBrim: {
    position: 'absolute',
    top: 24,
    left: 62,
    width: 192,
    height: 74,
    borderRadius: 40,
    backgroundColor: '#4A281C',
  },
  hatTop: {
    position: 'absolute',
    top: 0,
    left: 89,
    width: 136,
    height: 106,
    borderRadius: 68,
    backgroundColor: '#5F3728',
  },
  hairShape: {
    position: 'absolute',
    top: 72,
    left: 109,
    width: 94,
    height: 112,
    borderRadius: 48,
    backgroundColor: '#2D1C18',
  },
  faceShadow: {
    position: 'absolute',
    top: 94,
    left: 118,
    width: 74,
    height: 118,
    borderRadius: 36,
    backgroundColor: '#B57E5A',
    opacity: 0.38,
  },
  face: {
    position: 'absolute',
    top: 90,
    left: 121,
    width: 70,
    height: 116,
    borderRadius: 35,
    backgroundColor: '#D5A887',
  },
  neck: {
    position: 'absolute',
    top: 192,
    left: 145,
    width: 28,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#C08A68',
  },
  sweater: {
    position: 'absolute',
    top: 206,
    left: 108,
    width: 188,
    height: 258,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#B98B66',
  },
  sweaterShade: {
    position: 'absolute',
    top: 206,
    left: 214,
    width: 82,
    height: 258,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(112, 62, 31, 0.2)',
  },
  eyeLeft: {
    position: 'absolute',
    top: 136,
    left: 138,
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34231D',
  },
  eyeRight: {
    position: 'absolute',
    top: 136,
    left: 164,
    width: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34231D',
  },
  nose: {
    position: 'absolute',
    top: 150,
    left: 154,
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: 'rgba(120, 74, 48, 0.48)',
  },
  lip: {
    position: 'absolute',
    top: 176,
    left: 146,
    width: 22,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(133, 65, 54, 0.56)',
  },
  splitLine: {
    position: 'absolute',
    top: 90,
    left: 156,
    width: 2,
    height: 290,
    backgroundColor: '#F6F4EF',
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
  cropFrame: {
    position: 'absolute',
    borderWidth: 2,
  },
<<<<<<< HEAD
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
=======
  faceFocus: {
    top: 74,
    left: 120,
    width: 76,
    height: 126,
  },
  eyeFocus: {
    top: 95,
    left: 170,
    width: 50,
    height: 34,
  },
  detailPanel: {
    position: 'absolute',
    top: 236,
    left: 160,
    width: 166,
    height: 180,
    borderWidth: 2,
    backgroundColor: '#9A653B',
    overflow: 'hidden',
  },
  detailPanelGlow: {
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    ...StyleSheet.absoluteFillObject,
  },
  sampleWrap: {
    position: 'absolute',
<<<<<<< HEAD
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
=======
    left: 0,
    top: 292,
    width: 120,
    height: 116,
  },
  sampleCard: {
    position: 'absolute',
    width: 84,
    height: 92,
    borderRadius: 11,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000000',
<<<<<<< HEAD
    shadowOpacity: 0.16,
=======
    shadowOpacity: 0.18,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 5,
  },
  sampleFront: {
<<<<<<< HEAD
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
=======
    left: 8,
    top: 10,
    transform: [{rotate: '-1deg'}],
  },
  sampleBack: {
    right: 4,
    top: 18,
    transform: [{rotate: '8deg'}],
  },
  sampleSurface: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
    left: 86,
    top: 342,
    width: 118,
    height: 154,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
});

export default EnhancePreview;
