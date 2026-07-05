"use client";

import Link from "next/link";
// 1. useRef ko import karein
import React, { useState, useEffect, useRef } from "react"; 
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FoodPartnerRegistrationPageComponent = () => {
  const router = useRouter();
  // 2. Ek ref declare karein jo track rakhay ga ke redirect initiate ho chuka hai ya nahi
  const hasRedirected = useRef(false);

  const [fName, setFName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("email_token");
    const storedEmail = sessionStorage.getItem("verified_email");

    if (!token || !storedEmail) {
      // 3. Agar ref true hai (yani pehle hi redirect shuru ho chuka hai), to function yahin se return ho jaye
      if (hasRedirected.current) return;

      // Agar pehli baar chal raha hai, to ref ko true set karein aur toast chalayein
      hasRedirected.current = true;
      toast.error("Please verify your email address first.");
      router.push("/verify-email"); 
    } else {
      setVerificationToken(token);
      setEmail(storedEmail);
    }
  }, [router]); // dependency array mein router add karna standard practice hai

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/food-partner/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fName,
            businessName,
            phone,
            email, 
            address,
            password,
            verificationToken, 
          }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        sessionStorage.clear();
        router.push(`/food-partner/login`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-black px-6 py-12 antialiased selection:bg-zinc-800 selection:text-white select-none">
      <div className="mx-auto w-full max-w-lg">
        {/* Brand Architecture Header */}
        <div className="flex flex-col mb-8 border-b border-zinc-900 pb-6">
          <div className="h-6 w-6 bg-zinc-100 rounded-sm flex items-center justify-center mb-4 shadow-sm">
            <div className="h-2 w-2 bg-black" />
          </div>
          <h1 className="text-lg font-bold uppercase tracking-widest text-zinc-100 font-mono">
            Partner with us
          </h1>
          <p className="text-xs text-zinc-500 mt-2 tracking-tight">
            Register your kitchen or restaurant workspace to get started.
          </p>
        </div>

        {/* High-Contrast Layout Container */}
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-md p-6 shadow-[0_0_50px_rgba(0,0,0,0.85)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Row 1: Full Name & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="fName" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  id="fName"
                  type="text"
                  placeholder="e.g., K. O’Connor"
                  className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="businessName" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Business Name
                </label>
                <input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  id="businessName"
                  type="text"
                  placeholder="e.g., CENTRAL_KITCHEN_ALPHA"
                  className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                  required
                />
              </div>
            </div>

            {/* Row 2: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  id="phone"
                  type="tel"
                  placeholder="+92 XXX XXXXXXX"
                  className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Email
                </label>
                <input
                  value={email}
                  readOnly
                  tabIndex={-1}
                  id="email"
                  type="email"
                  placeholder="node@domain.com"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-md text-xs font-medium text-zinc-400 cursor-not-allowed focus:outline-none transition-all select-none"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label htmlFor="address" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                id="address"
                type="text"
                placeholder="HQ Complex, Block 4, Industrial Grid"
                className="w-full px-3 py-2 bg-zinc-900/40 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900/80 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Password
              </label>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-zinc-50 hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-500 font-bold text-xs uppercase tracking-widest py-3 rounded-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-zinc-500 border-t-zinc-950 rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[11px] text-zinc-600 tracking-wide mt-8">
          Already registered?{" "}
          <Link
            href="/food-partner/login"
            className="font-bold text-zinc-300 hover:text-zinc-100 transition-colors underline underline-offset-4 decoration-zinc-700"
          >
            LOGIN HERE
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FoodPartnerRegistrationPageComponent;