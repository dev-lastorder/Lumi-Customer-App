import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface MessageInputProps {
  messageText: string;
  onChangeText: (text: string) => void;
  onSendMessage: () => void;
  sendingMessage: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  onChangeText,
  onSendMessage,
  sendingMessage,
}) => {
  const canSend = messageText.trim() && !sendingMessage;

  return (
    <View className="px-4 py-3 border-t border-gray-200 bg-white">
      <View className="flex-row items-end bg-gray-100 rounded-2xl px-4 py-2">
        <TextInput
          className="flex-1 text-base text-black py-2 max-h-[100px]"
          placeholder="Send a message..."
          value={messageText}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
          editable={!sendingMessage}
        />
        <TouchableOpacity
          className={`w-8 h-8 rounded-2xl justify-center items-center ml-2 ${
            canSend ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onPress={onSendMessage}
          disabled={!canSend}
        >
          {sendingMessage ? (
            <Ionicons name="hourglass" size={20} color="#C7C7CC" />
          ) : (
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={canSend ? "#FFFFFF" : "#C7C7CC"} 
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageInput