import { useWindowDimensions, Platform } from 'react-native';
import { useMemo } from 'react';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  return useMemo(
    () => ({
      width,
      height,
      isWeb,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isLargeDesktop: width >= 1440,
      screenSize: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : width < 1440 ? 'desktop' : 'large',
    }),
    [width, height, isWeb]
  );
}
