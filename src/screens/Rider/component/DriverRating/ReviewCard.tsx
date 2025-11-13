import { Image, Text, View } from 'react-native';
import React, { Component } from 'react';
import { CustomIcon, CustomText } from '@/components';
import adjust from '@/utils/helpers/adjust';

export class ReviewCard extends Component {
  render() {
    return (
      <View className="mt-4 mb-4 gap-1">
        <View className="flex-row justify-between gap-2">
          <View className="flex-row justify-between gap-2">
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=3' }} className="w-10 h-10 rounded-full" />
            <CustomText fontSize="sm" fontWeight="medium">
              Brooklyn Simmons
            </CustomText>
          </View>

          <CustomText fontSize="sm" fontWeight="medium" lightColor="#B8B8B8" darkColor="#B8B8B8">
            26 Jul 2025
          </CustomText>
        </View>
        <View className="flex-row gap-1 mt-2">
          <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(20), color: '#FBC02D' }} />
          <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(20), color: '#FBC02D' }} />
          <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(20), color: '#FBC02D' }} />
          <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(20), color: '#FBC02D' }} />
          <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(20), color: '#FBC02D' }} />
        </View>
        <CustomText fontSize="sm" fontWeight="medium" lightColor="#858585" darkColor="#858585" className="mt-1">
          Friendly and helpful driver!
        </CustomText>
      </View>
    );
  }
}

export default ReviewCard;
