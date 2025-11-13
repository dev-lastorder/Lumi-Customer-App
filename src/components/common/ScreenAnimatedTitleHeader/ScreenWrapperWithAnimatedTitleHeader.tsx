// Imports
import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

// Components
import { CustomPaddedView, ScreenAnimatedTitleHeader } from '@/components';

// Types
interface ScreenWrapperWithAnimatedHeaderProps {
    title: string;
    onBack?: () => void;
    paddingHorizontal?: number;
    containerStyle?: ViewStyle;
    children: ReactNode;
    footer?: ReactNode; // New prop for sticky footer
}

const ScreenWrapperWithAnimatedTitleHeader: React.FC<ScreenWrapperWithAnimatedHeaderProps> = ({
    title,
    onBack,
    paddingHorizontal = 0,
    containerStyle,
    children,
    footer,
}) => {
    const router = useRouter();
    const scrollY = useSharedValue(0);

    // Scroll handler to update animated value
    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    return (
        <View className="bg-background dark:bg-dark-background flex-1 " style={containerStyle}>
            <ScreenAnimatedTitleHeader
                title={title}
                onBack={onBack || (() => router.back())}
                scrollY={scrollY}
            />

            <Animated.ScrollView
                scrollEventThrottle={16}
                onScroll={onScroll}
                className="bg-background dark:bg-dark-background"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <CustomPaddedView
                    className="bg-background dark:bg-dark-background"
                    paddingHorizontal={paddingHorizontal}
                >
                    {children}
                </CustomPaddedView>
            </Animated.ScrollView>
            {footer} {/* Render the footer here */}
        </View>
    );
};

export default ScreenWrapperWithAnimatedTitleHeader;
