import React from 'react';
// build-in widgets/components
import { View, Image } from 'react-native';

// custom components
import { CustomText } from '../CustomText';

// interfaces
import { NoDataProps } from './interface';

const EmptyLayout: React.FC<NoDataProps> = ({ imageSource, title, description, imageStyles }) => {
  return (
    <View className="flex-1 px-6 bg-background dark:bg-dark-background">
      {imageSource && (
        <View className="w-100 h-auto d-flex items-center  ">
          <Image source={imageSource} className=" mb-6" resizeMode="contain" style={imageStyles} />
        </View>
      )}
      <CustomText variant="heading3" fontWeight="bold" className="text-center mb-2">
        {title}
      </CustomText>
      <CustomText variant="label" className="text-center text-gray-500">
        {description}
      </CustomText>
    </View>
  );
};

export default EmptyLayout;