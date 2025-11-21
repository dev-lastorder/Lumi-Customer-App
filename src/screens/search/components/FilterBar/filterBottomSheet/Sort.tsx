import { View, Text, TouchableOpacity , ScrollView } from 'react-native'
import { CustomText } from '@/components'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { setStagedSort } from '@/redux/slices/searchSlice';

const SORT_OPTIONS = [
    {
        key: 'Recommended',
        value : 'Recommended'
    } ,
    {
        key: 'Distance',
        value : 'distance'
    } ,
    {
        key: 'Minimum Order',
        value : 'minimumOrder'
    } ,
    {
        key: 'Rating',
        value : 'rating'
    } ,
    {
        key: 'Delivery time',
        value : 'deliveryTime'
    } ,
]

const Sort = () => {
    const dispatch = useDispatch();
    const { stagedSort } = useSelector((state:RootState) => state.search);
    
    return (
        <View className="pt-4 pb-6 border-b border-b-border dark:border-b-dark-border mb-4">
            <View className='flex flex-col gap-4'>
                <CustomText
                    variant='subheading'
                    fontSize='sm'
                    fontWeight='medium'
                >
                    SORT BY
                </CustomText>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className=""
                    contentContainerStyle={{ paddingRight: 16 }}
                >
                    <View className="flex-row gap-2">
                        {SORT_OPTIONS.map((item : { key : string , value : string }, idx : number) => (
                            <TouchableOpacity
                                key={idx}
                                className={`px-4 py-2 rounded-full mx-1 
                                ${stagedSort === item?.value ? 'bg-primary ' : 'bg-gray-100 dark:bg-primary/10'}`}
                                onPress={() => dispatch(setStagedSort(item.value))}
                            >
                                <Text
                                    className={`
                                    ${stagedSort === item.value ? 'text-black' : 'text-gray-600 dark:text-primary'}
                                    `}
                                >
                                    {item.key}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default Sort