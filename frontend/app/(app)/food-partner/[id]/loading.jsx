"use client"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090b] antialiased py-10 px-4">
      <div className="max-w-md mx-auto bg-[#121214] border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative animate-pulse">
        
        {/* ⬅ Back Button Placeholder */}
        <Skeleton className="absolute left-6 top-6 h-4 w-12 bg-zinc-800" />

        {/* 🎯 Title Placeholder */}
        <div className="flex justify-center mt-2 mb-8">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
        </div>

        <div className="space-y-6">
          {/* 📸 Profile Image Upload Placeholder */}
          <div className="flex flex-col items-center space-y-3">
            {/* Circle Photo */}
            <Skeleton className="h-24 w-24 rounded-full bg-zinc-800 border-2 border-zinc-700/50" />
            {/* Upload Button Pill */}
            <Skeleton className="h-7 w-48 rounded-full bg-zinc-800/60" />
          </div>

          {/* 📝 Inputs Section Placeholders */}
          <div className="space-y-4">
            
            {/* 1. Full Name */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 bg-zinc-800" /> {/* Label */}
              <Skeleton className="w-full h-10.5 bg-zinc-900/60 rounded-xl border border-zinc-800/50" /> {/* Input */}
            </div>

            {/* 2. Business Name */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-zinc-800" />
              <Skeleton className="w-full h-10.5 bg-zinc-900/60 rounded-xl border border-zinc-800/50" />
            </div>

            {/* 3. Email Address */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-zinc-800" />
              <Skeleton className="w-full h-10.5 bg-zinc-900/60 rounded-xl border border-zinc-800/50" />
            </div>

            {/* 4. Phone Number */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-zinc-800" />
              <Skeleton className="w-full h-10.5 bg-zinc-900/60 rounded-xl border border-zinc-800/50" />
            </div>

            {/* 5. Shop/Restaurant Address */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-36 bg-zinc-800" />
              <Skeleton className="w-full h-21.5 bg-zinc-900/60 rounded-xl border border-zinc-800/50" /> {/* Textarea */}
            </div>
          </div>

          {/* 🚀 Save Changes Button Placeholder */}
          <Skeleton className="w-full h-12 mt-2 bg-zinc-800 rounded-xl" />
        </div>

      </div>
    </div>
  )
}