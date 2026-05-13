export const FontFamily = {
  reciaRegular: 'Recia-Regular',
  reciaSemibold: 'Recia-Semibold',
  reciaBold: 'Recia-Bold',
  reciaItalic: 'Recia-Italic',
} as const;

export const reciaFontAssets = {
  [FontFamily.reciaRegular]: require('../assets/fonts/Recia_Complete/Fonts/OTF/Recia-Regular.otf'),
  [FontFamily.reciaSemibold]: require('../assets/fonts/Recia_Complete/Fonts/OTF/Recia-Semibold.otf'),
  [FontFamily.reciaBold]: require('../assets/fonts/Recia_Complete/Fonts/OTF/Recia-Bold.otf'),
  [FontFamily.reciaItalic]: require('../assets/fonts/Recia_Complete/Fonts/OTF/Recia-Italic.otf'),
} as const;
