
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { Settings, Share, User as UserIcon, MapPin, Users, Gift, Camera } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ProfilePage = () => {
  const { currentUser } = useAppContext();
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-snapchat-dark' : 'bg-snapchat-yellow'} p-6 pt-8 pb-20 relative`}>
        <div className="flex justify-between items-center">
          <h2 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            My Profile
          </h2>
          <div className="flex space-x-4">
            <button className="rounded-full p-2 hover:bg-black/10">
              <Share size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
            </button>
            <button className="rounded-full p-2 hover:bg-black/10">
              <Settings size={20} className={theme === 'dark' ? 'text-white' : 'text-black'} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="px-4 -mt-16 relative z-10">
          <Card className={`p-6 ${theme === 'dark' ? 'bg-muted border-border' : 'bg-white'}`}>
            <div className="flex justify-center -mt-16">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage 
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                />
                <AvatarFallback>
                  {currentUser.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="text-center mt-4">
              <h1 className="text-xl font-bold">{currentUser.displayName}</h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>@{currentUser.username}</p>
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="text-center mx-4">
                <p className="text-lg font-bold">{currentUser.score.toLocaleString()}</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Snap Score</p>
              </div>
              
              <div className={`h-10 mx-4 ${theme === 'dark' ? 'border-muted-foreground/30' : 'border-gray-200'} border-r`}></div>
              
              <div className="text-center mx-4">
                <p className="text-lg font-bold">5</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>Friends</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Bitmoji Section */}
        <div className="mt-4 p-4">
          <Card className={`p-4 ${theme === 'dark' ? 'bg-muted border-border' : 'bg-white'}`}>
            <div className="flex items-center mb-3">
              <UserIcon size={18} className={`mr-2 ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-700'}`} />
              <h2 className="font-medium">Bitmoji</h2>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-32 overflow-hidden">
                <img 
                  src={currentUser.bitmoji}
                  alt="Your Bitmoji"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Button className={`w-full mt-3 ${theme === 'dark' ? 'bg-snapchat-yellow/80 text-black hover:bg-snapchat-yellow' : 'bg-snapchat-yellow text-black hover:bg-snapchat-yellow/90'}`}>
              Edit Bitmoji
            </Button>
          </Card>
        </div>
        
        {/* Snap Map */}
        <div className="mt-4 p-4">
          <Card className={`p-4 ${theme === 'dark' ? 'bg-muted border-border' : 'bg-white'}`}>
            <div className="flex items-center mb-3">
              <MapPin size={18} className="mr-2 text-snapchat-blue" />
              <h2 className="font-medium">Snap Map</h2>
            </div>
            
            <div className={`h-32 rounded-lg overflow-hidden flex items-center justify-center ${theme === 'dark' ? 'bg-secondary' : 'bg-gray-200'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                Ghost Mode Enabled
              </p>
            </div>
            
            <Button className={`w-full mt-3 ${theme === 'dark' ? 'bg-snapchat-yellow/80 text-black hover:bg-snapchat-yellow' : 'bg-snapchat-yellow text-black hover:bg-snapchat-yellow/90'}`}>
              Open Map
            </Button>
          </Card>
        </div>
        
        {/* Friends Section */}
        <div className="mt-4 p-4">
          <Card className={`p-4 ${theme === 'dark' ? 'bg-muted border-border' : 'bg-white'}`}>
            <div className="flex items-center mb-3">
              <Users size={18} className="mr-2 text-snapchat-purple" />
              <h2 className="font-medium">Friends</h2>
            </div>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full flex justify-between items-center">
                <span>Add Friends</span>
                <UserIcon size={18} />
              </Button>
              
              <Button variant="outline" className="w-full flex justify-between items-center">
                <span>My Friends</span>
                <Users size={18} />
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Memories Section */}
        <div className="mt-4 p-4 mb-20">
          <Card className={`p-4 ${theme === 'dark' ? 'bg-muted border-border' : 'bg-white'}`}>
            <div className="flex items-center mb-3">
              <Camera size={18} className="mr-2 text-snapchat-magenta" />
              <h2 className="font-medium">Memories</h2>
            </div>
            
            <div className={`h-40 rounded-lg overflow-hidden flex items-center justify-center ${theme === 'dark' ? 'bg-secondary' : 'bg-gray-200'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'}`}>
                Your memories will appear here
              </p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProfilePage;
