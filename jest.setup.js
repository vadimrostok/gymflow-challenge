jest.mock('react-native-ui-datepicker', () => ({
  __esModule: true,
  default: ({ date, onChange }) => {
    const React = require('react');
    const { TextInput } = require('react-native');

    return React.createElement(TextInput, {
      accessibilityLabel: 'Date of Birthday',
      onChangeText: (value) => onChange?.({ date: value }),
      value: date ?? '',
    });
  },
  useDefaultClassNames: () => ({}),
  useDefaultStyles: () => ({}),
}));
