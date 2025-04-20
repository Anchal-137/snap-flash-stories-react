
import React, { createContext, useState, useContext, useEffect } from 'react';

// Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isOpened: boolean;
  isSnap: boolean;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: string;
  duration: number;
  viewed: boolean;
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  streak?: number;
  lastActive: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bitmoji: string;
  score: number;
}

interface AppContextType {
  currentUser: User;
  friends: Friend[];
  messages: Message[];
  stories: Story[];
  viewedStoryIds: string[];
  activeCamera: boolean;
  setActiveCamera: (active: boolean) => void;
  toggleStoryViewed: (storyId: string) => void;
  markMessageAsOpened: (messageId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const MOCK_USER: User = {
  id: 'user1',
  username: 'yoursnap',
  displayName: 'Your Name',
  avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=120&h=120',
  bitmoji: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=120&h=120',
  score: 12450,
};

const MOCK_FRIENDS: Friend[] = [
  {
    id: 'friend1',
    username: 'alex_snap',
    displayName: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&h=120',
    streak: 56,
    lastActive: '2 min ago',
  },
  {
    id: 'friend2',
    username: 'sara_pics',
    displayName: 'Sara Wilson',
    avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=120&h=120',
    streak: 105,
    lastActive: '15 min ago',
  },
  {
    id: 'friend3',
    username: 'mike_snaps',
    displayName: 'Mike Brown',
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&h=120',
    streak: 23,
    lastActive: '1 hour ago',
  },
  {
    id: 'friend4',
    username: 'emma_stories',
    displayName: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=120&h=120',
    lastActive: '3 hours ago',
  },
  {
    id: 'friend5',
    username: 'james_snapper',
    displayName: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=120&h=120',
    streak: 45,
    lastActive: '5 hours ago',
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg1',
    senderId: 'friend1',
    receiverId: 'user1',
    content: '',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    isOpened: false,
    isSnap: true,
  },
  {
    id: 'msg2',
    senderId: 'friend2',
    receiverId: 'user1',
    content: 'Check out my new story!',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    isOpened: true,
    isSnap: false,
  },
  {
    id: 'msg3',
    senderId: 'user1',
    receiverId: 'friend1',
    content: '',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    isOpened: true,
    isSnap: true,
  },
  {
    id: 'msg4',
    senderId: 'friend3',
    receiverId: 'user1',
    content: '',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    isOpened: false,
    isSnap: true,
  },
  {
    id: 'msg5',
    senderId: 'friend5',
    receiverId: 'user1',
    content: 'Hey, what are you up to?',
    timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
    isOpened: false,
    isSnap: false,
  },
];

const MOCK_STORIES: Story[] = [
  {
    id: 'story1',
    userId: 'friend1',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=800',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    duration: 5,
    viewed: false,
  },
  {
    id: 'story2',
    userId: 'friend2',
    imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&h=800',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    duration: 8,
    viewed: false,
  },
  {
    id: 'story3',
    userId: 'friend3',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&h=800',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    duration: 10,
    viewed: false,
  },
  {
    id: 'story4',
    userId: 'friend4',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=800',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    duration: 5,
    viewed: false,
  },
];

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser] = useState<User>(MOCK_USER);
  const [friends] = useState<Friend[]>(MOCK_FRIENDS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [stories] = useState<Story[]>(MOCK_STORIES);
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([]);
  const [activeCamera, setActiveCamera] = useState<boolean>(false);

  // Mark message as opened
  const markMessageAsOpened = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, isOpened: true } : msg
      )
    );
  };

  // Add a new message
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  // Toggle story viewed state
  const toggleStoryViewed = (storyId: string) => {
    if (!viewedStoryIds.includes(storyId)) {
      setViewedStoryIds((prev) => [...prev, storyId]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        friends,
        messages,
        stories,
        viewedStoryIds,
        activeCamera,
        setActiveCamera,
        toggleStoryViewed,
        markMessageAsOpened,
        addMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
