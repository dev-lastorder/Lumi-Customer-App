import React, { memo } from 'react';
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';

import type { ICustomIconComponentProps } from '@/utils/interfaces';
import { Colors } from '@/utils';
import { useAppSelector } from '@/redux';
import { Text } from 'react-native';

const ICON_MAP = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  Fontisto,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

const CustomIconComponent = ({ icon, className, textStyle, isDefaultColor = true, rest }: ICustomIconComponentProps) => {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const defaultColor = Colors[currentTheme].text;

  const { size = 22, color } = icon;
  const type = icon.type ?? 'AntDesign';
  const Icon = ICON_MAP[type as keyof typeof ICON_MAP] ?? AntDesign;

  const iconProps: any = {
    name: icon.name,
    size,
    ...(isDefaultColor && !className ? { color: color ?? defaultColor } : {}),
  };

  return className ? (
    <Text  className={className} style={textStyle}>
      <Icon {...iconProps} {...rest} />
    </Text>
  ) : (
    <Icon {...iconProps} />
  );
};

export const CustomIcon = memo(CustomIconComponent);
