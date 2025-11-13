import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons'
import adjust from '@/utils/helpers/adjust'
import { CustomText } from '@/components'
import { rideOptions } from '../utils/rideOption'

const RideSelection = () => {
    const [selected, setSelected] = useState('ride')


    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0, }}
            style={{ flexGrow: 0 }}
        >
            <View className="flex-row mt-5">
                {rideOptions.map((option) => {
                    const isActive = selected === option.key;
                    return (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.pill,
                                isActive && styles.activePill,
                                { marginRight: 10 },
                            ]}
                            onPress={() => setSelected(option.key)}
                        >
                            <Image
                                source={option.icon}
                                style={[styles.icon]}
                                resizeMode="contain"
                            />
                            <View className="flex-row gap-4">
                                <CustomText
                                    fontSize="sm"
                                    style={[styles.label, isActive && styles.activeLabel]}
                                >
                                    {option.label}
                                </CustomText>
                                <View className="flex-row">
                                    <Feather
                                        name="user"
                                        size={20}
                                        color={isActive ? "#0EA170" : "black"}
                                    />
                                    <CustomText
                                        style={[styles.label, isActive && styles.activeLabel]}
                                    >
                                        {option.person}
                                    </CustomText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>

    )
}

export default RideSelection

const styles = StyleSheet.create({

    pill: {
        alignItems: 'center',
        paddingHorizontal: adjust(14),
        paddingBottom: adjust(6),
        marginHorizontal: 6,
    },
    activePill: {
        backgroundColor: '#CBF2DE',
        borderColor: '#000',
        borderRadius: 5,
    },
    label: {
        color: '#000',
        marginLeft: 8,
    },
    activeLabel: {
        color: '#058A60',
    },
    icon: {
        width: 65,
        height: 65,
    }
})
