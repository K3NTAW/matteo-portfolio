'use client';

import { useState, useEffect } from 'react';
import { getAboutContent } from '@/lib/database';
import ImageModal from '@/components/ui/image-modal';
import Image from 'next/image';

export default function About() {
  const [aboutContent, setAboutContent] = useState<{ content?: string; image_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const content = await getAboutContent();
        setAboutContent(content);
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
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
                  <Image
                    src={aboutContent.image_url}
                    alt="About Me"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
                    onClick={() => setSelectedImage({
                      url: aboutContent.image_url || '',
                      alt: "About Me"
                    })}
                    unoptimized={aboutContent.image_url?.startsWith('data:') || aboutContent.image_url?.startsWith('blob:')}
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