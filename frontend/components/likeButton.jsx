import React from "react";

const LikeButton = ({handleLike, isLiked, likesCount}) => {
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLike}
        className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/60 p-3 rounded-full text-white hover:bg-zinc-800/80 transition active:scale-90 shadow-2xl cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isLiked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-5 h-5 transition-colors duration-200 ${
            isLiked
              ? "text-red-500 stroke-red-500"
              : "text-white hover:text-red-400"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
      <span className="text-[11px] font-semibold text-zinc-200 mt-1 drop-shadow-md">
        {likesCount}
      </span>
    </div>
  );
};

export default LikeButton;
