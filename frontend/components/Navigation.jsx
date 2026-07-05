"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getCookieValue = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    setUserRole(getCookieValue('userRole'));
    setUserId(getCookieValue('userId'));
  }, []);

  const isFoodPartner = userRole === 'food-partner';

  // Helper for active route rendering
  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-16 bg-black/95 border-t border-zinc-800/80 z-50 flex items-center justify-around px-6 transition-all duration-300">
      
      {/* 🏠 HOME */}
      <Link 
        href="/" 
        className={`flex flex-col items-center justify-center w-12 h-full transition-colors relative ${
          isActive('/') ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill={isActive('/') ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Home</span>
      </Link>

      {/* ➕ PARTNER CREATE TOOL */}
      {isFoodPartner && (
        <Link 
          href="/food/create" 
          className="flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Create New Entry"
        >
          <div className="bg-zinc-50 text-black px-4 py-1.5 rounded-md font-bold flex items-center justify-center hover:bg-zinc-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </Link>
      )}

      {/* 🔖 SAVED */}
      <Link 
        href="/saved" 
        className={`flex flex-col items-center justify-center w-12 h-full transition-colors relative ${
          isActive('/saved') ? 'text-zinc-50' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill={isActive('/saved') ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.154 1.907 1.101 1.907 2.214v15.586c0 .895-.996 1.432-1.743.935L12 17.518l-5.757 4.54c-.747.497-1.743-.04-1.743-.936V5.536c0-1.113.808-2.06 1.907-2.214a48.554 48.554 0 0 1 11.186 0Z" />
        </svg>
        <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Saved</span>
      </Link>

      {/* 👤 DYNAMIC PROFILE */}
      {userId && (
        <Link 
          href={userRole === "user" ? `/user/profile/${userId}` : `/food-partner/${userId}`} 
          className={`flex flex-col items-center justify-center w-12 h-full transition-colors relative ${
            isActive(`/user/profile/${userId}`) || isActive(`/food-partner/${userId}`) 
              ? 'text-zinc-50' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={isActive(`/user/profile/${userId}`) || isActive(`/food-partner/${userId}`) ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </Link>
      )}

    </div>
  );
};

export default Navigation;