import React from 'react';
<<<<<<< HEAD
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
=======
import {StyleSheet, View} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

const TopBokeh = () => {
  return (
    <Svg height="100%" width="100%" viewBox="0 0 300 120">
      <Defs>
        <LinearGradient id="blurBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#2F261F" />
          <Stop offset="100%" stopColor="#544338" />
        </LinearGradient>
      </Defs>
      <Rect width="300" height="120" fill="url(#blurBg)" />
      <Circle cx="40" cy="54" r="16" fill="#F5D173" opacity="0.58" />
      <Circle cx="84" cy="90" r="13" fill="#FFF7D7" opacity="0.52" />
      <Circle cx="118" cy="38" r="10" fill="#A8B4E5" opacity="0.34" />
      <Circle cx="170" cy="78" r="18" fill="#F6C878" opacity="0.54" />
      <Circle cx="212" cy="45" r="12" fill="#F2E5BF" opacity="0.35" />
      <Circle cx="255" cy="82" r="14" fill="#FFE39C" opacity="0.46" />
      <Circle cx="273" cy="30" r="8" fill="#C8C6D6" opacity="0.26" />
      <Circle cx="145" cy="22" r="6" fill="#F4F0E8" opacity="0.22" />
    </Svg>
  );
};

const UpscalePreview = ({processed = false}) => {
  const accent = processed ? '#F7BA1B' : '#0C8CFF';

  return (
    <View style={styles.wrap}>
      <View style={styles.topStrip}>
        <TopBokeh />
      </View>
      <View style={styles.bodyWrap}>
        <Svg height="100%" width="100%" viewBox="0 0 300 430">
          <Defs>
            <LinearGradient id="bodyBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#CEC4B8" />
              <Stop offset="100%" stopColor="#70655C" />
            </LinearGradient>
            <LinearGradient id="jacketShade" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#F0C753" />
              <Stop offset="100%" stopColor="#C78A28" />
            </LinearGradient>
            <LinearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F2C9B4" />
              <Stop offset="100%" stopColor="#E2A78D" />
            </LinearGradient>
            <LinearGradient id="hairTone" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#7D4A24" />
              <Stop offset="100%" stopColor="#4A2A17" />
            </LinearGradient>
          </Defs>

          <Rect x="0" y="0" width="300" height="430" fill="url(#bodyBg)" />
          <Circle cx="38" cy="38" r="14" fill="#F3C75A" opacity="0.8" />
          <Circle cx="72" cy="52" r="10" fill="#FFF1C4" opacity="0.86" />
          <Circle cx="225" cy="55" r="12" fill="#F6D37B" opacity="0.72" />
          <Circle cx="264" cy="46" r="8" fill="#D9D5B9" opacity="0.6" />
          <Circle cx="40" cy="160" r="16" fill="#E0C08C" opacity="0.45" />
          <Circle cx="250" cy="144" r="14" fill="#D6B475" opacity="0.4" />

          <Path
            d="M96 235C105 190 118 160 150 154C182 160 195 190 204 235L220 410H80L96 235Z"
            fill="#786D5E"
          />
          <Path
            d="M56 200C76 180 96 176 108 190L122 224L126 420H12L20 292C23 252 35 222 56 200Z"
            fill="url(#jacketShade)"
          />
          <Path
            d="M244 200C224 180 204 176 192 190L178 224L174 420H288L280 292C277 252 265 222 244 200Z"
            fill="url(#jacketShade)"
          />
          <Rect x="135" y="184" width="30" height="68" rx="14" fill="url(#skinTone)" />
          <Ellipse cx="150" cy="138" rx="40" ry="48" fill="url(#skinTone)" />
          <Path
            d="M109 136C110 99 129 70 151 70C176 70 191 101 192 130C181 112 168 103 150 103C132 103 120 113 109 136Z"
            fill="url(#hairTone)"
          />
          <Path
            d="M111 138C116 208 122 270 134 330H102C92 258 90 191 111 138Z"
            fill="#8A572C"
            opacity="0.88"
          />
          <Path
            d="M189 138C184 208 178 270 166 330H198C208 258 210 191 189 138Z"
            fill="#8A572C"
            opacity="0.88"
          />
          <Circle cx="135" cy="134" r="4" fill="#3F302A" />
          <Circle cx="165" cy="134" r="4" fill="#3F302A" />
          <Path
            d="M136 154C144 160 156 160 164 154"
            stroke="#9C5D47"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <Path
            d="M90 260C112 247 126 246 142 256"
            stroke="#B6802F"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <Path
            d="M210 260C188 247 174 246 158 256"
            stroke="#B6802F"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <Path
            d="M98 216L68 424"
            stroke="#1C1A18"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <G transform="translate(18 170) rotate(-11)">
            <Rect x="0" y="0" width="72" height="90" rx="12" fill="#FFFFFF" />
            <Rect x="6" y="6" width="60" height="78" rx="10" fill="#D8D8D8" />
            <Ellipse cx="30" cy="34" rx="14" ry="18" fill="#2A2A2A" />
            <Path d="M14 68C20 50 29 46 38 46C47 46 56 50 60 68H14Z" fill="#555555" />
            <Path d="M21 50L39 62L46 42" stroke="#D83B3B" strokeWidth="6" strokeLinecap="round" />
          </G>

          <G transform="translate(208 250) rotate(8)">
            <Rect x="0" y="0" width="72" height="92" rx="12" fill="#FFFFFF" />
            <Rect x="6" y="6" width="60" height="80" rx="10" fill="#5F4737" />
            <Ellipse cx="34" cy="34" rx="15" ry="18" fill="#D7A489" />
            <Path d="M18 30C19 16 27 8 38 8C48 8 56 17 58 30C50 21 42 19 38 19C31 19 25 22 18 30Z" fill="#2A211D" />
            <Rect x="28" y="42" width="20" height="13" rx="4" fill="#1B1B1B" />
            <Circle cx="42" cy="48" r="8" stroke={accent} strokeWidth="2.2" />
            <Path d="M24 74C29 58 37 54 46 54C55 54 60 59 63 74H24Z" fill="#304A58" />
          </G>
        </Svg>
      </View>
      <View style={[styles.frame, {borderColor: accent}]} pointerEvents="none" />
      <View style={[styles.separator, {backgroundColor: accent}]} pointerEvents="none" />
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
<<<<<<< HEAD
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
=======
    height: 520,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#2C2926',
  },
  topStrip: {
    height: 110,
  },
  bodyWrap: {
    flex: 1,
  },
  frame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3,
  },
  separator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 108,
    height: 3,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
});

export default UpscalePreview;
