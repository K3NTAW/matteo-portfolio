'use client';
import { useState, useEffect } from 'react';
import MacOSDock from '@/components/ui/mac-dock';
import { motion, AnimatePresence } from 'framer-motion';
import { getDockApps } from '@/lib/database';
import { DockApp } from '@/types/database';
import ImageModal from '@/components/ui/image-modal';

// Helper function to create app content object from dock apps
const createAppContent = (dockApps: DockApp[]) => {
  const content: Record<string, { title: string; content: string; image_urls?: string[]; content_type: string }> = {};
  dockApps.forEach(app => {
    content[app.app_id] = {
      title: app.title,
      content: app.content,
      image_urls: app.image_urls,
      content_type: app.content_type
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

  // Fetch dock apps from database
  useEffect(() => {
    const fetchDockApps = async () => {
      try {
        const apps = await getDockApps();
        setDockApps(apps);
        // Don't open any apps by default
        setOpenApps([]);
        setActiveWindow(null);
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
      // Open the app
      setOpenApps(prev => [...prev, appId]);
      setActiveWindow(appId);
    }
  };

  const closeWindow = (appId: string) => {
    setOpenApps(prev => prev.filter(id => id !== appId));
    if (activeWindow === appId) {
      setActiveWindow(null);
    }
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
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden" style={{ position: 'relative' }}>
      {/* App Windows */}
      <AnimatePresence>
        {/* Backdrop for active window */}
        {activeWindow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-30"
            onClick={() => setActiveWindow(null)}
          />
        )}
        {openApps.map((appId) => (
          <motion.div
            key={appId}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`absolute bg-background border border-border rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl ${
              activeWindow === appId ? 'z-50' : 'z-40'
            }`}
            style={{
              width: '800px',
              height: '600px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90vw',
              maxHeight: '80vh'
            }}
            drag
            dragMomentum={false}
            dragElastic={0.1}
            dragConstraints={{
              top: -100,
              left: -100,
              right: 100,
              bottom: 100
            }}
          >
                        {/* Window Header */}
            <div className="h-12 bg-background/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
              <div className="flex items-center space-x-3">
                {/* Traffic Light Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => closeWindow(appId)}
                    className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    title="Close"
                  />
                  <button
                    className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
                    title="Minimize"
                  />
                  <button
                    className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                    title="Maximize"
                  />
                </div>
              </div>
              
              {/* Window Title */}
              <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
                <span className="text-sm font-medium text-foreground">{appContent[appId]?.title || appId}</span>
              </div>

              {/* Spacer for centering */}
              <div className="w-16" />
            </div>
            
            {/* Window Content */}
            <div className="h-full bg-background/50 backdrop-blur-sm overflow-auto">
              <div className="p-6">
                {appContent[appId]?.content_type === 'image' && appContent[appId]?.image_urls && appContent[appId].image_urls.length > 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <img 
                      src={appContent[appId].image_urls[0]} 
                      alt={appContent[appId]?.title || 'App content'}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
                      onClick={() => setSelectedImage({
                        url: appContent[appId]?.image_urls?.[0] || '',
                        alt: appContent[appId]?.title || 'App content'
                      })}
                    />
                  </div>
                ) : appContent[appId]?.content_type === 'mixed' && appContent[appId]?.image_urls && appContent[appId].image_urls.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <img 
                        src={appContent[appId].image_urls[0]} 
                        alt={appContent[appId]?.title || 'App content'}
                        className="max-w-full max-h-64 object-contain rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
                        onClick={() => setSelectedImage({
                          url: appContent[appId]?.image_urls?.[0] || '',
                          alt: appContent[appId]?.title || 'App content'
                        })}
                      />
                    </div>
                    <pre className="text-sm text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                      {appContent[appId]?.content || 'Content not available'}
                    </pre>
                  </div>
                ) : appContent[appId]?.content_type === 'gallery' && appContent[appId]?.image_urls && appContent[appId].image_urls.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {appContent[appId].image_urls.map((imageUrl, index) => (
                        <div key={index} className="aspect-square">
                          <img 
                            src={imageUrl} 
                            alt={`${appContent[appId]?.title || 'App'} image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => setSelectedImage({
                              url: imageUrl,
                              alt: `${appContent[appId]?.title || 'App'} image ${index + 1}`
                            })}
                          />
                        </div>
                      ))}
                    </div>
                    {appContent[appId]?.content && (
                      <pre className="text-sm text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                        {appContent[appId].content}
                      </pre>
                    )}
                  </div>
                ) : (
                  <pre className="text-sm text-foreground font-mono whitespace-pre-wrap leading-relaxed">
                    {appContent[appId]?.content || 'Content not available'}
                  </pre>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

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