import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Svg, {Circle, Path} from 'react-native-svg';
import BgRemoverArtwork from '../assets/images/bgremover.svg';

const Checkerboard = () => {
  const rows = Array.from({length: 8});
  const columns = Array.from({length: 6});

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

const BgRemoverPreview = ({imageUri, removedImageUri}) => {
  if (!imageUri) {
    return (
      <View style={styles.canvas}>
        <BgRemoverArtwork height="100%" width="100%" />
      </View>
    );
  }

  return (
    <View style={styles.canvas}>
      <View style={styles.mainPreview}>
        <Image resizeMode="cover" source={{uri: imageUri}} style={styles.mainImage} />
      </View>

      <View style={styles.outputPreview}>
        <Checkerboard />
        <Image
          resizeMode={removedImageUri ? 'contain' : 'cover'}
          source={{uri: removedImageUri ?? imageUri}}
          style={removedImageUri ? styles.outputImageRemoved : styles.outputImage}
        />
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
  },
});

export default BgRemoverPreview;
