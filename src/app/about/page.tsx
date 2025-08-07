import { getAboutContent } from '@/lib/database';

export default async function About() {
  let aboutContent = null;
  
  try {
    aboutContent = await getAboutContent();
  } catch (error) {
    console.error('Error fetching about content:', error);
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <section className="relative min-h-screen flex flex-col justify-center items-center px-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Text Content - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6">
                {aboutContent?.content ? (
                  <div dangerouslySetInnerHTML={{ __html: aboutContent.content.replace(/\n/g, '<br />') }} />
                ) : (
                  <>
                    <p>
                      I am deeply passionate about the crossroads of art and technology, crafting visually stunning interfaces and enhancing the entire digital experience for users.
                    </p>
                    <p>
                      I hold a Bachelor of Technology in Computer Science from the esteemed Art University and a Master of Fine Arts in Interactive Design. This academic foundation has equipped me with a solid understanding of the principles that underpin effective interaction design, providing me with the knowledge to create designs that seamlessly blend aesthetics and functionality.
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* Image - 1/3 width */}
            <div className="lg:col-span-1 flex justify-center">
              {aboutContent?.image_url ? (
                <div className="w-full max-w-md">
                  <img
                    src={aboutContent.image_url}
                    alt="About Me"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No image uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 