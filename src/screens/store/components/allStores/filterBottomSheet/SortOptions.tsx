import { View, Text, TouchableOpacity , ScrollView } from 'react-native'
import { CustomText } from '@/components'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { setStagedSort } from '@/redux/slices/storeSlice';



const SORT_OPTIONS = [
    {
        key: 'Recommended',
        value : 'Recommended'
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

const SortOptions = () => {
    const dispatch = useDispatch();
    const { stagedSort } = useSelector((state : RootState) => state.store)
    
    return (
        <View>
            <View className='flex flex-col gap-4 py-4'>
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
                    className="mb-6"
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

export default SortOptions