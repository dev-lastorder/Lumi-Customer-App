import { CustomIcon, CustomText } from '@/components';
import { RootState } from '@/redux';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';

interface Props {
    showDropMenus : boolean;
    setShowDropMenus: React.Dispatch<React.SetStateAction<boolean>>
}

type IoniconsIconName =
  | 'information-circle-outline'
  | 'share-social-outline'
  | 'people-outline';

type MenuType = {
    label : string
    icon: IoniconsIconName
}

const menus : MenuType[] = [
    { label: 'More info', icon: 'information-circle-outline'  },
    { label: 'Share venue', icon: 'share-social-outline'  },
    { label: 'Order together', icon: 'people-outline'  }
]

const DropMenus = ({ showDropMenus , setShowDropMenus } : Props ) => {
    const { currentTheme } = useSelector((state : RootState) => state.theme)

    return (
        <Modal
            transparent
            animationType="fade"
            visible={showDropMenus}
            onRequestClose={() => setShowDropMenus(false)}
            
        >
            <Pressable
                className="flex-1"
                onPress={() => setShowDropMenus(false)}
            >
                <View className="absolute top-32 right-6 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-2">
                    {menus.map((item : MenuType , index) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-row items-center gap-4 py-3 px-2"
                            onPress={() => {
                                setShowDropMenus(false);
                            }}
                        >
                            <CustomIcon
                                icon={{ 
                                    name: item.icon, 
                                    type: 'Ionicons', 
                                    color: currentTheme === 'light' ? 'black' : 'white', 
                                    size: 22 
                                }}
                            />
                            <CustomText 
                            variant='defaults' 
                            fontSize='sm'
                            fontWeight='medium'

                            >
                                {item.label}
                            </CustomText>
                        </TouchableOpacity>
                    ))}
                </View>
            </Pressable>
        </Modal>
    )
}

export default DropMenus