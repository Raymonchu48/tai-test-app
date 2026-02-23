/**
 * Servicio de almacenamiento local para la aplicación TAI Test
 * Utiliza AsyncStorage para persistencia de datos
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestResult, UserStats, AppSettings, BlockType } from './types';

const STORAGE_KEYS = {
  TEST_RESULTS: 'tai_test_results',
  USER_STATS: 'tai_user_stats',
  APP_SETTINGS: 'tai_app_settings',
};

// ============ Test Results ============

export async function saveTestResult(result: TestResult): Promise<void> {
  try {
    const results = await getTestResults();
    results.push(result);
    await AsyncStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(results));
    // Actualizar estadísticas
    await updateUserStats(result);
  } catch (error) {
    console.error('Error saving test result:', error);
  }
}

export async function getTestResults(): Promise<TestResult[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting test results:', error);
    return [];
  }
}

export async function deleteTestResult(resultId: string): Promise<void> {
  try {
    const results = await getTestResults();
    const filtered = results.filter(r => r.id !== resultId);
    await AsyncStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting test result:', error);
  }
}

export async function clearAllTestResults(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TEST_RESULTS);
  } catch (error) {
    console.error('Error clearing test results:', error);
  }
}

// ============ User Statistics ============

export async function getUserStats(): Promise<UserStats> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (data) {
      return JSON.parse(data);
    }
    // Retornar estadísticas por defecto
    return getDefaultStats();
  } catch (error) {
    console.error('Error getting user stats:', error);
    return getDefaultStats();
  }
}

export async function updateUserStats(result: TestResult): Promise<void> {
  try {
    const stats = await getUserStats();
    stats.totalTests += 1;
    stats.totalAttempted += result.totalQuestions;
    stats.totalCorrect += result.score;
    stats.averagePercentage = (stats.totalCorrect / stats.totalAttempted) * 100;

    // Actualizar estadísticas por bloque
    if (result.blockId) {
      const blockStats = stats.blockStats[result.blockId];
      blockStats.attempts += 1;
      blockStats.correct += result.score;
      blockStats.percentage = (blockStats.correct / (blockStats.attempts * 20)) * 100;
      blockStats.lastAttempt = result.createdAt;
    }

    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
}

export async function resetUserStats(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(getDefaultStats()));
  } catch (error) {
    console.error('Error resetting user stats:', error);
  }
}

function getDefaultStats(): UserStats {
  return {
    totalTests: 0,
    totalCorrect: 0,
    totalAttempted: 0,
    averagePercentage: 0,
    blockStats: {
      block1: { attempts: 0, correct: 0, percentage: 0 },
      block2: { attempts: 0, correct: 0, percentage: 0 },
      block3: { attempts: 0, correct: 0, percentage: 0 },
      block4: { attempts: 0, correct: 0, percentage: 0 },
    },
  };
}

// ============ App Settings ============

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
    return getDefaultSettings();
  } catch (error) {
    console.error('Error getting app settings:', error);
    return getDefaultSettings();
  }
}

export async function updateAppSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await getAppSettings();
    const updated = { ...current, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating app settings:', error);
  }
}

function getDefaultSettings(): AppSettings {
  return {
    darkMode: false,
    soundEnabled: true,
    vibrationEnabled: true,
    showTimer: true,
    theme: 'auto',
  };
}

// ============ Utility Functions ============

export async function getTestResultsByBlock(blockId: BlockType): Promise<TestResult[]> {
  try {
    const results = await getTestResults();
    return results.filter(r => r.blockId === blockId);
  } catch (error) {
    console.error('Error getting test results by block:', error);
    return [];
  }
}

export async function getTestResultsByType(type: 'block' | 'general'): Promise<TestResult[]> {
  try {
    const results = await getTestResults();
    return results.filter(r => r.type === type);
  } catch (error) {
    console.error('Error getting test results by type:', error);
    return [];
  }
}

export async function getRecentTestResults(limit: number = 10): Promise<TestResult[]> {
  try {
    const results = await getTestResults();
    return results.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit);
  } catch (error) {
    console.error('Error getting recent test results:', error);
    return [];
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TEST_RESULTS,
      STORAGE_KEYS.USER_STATS,
      STORAGE_KEYS.APP_SETTINGS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}
