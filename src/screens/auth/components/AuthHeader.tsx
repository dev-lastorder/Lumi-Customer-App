// src/components/auth/AuthHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}) => {
  return (
    <View className={`mb-8 ${className}`}>
      {/* Blue Title */}
      <Text 
        className={`text-4xl font-semibold mb-3 ${titleClassName}`}
        style={{ color: '#3853A4' }}
      >
        {title}
      </Text>
      
      {/* Gray Subtitle */}
      <Text 
        className={`text-base leading-6 ${subtitleClassName}`}
        style={{ color: '#969696' }}
      >
        {subtitle}
      </Text>
    </View>
  );
};

export default AuthHeader;