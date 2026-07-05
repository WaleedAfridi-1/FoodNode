"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import LogoutDialog from "./dialog";

export default function HandleLogoutClick() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const role = Cookies.get("userRole");
      let logoutRoute = "/api/auth/user/logout";

      if (role === "food-partner") {
        logoutRoute = "/api/auth/food-partner/logout";
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}${logoutRoute}`,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        if (role === "food-partner") {
          toast.success("Food-Partner Logout Successfully.");
          router.push("/food-partner/login");
        } else {
          toast.success("User Logout Successfully.");
          router.push("/user/login");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <LogoutDialog onLogout={handleLogout}>
      {/* The SVG is now passed inside the dialog component as children */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
        />
      </svg>
    </LogoutDialog>
  );
}