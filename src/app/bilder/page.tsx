"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMedia } from '@/lib/database';
import { Media } from '@/types/database';

const FLIP_SPEED = 750;
const flipTiming = { duration: FLIP_SPEED, iterations: 1 };

// flip down
const flipAnimationTop = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' }
];
const flipAnimationBottom = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0)' }
];

// flip up
const flipAnimationTopReverse = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0)' }
];
const flipAnimationBottomReverse = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' }
];

export default function Bilder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniteRef = useRef<Element[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch media from database
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const media = await getMedia();
        setMediaItems(media);
      } catch (error) {
        console.error('Error fetching media:', error);
        // Fallback to empty array if database is not set up
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // initialise first image once
  useEffect(() => {
    if (!containerRef.current || mediaItems.length === 0) return;
    uniteRef.current = Array.from(containerRef.current.querySelectorAll('.unite'));
    defineFirstImg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItems]);

  const defineFirstImg = () => {
    uniteRef.current.forEach(setActiveImage);
    setImageTitle();
  };

  const setActiveImage = (el: Element) => {
    if (el instanceof HTMLElement && displayImages[currentIndex]) {
      const imageUrl = 'file_url' in displayImages[currentIndex] 
        ? displayImages[currentIndex].file_url 
        : displayImages[currentIndex].url;
      el.style.backgroundImage = `url('${imageUrl}')`;
    }
  };

  const setImageTitle = () => {
    const gallery = containerRef.current;
    if (!gallery || !displayImages[currentIndex]) return;
    gallery.setAttribute('data-title', displayImages[currentIndex].title);
    gallery.setAttribute('data-description', displayImages[currentIndex].description || '');
    gallery.style.setProperty('--title-y', '0');
    gallery.style.setProperty('--title-opacity', '1');
  };

  const updateGallery = (nextIndex: number, isReverse = false) => {
    const gallery = containerRef.current;
    if (!gallery || displayImages.length === 0) return;

    // determine direction animation arrays
    const topAnim = isReverse ? flipAnimationTopReverse : flipAnimationTop;
    const bottomAnim = isReverse
      ? flipAnimationBottomReverse
      : flipAnimationBottom;

    // animate top half
    const topEl = uniteRef.current[0];
    if (topEl) {
      topEl.animate(topAnim, flipTiming);
    }

    // animate bottom half
    const bottomEl = uniteRef.current[1];
    if (bottomEl) {
      bottomEl.animate(bottomAnim, flipTiming);
    }

    // update image after animation
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      uniteRef.current.forEach(setActiveImage);
      setImageTitle();
    }, FLIP_SPEED / 2);
  };

  const updateIndex = (increment: number) => {
    if (displayImages.length === 0) return;
    
    const nextIndex = (currentIndex + increment + displayImages.length) % displayImages.length;
    const isReverse = increment < 0;
    updateGallery(nextIndex, isReverse);
  };

  // Fallback images if no media from database
  const fallbackImages = [
    { 
      title: 'Junior Center B2B Callcenter', 
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=1000&fit=crop',
      description: '1. Projekt - Customer Service'
    },
    { 
      title: 'MMO Multimediateam', 
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=1000&fit=crop',
      description: '3. Projekt - Video & Illustration'
    },
    { 
      title: 'Junior Center B2B Mediamatik', 
      url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=1000&fit=crop',
      description: '2. Projekt - Photography'
    },
    { 
      title: 'Motion', 
      url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=1000&fit=crop',
      description: '4. Projekt - Motion Design'
    },
    { 
      title: 'Portfolio Project', 
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=1000&fit=crop',
      description: 'Personal Portfolio Website'
    }
  ];

  // Use database media if available, otherwise use fallback
  const displayImages = mediaItems.length > 0 ? mediaItems : fallbackImages;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Animated Signature */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <svg width="60" height="40" viewBox="0 0 60 40" className="mb-2">
          {/* Background signature */}
          <path
            d="M20 20 Q25 25 30 20 Q35 15 40 20 Q45 25 50 20"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Animated white part of signature */}
          <path
            d="M20 20 Q25 25 30 20 Q35 15 40 20 Q45 25 50 20"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="30"
            strokeDashoffset="30"
            className="signature-animation"
          />
        </svg>
        <p className="text-gray-400 text-sm mt-2 text-center">Mediamatiker 2. Lehrjar</p>
      </div>

      <section className="relative flex flex-col items-center px-4 pt-64 pb-8">
        <div className="w-full max-w-none">
          {/* Flip Gallery */}
          <div className="flex flex-col items-center">
            <div className="relative bg-white/5 border border-white/25 p-2 rounded-lg w-full max-w-6xl mx-auto">
              <div
                id="flip-gallery"
                ref={containerRef}
                className="relative w-full h-[350px] md:h-[400px] lg:h-[650px] text-center rounded-lg overflow-hidden"
                style={{ perspective: '800px' }}
              >
                <div className="top unite bg-cover bg-no-repeat"></div>
                <div className="bottom unite bg-cover bg-no-repeat"></div>
              </div>

              {/* navigation */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <button
                  type="button"
                  onClick={() => updateIndex(-1)}
                  title="Previous"
                  className="text-yellow-400 opacity-75 hover:opacity-100 hover:scale-125 transition bg-black/50 p-2 rounded-full"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => updateIndex(1)}
                  title="Next"
                  className="text-yellow-400 opacity-75 hover:opacity-100 hover:scale-125 transition bg-black/50 p-2 rounded-full"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* component-scoped styles that Tailwind cannot express */}
      <style jsx>{`
        .signature-animation {
          animation: drawSignature 2s ease-in-out forwards;
        }

        @keyframes drawSignature {
          to {
            stroke-dashoffset: 0;
          }
        }

        #flip-gallery::before {
          content: attr(data-title);
          color: #fbbf24;
          font-size: 0.75rem;
          left: 1rem;
          position: absolute;
          bottom: 1rem;
          line-height: 2;
          opacity: var(--title-opacity, 0);
          transform: translateY(var(--title-y, 0));
          transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
          font-weight: 600;
          z-index: 10;
        }

        #flip-gallery::after {
          content: attr(data-description);
          color: rgba(255 255 255 / 0.75);
          font-size: 0.7rem;
          left: 1rem;
          position: absolute;
          bottom: 3rem;
          line-height: 1.5;
          opacity: var(--title-opacity, 0);
          transform: translateY(var(--title-y, 0));
          transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
          z-index: 10;
        }

        #flip-gallery > * {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background-repeat: no-repeat;
        }

        .top {
          top: 0;
          transform-origin: bottom;
          background-position: top center;
          background-size: 100% 200%;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .bottom {
          bottom: 0;
          transform-origin: top;
          background-position: bottom center;
          background-size: 100% 200%;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}