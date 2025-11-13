import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CustomIcon, CustomText } from '@/components';
import DropMenus from './DropMenus';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';

const Header = () => {
	const router = useRouter();
	const { currentTheme } = useSelector((state: RootState) => state.theme)
	const [showDropMenus, setShowDropMenus] = useState(false);

	return (
		<View>
			<View className="flex-row items-center justify-between gap-2">
				<TouchableOpacity onPress={() => router.back()} className="p-1">
					<CustomIcon
						icon={{
							name: 'arrow-back',
							type: 'Ionicons',
							color: currentTheme === 'light' ? 'black' : 'white',
							size: 22
						}}
					/>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={1}
					className="flex-1 bg-white dark:bg-[#2C2C2E]  rounded-full px-4 py-3 flex-row items-center gap-3"
					onPress={() => router.push('/(food-delivery)/(store)/search-items')}
				>
					<CustomIcon
						icon={{
							name: 'search',
							type: 'Ionicons',
							color: '#888',
							size: 22
						}}
					/>
					<CustomText variant="caption" fontSize="xs" fontWeight="medium">
						Galmart - Tashkent City Mall
					</CustomText>
				</TouchableOpacity>

				<View className='relative'>
					<TouchableOpacity 
					onPress={() => setShowDropMenus(true)} 
					className="p-1"
					>
						<CustomIcon
							icon={{
								name: showDropMenus ? 'cross' : 'dots-three-horizontal',
								type: 'Entypo',
								color: currentTheme === 'light' ? 'black' : 'white',
								size: 24
							}}
						/>
					</TouchableOpacity>
					<DropMenus
						showDropMenus={showDropMenus}
						setShowDropMenus={setShowDropMenus}
					/>
				</View>
			</View>


		</View>
	);
};

export default Header;
