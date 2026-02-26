// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// toReversed hatasını önlemek için configs array’ini manuel reverse yapıyoruz
if (config.resolver?.sourceExts) {
    config.resolver.sourceExts = [...config.resolver.sourceExts].reverse();
}

module.exports = config;