"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const EditPage = () => {
  const userId = Cookies.get("userId");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // States for form fields
  const [fName, setFName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // States for optional image upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const editFoodPartner = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/food-partner/edit/${userId}`,
          { withCredentials: true },
        );

        console.log("Response Data", res.data);

        if (res.status === 200) {
          const foodPartner = res.data.foodPartner;

          if (foodPartner) {
            setFName(foodPartner.fName);
            setBusinessName(foodPartner.businessName);
            setAddress(foodPartner.address);
            setPhone(foodPartner.phone);
            setEmail(foodPartner.email);
            if (foodPartner.image) {
              setImageFile(foodPartner.image);
            }
          }
        }
      } catch (error) {
        console.log("Error:", error.message);
      }
    };

    if (userId) {
      editFoodPartner();
    }
  }, [userId]);

  // Handle Image Selection & Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fName", fName);
      formData.append("businessName", businessName);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("email", email);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/food-partner/update/${userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (res.status === 200) {
        toast.success("Profile Updated Successfully.");
        router.push(`/food-partner/${userId}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "TRANSACTION FAILED. VERIFY REQ LOAD.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 antialiased py-12 px-4 select-none">
      <div className="w-full max-w-md mx-auto bg-zinc-950/40 border border-zinc-900 rounded-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 relative">
        
        {/* Navigation / Header Architecture */}
        <div className="flex justify-between items-baseline border-b border-zinc-900 pb-4">
          <button
            onClick={() => router.back()}
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-100 font-mono">
            Edit Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 📸 High-Contrast Image Config Panel */}
          <div className="flex flex-col items-center space-y-3 bg-zinc-900/10 border border-dashed border-zinc-900 p-4 rounded-md">
            <div className="relative h-20 w-20 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover "
                />
              ) : imageFile && typeof imageFile === "string" ? (
                <img 
                  src={imageFile} 
                  alt="Current Profile" 
                  className="h-full w-full object-cover "
                />
              ) : (
                <div className="text-[10px] font-mono text-zinc-700 uppercase">No Image</div>
              )}
            </div>

            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded-md cursor-pointer transition-all active:scale-[0.98]">
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* 📝 Inputs Matrix System */}
          <div className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Full Name 
              </label>
              <input
                type="text"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                placeholder="Operator Full Name"
                required
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md px-3 py-2 text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
              />
            </div>

            {/* Business Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., BRAND_NAME_STUDIO"
                required
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md px-3 py-2 text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@network.com"
                required
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md px-3 py-2 text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 XXXXXXXXXX"
                required
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md px-3 py-2 text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Complete coordinate address metadata here..."
                required
                rows="3"
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-md px-3 py-2 text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Action Execution Controller */}
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
  );
};

export default EditPage;