const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withIapFlavor(config) {
    return withAppBuildGradle(config, (config) => {
        const gradle = config.modResults.contents;
        if (!gradle.includes('missingDimensionStrategy')) {
            config.modResults.contents = gradle.replace(
                /applicationId\s+['"]com\.kaya\.yksrota['"]/,
                `applicationId 'com.kaya.yksrota'\n        missingDimensionStrategy "store", "play"`
            );
        }
        return config;
    });
};