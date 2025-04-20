
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, Plus, Send, Camera, Image, Smile, Mic } from 'lucide-react';

const ChatDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { friends, messages, currentUser, markMessageAsOpened, addMessage } = useAppContext();
  const [inputText, setInputText] = useState('');
  
  // Find the friend for this chat
  const friend = friends.find(f => f.id === id);
  
  // Get messages for this conversation
  const conversation = messages
    .filter(msg => 
      (msg.senderId === id && msg.receiverId === currentUser.id) || 
      (msg.senderId === currentUser.id && msg.receiverId === id)
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Mark received messages as opened
  conversation.forEach(msg => {
    if (!msg.isOpened && msg.senderId === id) {
      markMessageAsOpened(msg.id);
    }
  });
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!inputText.trim() || !id) return;
    
    addMessage({
      senderId: currentUser.id,
      receiverId: id,
      content: inputText,
      isOpened: false,
      isSnap: false,
    });
    
    setInputText('');
  };
  
  // Handle sending a snap
  const handleSendSnap = () => {
    if (!id) return;
    
    addMessage({
      senderId: currentUser.id,
      receiverId: id,
      content: '',
      isOpened: false,
      isSnap: true,
    });
  };
  
  if (!friend) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chat not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm">
        <Link to="/chat" className="mr-3">
          <ArrowLeft size={20} />
        </Link>
        
        <div className="flex-1 flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            <img 
              src={friend.avatar} 
              alt={friend.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <p className="font-medium">{friend.displayName}</p>
            {friend.streak && friend.streak > 0 && (
              <div className="flex items-center">
                <span className="text-xs">🔥 {friend.streak}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start chatting</p>
          </div>
        ) : (
          conversation.map(msg => {
            const isOwnMessage = msg.senderId === currentUser.id;
            
            return (
              <div 
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg py-2 px-4 max-w-xs ${
                    isOwnMessage 
                      ? 'bg-snapchat-blue text-white' 
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {msg.isSnap ? (
                    <div className="flex items-center space-x-2">
                      <Camera size={18} />
                      <span>{isOwnMessage ? 'Snap sent' : 'Snap received'}</span>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                  <p className="text-xs opacity-70 text-right mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Input Area */}
      <div className="bg-white p-3 flex items-center border-t">
        <button className="p-2 text-gray-500">
          <Plus size={24} />
        </button>
        
        <button className="p-2 text-gray-500" onClick={handleSendSnap}>
          <Camera size={24} />
        </button>
        
        <button className="p-2 text-gray-500">
          <Image size={24} />
        </button>
        
        <div className="flex-1 mx-2">
          <input 
            type="text"
            className="w-full p-2 bg-gray-100 rounded-full text-sm focus:outline-none"
            placeholder="Send a chat"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
        </div>
        
        {inputText ? (
          <button className="p-2 text-snapchat-blue" onClick={handleSendMessage}>
            <Send size={24} />
          </button>
        ) : (
          <>
            <button className="p-2 text-gray-500">
              <Mic size={24} />
            </button>
            <button className="p-2 text-gray-500">
              <Smile size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatDetailPage;
