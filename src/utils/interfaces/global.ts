// @/utils/interfaces.ts (or your interface file path)

import type {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle, ViewProps } from 'react-native';

export interface IGlobalProps {
  children?: React.ReactNode;
}

export interface IGlobalComponentProps extends IGlobalProps {
  className?: string;
}

// Icon
export type TIconType = 'Ionicons' | 'default';

export interface IDropdownItem {
  id: string;
  label: string;
  value: string;
}

interface IIconBaseProps {
  size?: number;
  color?: string;
}

export interface IAntDesignIconProps extends IIconBaseProps {
  type?: 'AntDesign' | 'default';
  name: keyof typeof AntDesign.glyphMap;
}

export interface IEntypoIconProps extends IIconBaseProps {
  type: 'Entypo';
  name: keyof typeof Entypo.glyphMap;
}

export interface IEvilIconsIconProps extends IIconBaseProps {
  type: 'EvilIcons';
  name: keyof typeof EvilIcons.glyphMap;
}

export interface IFeatherIconProps extends IIconBaseProps {
  type: 'Feather';
  name: keyof typeof Feather.glyphMap;
}

export interface IFontistoIconProps extends IIconBaseProps {
  type: 'Fontisto';
  name: keyof typeof Fontisto.glyphMap;
}

export interface IFontAwesomeIconProps extends IIconBaseProps {
  type: 'FontAwesome';
  name: keyof typeof FontAwesome.glyphMap;
}

export interface IFontAwesome5IconProps extends IIconBaseProps {
  type: 'FontAwesome5';
  name: keyof typeof FontAwesome5.glyphMap;
}

export interface IFontAwesome6IconProps extends IIconBaseProps {
  type: 'FontAwesome6';
  name: keyof typeof FontAwesome6.glyphMap;
}

export interface IFoundationIconProps extends IIconBaseProps {
  type: 'Foundation';
  name: keyof typeof Foundation.glyphMap;
}

export interface IIoniconsIconProps extends IIconBaseProps {
  type: 'Ionicons';
  name: keyof typeof Ionicons.glyphMap;
}

export interface IMaterialCommunityIconsIconProps extends IIconBaseProps {
  type: 'MaterialCommunityIcons';
  name: keyof typeof MaterialCommunityIcons.glyphMap;
}

export interface IMaterialIconsIconProps extends IIconBaseProps {
  type: 'MaterialIcons';
  name: keyof typeof MaterialIcons.glyphMap;
}

export interface IOcticonsIconProps extends IIconBaseProps {
  type: 'Octicons';
  name: keyof typeof Octicons.glyphMap;
}

export interface ISimpleLineIconsIconProps extends IIconBaseProps {
  type: 'SimpleLineIcons';
  name: keyof typeof SimpleLineIcons.glyphMap;
}

export interface IZocialIconProps extends IIconBaseProps {
  type: 'Zocial';
  name: keyof typeof Zocial.glyphMap;
}

export type SpecificIconProps =
  | IAntDesignIconProps
  | IEntypoIconProps
  | IEvilIconsIconProps
  | IFeatherIconProps
  | IFontistoIconProps
  | IFontAwesomeIconProps
  | IFontAwesome5IconProps
  | IFontAwesome6IconProps
  | IFoundationIconProps
  | IIoniconsIconProps
  | IMaterialCommunityIconsIconProps
  | IMaterialIconsIconProps
  | IOcticonsIconProps
  | ISimpleLineIconsIconProps
  | IZocialIconProps;

export interface ICustomIconComponentProps extends IGlobalComponentProps, ViewProps {
  textStyle?:StyleProp<TextStyle>;
  icon: SpecificIconProps;
  isDefaultColor?: boolean;
  [key: string]: any;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IPagination {
  pageNo?: number;
  pageSize?: number;
}

export interface IGoogleUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  picture: string;
  type: 'google' | 'apple';
}

export type FontFamily = 'Poppins' | 'Inter';
export type TRestaurantQueries = 'NearByRestaurants' | 'RecentOrderRestaurants' | 'MostOrderRestaurants' | 'TopRatedVendors';
export type TQueryArguments<T> = Partial<Record<TRestaurantQueries, QueryArgument<T>>>;

interface QueryArgument<T> {
  skip: boolean;
  variables?: T;
}
export interface IUseRestaurantVariables extends ILocation {
  shopType?: string[];
}

export interface IUseRestaurantHook<T> {
  queryArguments: TQueryArguments<T>;
  pagination?: IPagination;
}

export interface IDiscoveryPreview {
  _id: string;
  name: string;
  image: string;
  logo: string;
  deliveryTime: number;
  minimumOrder: number;
  rating: number;
  shopType: string;
}

export interface IDiscoveryMiniPreview extends IDiscoveryPreview {}

export interface ICuisine {
  _id: string;
  name: string;
  image: string;
}
