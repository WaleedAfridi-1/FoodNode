"use client";

;
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"send" | "verify">("send");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  // 1. Send OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/otp/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessage({ text: "OTP code sent to your email!", isError: false });
      setStep("verify");
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP Request
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include", 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid or expired OTP");

      // Save the validation payload securely
      sessionStorage.setItem("email_token", data.verificationToken);
      sessionStorage.setItem("verified_email", email);

      toast.success("Verification successful! Opening registration form...");
      router.push("/food-partner/register");

      setMessage({
        text: "Email verified successfully! Redirecting...",
        isError: false,
      });
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-6 border border-zinc-800 bg-zinc-950 p-8 rounded-xl shadow-2xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {step === "send" ? "Verify your email" : "Enter security code"}
          </h1>
          <p className="text-sm text-zinc-400">
            {step === "send"
              ? "Enter your registered email to receive a 6-digit verification code."
              : `We sent a code to ${email}`}
          </p>
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm border ${
              message.isError
                ? "bg-red-950/30 border-red-900 text-red-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === "send" ? (
          /* Step 1: Send Email Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              type="email"
              placeholder="name@example.com"
              required
              disabled={loading}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-sm font-medium p-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending Code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          /* Step 2: Input OTP Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              required
              disabled={loading}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-center text-2xl font-bold tracking-widest rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black text-sm font-medium p-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setStep("send")}
              className="w-full text-zinc-400 hover:text-white text-xs transition-colors text-center block mt-2 cursor-pointer"
            >
              ← Change email address
            </button>
          </form>
        )}

        {/* 🔥 Clean Elegant Divider & Login Redirection Action */}
        <div className="pt-2 border-t border-zinc-900 space-y-4">
          <p className="text-center text-xs text-zinc-500">
            Already have an active partner account?
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/food-partner/login")}
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 text-sm font-medium p-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Login to Account
          </button>
        </div>

      </div>
    </div>
  );
}
