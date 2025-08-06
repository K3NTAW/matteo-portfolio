"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

const pageTitles: { [key: string]: string } = {
  '/': 'HOME',
  '/about': 'ABOUT',
  '/bilder': 'BILDER',
  '/weiteres': 'WEITERES',
  '/contact': 'CONTACT'
};

export default function PageTitle() {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname] || 'HOME';

  // Don't show title on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <div className="fixed top-32 left-8 z-40">
      <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#E0F21E] tracking-wide">
        {currentTitle}
      </h2>
    </div>
  );
} 