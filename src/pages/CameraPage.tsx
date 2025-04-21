
import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Camera, 
  ArrowUp, 
  Image, 
  User as UserIcon, 
  Settings, 
  Moon, 
  Sun, 
  CloudSun 
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import Weather from '@/components/Weather';

const CameraPage = () => {
  const { activeCamera, setActiveCamera } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState<boolean>(false);
  
  const { weatherData, isLoading, error, fetchWeather } = useWeather();

  // Initialize camera
  useEffect(() => {
    setActiveCamera(true);
    
    // Start camera if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCamera(true);
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          setHasCamera(false);
        });
    }

    return () => {
      // Stop camera when unmounting
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      setActiveCamera(false);
    };
  }, [setActiveCamera]);

  // Toggle weather overlay
  const toggleWeather = async () => {
    if (!showWeather && !weatherData) {
      try {
        await fetchWeather();
        setShowWeather(true);
      } catch (err) {
        console.error('Failed to fetch weather data');
      }
    } else {
      setShowWeather(!showWeather);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && hasCamera) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // If weather data is available, overlay it on the image
        if (showWeather && weatherData) {
          // Add semi-transparent overlay for weather data
          context.fillStyle = 'rgba(0, 0, 0, 0.5)';
          context.fillRect(0, 0, canvas.width, canvas.height * 0.15);
          
          // Add weather information
          context.fillStyle = 'white';
          context.font = 'bold 20px Arial';
          context.fillText(`${weatherData.location.name}, ${weatherData.current.temperature}°C`, 20, 30);
          context.font = '16px Arial';
          context.fillText(`${weatherData.current.weather_descriptions[0]}`, 20, 55);
        }
        
        // Convert to data URL and store
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
      }
    }
  };

  // Discard captured photo and return to camera
  const discardPhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Camera View */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {hasCamera ? (
          capturedImage ? (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="h-full w-full object-contain"
            />
          ) : (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <Camera size={48} className="mx-auto mb-4" />
              <p>Camera not available</p>
              <p className="text-sm opacity-70 mt-2">Please allow camera access</p>
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Weather Overlay */}
      {showWeather && weatherData && !capturedImage && (
        <div className="absolute top-20 left-0 right-0 z-20">
          <Weather weatherData={weatherData} overlay={true} />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-0 right-0 bg-red-600/90 text-white p-4 z-50 text-center">
          {error}
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-30">
        <button className="bg-black/30 rounded-full p-2">
          <UserIcon size={20} className="text-white" />
        </button>
        <div className="flex space-x-4">
          <button 
            onClick={toggleWeather} 
            className={`${showWeather ? 'bg-white/30' : 'bg-black/30'} rounded-full p-2`}
          >
            <CloudSun size={20} className="text-white" />
          </button>
          <button 
            onClick={toggleTheme} 
            className="bg-black/30 rounded-full p-2"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-white" />
            ) : (
              <Moon size={20} className="text-white" />
            )}
          </button>
          <button className="bg-black/30 rounded-full p-2">
            <Settings size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center items-center gap-8 z-30">
        {capturedImage ? (
          <>
            {/* Discard Button */}
            <button 
              onClick={discardPhoto}
              className="bg-white/20 rounded-full p-3"
            >
              <ArrowUp size={24} className="text-white transform rotate-180" />
            </button>
            
            {/* Send Button */}
            <button className="bg-white/20 rounded-full p-3">
              <ArrowUp size={24} className="text-white" />
            </button>
          </>
        ) : (
          <>
            {/* Gallery Button */}
            <button className="bg-white/20 rounded-full p-3">
              <Image size={24} className="text-white" />
            </button>
            
            {/* Capture Button */}
            <button 
              onClick={capturePhoto}
              className="bg-white rounded-full w-16 h-16 flex items-center justify-center border-4 border-gray-200"
            />
            
            {/* Send Button */}
            <button className="bg-white/20 rounded-full p-3">
              <ArrowUp size={24} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Filters Carousel */}
      {!capturedImage && (
        <div className="absolute bottom-36 left-0 right-0 flex justify-center z-30">
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
      )}
    </div>
  );
};

export default CameraPage;
