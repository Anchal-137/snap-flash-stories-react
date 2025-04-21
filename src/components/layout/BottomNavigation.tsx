
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, MessageSquare, Users, User, Image } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';

export function BottomNavigation() {
  const location = useLocation();
  const { setActiveCamera } = useAppContext();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('/');

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${
      theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-t z-50 animate-fade-in`}>
      <div className="flex justify-around items-center h-16 px-4">
        <Link 
          to="/chat" 
          className={`flex flex-col items-center justify-center w-16 h-16 ${
            isActive('/chat') 
              ? 'text-snapchat-blue'
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
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
          className={`flex flex-col items-center justify-center w-16 h-16 ${
            isActive('/stories') 
              ? 'text-snapchat-blue'
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
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
          ${isActive('/') 
            ? 'bg-snapchat-yellow text-black' 
            : theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
          }`}
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
          className={`flex flex-col items-center justify-center w-16 h-16 ${
            isActive('/friends') 
              ? 'text-snapchat-blue'
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
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
          className={`flex flex-col items-center justify-center w-16 h-16 ${
            isActive('/profile') 
              ? 'text-snapchat-blue'
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
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
