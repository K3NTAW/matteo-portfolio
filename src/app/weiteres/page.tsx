'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import MacOSDock from '@/components/ui/mac-dock';
import { motion, AnimatePresence } from 'framer-motion';
import { getDockApps } from '@/lib/database';
import { DockApp } from '@/types/database';
import ImageModal from '@/components/ui/image-modal';

// Helper function to create app content object from dock apps
const createAppContent = (dockApps: DockApp[]) => {
  const content: Record<string, { title: string; content: string }> = {};
  dockApps.forEach(app => {
    content[app.app_id] = {
      title: app.title,
      content: app.content
    };
  });
  return content;
};

// Helper function to convert dock apps to the format expected by MacOSDock
const convertToDockFormat = (dockApps: DockApp[]) => {
  return dockApps.map(app => ({
    id: app.app_id,
    name: app.name,
    icon: app.icon_url
  }));
};

export default function Weiteres() {
  const [dockApps, setDockApps] = useState<DockApp[]>([]);
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({});

  // Fetch dock apps from database
  useEffect(() => {
    const fetchDockApps = async () => {
      try {
        const apps = await getDockApps();
        setDockApps(apps);
        // Reset all window positions to ensure clean state
        setWindowPositions({});
        // Set some default open apps if available
        if (apps.length > 0) {
          setOpenApps([apps[0].app_id]);
          setActiveWindow(apps[0].app_id);
        }
      } catch (error) {
        console.error('Error fetching dock apps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDockApps();
  }, []);

  const handleAppClick = (appId: string) => {
    console.log('App clicked:', appId);
    
    // Toggle app in openApps array
    if (openApps.includes(appId)) {
      // Close the app
      setOpenApps(prev => prev.filter(id => id !== appId));
      if (activeWindow === appId) {
        setActiveWindow(null);
      }
    } else {
      // Open the app - reset position to center
      setOpenApps(prev => [...prev, appId]);
      setActiveWindow(appId);
      // Force position reset to center when opening
      setWindowPositions(prev => ({
        ...prev,
        [appId]: { x: 0, y: 0 }
      }));
    }
  };

  const closeWindow = (appId: string) => {
    setOpenApps(prev => prev.filter(id => id !== appId));
    if (activeWindow === appId) {
      setActiveWindow(null);
    }
    // Reset window position when closed
    setWindowPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[appId];
      return newPositions;
    });
  };

  // Create app content from dock apps
  const appContent = createAppContent(dockApps);
  const sampleApps = convertToDockFormat(dockApps);
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-2xl">Loading dock apps...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans relative">
      {/* App Windows Container */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <AnimatePresence>
        {/* Backdrop for active window */}
        {activeWindow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30 pointer-events-auto"
            onClick={() => setActiveWindow(null)}
          />
        )}
        {openApps.map((appId) => {
          // Force position to center for all windows
          const position = { x: 0, y: 0 };
          return (
            <motion.div
              key={appId}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute z-50 flex flex-col pointer-events-auto ${
                activeWindow === appId ? 'z-50' : 'z-40'
              } backdrop-blur-sm`}
              style={{
                width: '600px',
                height: '500px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '90vw',
                maxHeight: '80vh'
              }}
              drag
              dragMomentum={false}
              dragElastic={0.1}
              onDragEnd={(event, info) => {
                // Reset position to center after drag
                setWindowPositions(prev => ({
                  ...prev,
                  [appId]: { x: 0, y: 0 }
                }));
              }}
              dragConstraints={{
                top: - 200,
                left: -200,
                right: 200,
                bottom: 200
              }}
            >
            {/* Window Header */}
            <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-2xl border border-gray-600 flex items-center justify-between px-4 py-3 shadow-sm relative">
              {/* Subtle highlight at the top */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                              <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-400 transition-all duration-200 flex items-center justify-center group shadow-sm"
                    onClick={() => closeWindow(appId)}
                    title="Close"
                  >
                    <div className="w-1 h-1 bg-red-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-400 transition-all duration-200 flex items-center justify-center group shadow-sm" title="Minimize">
                    <div className="w-1 h-1 bg-yellow-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-400 transition-all duration-200 flex items-center justify-center group shadow-sm" title="Maximize">
                    <div className="w-1 h-1 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              <div className="flex-1 text-center">
                <span className="text-sm font-medium text-gray-200 tracking-wide">{appContent[appId]?.title || appId}</span>
              </div>
              <div className="w-16" /> {/* Spacer for centering */}
            </div>
            
            {/* Window Content */}
            <div className="bg-white rounded-b-2xl border border-gray-600 border-t-0 shadow-2xl flex-1">
              <div className="p-6 h-full overflow-y-auto bg-gray-50 relative">
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/30 pointer-events-none rounded-b-2xl"></div>
                <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap leading-relaxed relative z-10">
                  {appContent[appId]?.content || 'Content not available'}
                </pre>
              </div>
            </div>
          </motion.div>
        );
        })}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <section className="absolute bottom-0 left-0 right-0 flex flex-col justify-end items-center px-8 pb-8">
        <div className="text-center max-w-6xl mx-auto">
          <MacOSDock
            apps={sampleApps}
            onAppClick={handleAppClick}
            openApps={openApps}
            className="mx-auto"
          />
        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage?.url || ''}
        alt={selectedImage?.alt || ''}
      />
    </div>
  );
} 