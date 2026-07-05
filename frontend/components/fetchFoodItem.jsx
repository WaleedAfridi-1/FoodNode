"use client";
import { useState, useEffect } from "react";
import VideoReel from '../components/video';
import axios from "axios";
import SkeletonCard from "./Loading";
import Navigation from "./Navigation";

const FetchFoodItemComponent = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null); 
  const [userRole, setUserRole] = useState(null); 

  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const currentUserId = getCookie("userId");
    const currentUserRole = getCookie("userRole");
    
    if (currentUserId) setUserId(currentUserId);
    if (currentUserRole) setUserRole(currentUserRole);

    const fetchFoodItems = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/food`, {
          withCredentials: true
        });
        const data = res.data?.item || res.data;
        if (Array.isArray(data)) {
          setFoodItems(data);
        }
      } catch (error) {
        console.error("Critical: Layout stream error ->", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto h-screen bg-black flex items-center justify-center border-x border-zinc-900">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-black border-x border-zinc-900 overflow-y-scroll snap-y snap-mandatory scrollbar-none antialiased">
      
      {/* Dynamic Reel Stream Engine */}
      {foodItems.length > 0 ? (
        <div className="w-full h-full">
          {foodItems.toReversed().map((item) => (
            <div key={item._id} className="w-full h-full snap-start snap-always">
              <VideoReel item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center select-none">
          <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-zinc-200 tracking-wide uppercase">Feed Empty</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-60">No premium content matches your dynamic stream filter.</p>
        </div>
      )}

      {/* Global Interface Navigation Element */}
      <Navigation />
    </div>
  );
};

export default FetchFoodItemComponent;