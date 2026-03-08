module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/asyncStorageMock.js',
    '^react-native-image-picker$':
      '<rootDir>/__mocks__/reactNativeImagePickerMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
