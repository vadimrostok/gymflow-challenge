import { getNextPainting } from './paintings';

describe('paintings', () => {
  it('returns asset-backed image metadata for the parallax header', () => {
    const painting = getNextPainting();

    expect(painting?.uri).toContain('assets/paintings/');
    expect(painting?.uri).not.toContain('wikimedia');
    expect(painting?.height).toEqual(expect.any(Number));
    expect(painting?.width).toEqual(expect.any(Number));
  });
});
