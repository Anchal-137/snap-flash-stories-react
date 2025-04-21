
import { useAppContext } from '@/context/AppContext';
import { Search, UserRound, Plus } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/context/ThemeContext';
import { Card } from '@/components/ui/card';

const FriendsPage = () => {
  const { friends } = useAppContext();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFriends = searchQuery 
    ? friends.filter(friend => 
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 p-4 shadow-sm border-b border-border">
        <div className="flex justify-between items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <UserRound size={24} className="text-foreground p-1 rounded-full" />
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
            <Search size={16} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none bg-muted text-foreground placeholder:text-muted-foreground"
            placeholder="Search Friends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Friend Lists */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4">
          <Card className="p-4">
            <h2 className="font-medium mb-3 text-foreground">My Friends</h2>
            <div className="space-y-4">
              {filteredFriends.length > 0 ? (
                filteredFriends.map(friend => (
                  <div key={friend.id} className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                      <img 
                        src={friend.avatar}
                        alt={friend.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">{friend.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {friend.username}
                      </p>
                    </div>
                    {friend.streak && (
                      <div className="ml-auto">
                        <span className="inline-flex items-center text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                          🔥 {friend.streak}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No friends found</p>
              )}
            </div>
          </Card>
        </div>
      
        {/* Quick Add Section */}
        <div className="p-4">
          <Card className="p-4">
            <h2 className="font-medium mb-3 text-foreground">Quick Add</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <UserRound size={24} className="text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-foreground">Jessica Smith</p>
                  <p className="text-xs text-muted-foreground">
                    From your contacts
                  </p>
                </div>
                <button className="ml-auto px-4 py-1.5 bg-snapchat-yellow rounded-full text-sm font-medium text-black">
                  Add
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <UserRound size={24} className="text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-foreground">Robert Johnson</p>
                  <p className="text-xs text-muted-foreground">
                    From your contacts
                  </p>
                </div>
                <button className="ml-auto px-4 py-1.5 bg-snapchat-yellow rounded-full text-sm font-medium text-black">
                  Add
                </button>
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FriendsPage;
