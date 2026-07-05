"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonCard() {
  return (
    <div className="w-full max-w-md mx-auto h-screen bg-black relative overflow-hidden select-none">
      
      {/* 🎬 Main Video Background Skeleton */}
      <Skeleton className="w-full h-full bg-zinc-900 animate-pulse" />

      {/* 🔴 Right Side Side-Bar (Like, Comment, Share Icons Placeholder) */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 z-10">

        {/* Like Button */}
        <div className="flex flex-col items-center space-y-1">
          <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
          <Skeleton className="h-3 w-6 bg-zinc-800 rounded" />
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center space-y-1">
          <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
          <Skeleton className="h-3 w-6 bg-zinc-800 rounded" />
        </div>
      </div>

      {/* 📝 Bottom Left Content (Username, Description, Music Title Placeholder) */}
      <div className="absolute left-4 bottom-8 right-20 space-y-3 z-10">
        {/* User Handle (@username) */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-32 bg-zinc-800 rounded" />
          <Skeleton className="h-5 w-16 bg-orange-600/30 rounded-full" /> {/* Follow button placeholder */}
        </div>
        
        {/* Video Description Lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-zinc-800 rounded" />
          <Skeleton className="h-4 w-3/4 bg-zinc-800 rounded" />
        </div>

        {/* Music / Audio Track bar */}
        <div className="flex items-center space-x-2 pt-1">
          <Skeleton className="w-4 h-4 rounded-full bg-zinc-800" />
          <Skeleton className="h-3 w-1/2 bg-zinc-800 rounded" />
        </div>
      </div>

      {/* 🎵 Spinning Vinyl/Audio Record Disc Placeholder (Bottom Right) */}
      <div className="absolute right-4 bottom-6 z-10">
        <Skeleton className="w-10 h-10 rounded-full bg-zinc-800 animate-spin animation-duration-[4s]" />
      </div>

    </div>
  )
}