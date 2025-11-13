import { CustomIcon } from '@/components'
import RatingBreakdown from '@/screens/restaurant/components/restaurant-reviews/reviews-breakdown'
import React from 'react'
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'

const RideCompleted = () => {
  const rating = 3;
  
  return (
    <View className="flex-1 justify-start items-center bg-white px-4">
      {/* Title */}
      <Text className="text-2xl font-bold mb-2">You have arrived!</Text>

      {/* User image */}
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} // Placeholder image
        className="w-20 h-20 rounded-full my-4"
      />

      {/* Subtitle */}
      <Text className="text-lg font-medium mb-3 text-gray-800">Rate your trip</Text>

      {/* Stars */}
      <View className="my-2 flex-row gap-2">
        {[...Array(5)].map((_, index) => (
          <CustomIcon
            key={index}
            icon={{
              name: index < rating ? "star" : "star-o", // filled vs empty
              type: "FontAwesome",
              size: 28,
              color: "#FFA500",
            }}
          />
        ))}
      </View>




      {/* Text input */}
      <TextInput
        placeholder="Write your experience here..."
        className="w-full h-24 border border-gray-300 rounded-lg p-3 text-gray-800 mb-4"
        multiline
        numberOfLines={4}
      />

      {/* Submit button */}
      <TouchableOpacity
        className="bg-gray-300 w-full py-3 rounded-lg items-center"
        disabled
      >
        <Text className="text-white font-semibold">Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

export default RideCompleted
