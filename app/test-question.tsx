import { ScrollView, Text, View, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useTestSession } from '@/hooks/use-test-session';
import { useEffect, useState } from 'react';
import { Question } from '@/lib/types';

export default function TestQuestionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    session,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    goToQuestion,
    finishTest,
    getCurrentQuestion,
    getCurrentAnswer,
    getProgress,
    getAnsweredCount,
  } = useTestSession();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setCurrentQuestion(getCurrentQuestion());
      setCurrentAnswer(getCurrentAnswer());
    }
  }, [session]);

  const handleAnswerSelect = (answer: 'a' | 'b' | 'c' | 'd') => {
    answerQuestion(answer);
    setCurrentAnswer(answer);
  };

  const handleNext = () => {
    if (session && session.currentQuestionIndex < session.questions.length - 1) {
      nextQuestion();
      setCurrentQuestion(getCurrentQuestion());
      setCurrentAnswer(getCurrentAnswer());
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (session && session.currentQuestionIndex > 0) {
      previousQuestion();
      setCurrentQuestion(getCurrentQuestion());
      setCurrentAnswer(getCurrentAnswer());
    }
  };

  const handleSkip = () => {
    skipQuestion();
    setCurrentQuestion(getCurrentQuestion());
    setCurrentAnswer(getCurrentAnswer());
  };

  const handleFinish = () => {
    Alert.alert(
      'Finalizar Test',
      '¿Deseas finalizar el test? No podrás cambiar tus respuestas.',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Finalizar',
          onPress: async () => {
            const result = await finishTest();
            if (result) {
              router.push({
                pathname: '/test-results',
                params: { resultId: result.id },
              });
            }
          },
        },
      ]
    );
  };

  if (!session || !currentQuestion) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-foreground">Cargando pregunta...</Text>
      </ScreenContainer>
    );
  }

  const progress = getProgress();
  const answeredCount = getAnsweredCount();
  const currentIndex = session.currentQuestionIndex + 1;
  const totalQuestions = session.questions.length;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Progress Header */}
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-foreground">
                Pregunta {currentIndex} de {totalQuestions}
              </Text>
              <Text className="text-xs text-muted">
                {answeredCount} respondidas
              </Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          {/* Question */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground leading-relaxed">
              {currentQuestion.text}
            </Text>

            {/* Options */}
            <View className="gap-3">
              {(['a', 'b', 'c', 'd'] as const).map(option => (
                <Pressable
                  key={option}
                  onPress={() => handleAnswerSelect(option)}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View
                    className={`border-2 rounded-lg p-4 flex-row items-center gap-3 ${
                      currentAnswer === option
                        ? 'border-primary bg-primary bg-opacity-10'
                        : 'border-border bg-surface'
                    }`}
                  >
                    <View
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        currentAnswer === option
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      }`}
                    >
                      {currentAnswer === option && (
                        <Text className="text-background font-bold text-xs">✓</Text>
                      )}
                    </View>
                    <Text
                      className={`flex-1 text-base font-medium ${
                        currentAnswer === option
                          ? 'text-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {currentQuestion.options[option]}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Navigation Buttons */}
          <View className="gap-3 mt-4">
            <View className="flex-row gap-3">
              <Pressable
                onPress={handlePrevious}
                disabled={currentIndex === 1}
                style={({ pressed }) => [
                  {
                    opacity: currentIndex === 1 ? 0.5 : pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View className="flex-1 border-2 border-border rounded-lg p-3 items-center">
                  <Text className="text-foreground font-semibold">Anterior</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleSkip}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View className="flex-1 border-2 border-warning rounded-lg p-3 items-center">
                  <Text className="text-warning font-semibold">Saltar</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleNext}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View className="flex-1 bg-primary rounded-lg p-3 items-center">
                  <Text className="text-background font-semibold">
                    {currentIndex === totalQuestions ? 'Finalizar' : 'Siguiente'}
                  </Text>
                </View>
              </Pressable>
            </View>

            <Pressable
              onPress={handleFinish}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View className="border-2 border-error rounded-lg p-3 items-center">
                <Text className="text-error font-semibold">Finalizar Test</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
