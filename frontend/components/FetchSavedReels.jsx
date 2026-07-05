"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import VideoReel from "./video";
import Navigation from "./Navigation";
import SkeletonCard from "./Loading"; 

const FetchSavedReels = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/food/saved/foods/${userId}`,
          { withCredentials: true },
        );
        if (res.data.success && res.data.savedReels) {
          const cleanedData = res.data.savedReels
            .filter((item) => item.foodItem !== null)
            .map((item) => item.foodItem);
          setSavedVideos(cleanedData);
        }
      } catch (error) {
        console.log("Error loading saved videos:", error.message);
      } finally {
        setIsLoading(false); // Fetching complete hone par loading false
      }
    };
    
    if (userId) {
      fetchVideos();
    } else {
      setIsLoading(false); // Agar userId nahi hai to loading band karain
    }
  }, [userId]);

  return (
    <div className="w-full max-w-md mx-auto scrollbar-none h-screen bg-black overflow-y-scroll snap-y snap-mandatory relative antialiased select-none">
      
      {/* 1. Condition: Agar Loading chal rahi ho */}
      {isLoading ? (
        <SkeletonCard />
      ) : savedVideos.length > 0 ? (
        /* 2. Condition: Data load ho chuka ho */
        savedVideos.toReversed().map((item) => <VideoReel key={item._id} item={item} />)
      ) : (
        /* 3. Condition: Data empty ho */
        <div className="w-full h-full flex items-center justify-center p-6">
          <div className="w-full py-16 bg-zinc-950/40 border border-dashed border-zinc-900 rounded-md text-center font-mono">
            <p className="text-xs text-zinc-600 tracking-widest uppercase">
              NO SAVED VIDEOS
            </p>
          </div>
        </div>
      )}
      
      {/* Fixed Navigation Matrix Layer */}
      <Navigation />
    </div>
  );
};

export default FetchSavedReels;