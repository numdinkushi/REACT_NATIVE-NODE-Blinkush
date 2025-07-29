import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors, lightTheme, darkTheme } from './Constants';
import { mmkvStorage } from '@state/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeColors;
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

    // Initialize theme from storage
    useEffect(() => {
        const savedTheme = mmkvStorage.getString('theme_mode');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setThemeModeState(savedTheme as ThemeMode);
        }
    }, []);

    // Determine if we should use dark theme
    const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

    // Get current theme colors
    const theme = isDark ? darkTheme : lightTheme;

    const setThemeMode = (mode: ThemeMode) => {
        setThemeModeState(mode);
        mmkvStorage.set('theme_mode', mode);
    };

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        setThemeMode(newMode);
    };

    const value: ThemeContextType = {
        theme,
        themeMode,
        isDark,
        setThemeMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 