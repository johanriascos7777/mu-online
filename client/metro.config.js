const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Aquí le decimos a Expo dónde está tu CSS global
module.exports = withNativeWind(config, { input: "./global.css" });