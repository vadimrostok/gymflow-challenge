import { getNextPainting } from './paintings';

describe('paintings', () => {
  it('returns remote image URLs for the parallax header', () => {
    const painting = getNextPainting();

    expect(painting?.uri).toEqual(expect.stringMatching(/^https:\/\//));
    expect(painting?.height).toEqual(expect.any(Number));
    expect(painting?.width).toEqual(expect.any(Number));
  });
});
