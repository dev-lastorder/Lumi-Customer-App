import { GET_ALL_ADDRESSES } from '@/api';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import { useAppSelector } from '@/redux/hooks';
import { Colors } from '@/utils';
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '../CustomText';
import LocationPickerModal from '../LocationPickerModal';
import { AnimatedHeaderProps } from '../interfaces';
import { useAnimatedHeaderStyles, useGoBackIcon } from './hooks';
import { HeaderIcon, BeforeLocation, AfterLocation, ChatAi } from './components';
import adjust from '@/utils/helpers/adjust';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  scrollY,
  title = 'Restaurants',
  showLocationDropdown = true,
  showSettings = true,
  showMap = true,
  showGoBack = false,
  showCart = false,
  settingsBadge,
  onSettingsPress = () => { },
  onMapPress = () => { },
  onGoBackPress = () => { },
  onCartPress = () => { },
  transparentBG = false
}) => {
  const insets = useSafeAreaInsets();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const cartItemsQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const { location: locationPicker, toggleLocationModal } = useLocationPicker();
  const { beforeLocationStyle, afterLocationStyle, overlayStyle } = useAnimatedHeaderStyles(scrollY);
  const goBackIcon = useGoBackIcon();
  const themeColors = Colors[currentTheme];


  const [openChatAi, setOpenChatAi] = useState(false);

  return (
    <>

      {title === 'Home' ? (
        // <View className={`${transparentBG ? 'absolute top-0 left-0 right-0 z-50' : 'relative pb-4'}`} style={{ paddingTop: insets.top + adjust(10) }}>
        <LinearGradient
          colors={["#DAD5FB", "#fcfcfc"]}
          start={{ x: 0, y: 0 }}   // top
          end={{ x: 0, y: 1 }}     // bottom
          style={{ paddingTop: insets.top + adjust(10) }}
          className={`${transparentBG ? 'absolute top-0 left-0 right-0 z-50 ' : 'relative pb-4'}`}
        >

          <Animated.View className='absolute flex-1 inset-0'  />

          <View className="px-4 bg- flex-row justify-between items-center h-14 mb-1 gap-4">

            {showGoBack && <HeaderIcon onPress={onGoBackPress} iconName={goBackIcon} iconType="Ionicons" />}
            {transparentBG && (<View className="flex-1" />)}

            <View className="flex-1 mr-3 justify-center relative h-full ">
              {showLocationDropdown && (<>
                <Animated.View className="absolute left-0 top-0 w-full justify-center h-full" style={beforeLocationStyle}>
                  <BeforeLocation
                    location={locationPicker?.selectedTitle}
                    onPress={() => toggleLocationModal(true)}
                    primaryColor={themeColors.primary}
                    textColor={themeColors.text}
                  />

                </Animated.View>
                <Animated.View className="absolute left-0 top-0 w-full justify-center h-full" style={afterLocationStyle}>
                  <AfterLocation
                    title={title}
                    location={locationPicker?.selectedTitle}
                    onPress={() => toggleLocationModal(true)}
                    primaryColor={themeColors.primary}
                    textColor={themeColors.text}
                  />
                </Animated.View>
              </>
              )}
            </View>

            <View className="flex-row items-center gap-4">
              {showSettings && <HeaderIcon onPress={onSettingsPress} iconName="filter-variant" iconType='MaterialCommunityIcons' badge={settingsBadge} />}
              {showMap && <HeaderIcon onPress={onMapPress} iconName="map" />}
              {showCart && (
                <View className='relative'>
                  {cartItemsQuantity >= 1 && (
                    <CustomText className='absolute bottom-7 left-7 z-10 bg-primary dark:bg-dark-primary rounded-full px-2' fontSize='xs' lightColor='white' darkColor='black'>{cartItemsQuantity}</CustomText>
                  )}
                  <HeaderIcon onPress={onCartPress} iconName="bell-outline" iconType='MaterialCommunityIcons' />
                </View>
              )}

            </View>
          </View>

          <View className="px-4 bg- flex-row justify-between items-center h-40 mb-1 gap-4">



            <View className="flex-1 mr-3 justify-center relative h-full ">


              <ChatAi
                location={locationPicker?.selectedTitle}
                onPress={() => toggleLocationModal(true)}
                primaryColor={themeColors.primary}
                textColor={themeColors.text}
              />
            </View>


          </View>


        </LinearGradient>
        // </View >

      ) : (
        <View className={`${transparentBG ? 'absolute top-0 left-0 right-0 z-50' : 'relative pb-4 bg-[#DAD5FB] dark:bg-dark-background'}`} style={{ paddingTop: insets.top + adjust(10) }}>
          <Animated.View className='absolute flex-1 inset-0' style={[overlayStyle, { backgroundColor: currentTheme === 'dark' ? themeColors.bgLight : themeColors.bgLight }]} />

          <View className="px-4 bg- flex-row justify-between items-center h-14 mb-1 gap-4">

            {showGoBack && <HeaderIcon onPress={onGoBackPress} iconName={goBackIcon} iconType="Ionicons" />}
            {transparentBG && (<View className="flex-1" />)}

            <View className="flex-1 mr-3 justify-center relative h-full ">
              {showLocationDropdown && (<>
                <Animated.View className="absolute left-0 top-0 w-full justify-center h-full" style={beforeLocationStyle}>
                  <BeforeLocation
                    location={locationPicker?.selectedTitle}
                    onPress={() => toggleLocationModal(true)}
                    primaryColor={themeColors.primary}
                    textColor={themeColors.text}
                  />

                </Animated.View>
                <Animated.View className="absolute left-0 top-0 w-full justify-center h-full" style={afterLocationStyle}>
                  <AfterLocation
                    title={title}
                    location={locationPicker?.selectedTitle}
                    onPress={() => toggleLocationModal(true)}
                    primaryColor={themeColors.primary}
                    textColor={themeColors.text}
                  />
                </Animated.View>
              </>
              )}
            </View>

            <View className="flex-row items-center gap-4">
              {showSettings && <HeaderIcon onPress={onSettingsPress} iconName="filter-variant" iconType='MaterialCommunityIcons' badge={settingsBadge} />}
              {showMap && <HeaderIcon onPress={onMapPress} iconName="map" />}
              {showCart && (
                <View className='relative'>
                  {cartItemsQuantity >= 1 && (
                    <CustomText className='absolute bottom-7 left-7 z-10 bg-primary dark:bg-dark-primary rounded-full px-2' fontSize='xs' lightColor='white' darkColor='black'>{cartItemsQuantity}</CustomText>
                  )}
                  <HeaderIcon onPress={onCartPress} iconName="cart-outline" iconType='MaterialCommunityIcons' />
                </View>
              )}

            </View>
          </View>
        </View >

      )

      }


      <LocationPickerModal
        visible={locationPicker.showLocationModal}
        onClose={() => toggleLocationModal(false)}
        onOpen={() => toggleLocationModal(true)}
        redirectTo='discovery'
      />
    </>
  );
};

export default AnimatedHeader;
