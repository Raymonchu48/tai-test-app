/**
 * Hook para gestionar la sesión de test
 */

import { useState, useCallback, useEffect } from 'react';
import { TestSession, TestResult, Question, BlockType } from '@/lib/types';
import { questionsBank } from '@/lib/questions-bank';
import { saveTestResult } from '@/lib/storage';

export function useTestSession() {
  const [session, setSession] = useState<TestSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Iniciar test por bloque
  const startBlockTest = useCallback((blockId: BlockType) => {
    setIsLoading(true);
    try {
      const blockQuestions = questionsBank.filter(q => q.block === blockId);
      // Mezclar preguntas aleatoriamente
      const shuffled = blockQuestions.sort(() => Math.random() - 0.5);

      const newSession: TestSession = {
        id: `session_${Date.now()}`,
        type: 'block',
        blockId,
        questions: shuffled,
        currentQuestionIndex: 0,
        userAnswers: {},
        skippedQuestions: new Set(),
        startTime: Date.now(),
        status: 'in-progress',
      };

      setSession(newSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Iniciar examen general
  const startGeneralTest = useCallback(() => {
    setIsLoading(true);
    try {
      // Seleccionar 20 preguntas aleatorias de todo el banco
      const shuffled = questionsBank.sort(() => Math.random() - 0.5).slice(0, 20);

      const newSession: TestSession = {
        id: `session_${Date.now()}`,
        type: 'general',
        questions: shuffled,
        currentQuestionIndex: 0,
        userAnswers: {},
        skippedQuestions: new Set(),
        startTime: Date.now(),
        status: 'in-progress',
      };

      setSession(newSession);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Responder pregunta
  const answerQuestion = useCallback((answer: 'a' | 'b' | 'c' | 'd') => {
    if (!session) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    setSession(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [currentQuestion.id]: answer,
        },
      };
    });
  }, [session]);

  // Ir a la siguiente pregunta
  const nextQuestion = useCallback(() => {
    if (!session) return;
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      });
    }
  }, [session]);

  // Ir a la pregunta anterior
  const previousQuestion = useCallback(() => {
    if (!session) return;
    if (session.currentQuestionIndex > 0) {
      setSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      });
    }
  }, [session]);

  // Saltar pregunta
  const skipQuestion = useCallback(() => {
    if (!session) return;
    const currentQuestion = session.questions[session.currentQuestionIndex];
    setSession(prev => {
      if (!prev) return prev;
      const newSkipped = new Set(prev.skippedQuestions);
      newSkipped.add(currentQuestion.id);
      return {
        ...prev,
        skippedQuestions: newSkipped,
      };
    });
    nextQuestion();
  }, [session, nextQuestion]);

  // Ir a pregunta específica
  const goToQuestion = useCallback((index: number) => {
    if (!session) return;
    if (index >= 0 && index < session.questions.length) {
      setSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          currentQuestionIndex: index,
        };
      });
    }
  }, [session]);

  // Finalizar test
  const finishTest = useCallback(async (): Promise<TestResult | null> => {
    if (!session) return null;

    try {
      // Calcular puntuación
      let score = 0;
      session.questions.forEach(question => {
        const userAnswer = session.userAnswers[question.id];
        if (userAnswer === question.correctAnswer) {
          score += 1;
        }
      });

      const endTime = Date.now();
      const duration = Math.floor((endTime - session.startTime) / 1000);
      const percentage = (score / session.questions.length) * 100;

      const result: TestResult = {
        id: `result_${Date.now()}`,
        type: session.type,
        blockId: session.blockId,
        blockName: session.blockId
          ? {
              block1: 'Organización del Estado',
              block2: 'Tecnología Básica',
              block3: 'Desarrollo de Sistemas',
              block4: 'Sistemas y Comunicaciones',
            }[session.blockId]
          : undefined,
        startTime: session.startTime,
        endTime,
        questions: session.questions,
        userAnswers: session.userAnswers,
        score,
        totalQuestions: session.questions.length,
        percentage,
        duration,
        createdAt: endTime,
      };

      // Guardar resultado
      await saveTestResult(result);

      // Limpiar sesión
      setSession(null);

      return result;
    } catch (error) {
      console.error('Error finishing test:', error);
      return null;
    }
  }, [session]);

  // Cancelar test
  const cancelTest = useCallback(() => {
    setSession(null);
  }, []);

  // Obtener pregunta actual
  const getCurrentQuestion = useCallback((): Question | null => {
    if (!session) return null;
    return session.questions[session.currentQuestionIndex] || null;
  }, [session]);

  // Obtener respuesta actual
  const getCurrentAnswer = useCallback((): 'a' | 'b' | 'c' | 'd' | null => {
    if (!session) return null;
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return null;
    return session.userAnswers[currentQuestion.id] || null;
  }, [session, getCurrentQuestion]);

  // Obtener progreso
  const getProgress = useCallback((): number => {
    if (!session) return 0;
    return (session.currentQuestionIndex / session.questions.length) * 100;
  }, [session]);

  // Obtener número de preguntas respondidas
  const getAnsweredCount = useCallback((): number => {
    if (!session) return 0;
    return Object.keys(session.userAnswers).length;
  }, [session]);

  return {
    session,
    isLoading,
    startBlockTest,
    startGeneralTest,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    skipQuestion,
    goToQuestion,
    finishTest,
    cancelTest,
    getCurrentQuestion,
    getCurrentAnswer,
    getProgress,
    getAnsweredCount,
  };
}
