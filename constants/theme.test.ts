import { Colors } from '@/constants/theme';

describe('Colors', () => {
  it('keeps filled primary button text readable in light and dark themes', () => {
    expect(Colors.light.primaryButtonText).not.toBe(Colors.light.primaryButtonBackground);
    expect(Colors.dark.primaryButtonText).not.toBe(Colors.dark.primaryButtonBackground);
  });
});
