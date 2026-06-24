"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSigninMutation } from "@/redux/api/UserApi";
import { setCredentials } from "@/redux/slices/authSlice";
import { setUserCookie } from "@/utils/setUserCookie";
import { AppDispatch } from "@/redux/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const [signin, { isLoading }] = useSigninMutation();

  const validate = () => {
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Invalid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await signin({ email, password }).unwrap();
      const token = response.data?.token;

      if (!token) {
        toast.error("Login failed. No token received.");
        return;
      }

      dispatch(setCredentials({ userInfo: response.data.user, token }));
      setUserCookie({ userInfo: response.data.user, token });

      toast.success(`Welcome back, ${response.data.user?.name ?? ""}!`);
      router.replace("/");
    } catch {
      toast.error("Incorrect email or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#191B1C]">
      {/* LEFT — image panel */}
      <div className="hidden md:block relative w-1/2">
        <img
          src="/images/banners/banner-1.png"
          alt="Dripside"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
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
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img
              src="/icons/nvwlogo.svg"
              alt="Dripside"
              className="h-7 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/40 mb-1"
              style={{ fontFamily: "satoshi" }}
            >
              Welcome back
            </p>
            <h1
              className="text-[#F4F4ED] text-4xl uppercase leading-none"
              style={{ fontFamily: "futuraCB" }}
            >
              Sign In
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                style={{ fontFamily: "satoshi" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4F4ED]/30 pointer-events-none"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`
                    w-full h-11 pl-9 pr-4 rounded-xl
                    bg-white/5 border text-[#F4F4ED] text-sm
                    placeholder:text-[#F4F4ED]/25
                    outline-none transition-colors duration-200
                    focus:border-[#F42D23]
                    ${errors.email ? "border-red-500" : "border-white/10"}
                  `}
                  style={{ fontFamily: "satoshi" }}
                />
              </div>
              {errors.email && (
                <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                  style={{ fontFamily: "satoshi" }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] text-[#F42D23] hover:underline"
                  style={{ fontFamily: "satoshi" }}
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4F4ED]/30 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`
                    w-full h-11 pl-9 pr-10 rounded-xl
                    bg-white/5 border text-[#F4F4ED] text-sm
                    placeholder:text-[#F4F4ED]/25
                    outline-none transition-colors duration-200
                    focus:border-[#F42D23]
                    ${errors.password ? "border-red-500" : "border-white/10"}
                  `}
                  style={{ fontFamily: "satoshi" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4F4ED]/30 hover:text-[#F4F4ED] transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                mt-2 w-full h-11 rounded-xl
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
                  Please wait…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </>
              )}
            </button>

            {/* Footer */}
            <p
              className="text-center text-xs text-[#F4F4ED]/40 mt-2"
              style={{ fontFamily: "satoshi" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[#F42D23] font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
