'use client';
import { getExperiences, getAdminProfile } from '@/lib/database';
import { Experience, AdminProfile } from '@/types/database';
import { useEffect, useRef, useState } from 'react';
import ImageModal from '@/components/ui/image-modal';

export default function Home() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const profileRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expData, profileData] = await Promise.all([
          getExperiences(),
          getAdminProfile()
        ]);
        setExperiences(expData);
        setAdminProfile(profileData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-8">
        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Name - Large and bold */}
          <h1 className="text-9xl md:text-[10rem] lg:text-[14rem] font-bold tracking-tight leading-none mb-0 text-[#E0F21E]">
            {adminProfile?.name ? adminProfile.name.split(' ')[0] : 'Matteo'}
          </h1>
          
          {/* Profile Picture - Centered between names */}
          {adminProfile?.profile_picture_url && (
            <div className="flex justify-center -my-8 md:-my-12 lg:-my-16">
              <div 
                ref={profileRef}
                className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-lg transition-transform duration-300 ease-out"
                style={{
                  transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-[#E0F21E] blur-2xl opacity-60 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E0F21E]/80 via-[#E0F21E]/40 to-transparent blur-xl"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E0F21E]/60 via-transparent to-[#E0F21E]/30 blur-lg"></div>
                
                {/* Profile picture */}
                <img
                  src={adminProfile.profile_picture_url}
                  alt={adminProfile.name}
                  className="relative w-full h-full object-cover rounded-full cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => setSelectedImage({
                    url: adminProfile.profile_picture_url,
                    alt: adminProfile.name
                  })}
                />
              </div>
            </div>
          )}
          
          {/* Surname */}
          <h2 className="text-9xl md:text-[10rem] lg:text-[14rem] font-bold tracking-tight leading-none mb-4 text-[#E0F21E]">
            {adminProfile?.name ? adminProfile.name.split(' ').slice(1).join(' ') : 'Pianta'}
          </h2>
          
          {/* Title */}
          <p className="text-xl md:text-2xl font-medium text-gray-300 mb-8">
            {adminProfile?.position || 'Mediamatiker 2. Lehrjar'}
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {adminProfile?.slogan || 'Ciao, ich bin Matteo. Momentan im 2. Lehrjahr als Mediamatiker. Erfahre mehr über mich auf dieser Seite!'}
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium text-gray-400 tracking-wider">
              SCROLL
            </span>
            <div className="w-px h-8 bg-yellow-400 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#E0F21E] mb-4">
              EXPERIENCE
            </h2>
            <div className="w-32 h-px bg-gray-600 mx-auto"></div>
          </div>

          {/* Experience Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.length > 0 ? (
              experiences.map((experience) => (
                <div key={experience.id} className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-900/70 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {experience.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{experience.project_number}. Projekt</p>
                  <p className="text-gray-300 leading-relaxed">
                    {experience.description}
                  </p>
                </div>
              ))
            ) : (
              // Fallback content if no experiences are loaded
              <>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-900/70 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Junior Center B2B Callcenter, Olten
                  </h3>
                  <p className="text-gray-400 mb-4">1. Projekt</p>
                  <p className="text-gray-300 leading-relaxed">
                    Dies war mein erstes Projekt. Ich lernte, wie man mit Kunden umgeht und konnte meine kommunikativen Skills verbessern.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-900/70 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Junior Center B2B Mediamatik, Zürich/Bern
                  </h3>
                  <p className="text-gray-400 mb-4">2. Projekt</p>
                  <p className="text-gray-300 leading-relaxed">
                    In diesem Projekt lernte ich viel zum Thema Fotografie. Eine meiner Hauptaufgaben war es, Fotoshootings zu machen.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-900/70 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    MMO Multimediateam, Zürich
                  </h3>
                  <p className="text-gray-400 mb-4">3. Projekt</p>
                  <p className="text-gray-300 leading-relaxed">
                    Von dem Videoschneiden bis zum Illustrieren konnte ich in allem Übung sammeln bei MMO.
                  </p>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-8 hover:bg-gray-900/70 transition-colors">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Motion, Zürich
                  </h3>
                  <p className="text-gray-400 mb-4">4. Projekt</p>
                  <p className="text-gray-300 leading-relaxed">
                    Dies war mein erstes Projekt. Ich lernte, wie man mit Kunden umgeht und konnte meine kommunikativen Skills verbessern.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Rotating Skills Banner */}
      <section className="py-24 bg-gray-900/30 overflow-hidden">
        <div className="relative">
          {/* First row of skills */}
          <div className="flex animate-scroll-left">
            <div className="flex items-center space-x-16 whitespace-nowrap">
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PREMIER PRO</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">AFTEREFFECTS</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">ILLUSTRATOR</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PHOTOSHOP</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PREMIER PRO</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">AFTEREFFECTS</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">ILLUSTRATOR</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PHOTOSHOP</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
            </div>
          </div>

          {/* Second row of skills (reverse direction) */}
          <div className="flex animate-scroll-right mt-8">
            <div className="flex items-center space-x-16 whitespace-nowrap">
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PHOTOSHOP</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">ILLUSTRATOR</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">AFTEREFFECTS</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PREMIER PRO</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PHOTOSHOP</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">ILLUSTRATOR</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">AFTEREFFECTS</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
              <span className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E]">PREMIER PRO</span>
              <div className="w-6 h-6 bg-gray-600 rotate-45"></div>
            </div>
          </div>
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
