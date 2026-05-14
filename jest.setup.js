jest.doMock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.doMock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    MaterialIcons: ({ name }) => React.createElement(Text, null, name),
  };
});

jest.doMock('react-native-ui-datepicker', () => ({
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

jest.doMock('@react-native-picker/picker', () => {
  const React = require('react');
  const { TextInput } = require('react-native');

  function Picker({ children, onValueChange, selectedValue, testID }) {
    return React.createElement(
      TextInput,
      {
        accessibilityLabel: 'Role',
        onValueChange,
        testID,
        value: selectedValue,
      },
      children
    );
  }

  Picker.Item = ({ label }) => React.createElement(React.Fragment, null, label);

  return {
    Picker,
  };
});
