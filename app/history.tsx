import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { getTestResults } from '@/lib/storage';
import { TestResult } from '@/lib/types';
import { useCallback, useState } from 'react';

export default function HistoryScreen() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [])
  );

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const allResults = await getTestResults();
      const sorted = allResults.sort((a, b) => b.createdAt - a.createdAt);
      setResults(sorted);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultPress = (result: TestResult) => {
    router.push({
      pathname: '/test-results',
      params: { resultId: result.id },
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = ({ item }: { item: TestResult }) => (
    <Pressable
      onPress={() => handleResultPress(item)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View className="bg-surface rounded-lg p-4 border border-border mb-3">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">
              {item.type === 'block' ? item.blockName : 'Examen General'}
            </Text>
            <Text className="text-xs text-muted mt-1">{formatDate(item.createdAt)}</Text>
          </View>
          <View
            className={`rounded-lg px-3 py-1 ${
              item.percentage >= 70
                ? 'bg-success bg-opacity-10'
                : 'bg-warning bg-opacity-10'
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                item.percentage >= 70 ? 'text-success' : 'text-warning'
              }`}
            >
              {item.percentage.toFixed(0)}%
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-muted">
            {item.score} de {item.totalQuestions} aciertos
          </Text>
          <Text className="text-xs text-muted">
            {Math.floor(item.duration / 60)}m {item.duration % 60}s
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="gap-2 mb-2">
          <Text className="text-2xl font-bold text-foreground">Historial</Text>
          <Text className="text-sm text-muted">
            {results.length} test{results.length !== 1 ? 's' : ''} realizados
          </Text>
        </View>

        {/* Results List */}
        {results.length > 0 ? (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        ) : (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-lg text-muted">No hay tests realizados aún</Text>
            <Pressable
              onPress={() => router.push('/test-blocks')}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-primary rounded-lg px-6 py-3">
                <Text className="text-background font-semibold">Comenzar Test</Text>
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
