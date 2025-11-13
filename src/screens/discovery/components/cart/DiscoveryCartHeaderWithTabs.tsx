import React, { useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '@/components/common/CustomText';
import { CustomIcon } from '@/components/common/Icon';
import { AnimatedIconButton } from '@/components/common/Buttons';

interface HeaderWithTabsProps {
  title: string;
  onGoBack: () => void;
  onEditPress: () => void;
  initialTab: 'cart' | 'order';
  onTabChange: (tab: 'cart' | 'order') => void;
  isEditing: boolean;
  handleSelectAll: () => void;
  totalQuantity: number;
}

const DiscoveryCartHeaderWithTabs: React.FC<HeaderWithTabsProps> = ({
  title,
  onGoBack,
  onEditPress,
  initialTab = 'cart',
  onTabChange,
  isEditing,
  handleSelectAll,
  totalQuantity,
}) => {
  const [activeTab, setActiveTab] = useState<'cart' | 'order'>(initialTab);
  const insets = useSafeAreaInsets();

  // Sync internal state with prop
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabPress = useCallback(
    (tab: 'cart' | 'order') => {
      setActiveTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange]
  );

  const shouldShowEditButton = activeTab === 'cart' && totalQuantity > 0;

  const tabs = [
    { key: 'cart', label: 'Shopping carts' },
    { key: 'order', label: 'Order again' },
  ] as const;

  return (
    <>
      {/* Custom Header */}
      <View style={{ paddingTop: insets.top + 15 }} className="bg-bgLight dark:bg-background/10 px-4 pt-4 pb-3">
        <View className="flex-row items-center justify-between">
          {/* Left - Back Button or Select All */}
          <View className="w-24 h-10 items-center justify-center relative">
            {/* Select All Button - only visible when editing */}
            {isEditing && (
              <TouchableOpacity onPress={handleSelectAll} className="absolute inset-0 flex-row items-center justify-center">
                <CustomText fontWeight="semibold" lightColor="#AAC810" darkColor="#AAC810" fontSize="sm">
                  Select all
                </CustomText>
              </TouchableOpacity>
            )}

            {/* Back Button - only visible when not editing */}
            {!isEditing && (
              <View className="absolute inset-0 flex-row items-center justify-center">
                <AnimatedIconButton
                  className="bg-grey-shade/10 dark:bg-dark-icon-background rounded-full w-10 h-10 items-center justify-center"
                  onPress={onGoBack}
                >
                  <CustomIcon
                    icon={{
                      size: 22,
                      type: 'AntDesign',
                      name: 'down',
                    }}
                  />
                </AnimatedIconButton>
              </View>
            )}
          </View>

          {/* Center - Title */}
          <View className="flex-1 items-center justify-center px-4">
            <CustomText variant="subheading" fontWeight="semibold" className="text-black dark:text-white" numberOfLines={1}>
              {title}
            </CustomText>
          </View>

          {/* Right - Edit button */}
          <View className="w-24 items-center">
            {shouldShowEditButton && (
              <TouchableOpacity onPress={onEditPress} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                <CustomText fontWeight="semibold" lightColor="#AAC810" darkColor="#AAC810" fontSize="sm">
                  {isEditing ? 'Cancel' : 'Edit'}
                </CustomText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Tabs Section */}
      <View className="items-center bg-bgLight dark:bg-background/10 pt-4 pb-2">
        <View className="flex-row rounded-full w-[90%] bg-grey-shade/10 dark:bg-background/10 p-1 h-[40px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabPress(tab.key)}
                className={`flex-1 items-center justify-center rounded-full ${isActive ? 'bg-background dark:bg-background/15' : ''}`}
                activeOpacity={0.7}
              >
                <CustomText
                  fontWeight={isActive ? 'semibold' : 'medium'}
                  fontSize="sm"
                  className={`leading-relaxed ${isActive ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {tab.label}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};

export default DiscoveryCartHeaderWithTabs;
