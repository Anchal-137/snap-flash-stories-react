import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Search, Edit, User as UserIcon, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatPage = () => {
  const { friends, messages } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const chatPreviews = friends.map(friend => {
    const friendMessages = messages.filter(
      msg => msg.senderId === friend.id || msg.receiverId === friend.id
    );
    
    const latestMessage = friendMessages.length > 0 
      ? friendMessages.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]
      : null;
    
    return {
      friend,
      latestMessage
    };
  });
  
  const filteredChats = searchQuery 
    ? chatPreviews.filter(chat => 
        chat.friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatPreviews;
  
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const getMessagePreview = (message: typeof messages[0] | null) => {
    if (!message) return 'Tap to chat';
    if (message.isSnap) return 'Sent a Snap';
    return message.content;
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 bg-background z-10 p-4 shadow-sm border-b border-border">
        <div className="flex justify-between items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <UserIcon size={24} className="bg-gray-200 p-1 rounded-full" />
          </div>
          
          <h1 className="text-2xl font-bold">Chats</h1>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-800">
              <Edit size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="divide-y divide-border">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No chats found</p>
            </div>
          ) : (
            filteredChats.map(({ friend, latestMessage }) => (
              <Link 
                key={friend.id}
                to={`/chat/${friend.id}`}
                className="flex items-center py-3 px-4 hover:bg-muted/50"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={friend.avatar} 
                      alt={friend.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!latestMessage?.isOpened && latestMessage?.senderId === friend.id && (
                    <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-snapchat-blue rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{friend.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {latestMessage ? formatTime(latestMessage.timestamp) : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    {latestMessage?.isSnap && (
                      <div className="w-4 h-4 mr-1">
                        <Camera size={16} className="text-red-500" />
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground truncate">
                      {getMessagePreview(latestMessage)}
                    </p>
                    
                    {friend.streak && friend.streak > 0 && (
                      <div className="ml-1 flex items-center">
                        <span className="text-xs bg-red-500 text-white px-1 rounded">
                          🔥 {friend.streak}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatPage;
