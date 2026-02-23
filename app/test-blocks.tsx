import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { BLOCKS, BlockType } from '@/lib/types';
import { useTestSession } from '@/hooks/use-test-session';
import { getTestResultsByBlock } from '@/lib/storage';
import { useEffect, useState } from 'react';

export default function TestBlocksScreen() {
  const router = useRouter();
  const { startBlockTest } = useTestSession();
  const [blockStats, setBlockStats] = useState<Record<BlockType, { attempts: number; percentage: number }>>({} as any);

  useEffect(() => {
    loadBlockStats();
  }, []);

  const loadBlockStats = async () => {
    const stats: Record<BlockType, { attempts: number; percentage: number }> = {
      block1: { attempts: 0, percentage: 0 },
      block2: { attempts: 0, percentage: 0 },
      block3: { attempts: 0, percentage: 0 },
      block4: { attempts: 0, percentage: 0 },
    };

    for (const blockId of Object.keys(BLOCKS) as BlockType[]) {
      const results = await getTestResultsByBlock(blockId);
      if (results.length > 0) {
        stats[blockId].attempts = results.length;
        const avgPercentage = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
        stats[blockId].percentage = avgPercentage;
      }
    }

    setBlockStats(stats);
  };

  const handleBlockPress = (blockId: BlockType) => {
    startBlockTest(blockId);
    router.push({
      pathname: '/test-question',
      params: { blockId },
    });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="gap-2 mb-4">
            <Text className="text-2xl font-bold text-foreground">Bloques Temáticos</Text>
            <Text className="text-sm text-muted">Selecciona un bloque para comenzar</Text>
          </View>

          {/* Blocks List */}
          {(Object.keys(BLOCKS) as BlockType[]).map(blockId => {
            const block = BLOCKS[blockId];
            const stats = blockStats[blockId];

            return (
              <Pressable
                key={blockId}
                onPress={() => handleBlockPress(blockId)}
                style={({ pressed }) => [{
                  opacity: pressed ? 0.7 : 1,
                }]}
              >
                <View className="bg-surface rounded-xl p-4 border border-border">
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground">{block.name}</Text>
                      <Text className="text-xs text-muted mt-1">{block.totalThemes} temas • {block.totalQuestions} preguntas</Text>
                    </View>
                    <View className="bg-primary rounded-lg px-3 py-1">
                      <Text className="text-sm font-semibold text-background">Iniciar</Text>
                    </View>
                  </View>

                  {/* Progress */}
                  {stats && stats.attempts > 0 && (
                    <View className="mt-3 gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-muted">Intentos: {stats.attempts}</Text>
                        <Text className="text-xs font-semibold text-primary">{stats.percentage.toFixed(1)}%</Text>
                      </View>
                      <View className="h-2 bg-border rounded-full overflow-hidden">
                        <View
                          className="h-full bg-primary"
                          style={{
                            width: `${Math.min(stats.percentage, 100)}%`,
                          }}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
