"use client";
import React from 'react';
import { useRouter } from "next/navigation";

const VideoGridCard = ({ item }) => {
    const router = useRouter()
  return (
    <div className="relative aspect-9/16 bg-zinc-900 overflow-hidden group border border-zinc-900/40 rounded-sm cursor-pointer">
      {/* Background Video Preview (Muted & Loop) */}
      <video 
        src={item.video} 
        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        muted
        playsInline
        loop
        onClick={() => router.push(`/food/${item._id}`)}
        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
        onMouseLeave={(e) => { 
          e.currentTarget.pause(); 
          e.currentTarget.currentTime = 0; 
        }}
      />

      {/* Video Bottom Overlay Text */}
      <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-linear-to-t from-black/80 via-black/20 to-transparent">
        <p className="text-[11px] text-white truncate font-medium">
          {item.name}
        </p>
      </div>
    </div>
  );
};

export default VideoGridCard;