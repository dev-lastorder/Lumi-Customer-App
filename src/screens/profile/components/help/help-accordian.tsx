
// Icons
import { CustomText } from "@/components";
import { useThemeColor } from "@/hooks";
import { Entypo } from "@expo/vector-icons";

// Core
import { ReactNode, useState } from "react";

// React Native
import { Text, TouchableOpacity, View } from "react-native";
export default function HelpAccordian({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  // Hooks
  const [open, setOpen] = useState(false);
  const theme = useThemeColor();
  return (
    <View
      className="flex w-full mt-2 items-center justify-between border border-grey dark:border-dark-grey/30 bg-card-secondary dark:bg-dark-card rounded-lg p-2"

    >
      <TouchableOpacity
        className="flex flex-row items-center justify-between w-[100%]  px-2 py-2  active:opacity-80"

        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        {/* <Text
          className="text-lg font-semibold text-black dark:text-white w-[90%]"
        >
          {heading}
        </Text> */}
        <CustomText
          fontSize="xs"
          fontWeight="medium"
          variant="label"
          className="w-[90%]"
        // className="text-lg font-semibold text-black dark:text-white w-[90%]"
        >
          {heading}
        </CustomText>
        <Entypo
          name={open ? "chevron-small-up" : "chevron-small-down"}
          size={24}
          color={theme?.text}

        />
      </TouchableOpacity>

      {open && (
        <View
          className="w-full p-3 rounded-b-lg "

        >
          {children}
        </View>
      )}
    </View>
  );
}
