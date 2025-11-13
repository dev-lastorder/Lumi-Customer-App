
import { SharedValue } from 'react-native-reanimated';


export interface AnimatedHeaderProps {
  scrollY: SharedValue<number>;
  title?: string;
  showLocationDropdown?: boolean;
  showSettings?: boolean;
  showMap?: boolean;
  showGoBack?: boolean;
  settingsBadge?: string | number;
  onSettingsPress?: () => void;
  onMapPress?: () => void;
  onGoBackPress?: () => void;
}

export interface HeaderIconProps {
  onPress?: () => void;
  iconName: string;
  iconType?: 'Feather' | 'Ionicons' | 'FontAwesome' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'Octicons' | 'FontAwesome5' | 'Entypo' | 'SimpleLineIcons';
  badge?: any;
}

export interface BeforeLocationProps {
  location: string;
  onPress: () => void;
  primaryColor: string;
  textColor: string;
}
export interface ChatAiProps {
  location: string;
  onPress: () => void;
  primaryColor: string;
  textColor: string;
}
export interface AfterLocationProps {
  title: string;
  location: string;
  onPress: () => void;
  primaryColor: string;
  textColor: string;
}
