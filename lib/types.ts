/**
 * Tipos y interfaces para la aplicación TAI Test
 */

export type BlockType = 'block1' | 'block2' | 'block3' | 'block4';

export interface Question {
  id: string;
  block: BlockType;
  theme: number;
  text: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation?: string;
}

export interface TestSession {
  id: string;
  type: 'block' | 'general';
  blockId?: BlockType;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, 'a' | 'b' | 'c' | 'd' | null>;
  skippedQuestions: Set<string>;
  startTime: number;
  status: 'in-progress' | 'completed';
}

export interface TestResult {
  id: string;
  type: 'block' | 'general';
  blockId?: BlockType;
  blockName?: string;
  startTime: number;
  endTime: number;
  questions: Question[];
  userAnswers: Record<string, 'a' | 'b' | 'c' | 'd' | null>;
  score: number;
  totalQuestions: number;
  percentage: number;
  duration: number; // en segundos
  createdAt: number;
}

export interface BlockInfo {
  id: BlockType;
  name: string;
  description: string;
  totalThemes: number;
  totalQuestions: number;
}

export interface UserStats {
  totalTests: number;
  totalCorrect: number;
  totalAttempted: number;
  averagePercentage: number;
  blockStats: Record<BlockType, {
    attempts: number;
    correct: number;
    percentage: number;
    lastAttempt?: number;
  }>;
}

export interface AppSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  showTimer: boolean;
  theme: 'light' | 'dark' | 'auto';
}

// Bloques de información
export const BLOCKS: Record<BlockType, BlockInfo> = {
  block1: {
    id: 'block1',
    name: 'Organización del Estado y Administración Electrónica',
    description: 'Normativa, Constitución, Gobierno, Protección de datos',
    totalThemes: 9,
    totalQuestions: 20,
  },
  block2: {
    id: 'block2',
    name: 'Tecnología Básica',
    description: 'Informática básica, periféricos, sistemas operativos, bases de datos',
    totalThemes: 5,
    totalQuestions: 20,
  },
  block3: {
    id: 'block3',
    name: 'Desarrollo de Sistemas',
    description: 'Programación, lenguajes, POO, aplicaciones web, accesibilidad',
    totalThemes: 12,
    totalQuestions: 20,
  },
  block4: {
    id: 'block4',
    name: 'Sistemas y Comunicaciones',
    description: 'Administración de sistemas, redes, TCP/IP, seguridad',
    totalThemes: 10,
    totalQuestions: 20,
  },
};
