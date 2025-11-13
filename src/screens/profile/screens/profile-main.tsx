// Components
import { CustomPaddedView } from '@/components';
import { ProfileHeader, ProfileMain } from '../components/profile-main';
import React from 'react';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';

const ProfileMainScreen = () => {
  return (
    <ScreenWrapperWithAnimatedTitleHeader title="Profile">
      <CustomPaddedView
        className="bg-background dark:bg-dark-background"
        paddingHorizontal={16}
        padding={0}
      >
        <ProfileHeader />
      </CustomPaddedView>
      <ProfileMain />
    </ScreenWrapperWithAnimatedTitleHeader>
  );
};

export default ProfileMainScreen;
