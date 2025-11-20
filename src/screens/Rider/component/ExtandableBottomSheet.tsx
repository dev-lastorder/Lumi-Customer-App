// components/WhereToBottomSheet.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import RiderRequest from '../screen/RiderRequest';
import RideConfirmation from '../screen/RideConfirmation';
import { CustomText } from '@/components';
import RideAccepted from './RideAccepted/RideAccepted';
import RideCompleted from './RideAccepted/RideCompleted';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderIcon } from '@/components/common/AnimatedHeader/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { clearLastSelectedRide } from '@/redux/slices/RideSlices/rideSelectionSlice';
import { resetLocations } from '@/redux/slices/RideSlices/rideLocationSlice';
import { clearRide } from '@/redux/slices/RideSlices/rideCreationSlice';

const { height } = Dimensions.get('window');

// Snap points
const SNAP_TOP = height * 0.2;
const SNAP_BOTTOM = height * 0.55;
const SNAP_HIDDEN = height * 0.9;
interface Props {
    rideConfirmation: boolean;
    setRideConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
    rideAccepted: boolean;
    setRideAccepted: React.Dispatch<React.SetStateAction<boolean>>;
    rideCompleted: boolean;
    setRideCompleted: React.Dispatch<React.SetStateAction<boolean>>;
    setFindingRide: React.Dispatch<React.SetStateAction<boolean>>;
    setFallback: React.Dispatch<React.SetStateAction<boolean>>;
    setFromLocation: React.Dispatch<React.SetStateAction<string>>;
    setToLocation: React.Dispatch<React.SetStateAction<string>>;


    fromLocation: string;


    toLocation: string;

}



const ExtandableBottomSheet: React.FC<Props> = ({
    rideConfirmation,
    setRideConfirmation,
    rideAccepted,
    setRideAccepted,
    rideCompleted,
    setRideCompleted,
    setFindingRide,
    setFallback,
    setFromLocation,
    setToLocation,


    fromLocation,
    toLocation,

}) => {
    const translateY = useRef(new Animated.Value(SNAP_BOTTOM)).current;
    const [scrollY, setScrollY] = useState(0);

    const isRiderRequest = !rideConfirmation && !rideAccepted && !rideCompleted;

    const dispatch = useDispatch();

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (_, gesture) => {
                if (isRiderRequest) return false;
                return scrollY <= 0 && Math.abs(gesture.dy) > 2;
            },
            onMoveShouldSetPanResponder: (_, gesture) => {
                if (isRiderRequest) return false;
                return scrollY <= 0 && Math.abs(gesture.dy) > 2;
            },
            onPanResponderMove: (_, gesture) => {
                if (isRiderRequest) return;

                let minSnap = SNAP_TOP;
                let maxSnap = SNAP_BOTTOM;

                if (rideAccepted || rideCompleted) {
                    maxSnap = SNAP_HIDDEN;
                }

                const newY = Math.max(minSnap, Math.min(maxSnap, translateY._value + gesture.dy));
                translateY.setValue(newY);
            },
            onPanResponderRelease: () => {
                if (isRiderRequest) return;

                let snapPoints = [SNAP_BOTTOM];
                if (rideConfirmation) {
                    snapPoints = [SNAP_TOP, SNAP_BOTTOM];
                } else if (rideAccepted || rideCompleted) {
                    snapPoints = [SNAP_TOP, SNAP_BOTTOM, SNAP_HIDDEN];
                }

                const current = translateY._value;
                const distances = snapPoints.map(point => ({
                    point,
                    dist: Math.abs(current - point),
                }));

                distances.sort((a, b) => a.dist - b.dist);
                const snapTo = distances[0].point;

                Animated.spring(translateY, {
                    toValue: snapTo,
                    useNativeDriver: true,
                }).start();
            },
            onPanResponderTerminate: () => {
                if (isRiderRequest) return;
                Animated.spring(translateY, {
                    toValue: SNAP_BOTTOM,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;


    useEffect(() => {
        if (isRiderRequest) {
            Animated.spring(translateY, {
                toValue: SNAP_BOTTOM,
                useNativeDriver: true,
            }).start();
        } else if (rideConfirmation) {
            console.log("in  rideConfirmation")

            Animated.spring(translateY, {
                toValue: SNAP_BOTTOM,
                useNativeDriver: true,
            }).start();
        } else if (rideAccepted || rideCompleted) {
            Animated.spring(translateY, {
                toValue: SNAP_TOP,
                useNativeDriver: true,
            }).start();
        }
    }, [isRiderRequest, rideConfirmation, rideAccepted, rideCompleted]);

    useEffect(() => {
        console.log(rideAccepted)
    }, [])



    const renderContent = () => {
        if (rideAccepted) return <RideAccepted setFallback={setFallback} setRideAccepted={setRideAccepted} setRideCompleted={setRideCompleted} setRideConfirmation={setRideConfirmation} setFindingRide={setFindingRide} />;
        if (rideConfirmation) return <RideConfirmation />;
        if (rideCompleted) return <RideCompleted />;
        return <RiderRequest setRideConfirmation={setRideConfirmation} setFromLocation={setFromLocation} setToLocation={setToLocation} fromLocation={fromLocation} toLocation={toLocation} />;
    };

    return (
        <Animated.View
            style={[
                styles.bottomSheet, rideAccepted && { backgroundColor: '#fff' },
                { transform: [{ translateY }] },
            ]}
            {...(!isRiderRequest ? panResponder.panHandlers : {})}
        >

        {(rideAccepted || rideConfirmation || rideCompleted) && (
        <View
            style={{
            position: 'absolute',
            top: -50,
            left: 15,
            zIndex: 100
            }}
        >
        <HeaderIcon
            onPress={() => {
                dispatch(clearLastSelectedRide());
                dispatch(clearRide());
                dispatch(resetLocations());
                router.back();
            }}
            iconName="arrow-back"
            iconType="Ionicons"
        />
        </View>
        )}

            {/* rounded corner sheet  */}
            <View style={styles.innerContainer}>
            {!rideAccepted && (
                <LinearGradient
                    colors={['#DBD6FB', '#FEFEFF']}
                    locations={[0, 0.2]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientBackground}
                />
            )

            }

            <ScrollView
                onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 12 }}
            >
                {renderContent()}
            </ScrollView>
            </View>
        </Animated.View>
    );
};



const styles = StyleSheet.create({
    bottomSheet: {
        position: 'absolute',
        left: 4,
        right: 4,
        bottom: 0,
        height: height,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        elevation: 10,
        width: '98%',
        alignSelf: 'center',
        // overflow: 'hidden',
    },
    innerContainer: {
        flex: 1,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        overflow: 'hidden',
        backgroundColor: '#fff',
  },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    foreground: {
        flex: 1,
        padding: 16,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },

});

export default ExtandableBottomSheet;
