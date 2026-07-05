"use server"; 

import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from "next/navigation";

export async function deleteFoodPartnerAction() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const token = cookieStore.get("token")?.value;
    const userRole = cookieStore.get("userRole")?.value;
    console.log("Server Action Triggered for ID:", userId);

    if (!userId || !token || !userRole) {
        return { error: "Session expired. Please login again." };
    }

    let successRedirect = false;

    try {
        const res = await axios.delete(
            userRole === "food-partner" ? (
                 `${process.env.NEXT_PUBLIC_API_URL}/api/food-partner/delete/${userId}`
            ) : (
                 `${process.env.NEXT_PUBLIC_API_URL}/api/user/delete/${userId}`
            )
           ,
            {
                withCredentials: true,
                headers : {
                    Cookie : `token=${token}; userId=${userId}; userRole=${userRole}`
                }
             }
        );
        
        console.log("Backend Response Status:", res.status);
        console.log("Backend Response Data:", res.data);

        // Agar response success hai ya status 200 hai
        if (res.status === 200 || res.data?.success) {
            // Clear cookies on server side
            cookieStore.delete("userId");
            cookieStore.delete("token");
            cookieStore.delete("userRole");
            
            successRedirect = true;
        } else {
            return { error: "Backend failed to delete account." };
        }

    } catch (error) {
        console.log("Account deletion failed:", error.response?.data || error.message);
        return {
            error: error.response?.data?.message || "Failed to delete account from backend.",
        };
    }

    // Next.js standard: Redirect MUST be outside try-catch
    if (successRedirect) {
        return {success : true}
    }
}