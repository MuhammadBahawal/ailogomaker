module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
<<<<<<< HEAD
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/asyncStorageMock.js',
    '^react-native-image-picker$':
      '<rootDir>/__mocks__/reactNativeImagePickerMock.js',
=======
>>>>>>> 33f05fe511af5d67a545c276419a36ca17d4a7f6
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
