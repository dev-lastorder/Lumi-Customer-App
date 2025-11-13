// hooks/rides/useRide.ts
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";

import { setRide } from "@/redux/slices/RideSlices/rideCreationSlice";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { createRide, RidePayload } from "@/screens/Rider/utils/requestRide";
import { Alert } from "react-native";

interface ApiError extends Error {
    status?: number;
    response?: { status: number; data: any };
}

export const useRide = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    // 👇 get token from Redux auth state
    const token = useSelector((state: any) => state.auth.token);

    const createRideMutation = useMutation({
        mutationFn: (data: RidePayload) => createRide(data),
        onSuccess: (response) => {
            console.log("✅ Ride created:", response);

            // Save ride in Redux
            dispatch(setRide(response));

            // Show success toast
            showSuccessToast("Ride created successfully!");

        },
        onError: (error: ApiError) => {
            console.log("❌ Ride creation failed:", error?.response);
            Alert.alert(error.message);
            showErrorToast(error.message, "Failed to create ride");
        },
    });

    return {
        createRide: createRideMutation.mutate,
        isCreatingRide: createRideMutation.isPending,
        rideError: createRideMutation.error as ApiError | null,
    };
};
