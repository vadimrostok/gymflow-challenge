export type Painting = {
  height: number;
  uri: string;
  width: number;
};

const paintings: Painting[] = [
  {
    height: 1540,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg/1920px-Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg',
    width: 1920,
  },
  {
    height: 1448,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Farmhouse_in_Provence%2C_1888%2C_Vincent_van_Gogh%2C_NGA.jpg/1920px-Farmhouse_in_Provence%2C_1888%2C_Vincent_van_Gogh%2C_NGA.jpg',
    width: 1920,
  },
  {
    height: 876,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Flower_Beds_in_Holland_by_Vincent_van_Gogh.jpg',
    width: 1200,
  },
  {
    height: 1600,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Edgar_Degas_-_Four_Dancers_-_Google_Art_Project.jpg/1920px-Edgar_Degas_-_Four_Dancers_-_Google_Art_Project.jpg',
    width: 1920,
  },
  {
    height: 1686,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Monet_Houses_of_Parliament%2C_Sunset.jpg/1920px-Monet_Houses_of_Parliament%2C_Sunset.jpg',
    width: 1920,
  },
  {
    height: 2737,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Henri_de_Toulouse-Lautrec%2C_The_Jockey_%28Le_jockey%29%2C_1899%2C_NGA_42185.jpg/1920px-Henri_de_Toulouse-Lautrec%2C_The_Jockey_%28Le_jockey%29%2C_1899%2C_NGA_42185.jpg',
    width: 1920,
  },
  {
    height: 1513,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Vincent_van_Gogh_-_Olive_Orchard_-_Google_Art_Project.jpg/1920px-Vincent_van_Gogh_-_Olive_Orchard_-_Google_Art_Project.jpg',
    width: 1920,
  },
  {
    height: 2334,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg/1920px-Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project.jpg',
    width: 1920,
  },
];

// Start at a random painting, then rotate deterministically so each form mount gets a fresh URL.
let paintingIndex = Math.floor(Math.random() * paintings.length);

export function getNextPainting() {
  if (paintings.length === 0) {
    return undefined;
  }

  const painting = paintings[paintingIndex % paintings.length];
  paintingIndex += 1;

  return painting;
}
