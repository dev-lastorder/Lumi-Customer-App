import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { IMAGE } from '@/utils/constants/videos';
import { useDispatch } from 'react-redux';
import { resetLocations } from '@/redux/slices/RideSlices/rideLocationSlice';
import { clearRide, resetHourlyRide } from '@/redux/slices/RideSlices/rideCreationSlice';
import { clearLastSelectedRide } from '@/redux/slices/RideSlices/rideSelectionSlice';

const { width, height } = Dimensions.get('window');

interface SplashGifProps {
    onLoaded?: () => void;
    onFinish?: () => void;
    duration?: number; // GIF duration in ms
}

export default function SplashGif({
    onLoaded,
    onFinish,
    duration = 3200,
}: SplashGifProps) {
    const [hasLoaded, setHasLoaded] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const clearRedux = () => {
            dispatch(resetLocations());
            dispatch(clearRide());
            dispatch(clearLastSelectedRide());
            dispatch(resetHourlyRide());
        };
        clearRedux();
    }, []);

    useEffect(() => {
        if (hasLoaded) onLoaded?.();

        const timer = setTimeout(() => {
            if (onFinish) {
                onFinish();
            } else {
                router.replace('/(food-delivery)/(discovery)/discovery');
            }
        }, duration);

        return () => clearTimeout(timer);
    }, [hasLoaded, duration, onLoaded, onFinish, router]);

    return (
        <View style={styles.container}>
            <Image
                source={IMAGE.SPLASH_SCREEN}
                style={styles.image}
                resizeMode="cover"
                onLoad={() => setHasLoaded(true)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width,
        height,
        position: 'absolute',
    },
});
