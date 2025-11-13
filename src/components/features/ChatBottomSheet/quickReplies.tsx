import { TouchableOpacity, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface QuickRepliesProps {
    quickReplies: string[];
    onQuickReply: (text: string) => void;
  }
  
  const QuickReplies: React.FC<QuickRepliesProps> = ({ quickReplies, onQuickReply }) => {
    const renderQuickReply = ({ item }: { item: string }) => (
      <TouchableOpacity
        className="bg-gray-100 py-3 px-4 rounded-2xl mr-3 min-w-[200px]"
        onPress={() => onQuickReply(item)}
        activeOpacity={0.7}
      >
        <Text className="text-sm text-blue-500 text-center font-medium">{item}</Text>
      </TouchableOpacity>
    );
  
    return (
      <View className="px-4 pb-4">
        <FlatList
          data={quickReplies}
          horizontal
          renderItem={renderQuickReply}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        />
      </View>
    );
  };

  export default QuickReplies;