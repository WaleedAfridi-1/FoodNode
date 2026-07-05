"use client";
import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SingleVideoView = ({ item, id }) => {
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay blocked by browser policy, click to play:", err);
      });
    }
  }, []);

  const handleBackClick = () => {
    if (item?.foodPartner) {
      router.push(`/food-partner/profile/${item.foodPartner}`);
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-black relative flex items-center justify-center overflow-hidden">
      
      {/* 1. Floating Back to Profile Button */}
      <Link href={`/food-partner/profile/${item.foodPartner.toString()}`}>
      <button
        className="absolute top-6 left-6 z-50 bg-black/40 backdrop-blur-md text-white border border-zinc-800 p-2.5 rounded-full shadow-lg hover:bg-zinc-900/80 transition active:scale-95 flex items-center justify-center"
        aria-label="Go Back"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2.5} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
    </Link>
      {/* 2. Full Screen Video View */}
      <video
        ref={videoRef}
        src={item?.video}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={() => {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }}
      />

      {/* 3. Bottom Video Details Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col space-y-2 pb-10">
        <h2 className="text-xl font-bold text-white tracking-wide">
          {item?.name || "Food Item"}
        </h2>
        <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
          {item?.description || "No description provided."}
        </p>
      </div>

    </div>
  );
};

export default SingleVideoView;