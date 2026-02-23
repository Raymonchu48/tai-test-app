import { View, useWindowDimensions, Platform } from 'react-native';
import { ReactNode } from 'react';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Componente de layout responsivo que se adapta a diferentes tamaños de pantalla
 * En web (escritorio): muestra una interfaz de dos columnas o sidebar
 * En móvil: muestra una interfaz de una columna
 */
export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width >= 1024; // Desktop

  if (isWeb && isLargeScreen) {
    // Layout de escritorio: sidebar + contenido
    return (
      <View className={`flex-1 flex-row bg-background ${className}`}>
        {children}
      </View>
    );
  }

  // Layout móvil: una columna
  return (
    <View className={`flex-1 bg-background ${className}`}>
      {children}
    </View>
  );
}

/**
 * Sidebar para navegación en escritorio
 */
export function ResponsiveSidebar({ children, className }: ResponsiveLayoutProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width >= 1024;

  if (!isWeb || !isLargeScreen) {
    return null;
  }

  return (
    <View className={`w-64 bg-surface border-r border-border ${className}`}>
      {children}
    </View>
  );
}

/**
 * Contenido principal responsivo
 */
export function ResponsiveContent({ children, className }: ResponsiveLayoutProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width >= 1024;

  const contentWidth = isWeb && isLargeScreen ? 'flex-1' : 'w-full';

  return (
    <View className={`${contentWidth} ${className}`}>
      {children}
    </View>
  );
}
