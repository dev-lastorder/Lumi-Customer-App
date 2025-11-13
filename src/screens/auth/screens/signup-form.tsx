// app/(auth)/signup-form.tsx - FIXED VERSION
// 🎯 WHAT HAPPENS: User enters NAME only, saves to Redux, navigates to phone screen (Clean UI)

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Keyboard,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Components
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import BackButton from '../components/BackButton';
import AuthHeader from '../components/AuthHeader';

// Redux
import { setSignupFormData, SignupFormData } from '@/redux';

export default function SignupFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  
  // Form state - ONLY name (NO ERROR STATES on screen)
  const [name, setName] = useState('');
  
  // 🔄 INDIVIDUAL LOADING STATE
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes (clear any visual feedback when typing)
  const handleInputChange = (value: string) => {
    setName(value);
  };

  // Validation function (returns boolean, shows errors via toast)
  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return false;
    }
    if (name.trim().length > 50) {
      toast.error('Name must be less than 50 characters');
      return false;
    }
    return true;
  };

  // 🎯 MAIN ACTION: Save name to Redux and go to phone screen
  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // 💾 SAVE NAME TO REDUX (NO API CALL!)
      const formData: SignupFormData = { name: name.trim() };
      dispatch(setSignupFormData(formData));
      
      console.log('✅ Name saved to Redux:', formData.name);
      
      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // ➡️ NAVIGATE TO PHONE INPUT SCREEN
      router.push('/(auth)/signup');
      
    } catch (error: any) {
      console.error('❌ Error navigating:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", () => {
        setIsKeyboardVisible(true);
      });
      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setIsKeyboardVisible(false);
      });
  
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

  const handleGoBack = () => {
    // ⬅️ GO BACK TO WELCOME SCREEN
    router.back();
  };

  return (
    <GradientBackground style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View 
          className="flex-1 px-6"
          style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
        >
          {/* TOP SECTION - Back Button & Header */}
         <View className="justify-start" style={{
                    flex: 0.25,
                    ...(isKeyboardVisible && Platform.OS === "android"
                      ? { flex: 0.20, height: 44 }
                      : {}),
                  }}>
            <View className="mb-4">
              <BackButton onPress={handleGoBack} />
            </View>

            <AuthHeader
              title="Sign up"
              subtitle="Hello, Welcome to your account."
            />
          </View>

          {/* MIDDLE SECTION - Name Input */}
          <View className="flex-1 justify-center">
            <Text className="text-lg font-medium text-gray-800 mb-6">
              First, let's create your account
            </Text>

            {/* Name Input Field - NO ERROR STYLING */}
            <View className="mb-2">
              <TextInput
                value={name}
                onChangeText={handleInputChange}
                placeholder="Enter your full name"
                autoCapitalize="words"
                autoCorrect={false}
                className="w-full px-4 py-4 text-base rounded-xl border border-gray-200 bg-white"
                style={{ color: '#1F2937' }}
                placeholderTextColor="#969696"
                autoFocus={true}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* BOTTOM SECTION - Continue Button */}
          <View className="mt-6">
            <TouchableOpacity
              onPress={handleContinue}
              disabled={isLoading || !name.trim()}
              className={`rounded-full py-4 px-8 items-center justify-center ${
                isLoading || !name.trim() ? 'opacity-50' : ''
              }`}
              style={{ backgroundColor: '#3853A4' }}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </GradientBackground>
  );
}