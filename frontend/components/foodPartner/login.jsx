"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FoodPartnerLoginPageComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/food-partner/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();
      console.log(data)
      if (res.ok) {
        setTimeout(() => {
          toast.success(data.message || "Logged in successfully!");
        }, 1000);
        setEmail("");
        setPassword("");
        router.push(`/food-partner/${data.foodPartnerExist._id}`);
      } else {
        toast.error(data.message || data.error || "Invalid email or password!");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-black px-6 py-12 antialiased selection:bg-zinc-800 selection:text-white select-none">
      <div className="mx-auto w-full max-w-md">
        
        {/* Brand Architecture Header - Pure Monochromatic Box */}
        <div className="flex flex-col mb-8 border-b border-zinc-900 pb-6">
          <div className="h-6 w-6 bg-zinc-100 rounded-sm flex items-center justify-center mb-4 shadow-sm">
            <div className="h-2 w-2 bg-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-50">
            Partner Workspace
          </h1>
          <p className="text-xs text-zinc-500 mt-2 tracking-tight leading-relaxed">
            Log in to manage your kitchen, and business.
          </p>
        </div>

        {/* Minimalist High-Contrast Form Wrapper */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Input Element: Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Registered Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="partner@yourbusiness.com"
                className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                required
              />
            </div>

            {/* Input Element: Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                required
              />
            </div>

            {/* Solid Functional Form Controller */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-zinc-50 hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-bold text-xs uppercase tracking-widest py-3 rounded-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-zinc-500 border-t-zinc-950 rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Navigation / Secondary Route Options */}
        <p className="text-center font-mono text-[11px] text-zinc-600 tracking-wide mt-8 space-y-2.5 flex flex-col">
          <span>
            New to the platform?{" "}
            <Link href="/food-partner/register" className="font-bold text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-4 decoration-zinc-800">
              Register your Kitchen
            </Link>
          </span>
          <span>
            Are you a customer?{" "}
            <Link href="/user/login" className="font-bold text-zinc-400 hover:text-zinc-100 transition-colors underline underline-offset-4 decoration-zinc-800">
              Go to User Login
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerLoginPageComponent;