"use client";

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MailCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useVerifyOtpMutation } from "@/redux/api/UserApi";

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<{ otp?: string; email?: string }>({});

  // Pass-through data for "Change Email" back-link
  const userData = {
    name: searchParams.get("name") ?? "",
    username: searchParams.get("username") ?? "",
    phone: searchParams.get("phone") ?? "",
    password: searchParams.get("password") ?? "",
  };

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  useEffect(() => {
    const q = searchParams.get("email");
    if (q) setEmail(q);
  }, [searchParams]);

  // ── OTP box helpers ───────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only single digits
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    const next = [...otp];
    digits.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Invalid email format";
    const code = otp.join("");
    if (code.length < 6) next.otp = "Please enter all 6 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await verifyOtp({ email, otp: otp.join("") }).unwrap();
      toast.success("Email verified! You can now sign in.");
      router.replace("/login");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message ?? "OTP verification failed. Please try again.");
    }
  };

  const changeEmailQs = new URLSearchParams(userData).toString();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#191B1C]">
      {/* LEFT — image panel */}
      <div className="hidden md:block relative w-1/2">
        <img
          src="/cdwasa.jpg"
          alt="Dripside"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-10 left-10 z-10">
          <img
            src="/icons/nvwlogo.svg"
            alt="Dripside"
            className="h-8 object-contain mb-4"
          />
          <p
            className="text-[#F4F4ED]/70 uppercase text-[9px] leading-relaxed max-w-xs"
            style={{ fontFamily: "satoshi" }}
          >
            Dripside is a collaborative effort between the brand and artists,
            committed to supporting creative growth and fostering a vibrant
            community.
          </p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Icon + Heading */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#F42D23]/10 border border-[#F42D23]/20 flex items-center justify-center mb-5">
              <MailCheck size={22} className="text-[#F42D23]" />
            </div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/40 mb-1"
              style={{ fontFamily: "satoshi" }}
            >
              Almost there
            </p>
            <h1
              className="text-[#F4F4ED] text-4xl uppercase leading-none"
              style={{ fontFamily: "futuraCB" }}
            >
              Verify Email
            </h1>
            <p
              className="text-[#F4F4ED]/40 text-xs mt-2 leading-relaxed"
              style={{ fontFamily: "satoshi" }}
            >
              We sent a 6-digit code to{" "}
              <span className="text-[#F4F4ED]/70">{email || "your email"}</span>.
              Enter it below to confirm your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email (editable only if not locked from query) */}
            {!searchParams.get("email") && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="otp-email"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                  style={{ fontFamily: "satoshi" }}
                >
                  Email
                </label>
                <input
                  id="otp-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`
                    w-full h-11 px-4 rounded-xl
                    bg-white/5 border text-[#F4F4ED] text-sm
                    placeholder:text-[#F4F4ED]/25
                    outline-none transition-colors duration-200
                    focus:border-[#F42D23]
                    ${errors.email ? "border-red-500" : "border-white/10"}
                  `}
                  style={{ fontFamily: "satoshi" }}
                />
                {errors.email && (
                  <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                    {errors.email}
                  </span>
                )}
              </div>
            )}

            {/* OTP boxes */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                style={{ fontFamily: "satoshi" }}
              >
                One-time code
              </label>
              <div
                className="grid w-full max-w-[336px] grid-cols-6 gap-2"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`OTP digit ${i + 1}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`
                      h-12 w-full min-w-0 text-center rounded-xl
                      bg-white/5 border text-[#F4F4ED] text-xl font-medium
                      outline-none transition-colors duration-200
                      focus:border-[#F42D23] focus:bg-white/10 caret-[#F42D23]
                      ${errors.otp ? "border-red-500" : digit ? "border-white/30" : "border-white/10"}
                    `}
                    style={{ fontFamily: "futuraCB" }}
                  />
                ))}
              </div>
              {errors.otp && (
                <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                  {errors.otp}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full h-11 rounded-xl
                bg-[#F42D23] text-[#F4F4ED]
                text-sm uppercase tracking-[0.1em]
                flex items-center justify-center gap-2
                hover:bg-[#F4F4ED] hover:text-[#191B1C]
                transition-colors duration-300
                disabled:opacity-60 disabled:cursor-not-allowed
                group
              "
              style={{ fontFamily: "futuraCB" }}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-t-transparent border-[#F4F4ED] rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  Verify &amp; Continue
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </>
              )}
            </button>

            {/* Footer links */}
            <div className="flex flex-col gap-2 text-center">
              <p
                className="text-xs text-[#F4F4ED]/40"
                style={{ fontFamily: "satoshi" }}
              >
                Didn&apos;t receive a code?{" "}
                <button
                  type="button"
                  className="text-[#F42D23] font-medium hover:underline"
                >
                  Resend OTP
                </button>
              </p>
              <p
                className="text-xs text-[#F4F4ED]/40"
                style={{ fontFamily: "satoshi" }}
              >
                Wrong email?{" "}
                <Link
                  href={`/signup?${changeEmailQs}`}
                  className="text-[#F42D23] font-medium hover:underline"
                >
                  Change email
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
