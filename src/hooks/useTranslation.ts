// Types
import { language, TranslationKeys } from '@/types';

// Utils
import { ar, de, en, fr, km, zh } from '@/utils';

// Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hooks
import { useEffect, useState } from 'react';

export function useTranslation(lang?: language) {
  // States
  const [currentLang, setCurrentLang] = useState<language>(lang ?? 'en');

  // Translation function
  const t = (key: TranslationKeys | string): string => {
    return (
      (currentLang === 'en'
        ? en
        : currentLang === 'ar'
          ? ar
          : currentLang === 'de'
            ? de
            : currentLang === 'fr'
              ? fr
              : currentLang === 'km'
                ? km
                : currentLang === 'zh'
                  ? zh
                  : en)[key as TranslationKeys] || (key as string)
    );
  };

  // Handlers
  const changeLang = (lang: language) => {
    AsyncStorage.setItem('lang', lang);
  };
  const getLang = async () => {
    const lang = await AsyncStorage.getItem('lang');
    setCurrentLang(lang as language);
  };

  // UseEffect
  useEffect(() => {
    getLang();
  }, [currentLang]);
  return { t, changeLang, currentLang };
}
