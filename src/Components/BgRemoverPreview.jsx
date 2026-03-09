import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import BgRemoverArtwork from '../assets/images/bgremover.svg';

const BgRemoverPreview = ({imageUri, removedImageUri}) => {
  if (!imageUri) {
    return (
      <View style={styles.canvas}>
        <View style={styles.placeholderCard}>
          <BgRemoverArtwork height="100%" width="100%" />
        </View>
      </View>
    );
  }
  const displayUri = removedImageUri ?? imageUri;

  return (
    <View style={styles.canvas}>
      <View style={styles.uploadedCard}>
        <Image
          resizeMode={removedImageUri ? 'contain' : 'cover'}
          source={{uri: displayUri}}
          style={styles.uploadedImage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    aspectRatio: 361 / 515,
    position: 'relative',
  },
  placeholderCard: {
    flex: 1,
    overflow: 'hidden',
  },
  uploadedCard: {
    position: 'absolute',
    top: '2%',
    left: '3%',
    width: '94%',
    height: '72%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE7E1',
  },
  uploadedImage: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default BgRemoverPreview;
