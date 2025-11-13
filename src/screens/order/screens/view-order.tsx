import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CustomIcon, CustomText } from '@/components'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { useRouter } from 'expo-router'

const ViewOrderScreen = () => {
    const router = useRouter();
    const { currentTheme } = useSelector((state :RootState) => state.theme)

    return (
        <View className='flex-1'>
            <SafeAreaView edges={['top']} className="bg-bgLight dark:bg-dark-bgLight px-4 pt-2 pb-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()}>
                    <CustomIcon
                    icon={{ 
                        name: 'arrowleft' , 
                        type: 'AntDesign', 
                        color: currentTheme === 'light' ? '#000' : '#fff',
                        size: 20
                    }}
                    />
                </TouchableOpacity>
                <View className='flex-col items-center gap-1'>
                    <CustomText
                    variant='heading3'
                    fontSize='sm'
                    fontWeight='semibold'
                    >
                        Galmart - Tashkent City Mall
                    </CustomText>
                    <CustomText
                    variant='caption'
                    fontSize='xs'
                    fontWeight='semibold'
                    >
                       Your Order
                    </CustomText>
                </View>

                <View></View>
                
            </SafeAreaView>
            <Text>ViewOrderScreen</Text>
        </View>
    )
}

export default ViewOrderScreen