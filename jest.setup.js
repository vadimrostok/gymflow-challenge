jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    MaterialIcons: ({ name }) => React.createElement(Text, null, name),
  };
});

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

jest.mock('react-native-picker-select', () => ({
  __esModule: true,
  default: ({ onValueChange, pickerProps, testID, value }) => {
    const React = require('react');
    const { TextInput } = require('react-native');

    return React.createElement(TextInput, {
      accessibilityLabel: 'Role',
      onValueChange,
      testID: testID ?? pickerProps?.testID,
      value,
    });
  },
}));
