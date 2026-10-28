import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeMode, THEME_CONFIG, ThemePalette } from './themeConfig';

interface ThemeContextType {
  theme: ThemeMode;
  palette: ThemePalette;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'reps_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'dark';
  });

  const applyThemeTokens = (mode: ThemeMode) => {
    const palette = THEME_CONFIG[mode];
    const root = document.documentElement;

    root.setAttribute('data-theme', mode);

    // Apply CSS Variables
    root.style.setProperty('--bg-app', palette.bgApp);
    root.style.setProperty('--bg-app-canvas', palette.bgAppCanvas);
    root.style.setProperty('--bg-header', palette.bgHeader);
    root.style.setProperty('--border-header', palette.borderHeader);
    root.style.setProperty('--header-accent-gradient', palette.headerAccentGradient);

    root.style.setProperty('--bg-nav-container', palette.bgNavContainer);
    root.style.setProperty('--border-nav-container', palette.borderNavContainer);
    root.style.setProperty('--nav-active-bg', palette.navActiveBg);
    root.style.setProperty('--nav-active-text', palette.navActiveText);
    root.style.setProperty('--nav-inactive-text', palette.navInactiveText);
    root.style.setProperty('--nav-inactive-hover-bg', palette.navInactiveHoverBg);

    root.style.setProperty('--bg-card', palette.bgCard);
    root.style.setProperty('--bg-card-hover', palette.bgCardHover);
    root.style.setProperty('--border-card', palette.borderCard);
    root.style.setProperty('--border-card-hover', palette.borderCardHover);
    root.style.setProperty('--shadow-card', palette.shadowCard);

    root.style.setProperty('--text-primary', palette.textPrimary);
    root.style.setProperty('--text-secondary', palette.textSecondary);
    root.style.setProperty('--text-muted', palette.textMuted);

    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--primary-hover', palette.primaryHover);
    root.style.setProperty('--primary-active', palette.primaryActive);
    root.style.setProperty('--primary-text', palette.primaryText);
    root.style.setProperty('--primary-border', palette.primaryBorder);
    root.style.setProperty('--primary-shadow', palette.primaryShadow);

    root.style.setProperty('--btn-secondary-bg', palette.btnSecondaryBg);
    root.style.setProperty('--btn-secondary-hover', palette.btnSecondaryHover);
    root.style.setProperty('--btn-secondary-text', palette.btnSecondaryText);
    root.style.setProperty('--btn-secondary-border', palette.btnSecondaryBorder);

    root.style.setProperty('--input-bg', palette.inputBg);
    root.style.setProperty('--input-border', palette.inputBorder);
    root.style.setProperty('--input-text', palette.inputText);
    root.style.setProperty('--input-focus-border', palette.inputFocusBorder);

    root.style.setProperty('--badge-dark-bg', palette.badgeDarkBg);
    root.style.setProperty('--badge-dark-text', palette.badgeDarkText);
    root.style.setProperty('--badge-light-bg', palette.badgeLightBg);
    root.style.setProperty('--badge-light-text', palette.badgeLightText);
    root.style.setProperty('--badge-accent-bg', palette.badgeAccentBg);
    root.style.setProperty('--badge-accent-text', palette.badgeAccentText);

    root.style.setProperty('--bg-mobile-nav', palette.bgMobileNav);
    root.style.setProperty('--border-mobile-nav', palette.borderMobileNav);
  };

  useEffect(() => {
    applyThemeTokens(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        palette: THEME_CONFIG[theme],
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
