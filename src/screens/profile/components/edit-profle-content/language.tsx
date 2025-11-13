import { CustomIconButton, CustomRadioButton, CustomText } from '@/components';
import { useThemeColor, useTranslation } from '@/hooks';
import { language } from '@/types';
import { LANGUAGES } from '@/utils';
// import { reloadAsync } from 'expo-updates';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

export default function ProfileLanguge() {
  const [isChangingLang, setIsChangingLang] = useState(false);
  const [isSelected, setIsSelected] = useState<language>('en');

  // Hooks
  const appTheme = useThemeColor();
  const { t, changeLang, currentLang } = useTranslation();

  // Handlers
  const handleLanguageSelection = async (selectedLanguage: language) => {
    setIsSelected(selectedLanguage);
  };

  const handleSubmission = async () => {
    try {
      setIsChangingLang(true);
      changeLang(isSelected);
      // await reloadAsync();
      setIsChangingLang(false);
    } catch (e) {
      
    }
  };

  useEffect(() => {
    setIsSelected(currentLang);
  }, [currentLang]);
  return (
    <View className="h-[90%] w-full items-center justify-between mx-auto  p-2" style={{ backgroundColor: appTheme.background }}>
      {LANGUAGES.map((lng, index) => {
        return (
          <View
            key={`lng-${index}`}
            className="w-[95%] mx-auto flex flex-row items-center justify-between border-b-[0.5px] border-b-gray-300 h-12"
            style={{ backgroundColor: appTheme.background }}
          >
            <View className="flex flex-row gap-3 items-center justify-center px-3">
              <View className="overflow-hidden items-center justify-start w-8 h-6">
                <Image source={lng.icon} width={100} height={100} className="max-w-8 max-h-8" />
              </View>
              <CustomText variant='label' fontSize='sm' fontWeight='normal' style={{ color: appTheme.text, }}>{lng.value}</CustomText>
            </View>
            <View>
              <CustomRadioButton
                label={lng.code}
                isSelected={lng.code === isSelected}
                showLabel={false}
                onPress={() => handleLanguageSelection(lng.code as language)}
              />
            </View>
          </View>
        );
      })}
      <View>
        <CustomIconButton
          label={isChangingLang ? t('Please wait') : t('Update Language')}
          onPress={handleSubmission}
          backgroundColor={appTheme.primary}
        />
      </View>
    </View>
  );
}
