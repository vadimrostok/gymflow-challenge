import { Platform } from 'react-native';

export type Painting = {
  height: number;
  uri: string;
  width: number;
};

type PaintingAsset = Omit<Painting, 'uri'> & {
  fileName: string;
};

const WEB_DEV_ASSET_PREFIX = '/assets/?unstable_path=.%2Fassets%2Fpaintings%2F';
const DEFAULT_WEB_PAINTINGS_PATH_BASE = 'assets/paintings';
const DEFAULT_NATIVE_PAINTINGS_URL_BASE = 'http://localhost:8081';

const paintingAssets: PaintingAsset[] = [
  { fileName: 'calanque_des_antibois_1982.76.2.jpg', height: 1445, width: 2048 },
  { fileName: 'cliffs_at_pourville_1985.64.27.jpg', height: 1222, width: 2048 },
  { fileName: 'docks_east_boston_1992.51.12.jpg', height: 1442, width: 2048 },
  { fileName: 'farmhouse_in_provence_1970.17.34.jpg', height: 1536, width: 2048 },
  { fileName: 'flower_beds_in_holland_1983.1.21.jpg', height: 1500, width: 2048 },
  { fileName: 'four_dancers_1963.10.122.jpg', height: 1714, width: 2048 },
  { fileName: 'pdia-7105ae30-9f2a-4d01-a95c-66e117d631b0.jpg', height: 1328, width: 2048 },
  { fileName: 'portrait_of_vincent_van_gogh_1963.10.153.jpg', height: 2048, width: 1635 },
  { fileName: 'revere_beach_1985.64.112.jpg', height: 1461, width: 2048 },
  { fileName: 'the_artist_s_garden_at_vetheuil_1970.17.45.jpg', height: 2048, width: 1637 },
  {
    fileName: 'the_artist_s_garden_in_argenteuil_a_corner_of_the_garden_with_dahlias_1991.27.1.jpg',
    height: 1532,
    width: 2048,
  },
  { fileName: 'the_houses_of_parliament_sunset_1963.10.48.jpg', height: 1809, width: 2048 },
  { fileName: 'the_jockey_le_jockey_1952.8.450.jpg', height: 2048, width: 1437 },
  { fileName: 'the_mall_central_park_1992.51.11.jpg', height: 1838, width: 2048 },
  { fileName: 'the_olive_orchard_1963.10.152.jpg', height: 1616, width: 2048 },
];

// Start at a random painting, then rotate deterministically so each form mount gets a fresh URL.
let paintingIndex = Math.floor(Math.random() * paintingAssets.length);

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function buildPaintingUri(fileName: string) {
  if (Platform.OS === 'web') {
    if (process.env.NODE_ENV !== 'production') {
      return `${WEB_DEV_ASSET_PREFIX}${fileName}`;
    }

    const webPathBase =
      process.env.EXPO_PUBLIC_WEB_PAINTINGS_PATH_BASE ?? DEFAULT_WEB_PAINTINGS_PATH_BASE;

    return `${trimTrailingSlash(webPathBase)}/${fileName}`;
  }

  const nativeUrlBase =
    process.env.EXPO_PUBLIC_PAINTINGS_URL_BASE ?? DEFAULT_NATIVE_PAINTINGS_URL_BASE;

  return `${trimTrailingSlash(nativeUrlBase)}/assets/paintings/${fileName}`;
}

export function getNextPainting() {
  if (paintingAssets.length === 0) {
    return undefined;
  }

  const painting = paintingAssets[paintingIndex % paintingAssets.length];
  paintingIndex += 1;

  return {
    height: painting.height,
    uri: buildPaintingUri(painting.fileName),
    width: painting.width,
  };
}
