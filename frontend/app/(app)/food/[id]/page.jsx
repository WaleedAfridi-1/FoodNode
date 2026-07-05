"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import LikeButton from "@/components/likeButton";
import SaveIcon from "@/components/SaveIcon";
import Cookies from "js-cookie";
import DeleteDialog from "@/components/DeleteDialog";

const FoodItemPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const userId = Cookies.get('userId');
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  // Dynamic Infrastructure States
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [saveCounts, setSaveCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchSingleVideo = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/food/${id}`,
          { withCredentials: true },
        );

        const foodData = res.data?.item || res.data;
        setItem(foodData);

        setIsLiked(foodData.isLiked || false);
        setLikesCount(foodData.likeCount || 0);
        setIsSaved(foodData.isSaved || false);
        setSaveCount(foodData.saveCounts || 0);
      } catch (error) {
        console.error("Critical: Data pipeline connection loss ->", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSingleVideo();
  }, [id]);

  useEffect(() => {
    if (videoRef.current && item) {
      videoRef.current
        .play()
        .catch((err) => console.log("Stream play request deferred ->", err));
    }
  }, [item]);

  const handleLike = async (e) => {
    e.stopPropagation();
    const oldIsLiked = isLiked;
    const oldLikesCount = likesCount;

    try {
      setIsLiked(!oldIsLiked);
      setLikesCount((prev) => (oldIsLiked ? prev - 1 : prev + 1));

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/food/like/${item._id}`,
        { withCredentials: true },
      );
      if (res.data && typeof res.data.like !== "undefined") {
        const backendLiked = res.data.like;
        setIsLiked(backendLiked);
        setLikesCount(() => {
          if (backendLiked) {
            return oldIsLiked ? oldLikesCount : oldLikesCount + 1;
          } else {
            return oldIsLiked ? oldLikesCount - 1 : oldLikesCount;
          }
        });
      }
    } catch (error) {
      console.error("Interaction layer sync failed:", error);
      setIsLiked(oldIsLiked);
      setLikesCount(oldLikesCount);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    const oldIsSaved = isSaved;
    const oldSavedCounts = saveCounts;

    try {
      setIsSaved(!oldIsSaved);
      setSaveCount((prev) => (oldIsSaved ? prev - 1 : prev + 1));

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/food/save/${item._id}`,
        { withCredentials: true },
      );

      if (res.data && typeof res.data.saved !== "undefined") {
        const backendIsSaved = res.data.saved;
        setIsSaved(backendIsSaved);
        setSaveCount(() => {
          if (backendIsSaved) {
            return oldIsSaved ? oldSavedCounts : oldSavedCounts + 1;
          } else {
            return oldIsSaved ? oldSavedCounts - 1 : oldSavedCounts;
          }
        });
      }
    } catch (error) {
      console.error("Save system layer sync sync failure:", error.message);
      setIsSaved(oldIsSaved);
      setSaveCount(oldSavedCounts);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/food/delete/${item._id}`,
        { withCredentials: true },
      );

      if (res.status === 200) {
        toast.success("Food item deleted successfully.");
        router.back();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete item.");
    }
  };

  const handleBack = () => {
    if (item && item.foodPartner) {
      router.push(`/food-partner/${item.foodPartner}`);
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto h-screen bg-black flex items-center justify-center border-x border-zinc-900">
        <div className="w-6 h-6 border-2 border-zinc-500 border-t-zinc-50 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full max-w-md mx-auto h-screen bg-black border-x border-zinc-900 flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-zinc-500 font-medium tracking-wide">STREAM METADATA MISSING</p>
        <button
          onClick={() => router.back()}
          className="mt-4 border border-zinc-800 text-zinc-200 text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-md hover:bg-zinc-900 transition-colors active:scale-95"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen bg-black border-x border-zinc-900 relative flex items-center justify-center overflow-hidden antialiased select-none">
      
      {/* 1. BACK INTERFACE CONTEXT BUTTON */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-50 bg-black/80 border border-zinc-800/80 text-zinc-200 p-2.5 rounded-md shadow-2xl flex items-center justify-center transition-all hover:bg-zinc-900 hover:text-zinc-50 active:scale-95 cursor-pointer"
        aria-label="Navigate back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>

      {/* 2. REEL CAPTURE ENGINE PIPELINE */}
      <video
        ref={videoRef}
        src={item.video}
        className="w-full h-full object-cover z-10"
        loop
        playsInline
        onClick={() => {
          if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }
        }}
      />

      {/* 3. PREMIUM MINIMALIST VERTICAL ACTION ROW */}
      <div className="absolute z-50 flex flex-col items-center space-y-5 w-max right-4 bottom-35">
        
        <div className="flex flex-col items-center justify-center transition-transform active:scale-95">
          <LikeButton handleLike={handleLike} isLiked={isLiked} likesCount={likesCount} />
        </div>

        <div className="flex flex-col items-center justify-center transition-transform active:scale-95">
          <SaveIcon handleSave={handleSave} isSaved={isSaved} saveCounts={saveCounts} />
        </div>

        {/* SECURE TRASH RETRIEVAL UNIT */}
        {item.foodPartner === userId && (
          <div className="flex flex-col items-center justify-center group mt-1">
            <DeleteDialog onDelete={handleDelete}>
              <button className="bg-black/80 border border-zinc-800/80 p-3 rounded-md text-zinc-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/20 transition-all active:scale-90 shadow-2xl cursor-pointer flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.34 9m-4.72 0l-.34-9M3 6.75h18M5.75 6.75l.75 12c.07.82.76 1.45 1.59 1.45h7.82c.83 0 1.52-.63 1.59-1.45l.75-12M9.75 6.75V4.5A1.5 1.5 0 0111.25 3h1.5A1.5 1.5 0 0114.25 4.5v2.25"
                  />
                </svg>
              </button>
            </DeleteDialog>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-1 group-hover:text-red-400 transition-colors">
              Delete
            </span>
          </div>
        )}
      </div>

      {/* 4. SOLID SHADOW OVERLAY WITH STRUCTURAL TEXT HIERARCHY */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pt-24 bg-linear-to-t from-black via-black/80 to-transparent flex flex-col space-y-1.5 pb-24 z-20 pointer-events-none">
        <h2 className="text-lg font-bold text-zinc-50 tracking-wide drop-shadow-md select-text pointer-events-auto">
          {item.name}
        </h2>
        <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-[88%] line-clamp-2 select-text pointer-events-auto drop-shadow-sm">
          {item.description || "No metadata description set for this content stream item."}
        </p>
      </div>

      {/* GLOBAL FOOTER FRAMEWORK LAYER */}
      <Navigation />
    </div>
  );
};

export default FoodItemPage;