import { useEffect, useState, useRef, useCallback } from 'react';
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
  CloudSun,
  CameraOff 
} from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import Weather from '@/components/Weather';

const CameraPage = () => {
  const { activeCamera, setActiveCamera } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState<boolean>(true); // Default to true
  const [streamReady, setStreamReady] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [retryCounter, setRetryCounter] = useState(0); // State to trigger retries
  
  const { weatherData, isLoading, error, fetchWeather } = useWeather(true); // Auto fetch weather

  // Function to stop the current media stream
  const stopMediaStream = useCallback(() => {
    if (mediaStream) {
      console.log("Cleaning up camera - stopping all tracks");
      mediaStream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      setMediaStream(null);
      setStreamReady(false); // Reset stream ready state
      setActiveCamera(false); // Update context: camera is now inactive
    }
  }, [mediaStream, setActiveCamera]); // Add setActiveCamera dependency

  // Effect 1: Get camera stream (runs on mount and retry)
  useEffect(() => {
    console.log(`CameraPage Effect 1 running (retry: ${retryCounter})...`);
    let isMounted = true;

    const initCameraStream = async () => {
      try {
        console.log("Requesting camera stream...");
        setCameraError(null);
        setStreamReady(false); // Ensure stream is not ready until confirmed
        
        // Clean up any existing stream first (important for retries)
        // No need to call stopMediaStream here, cleanup will handle it if needed
        // or the component remounts for retry.
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Browser doesn't support getUserMedia");
          throw new Error("Your browser doesn't support camera access");
        }
        
        console.log("Browser supports getUserMedia, requesting camera access...");
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        if (!isMounted) {
          console.log("Component unmounted before stream acquired, stopping tracks.");
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        console.log("Camera access granted, setting media stream state:", stream);
        setMediaStream(stream);
        setActiveCamera(true); // Update context: camera is now active
        
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Camera access error:", err);
        setCameraError(err.message || "Error accessing camera");
        setMediaStream(null);
        setStreamReady(false);
        setActiveCamera(false); // Update context: camera failed to activate
      }
    };

    initCameraStream();

    return () => {
      isMounted = false;
      console.log("CameraPage Effect 1 cleanup: stopping media stream.");
      // Cleanup just needs to stop the stream. stopMediaStream handles setActiveCamera(false).
      stopMediaStream();
    };
    // Depend only on retryCounter to trigger re-runs. stopMediaStream is called from cleanup.
  }, [retryCounter]); // Remove stopMediaStream from dependencies

  // Effect 2: Attach stream to video element when both are ready
  useEffect(() => {
    // Only proceed if we have a stream AND the video element ref is current
    if (mediaStream && videoRef.current) {
      const videoElement = videoRef.current;
      console.log("Effect 2: mediaStream and videoRef available. Attaching stream.");

      // Check if the stream needs to be attached or is already attached
      if (videoElement.srcObject !== mediaStream) {
          videoElement.srcObject = mediaStream;
          videoElement.muted = true; // Essential for preventing feedback
          videoElement.playsInline = true; // Important for mobile browsers
          setStreamReady(false); // Mark as not ready until metadata loads
          console.log("Stream attached to video element. Waiting for metadata...");
      }

      const handleLoadedMetadata = () => {
        console.log("Video metadata loaded. Ready state:", videoElement.readyState);
        // Attempt to play the video only if metadata is loaded
        if (videoElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
           videoElement.play()
            .then(() => {
              console.log("Video is now playing!");
              setStreamReady(true); // Now the stream is truly ready
              setCameraError(null); // Clear any previous errors like playback errors
            })
            .catch(err => {
              console.error("Error playing video:", err);
              setCameraError(`Error starting video playback: ${err.message}`);
              setStreamReady(false);
            });
        }
      };

      const handleVideoError = (event: Event) => {
        console.error("Video element error:", event, videoElement.error);
        setCameraError(`Video playback error: ${videoElement.error?.message || 'Unknown error'}`);
        setStreamReady(false);
      };
      
      // Add event listeners
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('error', handleVideoError);

      // If metadata is already loaded (e.g., HMR or stream re-attachment), trigger handler
       if (videoElement.readyState >= HTMLMediaElement.HAVE_METADATA) {
         console.log("Metadata already loaded, attempting play directly.");
         handleLoadedMetadata();
       }

      // Cleanup function for this effect
      return () => {
        console.log("Cleaning up video element listeners (Effect 2 cleanup).");
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('error', handleVideoError);
        
        // Do NOT nullify srcObject here to prevent flicker on re-renders unless stream changes.
        // It will be handled by stopMediaStream when the stream is truly stopped.

        // Mark as not ready during cleanup/stream change
        // Only set to false if the stream is actually changing or stopping
        // If the component just re-renders, we don't want to reset this unnecessarily
        // setStreamReady(false); 
      };
    } else {
       // Log state if stream or video ref is missing when this effect runs
       if (!mediaStream) console.log("Effect 2: Waiting for media stream...");
       if (!videoRef.current) console.log("Effect 2: Waiting for video element ref...");
    }
    // This effect depends solely on the mediaStream changing
  }, [mediaStream]); 

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

  // Update retryCamera to increment the counter
  const retryCamera = useCallback(() => {
    console.log("Retrying camera initialization...");
    setCameraError(null); // Clear error display
    setStreamReady(false); // Reset ready state
    setRetryCounter(c => c + 1); // Increment counter to trigger Effect 1
  }, []); // No dependencies needed now

  // Capture photo from camera
  const capturePhoto = () => {
    // Check streamReady state instead of hasCamera
    if (videoRef.current && canvasRef.current && streamReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      console.log("Capturing photo from video:", 
        `Video readyState: ${video.readyState}, ` + // Use readyState for more detail
        `Size: ${video.videoWidth}x${video.videoHeight}, ` +
        `Playing: ${!video.paused}`);
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        try {
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
          console.log("Photo captured successfully");
          setCapturedImage(imageDataUrl);
        } catch (err) {
          console.error("Error capturing photo:", err);
        }
      }
    } else {
      console.warn("Cannot capture photo. Video ready:", !!videoRef.current, 
        "Canvas ready:", !!canvasRef.current, 
        "Stream ready:", streamReady); // Check streamReady
    }
  };

  // Discard captured photo and return to camera
  const discardPhoto = () => {
    console.log("Discarding captured photo");
    setCapturedImage(null);
  };

  // Log camera state for debugging
  useEffect(() => {
    console.log("Camera state:", { 
      hasCamera: streamReady, // Derive from streamReady
      cameraError, 
      capturedImage,
      streamReady,
      videoRefAvailable: !!videoRef.current, // Log ref status
      mediaStreamActive: mediaStream ? mediaStream.active : "no stream"
    });
  }, [streamReady, cameraError, capturedImage, mediaStream]); // Update dependencies

  return (
    <div className={`flex flex-col h-dvh overflow-hidden pb-20 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="flex-none flex items-center justify-between p-4 bg-opacity-75 backdrop-blur-sm">
        <button className="p-2 rounded-full bg-gray-600 text-gray-300">
          <UserIcon size={24} />
        </button>
        <div className="flex space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full bg-gray-600 text-gray-300"
          >
            {theme === 'dark' ? (
              <Sun size={24} />
            ) : (
              <Moon size={24} />
            )}
          </button>
          <button className="p-2 rounded-full bg-gray-600 text-gray-300">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Camera Feed or Captured Image */}
      <div className="relative flex-grow flex items-center justify-center bg-black min-h-0">
        {capturedImage ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img src={capturedImage} alt="Captured" className="max-w-full max-h-full object-contain" />
            {/* Add overlay buttons for captured image */}
            <div className="absolute bottom-5 left-5 right-5 flex justify-around p-4 bg-black bg-opacity-50 rounded-lg">
               <button onClick={discardPhoto} className="p-3 bg-red-500 rounded-full text-white">Discard</button>
               <button onClick={() => alert('Save functionality not implemented yet')} className="p-3 bg-blue-500 rounded-full text-white">Save</button>
            </div>
          </div>
        ) : cameraError ? (
          <div className="flex flex-col items-center justify-center text-center text-red-500 p-4">
            <CameraOff size={48} className="mb-2" />
            <p className="font-semibold">Camera Error:</p>
            <p>{cameraError}</p>
            <button 
              onClick={retryCamera} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry Camera
            </button>
          </div>
        ) : !mediaStream ? ( // Show initializing state before stream is obtained
          <div className="flex flex-col items-center justify-center text-gray-500">
            <p>Initializing Camera...</p> 
            {/* Optional: Add a spinner here */}
          </div>
         ) : !streamReady ? ( // Show waiting state after stream obtained but before video plays
           <div className="flex flex-col items-center justify-center text-gray-500">
             <p>Waiting for video stream...</p> 
             {/* Optional: Add a spinner here */}
           </div>
        ) : null /* Video element rendered below when stream is ready */}

        {/* Video element: Always render it, hide based on state */}
        {/* Use streamReady to control visibility/activity */}
        <video 
          ref={videoRef} 
          className={`w-full h-full object-cover ${capturedImage || cameraError || !streamReady ? 'hidden' : ''}`} 
          playsInline // Ensure playsInline is set
          // autoPlay // Let the useEffect handle play()
          muted // Ensure muted
        />
        
        {/* Hidden canvas for capturing photos */}
        <canvas ref={canvasRef} className="hidden"></canvas>

        {/* Weather Overlay: Show only when stream is ready and no image captured */}
        {showWeather && weatherData && !capturedImage && streamReady && (
          <div className="absolute top-0 left-0 p-2 bg-black bg-opacity-50 rounded-br-lg">
             <Weather weatherData={weatherData} overlay={true} />
           </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex-none flex items-center justify-around p-4 bg-opacity-75 backdrop-blur-sm">
        {/* Left placeholder */}
        <div className="w-12 h-12"> {/* Placeholder for balance */}
          {/* Show weather toggle only if weather data is available or loading */}
          {(weatherData || isLoading) && (
            <button 
              onClick={toggleWeather} 
              className={`p-2 rounded-full ${showWeather ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'}`}
              aria-label={showWeather ? "Hide Weather" : "Show Weather"}
            >
              <CloudSun size={24} />
            </button>
          )}
        </div>

        {/* Capture Button: Disable based on streamReady */}
        <button 
          onClick={capturePhoto} 
          disabled={!streamReady || !!capturedImage || !!cameraError} 
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-opacity duration-300 ${
            (!streamReady || !!capturedImage || !!cameraError) ? 'opacity-50 cursor-not-allowed bg-gray-700' : 'bg-red-500 hover:bg-red-600'
          }`}
          aria-label="Capture Photo"
        >
          <Camera size={32} className="text-white" />
        </button>

        {/* Right placeholder */}
        <div className="w-12 h-12"> {/* Placeholder for balance */}
          {/* Example: Add a button to flip camera later */}
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
