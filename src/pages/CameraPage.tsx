
import { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Camera, ArrowUp, Image, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';

const CameraPage = () => {
  const { activeCamera, setActiveCamera } = useAppContext();

  useEffect(() => {
    setActiveCamera(true);
    return () => setActiveCamera(false);
  }, [setActiveCamera]);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Camera View */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-black/20 z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&h=2000" 
            alt="Camera view" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-20">
        <button className="bg-black/30 rounded-full p-2">
          <UserIcon size={20} className="text-white" />
        </button>
        <div className="flex space-x-4">
          <button className="bg-black/30 rounded-full p-2">
            <SettingsIcon size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-8 z-20">
        {/* Gallery Button */}
        <button className="bg-white/20 rounded-full p-3">
          <Image size={24} className="text-white" />
        </button>
        
        {/* Capture Button */}
        <button className="bg-white rounded-full w-16 h-16 flex items-center justify-center border-4 border-gray-200">
        </button>
        
        {/* Send Button */}
        <button className="bg-white/20 rounded-full p-3">
          <ArrowUp size={24} className="text-white" />
        </button>
      </div>

      {/* Filters Carousel */}
      <div className="absolute bottom-36 left-0 right-0 flex justify-center z-20">
        <div className="flex space-x-3 px-4 py-2 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-16 w-16 rounded-full bg-gray-600 border-2 
                ${i === 0 ? 'border-white' : 'border-transparent'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
