"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UserEditProfile = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const userId = Cookies.get("userId");
  useEffect(() => {
    const getProfileData = async () => {
      if (userId) {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/${userId}/edit`,
            { withCredentials: true },
          );

          if (res.status === 200 && res.data.user) {
            setEmail(res.data.user.email || "");
            setName(res.data.user.fName || "");
            if (res.data.user.image) {
              setImageFile(res.data.user.image);
            }
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    if (userId) getProfileData();
  }, [userId]);

  const updatedProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fName", name);
      formData.append("email", email);

      if (imageFile && typeof imageFile !== "string") {
        formData.append("image", imageFile);
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/${userId}/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        router.push(`/user/profile/${userId}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased py-12 px-6 selection:bg-zinc-800 selection:text-white select-none">
      <div className="max-w-md mx-auto relative">
        
        {/* Navigation & Header Section - Linear Border Layout */}
        <div className="flex flex-col mb-8 border-b border-zinc-900 pb-6 relative">
          <button
            onClick={() => router.push(`/user/profile/${userId}`)}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer mb-6 self-start tracking-tight"
          >
            &larr; BACK TO PROFILE
          </button>
          
          <h1 className="text-xl font-bold tracking-tight text-zinc-50">
            Edit Profile
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5 tracking-tight leading-relaxed">
            Modify your credentials and identity profile details.
          </p>
        </div>

        {/* High-Contrast Dynamic Form Wrapper */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)]">
          <form onSubmit={updatedProfile} className="space-y-6">
            
            {/* Minimalist Profile Image Block */}
            <div className="flex flex-col items-center space-y-4 border-b border-zinc-900 pb-6">
              <div className="relative h-20 w-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center overflow-hidden shadow-md">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : imageFile && typeof imageFile === "string" ? (
                  <img
                    src={imageFile}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-zinc-500 font-mono uppercase">
                    {name ? name[0] : "U"}
                  </span>
                )}
              </div>

              <label className="text-[10px] font-bold text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors bg-zinc-900/60 px-3 py-2 rounded-sm border border-zinc-800 uppercase tracking-wider">
                Change Profile Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Form Fields Elements */}
            <div className="space-y-5">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter full name"
                  required
                  className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                />
              </div>
            </div>

            {/* Action Trigger Block */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-50 hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-bold text-xs uppercase tracking-widest py-3 rounded-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-zinc-500 border-t-zinc-950 rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default UserEditProfile;