"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import LikeButton from "./likeButton";
import SaveIcon from "./SaveIcon";
import Navigation from "./Navigation";

const VideoReel = ({ item }) => {
  const videoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current
            .play()
            .catch((err) => console.log("Autoplay blocked:", err));
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const handleStoreClick = () => {
    if (item.foodPartner) {
      router.push(`/food-partner/${item.foodPartner}`);
    } else {
      console.log("No food partner linked to this item");
    }
  };

  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const [likesCount, setLikesCount] = useState(item.likeCount || 0);
  const [isSaved, setIsSaved] = useState(item.isSaved || false);
  const [saveCounts, setSaveCount] = useState(item.saveCounts || 0);

  const handleLike = async (e) => {
    e.stopPropagation();

    const oldIsLiked = isLiked;
    const oldLikesCount = likesCount;

    try {
      setIsLiked(!oldIsLiked);
      setLikesCount((prev) => (oldIsLiked ? prev - 1 : prev + 1));

      // 2. Backend API Call
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
      console.error("Like toggle failed:", error);
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
      console.log(" Save toggle failed:", error.message);
      setIsSaved(oldIsSaved);
      setSaveCount(oldSavedCounts);
    }
  };

  return (
    <div className="w-full h-screen bg-black shrink-0 relative snap-start flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={item.video}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted
        onClick={() => {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }}
      />

      <div
        className="absolute z-50 flex flex-col items-center space-y-6 w-max"
        style={{
          bottom: "130px",
          right: "16px",
          left: "auto",
          transform: "none",
        }}
      >
        {/* LIKE BUTTON */}
        <LikeButton
          handleLike={handleLike}
          isLiked={isLiked}
          likesCount={likesCount}
        />
        {/* 🔖 SAVE BUTTON */}
        <SaveIcon
          handleSave={handleSave}
          isSaved={isSaved}
          saveCounts={saveCounts}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col space-y-3 pb-16 z-40">
        {/* Food Name & Description */}
        <div className="space-y-1 max-w-[75%]">
          {" "}
          <h2 className="text-xl font-bold text-white tracking-wide">
            {item.name}
          </h2>
          <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* 🛒 View Store Button */}
        <button
          onClick={handleStoreClick}
          className="w-full sm:w-auto self-start mb-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs tracking-wide py-2.5 px-5 rounded-full shadow-lg shadow-orange-500/30 active:scale-[0.97] transition duration-150 flex items-center justify-center space-x-2 group cursor-pointer"
        >
          {/* ✨ Premium Minimalist Cart Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" // Hover karne par cart thoda sa aage move hoga
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>

          <span>View Store</span>
        </button>
      </div>

      <Navigation />
    </div>
  );
};

export default VideoReel;
