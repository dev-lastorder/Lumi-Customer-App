const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Add .mjs support
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

// ✅ Add extraNodeModules mapping
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-native": require.resolve("react-native"),
};

// ✅ Allow require.context (Hermes support)
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = withNativeWind(config, {
  input: "./global.css",
});
