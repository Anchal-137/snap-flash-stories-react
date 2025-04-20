import { useAppContext } from '@/context/AppContext';
import { Search, User as UserIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const FriendsPage = () => {
  const { friends } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFriends = searchQuery 
    ? friends.filter(friend => 
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 p-4 shadow-sm border-b border-border">
        <div className="flex justify-between items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <UserIcon size={24} className="bg-gray-200 p-1 rounded-full" />
          </div>
          
          <h1 className="text-2xl font-bold">Friends</h1>
          
          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 bg-snapchat-yellow rounded-full flex items-center justify-center">
              <Plus size={18} className="text-black" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
            placeholder="Search Friends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Friend Lists */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          <h2 className="font-medium mb-3">My Friends</h2>
          <div className="space-y-4">
            {filteredFriends.map(friend => (
              <div key={friend.id} className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={friend.avatar}
                    alt={friend.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-medium">{friend.displayName}</p>
                  <p className="text-sm text-gray-500">{friend.username}</p>
                </div>
                {friend.streak && (
                  <div className="ml-auto">
                    <span className="inline-flex items-center text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                      🔥 {friend.streak}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {/* Quick Add Section */}
      <div className="p-4 mt-4">
        <h2 className="font-medium mb-3">Quick Add</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <UserIcon size={24} className="text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Jessica Smith</p>
              <p className="text-xs text-gray-500">From your contacts</p>
            </div>
            <button className="ml-auto px-4 py-1.5 bg-snapchat-yellow rounded-full text-sm font-medium">
              Add
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <UserIcon size={24} className="text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Robert Johnson</p>
              <p className="text-xs text-gray-500">From your contacts</p>
            </div>
            <button className="ml-auto px-4 py-1.5 bg-snapchat-yellow rounded-full text-sm font-medium">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
