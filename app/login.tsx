import { ScrollView, Text, View, Pressable, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const { user, isAuthenticated, loading, refresh } = useAuth();

  const handleLogin = async () => {
    const oauthUrl = 'https://api.manus.im/oauth/authorize?response_type=code&client_id=tai-test-app&redirect_uri=' + encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/oauth/callback' : 'exp://localhost/oauth/callback');
    if (typeof window !== 'undefined') {
      window.location.href = oauthUrl;
    } else {
      await Linking.openURL(oauthUrl);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    refresh();
  }, []);

  if (loading) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  if (isAuthenticated && user) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-8">
          <View className="gap-4 items-center">
            <Text className="text-5xl font-bold text-primary">TAI Test</Text>
            <Text className="text-xl font-semibold text-foreground text-center">
              Sincroniza tu progreso en la nube
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              Accede desde cualquier dispositivo (móvil o escritorio) y mantén tu progreso sincronizado automáticamente.
            </Text>
          </View>

          <View className="gap-3">
            <View className="flex-row gap-3 items-start">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mt-1">
                <Text className="text-background font-bold text-sm">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Sincronización en la nube</Text>
                <Text className="text-sm text-muted">Accede desde múltiples dispositivos</Text>
              </View>
            </View>

            <View className="flex-row gap-3 items-start">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mt-1">
                <Text className="text-background font-bold text-sm">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Historial completo</Text>
                <Text className="text-sm text-muted">Todos tus tests guardados en la nube</Text>
              </View>
            </View>

            <View className="flex-row gap-3 items-start">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mt-1">
                <Text className="text-background font-bold text-sm">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Estadísticas sincronizadas</Text>
                <Text className="text-sm text-muted">Tu progreso siempre actualizado</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [{
              opacity: pressed ? 0.7 : 1,
            }]}
          >
            <View className="bg-primary rounded-xl p-6 items-center">
              <Text className="text-lg font-bold text-background">
                Iniciar sesión con Manus
              </Text>
            </View>
          </Pressable>

          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted text-center leading-relaxed">
              Al iniciar sesión, aceptas que tu progreso se sincronice en la nube de forma segura. Tus datos están protegidos con encriptación.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
