import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useTestSession } from '@/hooks/use-test-session';
import { useEffect } from 'react';

export default function GeneralTestScreen() {
  const router = useRouter();
  const { startGeneralTest } = useTestSession();

  useEffect(() => {
    startGeneralTest();
    router.push('/test-question');
  }, []);

  return (
    <ScreenContainer className="p-6 justify-center items-center">
      <Text className="text-foreground text-lg">Iniciando examen general...</Text>
    </ScreenContainer>
  );
}
