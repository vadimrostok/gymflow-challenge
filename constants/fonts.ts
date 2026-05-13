export const FontFamily = {
  regular: 'Rubik-Regular',
  semibold: 'Rubik-SemiBold',
  bold: 'Rubik-Bold',
  italic: 'Rubik-Italic',
} as const;

export const fontAssets = {
  [FontFamily.regular]: require('../assets/fonts/Rubik/static/Rubik-Regular.ttf'),
  [FontFamily.semibold]: require('../assets/fonts/Rubik/static/Rubik-SemiBold.ttf'),
  [FontFamily.bold]: require('../assets/fonts/Rubik/static/Rubik-Bold.ttf'),
  [FontFamily.italic]: require('../assets/fonts/Rubik/static/Rubik-Italic.ttf'),
} as const;
