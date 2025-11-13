const { withMainApplication } = require('@expo/config-plugins');
function addVoiceProxyInitialization(src) {
  if (src.includes('VoiceApplicationProxy')) {
    return src;
  }
  // 1. Add import (after other imports, not after package)
  src = src.replace(
    /(import expo\.modules\.ReactNativeHostWrapper)/,
    `$1\nimport com.twiliovoicereactnative.VoiceApplicationProxy`
  );
  // 2. Add property
  src = src.replace(
    /(class MainApplication[^{]*\{)/,
    `$1\n\n  private lateinit var voiceApplicationProxy: VoiceApplicationProxy`
  );
  // 3. Initialize in onCreate (simple pattern)
  src = src.replace(
    /(super\.onCreate\(\))/,
    `$1\n    \n    voiceApplicationProxy = VoiceApplicationProxy(this)\n    voiceApplicationProxy.onCreate()`
  );
  // 4. Add onTerminate (at end of class, before last })
  src = src.replace(
    /(\n)(\s*)\}\s*$/,
    `\n$2override fun onTerminate() {\n$2  voiceApplicationProxy.onTerminate()\n$2  super.onTerminate()\n$2}\n$2}`
  );
  return src;
}
module.exports = (config) => {
  return withMainApplication(config, (config) => {
    config.modResults.contents = addVoiceProxyInitialization(config.modResults.contents);
    return config;
  });
};

