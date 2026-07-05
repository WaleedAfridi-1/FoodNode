"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UserLoginPageComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/login`,
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
      if (res.ok) {
        toast.success(data.message)
        setEmail("");
        setPassword("");
        router.push("/");
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-black px-6 py-12 antialiased selection:bg-zinc-800 selection:text-white select-none">
      <div className="mx-auto w-full max-w-md">
        
        {/* Brand / Logo Area - Solid Linear Architecture */}
        <div className="flex flex-col mb-8 border-b border-zinc-900 pb-6">
          <div className="h-6 w-6 bg-zinc-100 rounded-sm flex items-center justify-center mb-4 shadow-sm">
            <div className="h-2 w-2 bg-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-50">
            Login your account
          </h1>
          <p className="text-xs text-zinc-500 mt-2 tracking-tight leading-relaxed">
            Enter your details below to get started with your workspace.
          </p>
        </div>

        {/* High-Contrast Card Component */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)]">
          <form className="space-y-5" onSubmit={handleLogin}>
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
              >
                Email Address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                >
                  Password
                </label>
              </div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                required
              />
            </div>

            {/* Form Actions - Monochrome Trigger Block */}
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

        {/* Traversal Context / Routing Anchors */}
        <p className="text-center font-mono text-[11px] text-zinc-600 tracking-wide mt-8 space-y-2.5 flex flex-col">
          <span>
            Don't have an account?{" "}
            <Link
              href="/user/register"
              className="font-bold text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-4 decoration-zinc-800"
            >
              Register here
            </Link>
          </span>
          <span>
            Are you a business partner?{" "}
            <Link
              href="/food-partner/login" 
              className="font-bold text-zinc-400 hover:text-zinc-100 transition-colors underline underline-offset-4 decoration-zinc-800"
            >
              Go to Food Partner Login
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserLoginPageComponent;