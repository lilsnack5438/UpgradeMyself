import { Text, type TextProps } from 'react-native';

import { Typography, type ThemeColor, type TypographyVariant } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: TypographyVariant;
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'body', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text style={[{ color: theme[themeColor ?? 'text'] }, Typography[type], style]} {...rest} />
  );
}
