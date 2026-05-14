const ExpoColors = {
  adaptiveIconBackground: '#E6F4FE',
  splashBackgroundDark: '#000000',
  splashBackgroundLight: '#ffffff',
};

function normalizeBaseUrl(value) {
  if (!value || value === '/') {
    return undefined;
  }

  return `/${value.replace(/^\/+|\/+$/g, '')}`;
}

function withSplashColors(plugins = []) {
  return plugins.map((plugin) => {
    if (!Array.isArray(plugin) || plugin[0] !== 'expo-splash-screen') {
      return plugin;
    }

    return [
      plugin[0],
      {
        ...plugin[1],
        backgroundColor: ExpoColors.splashBackgroundLight,
        dark: {
          ...plugin[1]?.dark,
          backgroundColor: ExpoColors.splashBackgroundDark,
        },
      },
    ];
  });
}

module.exports = ({ config }) => {
  const baseUrl = normalizeBaseUrl(process.env.EXPO_PUBLIC_WEB_BASE_PATH);

  return {
    ...config,
    android: {
      ...config.android,
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        backgroundColor: ExpoColors.adaptiveIconBackground,
      },
    },
    plugins: withSplashColors(config.plugins),
    experiments: {
      ...config.experiments,
      ...(baseUrl ? { baseUrl } : {}),
    },
  };
};
