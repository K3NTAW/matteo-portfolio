import { getExperiences, getAdminProfile } from '@/lib/database';
import { Experience } from '@/types/database';

export default async function Home() {
  // Fetch experiences and admin profile from database
  let experiences: Experience[] = [];
  let adminProfile = null;
  
  try {
    const [expData, profileData] = await Promise.all([
      getExperiences(),
      getAdminProfile()
    ]);
    experiences = expData;
    adminProfile = profileData;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Fallback to empty array if database is not set up yet
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-8">
        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Name - Large and bold */}
          <h1 className="text-9xl md:text-[10rem] lg:text-[14rem] font-bold tracking-tight leading-none mb-4 text-[#E0F21E]">
            {adminProfile?.name ? adminProfile.name.split(' ')[0] : 'Matteo'}
          </h1>
          
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
    </div>
  );
}
