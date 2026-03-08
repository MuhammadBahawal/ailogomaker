import React from 'react';
<<<<<<< HEAD
import {Image, StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import BgRemoverArtwork from '../assets/images/bgremover.svg';

const Checkerboard = () => {
  const rows = Array.from({length: 8});
  const columns = Array.from({length: 6});
=======
import {StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';

const Checkerboard = () => {
  const rows = Array.from({length: 7});
  const columns = Array.from({length: 5});
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6

  return (
    <View style={styles.checkerboard}>
      {rows.map((_, rowIndex) => {
        return (
          <View key={`row-${rowIndex}`} style={styles.checkerRow}>
            {columns.map((__, columnIndex) => {
              const darkSquare = (rowIndex + columnIndex) % 2 === 0;

              return (
                <View
                  key={`square-${rowIndex}-${columnIndex}`}
                  style={[
                    styles.checkerSquare,
                    darkSquare && styles.checkerSquareDark,
                  ]}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

<<<<<<< HEAD
const BgRemoverPreview = ({imageUri, removedImageUri}) => {
  if (!imageUri) {
    return (
      <View style={styles.canvas}>
        <BgRemoverArtwork height="100%" width="100%" />
      </View>
    );
  }
=======
const SubjectArtwork = ({compact = false, isolated = false}) => {
  return (
    <View style={compact ? styles.subjectFrameCompact : styles.subjectFrame}>
      {!isolated ? <View style={styles.subjectBackdrop} /> : null}
      <View style={[styles.hairBack, compact && styles.hairBackCompact]} />
      <View style={[styles.face, compact && styles.faceCompact]} />
      <View style={[styles.hairFront, compact && styles.hairFrontCompact]} />
      <View style={[styles.smile, compact && styles.smileCompact]} />
      <View style={[styles.shirt, compact && styles.shirtCompact]} />
      <View style={[styles.jacketLeft, compact && styles.jacketLeftCompact]} />
      <View style={[styles.jacketRight, compact && styles.jacketRightCompact]} />
      <View style={[styles.thumbLeft, compact && styles.thumbLeftCompact]} />
      <View style={[styles.thumbRight, compact && styles.thumbRightCompact]} />
      <View style={[styles.jeans, compact && styles.jeansCompact]} />
    </View>
  );
};

const BgRemoverPreview = ({stage = 'upload'}) => {
  const showResult = stage === 'removed';
  const showOutputFigure = stage !== 'upload';
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6

  return (
    <View style={styles.canvas}>
      <View style={styles.mainPreview}>
<<<<<<< HEAD
        <Image resizeMode="cover" source={{uri: imageUri}} style={styles.mainImage} />
=======
        <SubjectArtwork />
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
      </View>

      <View style={styles.outputPreview}>
        <Checkerboard />
<<<<<<< HEAD
        <Image
          resizeMode={removedImageUri ? 'contain' : 'cover'}
          source={{uri: removedImageUri ?? imageUri}}
          style={removedImageUri ? styles.outputImageRemoved : styles.outputImage}
        />
=======
        {showOutputFigure ? (
          <View style={styles.outputFigureWrap}>
            <SubjectArtwork compact isolated={showResult} />
          </View>
        ) : (
          <View style={styles.outputGhost} />
        )}
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
      </View>

      <Svg style={styles.arrow} viewBox="0 0 118 132">
        <Path
          d="M82 12 C 32 26, 28 78, 52 114"
          fill="none"
          stroke="#212121"
          strokeDasharray="2 4"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <Path d="M74 11 L84 12 L80 22 Z" fill="#111111" />
        <Circle cx="54" cy="118" fill="#111111" r="4.8" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
<<<<<<< HEAD
    width: '100%',
    aspectRatio: 361 / 515,
    position: 'relative',
  },
  mainPreview: {
    position: 'absolute',
    top: '0.1%',
    left: '0.1%',
    width: '72.6%',
    height: '65.4%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F4F0EC',
  },
  mainImage: {
    ...StyleSheet.absoluteFillObject,
  },
  outputPreview: {
    position: 'absolute',
    right: 0,
    top: '45.4%',
    width: '46%',
    height: '32.2%',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#F3F3F3',
=======
    alignItems: 'center',
  },
  mainPreview: {
    width: 148,
    height: 188,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#EE4458',
    alignSelf: 'flex-start',
  },
  outputPreview: {
    position: 'absolute',
    right: 6,
    top: 114,
    width: 96,
    height: 126,
    overflow: 'hidden',
    borderRadius: 2,
    backgroundColor: '#F2F2F2',
  },
  outputFigureWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outputGhost: {
    position: 'absolute',
    left: 24,
    top: 22,
    width: 48,
    height: 78,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.06)',
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
  checkerboard: {
    ...StyleSheet.absoluteFillObject,
  },
  checkerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  checkerSquare: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#F9F9F9',
  },
  checkerSquareDark: {
    backgroundColor: '#E0E0E0',
  },
  outputImage: {
    ...StyleSheet.absoluteFillObject,
  },
  outputImageRemoved: {
    position: 'absolute',
    top: '3%',
    left: '3%',
    right: '3%',
    bottom: '3%',
  },
  arrow: {
    position: 'absolute',
    left: '26%',
    top: '66%',
    width: '32.7%',
    height: '25.7%',
=======
    backgroundColor: '#FAFAFA',
  },
  checkerSquareDark: {
    backgroundColor: '#E8E8E8',
  },
  arrow: {
    width: 118,
    height: 132,
    marginTop: 32,
    marginRight: 18,
    alignSelf: 'center',
  },
  subjectFrame: {
    flex: 1,
    position: 'relative',
  },
  subjectFrameCompact: {
    width: 62,
    height: 108,
    position: 'relative',
  },
  subjectBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EE4458',
  },
  hairBack: {
    position: 'absolute',
    top: 12,
    left: 30,
    width: 84,
    height: 104,
    borderRadius: 42,
    backgroundColor: '#381616',
  },
  hairBackCompact: {
    top: 6,
    left: 12,
    width: 38,
    height: 48,
    borderRadius: 19,
  },
  face: {
    position: 'absolute',
    top: 28,
    left: 52,
    width: 42,
    height: 52,
    borderRadius: 21,
    backgroundColor: '#F1BE96',
  },
  faceCompact: {
    top: 16,
    left: 23,
    width: 18,
    height: 22,
    borderRadius: 9,
  },
  hairFront: {
    position: 'absolute',
    top: 16,
    left: 40,
    width: 72,
    height: 48,
    borderRadius: 26,
    backgroundColor: '#291010',
    transform: [{rotate: '-10deg'}],
  },
  hairFrontCompact: {
    top: 8,
    left: 14,
    width: 34,
    height: 22,
    borderRadius: 12,
  },
  smile: {
    position: 'absolute',
    top: 60,
    left: 66,
    width: 16,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#B96E63',
  },
  smileCompact: {
    top: 29,
    left: 29,
    width: 7,
    height: 2,
  },
  shirt: {
    position: 'absolute',
    top: 78,
    left: 56,
    width: 34,
    height: 62,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  shirtCompact: {
    top: 36,
    left: 25,
    width: 14,
    height: 28,
    borderRadius: 6,
  },
  jacketLeft: {
    position: 'absolute',
    top: 74,
    left: 24,
    width: 44,
    height: 78,
    borderRadius: 12,
    backgroundColor: '#1A1B1D',
    transform: [{rotate: '8deg'}],
  },
  jacketLeftCompact: {
    top: 34,
    left: 11,
    width: 18,
    height: 36,
    borderRadius: 6,
  },
  jacketRight: {
    position: 'absolute',
    top: 70,
    left: 80,
    width: 40,
    height: 82,
    borderRadius: 12,
    backgroundColor: '#1A1B1D',
    transform: [{rotate: '-9deg'}],
  },
  jacketRightCompact: {
    top: 32,
    left: 33,
    width: 17,
    height: 37,
    borderRadius: 6,
  },
  thumbLeft: {
    position: 'absolute',
    top: 102,
    left: 38,
    width: 12,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#F1BE96',
    transform: [{rotate: '-32deg'}],
  },
  thumbLeftCompact: {
    top: 48,
    left: 17,
    width: 5,
    height: 9,
    borderRadius: 3,
  },
  thumbRight: {
    position: 'absolute',
    top: 98,
    left: 102,
    width: 12,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#F1BE96',
    transform: [{rotate: '28deg'}],
  },
  thumbRightCompact: {
    top: 46,
    left: 43,
    width: 5,
    height: 9,
    borderRadius: 3,
  },
  jeans: {
    position: 'absolute',
    bottom: 0,
    left: 50,
    width: 46,
    height: 50,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#7B9BC6',
  },
  jeansCompact: {
    bottom: 0,
    left: 22,
    width: 18,
    height: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
  },
});

export default BgRemoverPreview;
