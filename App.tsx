import { ExpoRoot } from 'expo-router';
import { ctx } from 'expo-router/_ctx';
import 'react-native-reanimated';

export default function App() {
  return <ExpoRoot context={ctx} />;
}
