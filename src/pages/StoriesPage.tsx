import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { X, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const StoriesPage = () => {
  const { stories, friends, viewedStoryIds, toggleStoryViewed } = useAppContext();
  const [activeStory, setActiveStory] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Group stories by user
  const storyGroups = stories.reduce((groups, story) => {
    const friend = friends.find(f => f.id === story.userId);
    if (!friend) return groups;
    
    if (!groups[story.userId]) {
      groups[story.userId] = {
        friend,
        stories: []
      };
    }
    
    groups[story.userId].stories.push(story);
    return groups;
  }, {} as Record<string, { friend: typeof friends[0], stories: typeof stories }>);
  
  const storyGroupsArray = Object.values(storyGroups);

  // Check if a story has been viewed
  const isStoryViewed = (storyId: string) => {
    return viewedStoryIds.includes(storyId);
  };
  
  // View story handler
  const handleViewStory = (userId: string) => {
    setActiveStory(userId);
    
    // Find the first unviewed story for this user
    const userStories = storyGroups[userId].stories;
    const firstUnviewedStory = userStories.find(story => !isStoryViewed(story.id));
    
    if (firstUnviewedStory) {
      toggleStoryViewed(firstUnviewedStory.id);
      
      // Start progress timer
      setProgress(0);
      const duration = firstUnviewedStory.duration * 1000;
      const interval = 50;
      let currentProgress = 0;
      
      const timer = setInterval(() => {
        currentProgress += (interval / duration) * 100;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(timer);
          // Move to next story or close
          setTimeout(() => {
            setActiveStory(null);
          }, 200);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  };

  // Close story view
  const closeStory = () => {
    setActiveStory(null);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {activeStory ? (
        // Story Viewer
        <div className="fixed inset-0 bg-black z-50">
          <div className="absolute inset-0">
            {/* Current Story */}
            {storyGroups[activeStory]?.stories.map((story, index) => (
              <div
                key={story.id}
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: isStoryViewed(story.id) ? 20 : 10 }}
              >
                <img 
                  src={story.imageUrl} 
                  alt="Story" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            
            {/* Progress Bar */}
            <div className="absolute top-2 left-0 right-0 flex px-2 gap-1 z-50">
              {storyGroups[activeStory]?.stories.map((story, index) => (
                <div key={story.id} className="story-progress-bar flex-1">
                  <div 
                    className="story-progress-fill" 
                    style={{ 
                      width: isStoryViewed(story.id) ? '100%' : 
                             (activeStory === story.userId ? `${progress}%` : '0%') 
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* User Info */}
            <div className="absolute top-6 left-0 right-0 flex items-center px-4 z-50">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img 
                    src={storyGroups[activeStory]?.friend.avatar} 
                    alt={storyGroups[activeStory]?.friend.displayName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {storyGroups[activeStory]?.friend.displayName}
                  </p>
                  <p className="text-white/70 text-xs">
                    {new Date(storyGroups[activeStory]?.stories[0].timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <button 
                className="ml-auto text-white"
                onClick={closeStory}
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Navigation Controls */}
            <div className="absolute inset-0 flex z-30">
              <div className="w-1/2 h-full" onClick={() => console.log('Previous story')} />
              <div className="w-1/2 h-full" onClick={() => console.log('Next story')} />
            </div>
          </div>
        </div>
      ) : (
        // Stories List
        <ScrollArea className="h-screen pb-20">
          <div className="pt-8">
            <div className="px-4 mb-6">
              <h1 className="text-2xl font-bold">Stories</h1>
            </div>
            
            {/* My Story */}
            <div className="px-4 mb-6">
              <h2 className="text-lg font-medium mb-3">My Story</h2>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <Plus size={24} className="text-gray-500" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Add to My Story</p>
                  <p className="text-sm text-gray-500">Share your day with friends</p>
                </div>
              </div>
            </div>
            
            {/* Friends Stories */}
            <div className="px-4">
              <h2 className="text-lg font-medium mb-3">Friends</h2>
              <div className="space-y-4">
                {storyGroupsArray.map((group) => (
                  <div 
                    key={group.friend.id} 
                    className="flex items-center" 
                    onClick={() => handleViewStory(group.friend.id)}
                  >
                    <div className={`w-16 h-16 rounded-full overflow-hidden ring-2 ${
                      group.stories.some(s => !isStoryViewed(s.id)) ? 'ring-snapchat-blue' : 'ring-gray-300'
                    }`}>
                      <img 
                        src={group.friend.avatar} 
                        alt={group.friend.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{group.friend.displayName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(group.stories[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default StoriesPage;
