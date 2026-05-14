import { useLocalSearchParams } from 'expo-router';
import { EditUserScreen } from '@/screens/edit-user-screen';

export default function ExpoEditUserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EditUserScreen userId={id} />;
}