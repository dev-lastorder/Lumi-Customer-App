// ====================================
// 📦 Imports
// ====================================
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 🧩 Components
import { CustomText } from '@/components/common/CustomText';
import { CustomIcon } from '@/components/common/Icon';
import { AnimatedIconButton } from './Buttons';

// ====================================
// 🧠 Props Interface
// ====================================
interface GlobalHeaderProps {
  title?: string;
  subtitle?: string; // ← new
  showGoBack?: boolean;
  icon?: { name: string; type: any; size: number; color?: string };
  rightIcons?: React.ReactNode[];
  onGoBack?: () => void;
}

// ====================================
// 📌 Global Header Component
// ====================================
const GlobalHeader: React.FC<GlobalHeaderProps> = ({ title = '', subtitle, showGoBack = true, icon, rightIcons = [], onGoBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-background dark:bg-dark-background border-b border-border dark:border-dark-border/30 px-4 pt-4 pb-3"
    >
      {/* ── Left Section ───────────────────────────────────── */}
      <View className='flex-row items-center  pr-11'>
        <View className="flex-row items-center">
          {showGoBack && (
            <AnimatedIconButton className="bg-icon-background dark:bg-dark-icon-background p-2 rounded-full w-10" onPress={onGoBack}>
              <CustomIcon icon={{ size: 22, type: 'Ionicons', name: 'arrow-back' }} />
            </AnimatedIconButton>
          )}

          {icon && (
            <View className="ml-2">
              <CustomIcon icon={icon} />
            </View>
          )}

          <View className="ml-3 flex-1 flex-col ">
            {/* ── Title and Subtitle ──────────────────────────── */}
            {title.length > 0 && (
              <CustomText variant="heading3" fontWeight="semibold" className="text-black dark:text-white" numberOfLines={1}>
                {title}
              </CustomText>
            )}

            {subtitle && (
              <CustomText variant={'label'} fontSize={'sm'} numberOfLines={1}>
                {subtitle}
              </CustomText>
            )}
          </View>
        </View>

        {rightIcons.length > 0 && (
          <View className="flex-row space-x-3">
            {rightIcons.map((IconComponent, i) => (
              <View key={i} className='bg-icon-background dark:bg-dark-icon-background w-[40px] h-[40px] flex items-center justify-center rounded-full'>
                {IconComponent}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ── Right Section ──────────────────────────────────── */}
      {/* {rightIcons.length > 0 && (
        <View className="absolute right-4 top-[50%] transform -translate-y-1/2 flex-row space-x-3">
          {rightIcons.map((IconComponent, i) => (
            <View key={i}>{IconComponent}</View>
          ))}
        </View>
      )} */}
    </View>
  );
};

export default GlobalHeader;
