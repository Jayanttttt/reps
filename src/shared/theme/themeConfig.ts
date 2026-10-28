/**
 * REPS Theme Configuration
 * ============================================================
 * Easily customize colors for both Light and Dark themes here.
 * Any change made to this file updates the entire application
 * without touching component code.
 * ============================================================
 */

export type ThemeMode = 'dark' | 'light';

export interface ThemePalette {
  // Canvas & Backgrounds
  bgApp: string;
  bgAppCanvas: string;
  bgHeader: string;
  borderHeader: string;
  headerAccentGradient: string;

  // Navigation
  bgNavContainer: string;
  borderNavContainer: string;
  navActiveBg: string;
  navActiveText: string;
  navInactiveText: string;
  navInactiveHoverBg: string;

  // Cards
  bgCard: string;
  bgCardHover: string;
  borderCard: string;
  borderCardHover: string;
  shadowCard: string;

  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Primary Action Accent (Buttons, Highlights)
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryText: string;
  primaryBorder: string;
  primaryShadow: string;

  // Secondary Buttons
  btnSecondaryBg: string;
  btnSecondaryHover: string;
  btnSecondaryText: string;
  btnSecondaryBorder: string;

  // Inputs
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputFocusBorder: string;

  // Badges & Accents
  badgeDarkBg: string;
  badgeDarkText: string;
  badgeLightBg: string;
  badgeLightText: string;
  badgeAccentBg: string;
  badgeAccentText: string;

  // Mobile Bottom Nav
  bgMobileNav: string;
  borderMobileNav: string;
}

export const THEME_CONFIG: Record<ThemeMode, ThemePalette> = {
  // 🌙 Dark Theme (Luxury Dark Athletic Aesthetics)
  dark: {
    bgApp: 'transparent',
    bgAppCanvas: '#050505',
    bgHeader: 'rgba(10, 10, 10, 0.95)',
    borderHeader: 'rgba(239, 68, 68, 0.3)',
    headerAccentGradient: 'linear-gradient(to right, #b91c1c, #f43f5e, #b91c1c)',

    bgNavContainer: 'rgba(23, 23, 23, 0.9)',
    borderNavContainer: 'rgba(64, 64, 64, 0.8)',
    navActiveBg: 'linear-gradient(to right, #dc2626, #e11d48)',
    navActiveText: '#ffffff',
    navInactiveText: '#d4d4d4',
    navInactiveHoverBg: 'rgba(38, 38, 38, 0.8)',

    bgCard: 'rgba(0, 0, 0, 0.45)',
    bgCardHover: 'rgba(20, 20, 20, 0.65)',
    borderCard: 'rgba(255, 255, 255, 0.1)',
    borderCardHover: 'rgba(239, 68, 68, 0.4)',
    shadowCard: '0 8px 32px 0 rgba(0, 0, 0, 0.35)',

    textPrimary: '#ffffff',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',

    primary: '#dc2626',
    primaryHover: '#ef4444',
    primaryActive: '#b91c1c',
    primaryText: '#ffffff',
    primaryBorder: 'rgba(239, 68, 68, 0.5)',
    primaryShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.35)',

    btnSecondaryBg: 'rgba(255, 255, 255, 0.08)',
    btnSecondaryHover: 'rgba(255, 255, 255, 0.15)',
    btnSecondaryText: '#ffffff',
    btnSecondaryBorder: 'rgba(255, 255, 255, 0.16)',

    inputBg: 'rgba(0, 0, 0, 0.55)',
    inputBorder: 'rgba(255, 255, 255, 0.2)',
    inputText: '#ffffff',
    inputFocusBorder: '#ef4444',

    badgeDarkBg: 'rgba(0, 0, 0, 0.6)',
    badgeDarkText: '#ffffff',
    badgeLightBg: 'rgba(255, 255, 255, 0.1)',
    badgeLightText: '#ffffff',
    badgeAccentBg: 'rgba(239, 68, 68, 0.25)',
    badgeAccentText: '#fca5a5',

    bgMobileNav: 'rgba(10, 10, 10, 0.98)',
    borderMobileNav: 'rgba(220, 38, 38, 0.6)',
  },

  // ☀️ Light Theme (Inspiration: Modern Clean Dashboard + Coral Peach / Sunset Orange & Midnight Navy)
  light: {
    bgApp: '#F6F8FB',
    bgAppCanvas: '#F6F8FB',
    bgHeader: 'rgba(255, 255, 255, 0.85)',
    borderHeader: 'rgba(226, 232, 240, 0.7)',
    headerAccentGradient: 'linear-gradient(135deg, #FF5B45 0%, #FF7854 50%, #FFA07A 100%)',

    bgNavContainer: 'rgba(241, 244, 249, 0.8)',
    borderNavContainer: 'rgba(226, 232, 240, 0.8)',
    navActiveBg: 'linear-gradient(135deg, #FF5B45 0%, #FF7854 100%)', // Vibrant warm coral pill
    navActiveText: '#FFFFFF',
    navInactiveText: '#334155',
    navInactiveHoverBg: 'rgba(233, 238, 245, 0.7)',

    // Glassmorphic Card Settings
    bgCard: 'rgba(255, 255, 255, 0.78)',
    bgCardHover: 'rgba(255, 255, 255, 0.92)',
    borderCard: 'rgba(255, 255, 255, 0.85)',
    borderCardHover: 'rgba(255, 91, 69, 0.45)',
    shadowCard: '0 10px 32px -4px rgba(24, 39, 75, 0.06), 0 2px 8px -2px rgba(24, 39, 75, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',

    textPrimary: '#1A2238',
    textSecondary: '#334155',
    textMuted: '#475569',

    primary: '#FF5B45', // Warm vibrant coral from the inspo image
    primaryHover: '#E84D37',
    primaryActive: '#CF3C27',
    primaryText: '#FFFFFF',
    primaryBorder: 'rgba(255, 91, 69, 0.4)',
    primaryShadow: '0 4px 16px 0 rgba(255, 91, 69, 0.28)',

    btnSecondaryBg: '#F1F4F9',
    btnSecondaryHover: '#E5EBF4',
    btnSecondaryText: '#1A2238',
    btnSecondaryBorder: '#E2E8F0',

    inputBg: '#F8FAFD',
    inputBorder: '#E2E8F0',
    inputText: '#1A2238',
    inputFocusBorder: '#FF5B45',

    badgeDarkBg: '#1A2238',
    badgeDarkText: '#FFFFFF',
    badgeLightBg: '#F1F4F9',
    badgeLightText: '#5F6D7E',
    badgeAccentBg: '#FFF0ED',
    badgeAccentText: '#FF5B45',

    bgMobileNav: 'rgba(255, 255, 255, 0.98)',
    borderMobileNav: '#EEF2F6',
  },
};
