import React from "react";
import Link from "next/link";
import axios from "axios";
import { cookies } from "next/headers";
import HandleLogoutClick from "@/components/Logout";
import Navigation from "@/components/Navigation";
import { AlertDialogDemo } from "@/components/DeleteUser";
import { deleteFoodPartnerAction } from "@/components/DeleteFoodPartner";

// Server-side data fetching function
async function getUserProfile(id) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/${id}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      },
    );

    return res.data;
  } catch (error) {
    console.log("Error fetching user profile:", error.message);
    return null;
  }
}

const UserProfilePage = async ({ params }) => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  const { id } = await params;
  const userData = await getUserProfile(id);

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-600 font-mono text-xs tracking-wider">
        <p>SYSTEM_ERROR: USER NODE ACCESS DENIED OR ARCHIVE NOT FOUND.</p>
      </div>
    );
  }

  const user = userData.user || userData;

  return (
    <div className="min-h-screen bg-black text-zinc-200 antialiased flex items-center justify-center px-4 select-none">
      <div className="w-full max-w-md bg-zinc-950/40 border border-zinc-900 rounded-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6">
        
        {/* Top Control Utility Bar */}
        <div className="flex w-full justify-between items-center border-b border-zinc-900 pb-4">
          <HandleLogoutClick />

          <AlertDialogDemo userRole={"user"} handleDeleteUser={deleteFoodPartnerAction}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-zinc-500 hover:text-red-400 cursor-pointer transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </AlertDialogDemo>
        </div>

        {/* Navigation Action Path */}
        <div className="flex justify-start">
          <Link
            href="/"
            className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← BACK HOME
          </Link>
        </div>

        {/* 👤 Geometrical User Identity Area */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden flex items-center justify-center shadow-inner">
            {user.image ? (
              <img src={user.image} alt="" className="h-full w-full object-cover " />
            ) : (
              <span className="text-xl font-bold font-mono text-zinc-400 uppercase">
                {user.fName ? user.fName[0] : "U"}
              </span>
            )}
          </div>

          <div className="w-full flex flex-col items-center relative space-y-2">
            <h1 className="text-lg font-bold tracking-tight text-zinc-100 uppercase">
              {user.fName}
            </h1>

            {/* Config Trigger */}
            {userId === id && (
              <Link href={`/user/profile/${userId}/edit`}>
                <button className="px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.97] transition-all cursor-pointer">
                  EDIT
                </button>
              </Link>
            )}

            <div className="pt-1">
              <span className="text-[9px] font-bold font-mono tracking-widest text-zinc-500 bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded uppercase">
                ROLE: {user.role || "USER"}
              </span>
            </div>
          </div>
        </div>

        {/* 📝 Telemetry Data Core */}
        <div className="space-y-2 font-mono text-xs tracking-tight">
          <div className="flex justify-between items-center bg-zinc-950/20 p-3 rounded-md border border-zinc-900/60">
            <span className="text-zinc-600 font-bold uppercase">[EMAIL]</span>
            <span className="text-zinc-300 text-xs">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between items-center bg-zinc-950/20 p-3 rounded-md border border-zinc-900/60">
            <span className="text-zinc-600 font-bold uppercase">[USER ID]</span>
            <span className="text-zinc-400 text-[11px] select-all truncate max-w-45">
              {user._id}
            </span>
          </div>
        </div>

      </div>
      <Navigation />
    </div>
  );
};

export default UserProfilePage;