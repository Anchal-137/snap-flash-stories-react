import { useAppContext } from '@/context/AppContext';
import { Settings, Share, User as UserIcon, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProfilePage = () => {
  const { currentUser } = useAppContext();
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="bg-snapchat-yellow p-6 pt-8 pb-20 relative">
        <div className="flex justify-end">
          <button className="mr-4">
            <Share size={20} className="text-black" />
          </button>
          <button>
            <Settings size={20} className="text-black" />
          </button>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="px-4 -mt-16 relative z-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center -mt-16">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                <img 
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="text-center mt-2">
              <h1 className="text-xl font-bold">{currentUser.displayName}</h1>
              <p className="text-gray-500 text-sm">{currentUser.username}</p>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="text-center mx-3">
                <p className="text-lg font-bold">{currentUser.score.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Snap Score</p>
              </div>
              
              <div className="h-10 border-r border-gray-200 mx-3"></div>
              
              <div className="text-center mx-3">
                <p className="text-lg font-bold">{5}</p>
                <p className="text-xs text-gray-500">Friends</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      {/* Bitmoji Section */}
      <div className="mt-4 p-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-medium mb-3">Bitmoji</h2>
          <div className="flex justify-center">
            <div className="w-32 h-32 overflow-hidden">
              <img 
                src={currentUser.bitmoji}
                alt="Your Bitmoji"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Snap Map */}
      <div className="mt-4 p-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center mb-3">
            <MapPin size={18} className="mr-2 text-snapchat-blue" />
            <h2 className="font-medium">Snap Map</h2>
          </div>
          
          <div className="bg-gray-200 h-32 rounded-lg overflow-hidden flex items-center justify-center">
            <p className="text-sm text-gray-500">Ghost Mode Enabled</p>
          </div>
          
          <button className="w-full mt-3 py-2.5 bg-snapchat-yellow rounded-full text-sm font-medium">
            Open Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
