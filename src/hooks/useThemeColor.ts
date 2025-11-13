import { useAppSelector } from '@/redux';
import { Colors } from '@/utils';

type ThemeColors = typeof Colors.light; 

export const useThemeColor = (): ThemeColors => {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme) as keyof typeof Colors;
  const safeTheme = currentTheme in Colors ? currentTheme : 'light';
  
  return Colors[safeTheme] as ThemeColors; 
};