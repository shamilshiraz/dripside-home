import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export default function RequestedPage() {
  return (
    <div className="min-h-screen bg-[#191B1C] flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-[#F42D23]/10 border border-[#F42D23]/20 flex items-center justify-center mb-8">
        <Clock size={28} className="text-[#F42D23]" />
      </div>

      {/* Heading */}
      <p
        className="text-[10px] uppercase tracking-[0.25em] text-[#F4F4ED]/40 mb-2"
        style={{ fontFamily: "satoshi" }}
      >
        Under Review
      </p>
      <h1
        className="text-[#F4F4ED] text-5xl uppercase leading-none mb-5"
        style={{ fontFamily: "futuraCB" }}
      >
        Application
        <br />
        Submitted
      </h1>

      {/* Body */}
      <p
        className="text-[#F4F4ED]/50 text-sm leading-relaxed max-w-sm"
        style={{ fontFamily: "satoshi" }}
      >
        Thank you for applying to join Dripside as an artist. Your application
        is now under review by our team — we&apos;ll reach out once your
        profile has been approved.
      </p>

      {/* Divider */}
      <div className="w-16 h-px bg-[#F42D23]/30 my-8" />

      {/* CTA */}
      <Link
        href="/"
        className="
          flex items-center gap-2
          h-11 px-8 rounded-full
          bg-[#F42D23] text-[#F4F4ED] text-sm uppercase tracking-[0.1em]
          hover:bg-[#F4F4ED] hover:text-[#191B1C]
          transition-colors duration-300 group
        "
        style={{ fontFamily: "futuraCB" }}
      >
        Back to Home
        <ArrowRight
          size={13}
          className="group-hover:translate-x-0.5 transition-transform duration-300"
        />
      </Link>

      {/* Footer */}
      <p
        className="text-xs text-[#F4F4ED]/25 mt-10"
        style={{ fontFamily: "satoshi" }}
      >
        Need help?{" "}
        <Link href="/" className="text-[#F42D23] hover:underline">
          Contact support
        </Link>
      </p>
    </div>
  );
}
