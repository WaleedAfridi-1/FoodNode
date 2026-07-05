import React from "react";
import Link from "next/link";
import axios from "axios";
import { cookies } from "next/headers";
import VideoGridCard from "@/components/VideoGridCard";
import jwt from "jsonwebtoken";
import Navigation from "@/components/Navigation";
import HandleLogoutClick from "@/components/Logout";
import { AlertDialogDemo } from "@/components/DeleteUser";
import { deleteFoodPartnerAction } from "@/components/DeleteFoodPartner";

// Server-side Data Fetching Function
async function getProfileData(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/food-partner/${id}`,
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log("Error fetching partner profile:", error.message);
    return null;
  }
}

const FoodPartnerIDPage = async ({ params }) => {
  const { id } = await params;
  const data = await getProfileData(id);

  if (!data || !data.foodPartner) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-600 font-mono text-xs tracking-wider">
        <p> PROFILE DATA NOT FOUND.</p>
      </div>
    );
  }

  const { foodPartner, foodItems } = data;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userRole = cookieStore.get("userRole")?.value;
  let loggedInUserId = null;

  if (token) {
    try {
      const decoded = jwt.decode(token);
      loggedInUserId = decoded?.id || decoded?._id;
    } catch (err) {
      console.log("Token decode error:", err.message);
    }
  }

  const isOwner = loggedInUserId === id && userRole === "food-partner";

  return (
    <div className="min-h-screen pb-28 bg-black text-zinc-200 antialiased select-none relative">
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* 1. TOP HEADER ARCHITECTURE */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <h2 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-mono">
            / PARTNER_PROFILE
          </h2>
          {/* Top Right Actions Grid */}
          <div className="flex items-center gap-3">
            {isOwner && (
              <div className="flex items-center gap-3 text-zinc-500 hover:text-zinc-300 transition-colors">
                {/* Permanent Delete Account Trigger */}
                <AlertDialogDemo userRole={"food-partner"} handleDeleteUser={deleteFoodPartnerAction}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 cursor-pointer hover:text-red-400 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    />
                  </svg>
                </AlertDialogDemo>

                {/* Logout Trigger */}
                <HandleLogoutClick />
              </div>
            )}
          </div>
        </div>

        {/* 2. PROFILE DETAILS METRIC BLOCK */}
        <div className="flex flex-col items-center space-y-5">
          {foodPartner.image ? (
            <div className="h-20 w-20 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950">
              <img
                className="h-full w-full object-cover  contrast-125"
                src={foodPartner.image}
                alt={foodPartner.businessName || "Food Partner"}
              />
            </div>
          ) : (
            <div className="h-20 w-20 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center">
              <span className="text-xl font-mono font-bold text-zinc-400 uppercase">
                {foodPartner.businessName ? foodPartner.businessName[0] : "F"}
              </span>
            </div>
          )}

          {/* Name & Identifier Metadata */}
          <div className="w-full flex flex-col items-center relative text-center">
            <h1 className="text-lg font-bold tracking-tight text-zinc-100 max-w-70 truncate uppercase">
              {foodPartner.businessName}
            </h1>

            <p className="text-[11px] font-mono tracking-tight text-zinc-500 mt-0.5">
              @{foodPartner.fName.toLowerCase().replace(/\s+/g, "")}
            </p>

            {isOwner && (
              <Link href={`/food-partner/${loggedInUserId}/edit`} className="mt-3">
                <button className="px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.97] transition-all cursor-pointer">
                  EDIT
                </button>
              </Link>
            )}
          </div>

          {/* Core Analytics Matrix */}
          <div className="grid grid-cols-2 bg-zinc-950/40 border border-zinc-900 rounded-md w-full divide-x divide-zinc-900 text-center py-3">
            <div>
              <span className="block text-sm font-bold font-mono text-zinc-200">
                {foodItems.length}
              </span>
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mt-0.5">
                Videos
              </span>
            </div>
            <div>
              <span className="block text-sm font-mono text-zinc-400 truncate px-2 uppercase">
                {foodPartner.role || "PARTNER"}
              </span>
              <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block mt-0.5">
                System Registry
              </span>
            </div>
          </div>

          {/* Data Attributes Container */}
          <div className="w-full bg-zinc-950/20 border border-zinc-900/60 rounded-md p-4 space-y-2 text-xs font-mono tracking-tight">
            <div className="flex items-start gap-3">
              <span className="text-zinc-600 font-bold uppercase w-16 select-none">LOCATION:</span>
              <p className="text-zinc-400 leading-normal flex-1">{foodPartner.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-600 font-bold uppercase w-16 select-none">TELEPHONE:</span>
              <p className="text-zinc-400 flex-1">{foodPartner.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-600 font-bold uppercase w-16 select-none">EMAIL:</span>
              <p className="text-zinc-400 flex-1 truncate">{foodPartner.email}</p>
            </div>
          </div>
        </div>

        {/* 3. CORE FEED TAB MATRIX */}
        <div className="flex border-b border-zinc-900">
          <div className="pb-2 border-b border-zinc-300 px-2 text-[10px] font-bold text-zinc-100 tracking-widest uppercase font-mono flex items-center gap-1.5">
            <span>VIDEOS</span>
            <span className="text-[9px] px-1 bg-zinc-900 text-zinc-500 font-mono rounded">{foodItems.length}</span>
          </div>
        </div>

        {/* 4. CONTENT GRID PIPELINE */}
        {foodItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 pb-10">
            {foodItems.toReversed().map((item) => (
              <VideoGridCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-950/40 border border-dashed border-zinc-900 rounded-md font-mono">
            <p className="text-xs text-zinc-600 tracking-wide uppercase"> NO VIDEOS AVAILABLE</p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
};

export default FoodPartnerIDPage;