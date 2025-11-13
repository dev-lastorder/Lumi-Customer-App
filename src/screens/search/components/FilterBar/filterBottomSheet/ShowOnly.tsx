import { View, Switch } from 'react-native'
import { CustomIcon, CustomText } from '@/components'
import { useThemeColor } from '@/hooks'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { useDispatch } from 'react-redux'
import { setStagedOpenOnly } from '@/redux/slices/searchSlice'


const ShowOnly = () => {
    const dispatch = useDispatch();
    const { stagedOpenOnly } = useSelector((state: RootState) => state.search);

    const { primary , border } = useThemeColor();

    const toggleSwitch = () => {
        dispatch(setStagedOpenOnly(!stagedOpenOnly))
    };

    return (
        <View className='flex flex-col gap-6 pb-12'>
            <CustomText
                variant='subheading'
                fontSize='sm'
                fontWeight='medium'
            >
                SHOW ONLY
            </CustomText>

            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-4">
                    <CustomIcon
                     icon={{ name : 'clock' , type : 'FontAwesome5' , size: 24}}
                    />

                    <CustomText variant='body' fontWeight='medium' fontSize='md'>
                        Open now
                    </CustomText>
                </View>

                <Switch
                    trackColor={{ false: border, true: primary }}
                    thumbColor={stagedOpenOnly ? '#fff' : "#fff"}
                    ios_backgroundColor= {border}
                    onValueChange={toggleSwitch}
                    value={stagedOpenOnly}
                />
            </View>
        </View>
    )
}

export default ShowOnly