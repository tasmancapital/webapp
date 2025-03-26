import React, { createContext, useContext, useEffect, useState } from 'react';
import { themes } from './themes';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  activeTheme: string;
  isCustomizerOpen: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setActiveTheme: (theme: string) => void;
  toggleCustomizer: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('theme') as Theme) || 'light';
}

function getInitialActiveTheme(): string {
  if (typeof window === 'undefined') return 'slate';
  return localStorage.getItem('activeTheme') || 'zinc';
}

function applyTheme(theme: Theme, activeTheme: string) {
  const root = window.document.documentElement;
  const themeColors = themes[activeTheme]?.cssVars[theme];
  
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  
  if (themeColors) {
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const [activeTheme, setActiveTheme] = useState(getInitialActiveTheme());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Initialize theme before first render
  useEffect(() => {
    applyTheme(theme, activeTheme);
    setIsLoading(false);
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (isLoading) return;
    
    applyTheme(theme, activeTheme);
    localStorage.setItem('theme', theme);
  }, [theme, activeTheme]);

  // Handle active theme changes
  useEffect(() => {
    if (isLoading) return;
    
    localStorage.setItem('activeTheme', activeTheme);
  }, [activeTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const toggleCustomizer = () => {
    setIsCustomizerOpen(prev => !prev);
  };

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        activeTheme, 
        isCustomizerOpen,
        toggleTheme, 
        setTheme, 
        setActiveTheme,
        toggleCustomizer 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}