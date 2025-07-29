export enum Colors {
    primary = '#f7ca49',
    primary_light = '#ffe141',
    secondary = '#0d8320',
    text = '#363636',
    disabled = '#9197a6',
    border = "#d0d4dc",
    backgroundSecondary = '#f5f6fb'
}

export enum Fonts {
    Regular = 'Okra-Regular',
    Medium = 'Okra-Medium',
    Light = 'Okra-MediumLight',
    SemiBold = 'Okra-Bold',
    Bold = 'Okra-ExtraBold',
}

// Theme system for light and dark modes
export interface ThemeColors {
    primary: string;
    primary_light: string;
    secondary: string;
    text: string;
    textSecondary: string;
    disabled: string;
    border: string;
    background: string;
    backgroundSecondary: string;
    surface: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    lightGray: string;
}

export const lightTheme: ThemeColors = {
    primary: '#f7ca49',
    primary_light: '#ffe141',
    secondary: '#0d8320',
    text: '#363636',
    textSecondary: '#666666',
    disabled: '#9197a6',
    border: '#d0d4dc',
    background: '#ffffff',
    backgroundSecondary: '#f5f6fb',
    surface: '#ffffff',
    card: '#ffffff',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    lightGray: '#f8f9fa',
};

export const darkTheme: ThemeColors = {
    primary: '#f7ca49',
    primary_light: '#ffe141',
    secondary: '#0d8320',
    text: '#ffffff',
    textSecondary: '#cccccc',
    disabled: '#6c757d',
    border: '#404040',
    background: '#121212',
    backgroundSecondary: '#1e1e1e',
    surface: '#2d2d2d',
    card: '#2d2d2d',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    lightGray: '#404040',
};

// Existing gradient colors
export const lightColors = [
    'rgba(255,255,255,1)',
    'rgba(255,255,255,0.9)',
    'rgba(255,255,255,0.7)',
    'rgba(255,255,255,0.6)',
    'rgba(255,255,255,0.5)',
    'rgba(255,255,255,0.4)',
    'rgba(255,255,255,0.003)',
];

export const darkWeatherColors = [
    'rgba(54, 67, 92, 1)',
    'rgba(54, 67, 92, 0.9)',
    'rgba(54, 67, 92, 0.8)',
    'rgba(54, 67, 92, 0.2)',
    'rgba(54, 67, 92, 0.0)',
];

// Dark gradient colors for dark mode
export const darkColors = [
    'rgba(18,18,18,1)',
    'rgba(18,18,18,0.9)',
    'rgba(18,18,18,0.7)',
    'rgba(18,18,18,0.6)',
    'rgba(18,18,18,0.5)',
    'rgba(18,18,18,0.4)',
    'rgba(18,18,18,0.003)',
];
