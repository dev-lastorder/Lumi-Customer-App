// utils/rideOptions.ts
import { ImageSourcePropType } from "react-native";

export type RideOption = {
  key: string;
  label: string;
  icon: ImageSourcePropType;
  person: number;
};

export const rideOptions: RideOption[] = [
  // {
  //   key: "ride",
  //   label: "Ride",
  //   icon: require("@/assets/images/Ride.png"),
  //   person: 4,
  // },
  {
    key: "2wheel",
    label: "2-Wheels",
    icon: require("@/assets/images/2Wheels.png"),
    person: 2,
  },
  {
    key: "comfort",
    label: "Comfort",
    icon: require("@/assets/images/Comfort.png"),
    person: 4,
  },
  {
    key: "premium",
    label: "Premium",
    icon: require("@/assets/images/Premium.png"),
    person: 4,
  },
];
