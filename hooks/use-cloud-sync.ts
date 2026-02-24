import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import { trpc } from '@/lib/trpc';
import { TestResult } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: number | null;
  syncError: string | null;
  syncedCount: number;
}

const DEVICE_ID_KEY = 'tai-test-device-id';
const LAST_SYNC_KEY = 'tai-test-last-sync';

export function useCloudSync() {
  const { user, isAuthenticated } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
    syncedCount: 0,
  });
  const [deviceId, setDeviceId] = useState<string | null>(null);

  // Initialize device ID
  useEffect(() => {
    const initDeviceId = async () => {
      let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
      if (!id) {
        id = uuidv4();
        await AsyncStorage.setItem(DEVICE_ID_KEY, id);
      }
      setDeviceId(id || '');
    };
    initDeviceId();
  }, []);

  // Get tRPC mutations and queries
  const createTestMutation = trpc.tests.create.useMutation();
  const getTestsQuery = trpc.tests.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const recordSyncMutation = trpc.sync.recordSync.useMutation();

  /**
   * Upload local test results to the cloud
   */
  const syncTestsToCloud = useCallback(async () => {
    if (!isAuthenticated || !deviceId) return;

    setSyncState(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      const localResults = await AsyncStorage.getItem('tai-test-results');
      if (!localResults) {
        setSyncState(prev => ({ ...prev, isSyncing: false }));
        return;
      }

      const results: TestResult[] = JSON.parse(localResults);
      let syncedCount = 0;

      // Upload each test result
      for (const result of results) {
        try {
          const userAnswersRecord: Record<string, string> = {};
          for (const [key, value] of Object.entries(result.userAnswers)) {
            userAnswersRecord[key] = value || '';
          }

          await createTestMutation.mutateAsync({
            type: result.type as 'block' | 'general',
            blockId: result.blockId || '',
            blockName: result.blockName || '',
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: result.percentage,
            duration: result.duration,
            userAnswers: userAnswersRecord,
            questions: result.questions,
          });

          // Record sync event
          await recordSyncMutation.mutateAsync({
            deviceId,
            action: 'upload',
            entityType: 'testResult',
            entityId: result.id,
          });

          syncedCount++;
        } catch (error) {
          console.error('Error syncing test result:', error);
        }
      }

      // Update last sync time
      const now = Date.now();
      await AsyncStorage.setItem(LAST_SYNC_KEY, now.toString());

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: now,
        syncedCount,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));
    }
  }, [isAuthenticated, deviceId, createTestMutation, recordSyncMutation]);

  /**
   * Download test results from the cloud
   */
  const syncTestsFromCloud = useCallback(async () => {
    if (!isAuthenticated || !deviceId) return;

    setSyncState(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      // Fetch tests from server
      const serverTests = await getTestsQuery.refetch();

      if (serverTests.data) {
        // Merge with local tests
        const localResults = await AsyncStorage.getItem('tai-test-results');
        const localTests: TestResult[] = localResults ? JSON.parse(localResults) : [];

        // Create a map of local test IDs for quick lookup
        const localTestIds = new Set(localTests.map(t => t.id));

        // Add new tests from server
        const newTests = (serverTests.data as any[]).filter(
          (serverTest: any) => !localTestIds.has(serverTest.id)
        );

        const mergedTests = [...localTests, ...newTests];
        await AsyncStorage.setItem('tai-test-results', JSON.stringify(mergedTests));

        // Record sync event
        if (deviceId) {
          await recordSyncMutation.mutateAsync({
            deviceId,
            action: 'download',
            entityType: 'testResult',
          });
        }

        const now = Date.now();
        await AsyncStorage.setItem(LAST_SYNC_KEY, now.toString());

        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncTime: now,
          syncedCount: newTests.length,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));
    }
  }, [isAuthenticated, deviceId, getTestsQuery, recordSyncMutation]);

  /**
   * Bidirectional sync
   */
  const syncBidirectional = useCallback(async () => {
    await syncTestsToCloud();
    await syncTestsFromCloud();
  }, [syncTestsToCloud, syncTestsFromCloud]);

  /**
   * Get last sync time
   */
  const getLastSyncTime = useCallback(async () => {
    const lastSync = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return lastSync ? parseInt(lastSync, 10) : null;
  }, []);

  return {
    ...syncState,
    deviceId,
    syncTestsToCloud,
    syncTestsFromCloud,
    syncBidirectional,
    getLastSyncTime,
  };
}
