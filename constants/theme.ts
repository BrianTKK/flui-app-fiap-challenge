// Flui App - Design System tokens extracted from Figma

export const Colors = {
  // Backgrounds
  background: '#121212',
  surface: 'rgba(30, 30, 30, 0.85)',
  surfaceSolid: '#1E1E1E',
  surfaceLow: '#182218',
  surfaceCard: 'rgba(30, 30, 30, 0.7)',

  // Primary
  primary: '#00FF66',
  primaryDark: '#007128',
  primaryGlow: 'rgba(0, 255, 102, 0.3)',
  primaryGlowStrong: 'rgba(0, 255, 102, 0.4)',
  primarySubtle: 'rgba(0, 255, 102, 0.1)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B9CCB5',
  textMuted: 'rgba(185, 204, 181, 0.5)',
  textOnPrimary: '#007128',

  // Status
  available: '#00FF66',
  occupied: '#FFB4AB',
  location: '#00EEFC',
  locationGlow: 'rgba(0, 238, 252, 0.8)',
  locationBg: 'rgba(0, 238, 252, 0.2)',

  // Borders
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
  borderLight: 'rgba(255, 255, 255, 0.1)',

  // Misc
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  navBar: 'rgba(24, 34, 24, 0.8)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  titleLarge: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 40,
    letterSpacing: -2,
    lineHeight: 48,
  },
  titleMedium: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    lineHeight: 36,
  },
  titleSmall: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    lineHeight: 28,
  },
  headingLarge: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    lineHeight: 32,
  },
  headingMedium: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    lineHeight: 28,
  },
  bodyLarge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 0.96,
    lineHeight: 16,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 15,
  },
};

export const Shadows = {
  glow: {
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  tabGlow: {
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 7.5,
    elevation: 6,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  navBar: {
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
};
