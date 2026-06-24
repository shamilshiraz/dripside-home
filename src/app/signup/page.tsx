"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone, AtSign } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSignupMutation } from "@/redux/api/UserApi";

interface Errors {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
}

interface APIError {
  data?: {
    errors?: Record<string, string>;
    message?: string;
  };
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [signup, { isLoading }] = useSignupMutation();

  // Pre-fill if returning from OTP page
  useEffect(() => {
    if (searchParams.get("name")) setName(searchParams.get("name")!);
    if (searchParams.get("username")) setUsername(searchParams.get("username")!);
    if (searchParams.get("email")) setEmail(searchParams.get("email")!);
    if (searchParams.get("phone")) setPhone(searchParams.get("phone")!);
    if (searchParams.get("password")) setPassword(searchParams.get("password")!);
  }, [searchParams]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!username.trim()) next.username = "Username is required";
    if (!email) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Invalid email";
    if (!phone.trim()) next.phone = "Phone number is required";
    else if (!/^\d{7,15}$/.test(phone.replace(/\s/g, "")))
      next.phone = "Enter a valid phone number";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Minimum 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    if (!agreed) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    try {
      const response = await signup({ name, username, email, phone, password }).unwrap();

      if (response.data?.user?.email) {
        toast.success("Account created! Please verify your email.");
        const qs = new URLSearchParams({ email: response.data.user.email, name, username, phone, password });
        router.replace(`/verify-otp?${qs.toString()}`);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      const err = error as APIError;
      if (err.data?.errors) {
        Object.values(err.data.errors).forEach((msg) => toast.error(msg));
      } else if (err.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

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
          {/* Heading */}
          <div className="mb-8">
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/40 mb-1"
              style={{ fontFamily: "satoshi" }}
            >
              Join Dripside
            </p>
            <h1
              className="text-[#F4F4ED] text-4xl uppercase leading-none"
              style={{ fontFamily: "futuraCB" }}
            >
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Name + Username row */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="name"
                label="Name"
                icon={<User size={13} />}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={setName}
                error={errors.name}
              />
              <Field
                id="username"
                label="Username"
                icon={<AtSign size={13} />}
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={setUsername}
                error={errors.username}
              />
            </div>

            {/* Email */}
            <Field
              id="email"
              label="Email"
              icon={<Mail size={13} />}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              error={errors.email}
            />

            {/* Phone */}
            <Field
              id="phone"
              label="Phone"
              icon={<Phone size={13} />}
              type="tel"
              placeholder="+1 234 567 890"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                style={{ fontFamily: "satoshi" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4F4ED]/30 pointer-events-none"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F4F4ED]/30 hover:text-[#F4F4ED] transition-colors cursor-pointer"
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

            {/* Terms */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => setAgreed((v) => !v)}
                className={`
                  w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center
                  transition-colors duration-200 cursor-pointer
                  ${agreed ? "bg-[#F42D23] border-[#F42D23]" : "border-white/20 bg-white/5"}
                `}
              >
                {agreed && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="#F4F4ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-xs text-[#F4F4ED]/50"
                style={{ fontFamily: "satoshi" }}
              >
                I agree to the{" "}
                <button type="button" className="text-[#F42D23] hover:underline">
                  Terms &amp; Conditions
                </button>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                mt-1 w-full h-11 rounded-xl
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
                  Create Account
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </>
              )}
            </button>

            {/* Footer */}
            <p
              className="text-center text-xs text-[#F4F4ED]/40 mt-1"
              style={{ fontFamily: "satoshi" }}
            >
              Already have an account?{" "}
              <Link href="/login" className="text-[#F42D23] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Reusable field component ──────────────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

function Field({ id, label, icon, type, placeholder, value, onChange, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
        style={{ fontFamily: "satoshi" }}
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F4F4ED]/30 pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full h-11 pl-9 pr-4 rounded-xl
            bg-white/5 border text-[#F4F4ED] text-sm
            placeholder:text-[#F4F4ED]/25
            outline-none transition-colors duration-200
            focus:border-[#F42D23]
            ${error ? "border-red-500" : "border-white/10"}
          `}
          style={{ fontFamily: "satoshi" }}
        />
      </div>
      {error && (
        <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
          {error}
        </span>
      )}
    </div>
  );
}
