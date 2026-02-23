import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { getUserStats } from "@/lib/storage";
import { UserStats } from "@/lib/types";

export default function HomeScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const userStats = await getUserStats();
    setStats(userStats);
  };

  const handleBlockTest = () => {
    router.push("/test-blocks");
  };

  const handleGeneralTest = () => {
    router.push("/general-test");
  };

  const handleHistory = () => {
    router.push("/history");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">TAI Test</Text>
            <Text className="text-sm text-muted">Preparación para la oposición TAI 2025</Text>
          </View>

          {/* Statistics Cards */}
          {stats && (
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-xs text-muted mb-1">Tests Realizados</Text>
                  <Text className="text-2xl font-bold text-primary">{stats.totalTests}</Text>
                </View>
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
                  <Text className="text-xs text-muted mb-1">Aciertos</Text>
                  <Text className="text-2xl font-bold text-success">{stats.totalCorrect}</Text>
                </View>
              </View>
              <View className="bg-surface rounded-xl p-4 border border-border">
                <Text className="text-xs text-muted mb-1">Porcentaje Promedio</Text>
                <Text className="text-2xl font-bold text-primary">
                  {stats.averagePercentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          )}

          {/* Main Actions */}
          <View className="gap-3">
            <Pressable
              onPress={handleBlockTest}
              style={({ pressed }) => [{
                opacity: pressed ? 0.7 : 1,
              }]}
            >
              <View className="bg-primary rounded-xl p-5">
                <Text className="text-lg font-bold text-background mb-1">Test por Bloques</Text>
                <Text className="text-sm text-background opacity-90">
                  Practica bloques temáticos específicos
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleGeneralTest}
              style={({ pressed }) => [{
                opacity: pressed ? 0.7 : 1,
              }]}
            >
              <View className="bg-primary rounded-xl p-5">
                <Text className="text-lg font-bold text-background mb-1">Examen General</Text>
                <Text className="text-sm text-background opacity-90">
                  20 preguntas aleatorias de todos los bloques
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Secondary Actions */}
          <View className="gap-2">
            <Pressable
              onPress={handleHistory}
              style={({ pressed }) => [{
                opacity: pressed ? 0.7 : 1,
              }]}
            >
              <View className="bg-surface rounded-xl p-4 border border-border">
                <Text className="text-base font-semibold text-foreground">Historial de Tests</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
