"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Briefcase,
  Globe,
  Upload,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { RootState, AppDispatch } from "@/redux/store";
import { setCredentials } from "@/redux/slices/authSlice";
import { useArtistSignupMutation, useGetUserProfileQuery } from "@/redux/api/UserApi";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormErrors {
  brandname?: string;
  aadhaar?: string;
  pancard?: string;
  instagram?: string;
  behance?: string;
  linkedin?: string;
  root?: string;
}

const STEPS = [
  { label: "Brand", title: "Your Brand", sub: "What do your fans call you?" },
  { label: "Identity", title: "Verify Identity", sub: "Upload Aadhaar & PAN details." },
  { label: "Social", title: "Social Links", sub: "Connect your online presence." },
] as const;

const URL_RE = /^(https?:\/\/)?(www\.)?[\w-]+\.\w{2,}(\/\S*)?$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

// ── Page wrapper with auth guard ──────────────────────────────────────────────
export default function ArtistSignupPage() {
  const router = useRouter();
  const { userInfo, token } = useSelector((state: RootState) => state.auth);

  // Guard: must be logged in
  useEffect(() => {
    if (token === null) return; // still hydrating
    if (!token) router.replace("/login");
  }, [token, router]);

  // Guard: already requested
  useEffect(() => {
    if (userInfo?.status === "REQUESTED") router.replace("/requested");
  }, [userInfo, router]);

  if (!token || !userInfo) return null;

  return <ArtistSignupForm />;
}

// ── Multi-step form ───────────────────────────────────────────────────────────
function ArtistSignupForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState(0); // 0-indexed
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fields
  const [brandname, setBrandname] = useState("");
  const [aadhaar, setAadhaar] = useState<File | null>(null);
  const [pancard, setPancard] = useState("");
  const [instagram, setInstagram] = useState("");
  const [behance, setBehance] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [artistSignup] = useArtistSignupMutation();
  const { refetch } = useGetUserProfileQuery(undefined);

  // ── File handler ────────────────────────────────────────────────────────────
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, aadhaar: "Only PDF files are accepted." }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrors((prev) => ({ ...prev, aadhaar: "File exceeds 5 MB limit." }));
      e.target.value = "";
      return;
    }
    setErrors((prev) => { const n = { ...prev }; delete n.aadhaar; return n; });
    setAadhaar(file);
  };

  const removeFile = () => {
    setAadhaar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Per-step validation ─────────────────────────────────────────────────────
  const validate = (): boolean => {
    const next: FormErrors = {};

    if (step === 0) {
      if (!brandname.trim()) next.brandname = "Brand name is required.";
    }

    if (step === 1) {
      if (!aadhaar) next.aadhaar = "Aadhaar card upload is required.";
      if (!pancard.trim()) next.pancard = "PAN Card number is required.";
      else if (!PAN_RE.test(pancard.toUpperCase()))
        next.pancard = "Invalid format — expected ABCDE1234F.";
    }

    if (step === 2) {
      if (instagram && !URL_RE.test(instagram)) next.instagram = "Invalid Instagram URL.";
      if (behance && !URL_RE.test(behance)) next.behance = "Invalid Behance URL.";
      if (linkedin && !URL_RE.test(linkedin)) next.linkedin = "Invalid LinkedIn URL.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => { if (validate()) setStep((s) => s + 1); };
  const goBack = () => setStep((s) => s - 1);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("brandname", brandname);
      fd.append("panCard", pancard.toUpperCase());
      if (instagram.trim()) fd.append("instagram", instagram);
      if (behance.trim()) fd.append("behance", behance);
      if (linkedin.trim()) fd.append("linkedin", linkedin);
      if (aadhaar) fd.append("aadhaar", aadhaar);

      await artistSignup(fd).unwrap();

      const updated = await refetch().unwrap();
      dispatch(setCredentials({
        userInfo: updated.data ?? updated,
        token: token ?? "",
      }));

      router.push("/requested");
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Submission failed. Please try again.";
      toast.error(msg);
      setErrors({ root: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#191B1C]">
      {/* LEFT — video panel */}
      <div className="hidden md:block relative w-1/2">
        <video
          src="/videos/banner1.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Back link */}
        <Link
          href="/"
          className="absolute top-8 left-8 z-10 flex items-center gap-2 text-[#F4F4ED]/60 hover:text-[#F4F4ED] transition-colors text-xs"
          style={{ fontFamily: "satoshi" }}
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <div className="absolute bottom-10 left-10 z-10">
          <img src="/icons/nvwlogo.svg" alt="Dripside" className="h-8 object-contain mb-4" />
          <p
            className="text-[#F4F4ED]/70 uppercase text-[9px] leading-relaxed max-w-xs"
            style={{ fontFamily: "satoshi" }}
          >
            Join the Dripside collective — apply to become a featured artist and
            bring your creative vision to our community.
          </p>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          {/* Step progress */}
          {/* <div className="flex items-center gap-2 mb-10">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-[10px]
                      transition-colors duration-300
                      ${i < step
                        ? "bg-[#F42D23] text-[#F4F4ED]"
                        : i === step
                        ? "bg-[#F42D23]/20 border border-[#F42D23] text-[#F42D23]"
                        : "bg-white/5 border border-white/10 text-[#F4F4ED]/30"
                      }
                    `}
                    style={{ fontFamily: "futuraCB" }}
                  >
                    {i < step ? <CheckCircle2 size={12} /> : i + 1}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px transition-colors duration-500 ${
                      i < step ? "bg-[#F42D23]" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div> */}

          {/* Heading */}
          <div className="mb-7">
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-[#F4F4ED]/40 mb-1"
              style={{ fontFamily: "satoshi" }}
            >
              Step {step + 1} of {STEPS.length} — {STEPS[step].label}
            </p>
            <h1
              className="text-[#F4F4ED] text-4xl uppercase leading-none"
              style={{ fontFamily: "futuraCB" }}
            >
              {STEPS[step].title}
            </h1>
            <p
              className="text-[#F4F4ED]/40 text-xs mt-2"
              style={{ fontFamily: "satoshi" }}
            >
              {STEPS[step].sub}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* ── STEP 1: Brand Name ── */}
            {step === 0 && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="brandname"
                  className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                  style={{ fontFamily: "satoshi" }}
                >
                  Brand / Stage Name
                </label>
                <input
                  id="brandname"
                  type="text"
                  placeholder="e.g. Void Studio"
                  value={brandname}
                  onChange={(e) => setBrandname(e.target.value)}
                  className={`
                    w-full h-11 px-4 rounded-xl
                    bg-white/5 border text-[#F4F4ED] text-sm
                    placeholder:text-[#F4F4ED]/25 outline-none
                    transition-colors duration-200 focus:border-[#F42D23]
                    ${errors.brandname ? "border-red-500" : "border-white/10"}
                  `}
                  style={{ fontFamily: "satoshi" }}
                />
                {errors.brandname && (
                  <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                    {errors.brandname}
                  </span>
                )}
              </div>
            )}

            {/* ── STEP 2: Identity ── */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                {/* Aadhaar upload */}
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                    style={{ fontFamily: "satoshi" }}
                  >
                    Aadhaar Card (PDF)
                  </label>

                  {aadhaar ? (
                    /* File selected state */
                    <div className="flex items-center gap-3 h-11 px-4 rounded-xl bg-[#F42D23]/10 border border-[#F42D23]/30">
                      <FileText size={14} className="text-[#F42D23] shrink-0" />
                      <span
                        className="flex-1 text-sm text-[#F4F4ED]/80 truncate"
                        style={{ fontFamily: "satoshi" }}
                      >
                        {aadhaar.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-[#F4F4ED]/40 hover:text-[#F42D23] transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    /* Upload trigger */
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        flex items-center gap-3 h-11 px-4 rounded-xl w-full text-left
                        bg-white/5 border transition-colors duration-200
                        hover:border-[#F42D23]/40 hover:bg-white/[0.07]
                        ${errors.aadhaar ? "border-red-500" : "border-white/10"}
                      `}
                    >
                      <Upload size={14} className="text-[#F4F4ED]/30 shrink-0" />
                      <span
                        className="text-sm text-[#F4F4ED]/25"
                        style={{ fontFamily: "satoshi" }}
                      >
                        Click to upload PDF
                      </span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p
                    className="text-[10px] text-[#F4F4ED]/25"
                    style={{ fontFamily: "satoshi" }}
                  >
                    PDF only · Max 5 MB
                  </p>
                  {errors.aadhaar && (
                    <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                      {errors.aadhaar}
                    </span>
                  )}
                </div>

                {/* PAN Card */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="pancard"
                    className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                    style={{ fontFamily: "satoshi" }}
                  >
                    PAN Card Number
                  </label>
                  <input
                    id="pancard"
                    type="text"
                    placeholder="ABCDE1234F"
                    value={pancard}
                    onChange={(e) => setPancard(e.target.value.toUpperCase())}
                    maxLength={10}
                    className={`
                      w-full h-11 px-4 rounded-xl
                      bg-white/5 border text-[#F4F4ED] text-sm tracking-widest
                      placeholder:text-[#F4F4ED]/25 placeholder:tracking-normal
                      outline-none transition-colors duration-200 focus:border-[#F42D23]
                      ${errors.pancard ? "border-red-500" : "border-white/10"}
                    `}
                    style={{ fontFamily: "satoshi" }}
                  />
                  {errors.pancard && (
                    <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                      {errors.pancard}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 3: Social Links ── */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                {(
                  [
                    {
                      id: "instagram",
                      label: "Instagram",
                      icon: <Camera size={13} />,
                      placeholder: "instagram.com/yourusername",
                      value: instagram,
                      set: setInstagram,
                      error: errors.instagram,
                    },
                    {
                      id: "behance",
                      label: "Behance",
                      icon: <Globe size={13} />,
                      placeholder: "behance.net/yourusername",
                      value: behance,
                      set: setBehance,
                      error: errors.behance,
                    },
                    {
                      id: "linkedin",
                      label: "LinkedIn",
                      icon: <Briefcase size={13} />,
                      placeholder: "linkedin.com/in/yourusername",
                      value: linkedin,
                      set: setLinkedin,
                      error: errors.linkedin,
                    },
                  ] as const
                ).map(({ id, label, icon, placeholder, value, set, error }) => (
                  <div key={id} className="flex flex-col gap-1.5">
                    <label
                      htmlFor={id}
                      className="text-[10px] uppercase tracking-[0.15em] text-[#F4F4ED]/40"
                      style={{ fontFamily: "satoshi" }}
                    >
                      {label}{" "}
                      <span className="normal-case tracking-normal text-[#F4F4ED]/20">
                        (optional)
                      </span>
                    </label>
                    <div
                      className={`
                        flex items-center gap-3 h-11 px-4 rounded-xl
                        bg-white/5 border transition-colors duration-200
                        focus-within:border-[#F42D23]
                        ${error ? "border-red-500" : "border-white/10"}
                      `}
                    >
                      <span className="text-[#F4F4ED]/30 shrink-0">{icon}</span>
                      <input
                        id={id}
                        type="url"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className="flex-1 bg-transparent text-[#F4F4ED] text-sm placeholder:text-[#F4F4ED]/20 outline-none"
                        style={{ fontFamily: "satoshi" }}
                      />
                    </div>
                    {error && (
                      <span className="text-red-400 text-xs" style={{ fontFamily: "satoshi" }}>
                        {error}
                      </span>
                    )}
                  </div>
                ))}

                <p
                  className="text-[10px] text-[#F4F4ED]/25 leading-relaxed"
                  style={{ fontFamily: "satoshi" }}
                >
                  At least one social profile helps us verify your creative presence.
                </p>
              </div>
            )}

            {/* Root error */}
            {errors.root && (
              <p className="text-red-400 text-xs text-center" style={{ fontFamily: "satoshi" }}>
                {errors.root}
              </p>
            )}

            {/* Navigation */}
            <div className={`flex gap-3 mt-1 ${step > 0 ? "flex-row" : ""}`}>
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="
                    flex items-center justify-center gap-2
                    h-11 px-5 rounded-xl shrink-0
                    bg-white/5 border border-white/10 text-[#F4F4ED] text-sm
                    hover:bg-white/10 transition-colors duration-200
                  "
                  style={{ fontFamily: "satoshi" }}
                >
                  <ArrowLeft size={13} />
                  Back
                </button>
              )}

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-11 rounded-xl
                    bg-[#F42D23] text-[#F4F4ED] text-sm uppercase tracking-[0.1em]
                    hover:bg-[#F4F4ED] hover:text-[#191B1C]
                    transition-colors duration-300 group
                  "
                  style={{ fontFamily: "futuraCB" }}
                >
                  Continue
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-11 rounded-xl
                    bg-[#F42D23] text-[#F4F4ED] text-sm uppercase tracking-[0.1em]
                    hover:bg-[#F4F4ED] hover:text-[#191B1C]
                    transition-colors duration-300
                    disabled:opacity-60 disabled:cursor-not-allowed group
                  "
                  style={{ fontFamily: "futuraCB" }}
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-t-transparent border-[#F4F4ED] rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <p
            className="text-center text-xs text-[#F4F4ED]/25 mt-8"
            style={{ fontFamily: "satoshi" }}
          >
            Having trouble?{" "}
            <Link href="/" className="text-[#F42D23] hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
