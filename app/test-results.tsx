import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { getTestResults } from '@/lib/storage';
import { TestResult } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TestResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    loadResult();
  }, [params.resultId]);

  const loadResult = async () => {
    if (params.resultId) {
      const results = await getTestResults();
      const found = results.find(r => r.id === params.resultId);
      if (found) {
        setResult(found);
      }
    }
  };

  const handleReview = () => {
    if (result) {
      router.push({
        pathname: '/test-review',
        params: { resultId: result.id },
      });
    }
  };

  const handleNewTest = () => {
    router.push('/test-blocks');
  };

  const handleHome = () => {
    router.push('/');
  };

  if (!result) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-foreground">Cargando resultados...</Text>
      </ScreenContainer>
    );
  }

  const minutes = Math.floor(result.duration / 60);
  const seconds = result.duration % 60;
  const isGoodScore = result.percentage >= 70;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">
              {result.type === 'block' ? result.blockName : 'Examen General'}
            </Text>
            <Text className="text-sm text-muted">Test completado</Text>
          </View>

          {/* Score Circle */}
          <View className="items-center gap-4">
            <View
              className={`w-48 h-48 rounded-full border-8 items-center justify-center ${
                isGoodScore ? 'border-success' : 'border-warning'
              }`}
            >
              <View className="items-center">
                <Text className={`text-5xl font-bold ${isGoodScore ? 'text-success' : 'text-warning'}`}>
                  {result.percentage.toFixed(0)}%
                </Text>
                <Text className="text-sm text-muted mt-2">
                  {result.score} de {result.totalQuestions}
                </Text>
              </View>
            </View>

            {/* Feedback */}
            <View className="items-center gap-2">
              <Text className="text-lg font-semibold text-foreground">
                {isGoodScore ? '¡Excelente!' : 'Buen intento'}
              </Text>
              <Text className="text-sm text-muted text-center">
                {isGoodScore
                  ? 'Has alcanzado una buena puntuación. Sigue practicando.'
                  : 'Revisa las preguntas incorrectas para mejorar.'}
              </Text>
            </View>
          </View>

          {/* Statistics */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1 bg-success bg-opacity-10 rounded-lg p-4 border border-success">
                <Text className="text-xs text-muted mb-1">Correctas</Text>
                <Text className="text-2xl font-bold text-success">{result.score}</Text>
              </View>
              <View className="flex-1 bg-error bg-opacity-10 rounded-lg p-4 border border-error">
                <Text className="text-xs text-muted mb-1">Incorrectas</Text>
                <Text className="text-2xl font-bold text-error">
                  {result.totalQuestions - result.score}
                </Text>
              </View>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-xs text-muted mb-1">Tiempo empleado</Text>
              <Text className="text-2xl font-bold text-foreground">
                {minutes}m {seconds}s
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="gap-3 mt-4">
            <Pressable
              onPress={handleReview}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-primary rounded-lg p-4 items-center">
                <Text className="text-background font-semibold">Ver Detalle de Respuestas</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleNewTest}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="border-2 border-primary rounded-lg p-4 items-center">
                <Text className="text-primary font-semibold">Nuevo Test</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleHome}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="border-2 border-border rounded-lg p-4 items-center">
                <Text className="text-foreground font-semibold">Volver al Inicio</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
