
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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState<boolean>(true); // Default to true
  
  const { weatherData, isLoading, error, fetchWeather } = useWeather(true); // Auto fetch weather

  // Initialize camera
  useEffect(() => {
    console.log("CameraPage mounted, initializing camera...");
    setActiveCamera(true);
    
    const initCamera = async () => {
      try {
        console.log("Starting camera initialization");
        setCameraError(null);
        
        // Check if the browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Browser doesn't support getUserMedia");
          throw new Error("Your browser doesn't support camera access");
        }
        
        console.log("Browser supports getUserMedia, requesting camera access...");
        
        // Try to get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        console.log("Camera access granted:", stream);
        console.log("Stream tracks:", stream.getTracks());
        
        // If we got here, we have camera access
        if (videoRef.current) {
          console.log("Setting video source and playing...");
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded, attempting to play");
            
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log("Camera initialized successfully and playing");
                  setHasCamera(true);
                })
                .catch(err => {
                  console.error("Error playing video:", err);
                  setCameraError("Error starting camera stream: " + err.message);
                });
            }
          };
          
          videoRef.current.onerror = (event) => {
            console.error("Video element error:", event);
          };
        } else {
          console.error("Video ref is null");
          setCameraError("Camera initialization failed: Video element not available");
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setCameraError(err.message || "Error accessing camera");
        setHasCamera(false);
      }
    };

    // Initialize camera with a slight delay to ensure DOM is ready
    setTimeout(() => {
      initCamera().catch(err => {
        console.error("Failed to initialize camera with timeout:", err);
      });
    }, 500);

    return () => {
      // Stop camera when unmounting
      console.log("CameraPage unmounting, stopping camera...");
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        console.log("Stopping tracks:", tracks);
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

  // Try to reinitialize camera after error
  const retryCamera = () => {
    console.log("Retrying camera initialization...");
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => {
        console.log("Stopping track:", track);
        track.stop();
      });
    }
    
    // Force re-run of the useEffect
    setHasCamera(false);
    setCameraError(null);
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

  // Log camera state for debugging
  console.log("Camera state:", { hasCamera, cameraError, capturedImage });

  return (
    <div className={`relative h-screen w-full overflow-hidden ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
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
          <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'} flex items-center justify-center`}>
            <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} text-center p-4`}>
              <Camera size={48} className="mx-auto mb-4" />
              <p className="text-lg font-medium">{cameraError || "Camera not available"}</p>
              <p className="text-sm opacity-70 mt-2">Please allow camera access</p>
              <p className="text-xs opacity-70 mt-2">Browser indicates camera is: {document.visibilityState === 'visible' ? 'visible' : 'hidden'}</p>
              <button 
                onClick={retryCamera}
                className="mt-4 px-4 py-2 bg-snapchat-blue text-white rounded-full hover:bg-opacity-80"
              >
                Retry Camera Access
              </button>
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
      <div className={`absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-30 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-100/50'}`}>
        <button className={`${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} rounded-full p-2`}>
          <UserIcon size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
        </button>
        <div className="flex space-x-4">
          <button 
            onClick={toggleWeather} 
            className={`${showWeather ? (theme === 'dark' ? 'bg-white/30' : 'bg-gray-800/30') : (theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70')} rounded-full p-2`}
          >
            <CloudSun size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
          </button>
          <button 
            onClick={toggleTheme} 
            className={`${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} rounded-full p-2`}
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-white" />
            ) : (
              <Moon size={20} className="text-gray-800" />
            )}
          </button>
          <button className={`${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} rounded-full p-2`}>
            <Settings size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
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
              className={`${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} rounded-full p-3`}
            >
              <ArrowUp size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} transform="rotate(180)" />
            </button>
            
            {/* Send Button */}
            <button className={`${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} rounded-full p-3`}>
              <ArrowUp size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
            </button>
          </>
        ) : (
          <>
            {/* Gallery Button */}
            <button className={`${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} rounded-full p-3`}>
              <Image size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
            </button>
            
            {/* Capture Button */}
            <button 
              onClick={capturePhoto}
              disabled={!hasCamera}
              className={`${theme === 'dark' ? 'bg-white' : 'bg-white'} rounded-full w-16 h-16 flex items-center justify-center border-4 ${!hasCamera ? 'opacity-50' : ''} ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
            />
            
            {/* Send Button */}
            <button className={`${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} rounded-full p-3`}>
              <ArrowUp size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
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
                className={`h-16 w-16 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} border-2 
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
