import { ChatMessage } from "@/utils/interfaces/chat";
import { View , Text} from "react-native";

interface MessageBubbleProps {
    message: ChatMessage;
    isMyMessage: boolean;
  }
  
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMyMessage }) => {
    const formatMessageTime = (createdAt: string) => {
      const date = new Date(createdAt);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
  
    return (
      <View className={`my-1 ${isMyMessage ? 'items-end' : 'items-start'}`}>
        <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isMyMessage 
            ? 'bg-blue-500 rounded-br-md' 
            : 'bg-gray-100 rounded-bl-md'
        }`}>
          <Text className={`text-base leading-5 mb-1 ${
            isMyMessage ? 'text-white' : 'text-black'
          }`}>
            {message.message}
          </Text>
          <Text className={`text-xs opacity-70 ${
            isMyMessage 
              ? 'text-white text-right' 
              : 'text-gray-600 text-left'
          }`}>
            {formatMessageTime(message.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  export default MessageBubble