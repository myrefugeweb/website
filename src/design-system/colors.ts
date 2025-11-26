// Color tokens for the design system
export const colors = {
  // Primary colors
  primary: {
    50: '#FFF4E6',
    100: '#FFE8CC',
    200: '#FFD199',
    300: '#FFBA66',
    400: '#FFA333',
    500: '#FF8C00', // Main orange
    600: '#CC7000',
    700: '#995400',
    800: '#663800',
    900: '#331C00',
  },
  
  // Secondary colors (blue)
  secondary: {
    50: '#E6F2FF',
    100: '#CCE5FF',
    200: '#99CBFF',
    300: '#66B1FF',
    400: '#3397FF',
    500: '#007DFF', // Main blue
    600: '#0064CC',
    700: '#004B99',
    800: '#003266',
    900: '#001933',
  },
  
  // Accent colors
  accent: {
    green: '#4CAF50',
    greenLight: '#81C784',
  },
  
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
} as const;

export type ColorToken = typeof colors;

