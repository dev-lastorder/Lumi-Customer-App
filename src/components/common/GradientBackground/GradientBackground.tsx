// src/components/common/GradientBackground/GradientBackground.tsx
import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

// Exact colors from your Figma design (same as AnimatedHeader)
const GRADIENT_COLORS = ["#DAD5FB", "#fcfcfc"];

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  className,
}) => {
  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}    // Start from top
      end={{ x: 0, y: 1 }}      // End at bottom
      style={[{ flex: 1 }, style]}  // <- Add flex: 1 here explicitly
      className={className}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;