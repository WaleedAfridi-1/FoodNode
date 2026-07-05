"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CreateFoodItem = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setMessage({type: "error", text: "Please select a valid video file!"});
        return;
      }
      setVideoFile(file);
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !videoFile) {
      setMessage({  type: "error", text: "All fields are required!" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("video", videoFile); 

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/food`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      
      if (res.status === 200 || res.status === 201) {
        setMessage({ type: "success", text: "Reel Shared successfully!" });
        setName("");
        setDescription("");
        setVideoFile(null);
        
        setTimeout(() => {
          router.push(`/food-partner/${res.data.foodItem.foodPartner}`);
        }, 1500);
      }
    } catch (error) {
      setMessage({ 
           type: "error",
        text: error.response?.data?.message || "Failed to create food item. Try again!"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-zinc-200 flex items-center justify-center px-4 py-12 antialiased select-none">
      <div className="w-full max-w-md bg-zinc-950/40 border border-zinc-900 rounded-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
        
        {/* Header Architecture */}
        <div className="flex justify-between items-baseline border-b border-zinc-900 pb-4">
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-100">Create Food Reel</h1>
          <Link href="/" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors">
            Cancel
          </Link>
        </div>

        {/* System Logs / Alerts */}
        {message.text && (
          <div className={`px-4 py-3 rounded-md text-[11px] font-mono tracking-wide border ${
            message.type === "error" 
              ? "bg-red-950/10 border-red-900/30 text-red-400" 
              : "bg-zinc-900/50 border-zinc-800 text-green-500"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. Name Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Food Name</label>
            <input
              type="text"
              placeholder="e.g., SPICY CHICKEN BIRYANI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md px-3 py-2 text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
              required
            />
          </div>

          {/* 2. Description Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
            <textarea
              rows="3"
              placeholder="Enter contextual caption parameters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md px-3 py-2 text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all resize-none leading-relaxed"
              required
            ></textarea>
          </div>

          {/* 3. High-Contrast File Matrix Dropzone */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Video Content Stream Payload</label>
            <div className={`relative w-full border rounded-md p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              videoFile 
                ? "bg-zinc-900/20 border-zinc-400" 
                : "bg-zinc-900/10 border-dashed border-zinc-800 hover:border-zinc-700"
            }`}>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
              />
              
              {/* Terminal Style File Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 mb-2 transition-colors ${videoFile ? "text-zinc-200" : "text-zinc-600"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>

              <p className={`text-xs font-mono font-medium tracking-tight max-w-65 truncate ${videoFile ? "text-zinc-200" : "text-zinc-500"}`}>
                {videoFile ? videoFile.name : "SELECT OR DROP VIDEO TARGET"}
              </p>
              <p className="text-[9px] font-bold tracking-wider uppercase text-zinc-600 mt-1">MAX BOUNDARY SUGGESTION: 50MB</p>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-50 hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-bold text-xs uppercase tracking-widest py-3 rounded-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-zinc-500 border-t-zinc-950 rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              "Upload"
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateFoodItem;