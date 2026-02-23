import { ScrollView, Text, View, Pressable, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { getTestResults } from '@/lib/storage';
import { TestResult, Question } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function TestReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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

  const renderQuestionItem = ({ item, index }: { item: Question; index: number }) => {
    const userAnswer = result?.userAnswers[item.id];
    const isCorrect = userAnswer === item.correctAnswer;
    const isExpanded = expandedIndex === index;

    return (
      <Pressable
        onPress={() => setExpandedIndex(isExpanded ? null : index)}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      >
        <View
          className={`rounded-lg p-4 border-2 mb-3 ${
            isCorrect
              ? 'border-success bg-success bg-opacity-5'
              : 'border-error bg-error bg-opacity-5'
          }`}
        >
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                Pregunta {index + 1}
              </Text>
              <Text className="text-xs text-muted mt-1 leading-relaxed">
                {item.text}
              </Text>
            </View>
            <View
              className={`rounded-full w-8 h-8 items-center justify-center ${
                isCorrect ? 'bg-success' : 'bg-error'
              }`}
            >
              <Text className="text-background font-bold text-lg">
                {isCorrect ? '✓' : '✗'}
              </Text>
            </View>
          </View>

          {isExpanded && (
            <View className="mt-4 gap-3 border-t border-border pt-4">
              {/* User Answer */}
              <View className="gap-2">
                <Text className="text-xs font-semibold text-foreground">Tu respuesta:</Text>
                <View
                  className={`p-3 rounded-lg ${
                    isCorrect
                      ? 'bg-success bg-opacity-10 border border-success'
                      : 'bg-error bg-opacity-10 border border-error'
                  }`}
                >
                  <Text className="text-sm text-foreground">
                    {userAnswer?.toUpperCase()}) {item.options[userAnswer as keyof typeof item.options]}
                  </Text>
                </View>
              </View>

              {/* Correct Answer (if wrong) */}
              {!isCorrect && (
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-foreground">Respuesta correcta:</Text>
                  <View className="p-3 rounded-lg bg-success bg-opacity-10 border border-success">
                    <Text className="text-sm text-foreground">
                      {item.correctAnswer.toUpperCase()}) {item.options[item.correctAnswer]}
                    </Text>
                  </View>
                </View>
              )}

              {/* Explanation */}
              {item.explanation && (
                <View className="gap-2">
                  <Text className="text-xs font-semibold text-foreground">Explicación:</Text>
                  <View className="p-3 rounded-lg bg-surface border border-border">
                    <Text className="text-sm text-foreground leading-relaxed">
                      {item.explanation}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  if (!result) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-foreground">Cargando revisión...</Text>
      </ScreenContainer>
    );
  }

  const correctCount = result.questions.filter(
    q => result.userAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="gap-2 mb-2">
          <Text className="text-2xl font-bold text-foreground">Revisión de Respuestas</Text>
          <Text className="text-sm text-muted">
            {correctCount} de {result.totalQuestions} respuestas correctas
          </Text>
        </View>

        {/* Questions List */}
        <FlatList
          data={result.questions}
          renderItem={renderQuestionItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />

        {/* Action Button */}
        <Pressable
          onPress={() => router.push('/')}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <View className="bg-primary rounded-lg p-4 items-center">
            <Text className="text-background font-semibold">Volver al Inicio</Text>
          </View>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
