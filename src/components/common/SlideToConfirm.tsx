import React, { useEffect, useRef, useState } from 'react';
import { View, PanResponder, Animated, StyleSheet, Text, Easing } from 'react-native';
import { CustomText } from '@/components';


interface SlideToConfirmButtonProps {
    onSlideComplete: () => void;
    width?: number;
    height?: number;
    text?: string;
    disabled?: boolean;
}

const SlideToConfirmButton: React.FC<SlideToConfirmButtonProps> = ({
    onSlideComplete,
    width = 210,
    height = 30,
    text = 'Slide to Place Order',
    disabled = false,
}) => {
    const slideX = useRef(new Animated.Value(0)).current;
    const threshold = width * 0.6;
    const shimmerAnim = useRef(new Animated.Value(0)).current;


    const [showRelease, setshowRelease] = useState(false)


    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !disabled,
            onPanResponderMove: (_, gestureState) => {
                const dx = gestureState.dx;

                // Only proceed for valid positive dx values
                if (dx > 0 && dx < width - height) {

                    slideX.setValue(dx);

                    // Only show release if dx > 120
                    if (dx > 140) {
                        setshowRelease(true);
                    } else {
                        // Otherwise hide it
                        setshowRelease(false);
                    }
                }
            },

            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > threshold) {
                    // Trigger success
                    Animated.timing(slideX, {
                        toValue: width - height,
                        duration: 150,
                        useNativeDriver: false,
                    }).start(() => {
                        setshowRelease(false);
                        onSlideComplete();
                        slideX.setValue(0);
                    });
                } else {
                    Animated.spring(slideX, {
                        toValue: 0,
                        useNativeDriver: false,
                    }).start(() => {
                        setshowRelease(false);
                    });
                }
            },
        })
    ).current;


    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 200], // adjust based on width
    });


    return (
        <View className='overflow-hidden justify-center' style={{ width, height, opacity: disabled ? 0.5 : 1 }}>



            {showRelease && (
                <>
                    <CustomText fontWeight="semibold" lightColor="white" darkColor="white" className='text-gray-50 absolute text-lg'>Release To Confirm</CustomText>
                </>
            )

            }

            <Animated.View
                {...panResponder.panHandlers}
                style={[

                    {
                        width: height,
                        height,
                        transform: [{ translateX: slideX }],
                    },
                ]}

                className="justify-center items-center"
            >

                <View style={{ flexDirection: 'row', gap: 20, }}>
                    <CustomText lightColor="white" darkColor="white" fontWeight="semibold" fontSize="2xl" className='text-3xl'>{'❯'}</CustomText>
                    <CustomText lightColor="white" darkColor="white" fontWeight="semibold" className='text-white absolute text-base self-center ml-8'>{text}</CustomText>
                </View>
            </Animated.View>
        </View>
    );
};

export default SlideToConfirmButton;
