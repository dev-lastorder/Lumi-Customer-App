import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon, CustomText } from '@/components';
import { useThemeColor } from '@/hooks';
import { useRouter } from 'expo-router';

const SearchItemsScreen = () => {
    const router = useRouter();
    const { primary } = useThemeColor();

    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View className="flex-1 bg-bgLight dark:bg-dark-bgLight">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <SafeAreaView 
                edges={['top']} 
                className="flex-row items-center gap-2 px-4 pt-4 pb-4"
                >
                    <CustomIcon
                    icon={{
                        name : 'search',
                        type: 'Ionicons',
                        size: 24
                    }}
                    />
                    <TextInput
                        autoFocus
                        placeholder="Search Galmart - Tashkent City Mall"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 text-white ml-2 text-[15px] font-medium"
                    />
                    <TouchableOpacity onPress={() => router.back()}>
                        <CustomText 
                        variant='button' 
                        fontSize='xs' 
                        fontWeight='medium' 
                        darkColor={primary}
                        >
                            Cancel
                        </CustomText>
                    </TouchableOpacity>
                </SafeAreaView>


                <View className='pt-6 flex-1 bg-white dark:bg-black px-4'>
                    {!searchQuery && (
                        <View className="flex-1 items-center justify-center">
                            <Image
                                source={{
                                    uri: 'https://img.icons8.com/fluency/96/search.png',
                                }}
                                className="w-28 h-28 mb-6"
                                resizeMode="contain"
                            />
                            <CustomText variant='caption' fontSize='sm'>
                                Search this store’s products and brands
                            </CustomText>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SearchItemsScreen;
