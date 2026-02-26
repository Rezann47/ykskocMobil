const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// react-native-iap için gerekli
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;