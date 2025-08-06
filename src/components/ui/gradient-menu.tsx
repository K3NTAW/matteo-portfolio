"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHomeOutline, IoPersonOutline, IoImagesOutline, IoEllipsisHorizontalOutline, IoMailOutline } from 'react-icons/io5';

const menuItems = [
  { title: 'HOME', href: '/', icon: <IoHomeOutline />, gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { title: 'ABOUT', href: '/about', icon: <IoPersonOutline />, gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { title: 'BILDER', href: '/bilder', icon: <IoImagesOutline />, gradientFrom: '#FF9966', gradientTo: '#FF5E62' },
  { title: 'WEITERES', href: '/weiteres', icon: <IoEllipsisHorizontalOutline />, gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
  { title: 'CONTACT', href: '/contact', icon: <IoMailOutline />, gradientFrom: '#ffa9c6', gradientTo: '#f434e2' }
];

export default function GradientMenu() {
  const pathname = usePathname();

  return (
    <div className="fixed top-8 left-8 z-50">
      <ul className="flex gap-4">
        {menuItems.map(({ title, href, icon, gradientFrom, gradientTo }, idx) => (
          <li key={idx}>
            <Link href={href}>
              <div
                style={{ '--gradient-from': gradientFrom, '--gradient-to': gradientTo }}
                className={`relative w-[50px] h-[50px] bg-black border border-gray-700 shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[140px] hover:shadow-none group cursor-pointer ${
                  pathname === href ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                {/* Gradient background on hover */}
                <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100"></span>
                {/* Blur glow */}
                <span className="absolute top-[5px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[10px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-50"></span>

                {/* Icon */}
                <span className="relative z-10 transition-all duration-500 group-hover:scale-0 delay-0">
                  <span className={`text-xl ${pathname === href ? 'text-yellow-400' : 'text-gray-400'}`}>{icon}</span>
                </span>

                {/* Title */}
                <span className="absolute text-white uppercase tracking-wide text-xs font-medium transition-all duration-500 scale-0 group-hover:scale-100 delay-150">
                  {title}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
