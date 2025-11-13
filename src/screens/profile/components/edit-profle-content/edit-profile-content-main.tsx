// Components
import { CustomText } from '@/components';

// Interfaces
import { IEditProfileContentMainProps } from '@/utils/interfaces';

// Sub-Screens
import DeleteAccount from './delete-account';
import ProfileEmailUpdate from './email';
import ProfileLanguge from './language';
import ProfileNameUpdate from './name';
import ProfilePhoneUpdate from './phone';

export default function EditProfileContentMain({ title, userId, content }: IEditProfileContentMainProps) {
  switch (title) {
    case 'Choose Language':
      return <ProfileLanguge />;
    case 'Name':
      return <ProfileNameUpdate content={content as string} />;
    case 'Email Address':
      return <ProfileEmailUpdate content={content as string} />;
    case 'Mobile Number':
      return <ProfilePhoneUpdate content={content as string} />;
    case 'Delete Account':
      return <DeleteAccount />;
    default: {
      return <CustomText>{title + "no screen"}</CustomText>;
    }
  }
}
