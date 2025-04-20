
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, MessageSquare, Users, User, Image } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export function BottomNavigation() {
  const location = useLocation();
  const { setActiveCamera } = useAppContext();
  const [activeTab, setActiveTab] = useState('/');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 animate-fade-in">
      <div className="flex justify-around items-center h-16 px-4">
        <Link 
          to="/chat" 
          className={`flex flex-col items-center justify-center w-16 h-16 ${isActive('/chat') ? 'text-snapchat-blue' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('/chat');
            setActiveCamera(false);
          }}
        >
          <MessageSquare size={24} />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        
        <Link 
          to="/stories" 
          className={`flex flex-col items-center justify-center w-16 h-16 ${isActive('/stories') ? 'text-snapchat-blue' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('/stories');
            setActiveCamera(false);
          }}
        >
          <Image size={24} />
          <span className="text-xs mt-1">Stories</span>
        </Link>
        
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-20 h-20 -mt-5 rounded-full 
          ${isActive('/') ? 'bg-snapchat-yellow text-black' : 'bg-gray-100 text-gray-800'}`}
          onClick={() => {
            setActiveTab('/');
            setActiveCamera(true);
          }}
        >
          <Camera size={28} />
          <span className="text-xs mt-1 font-medium">Snap</span>
        </Link>
        
        <Link 
          to="/friends" 
          className={`flex flex-col items-center justify-center w-16 h-16 ${isActive('/friends') ? 'text-snapchat-blue' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('/friends');
            setActiveCamera(false);
          }}
        >
          <Users size={24} />
          <span className="text-xs mt-1">Friends</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center w-16 h-16 ${isActive('/profile') ? 'text-snapchat-blue' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('/profile');
            setActiveCamera(false);
          }}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
}
