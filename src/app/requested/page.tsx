"use client";

import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function RequestedPage() {
  const supportNumber = "+919895796738";
  const displayNumber = "+91 98957 96738";
  const whatsappMessage = encodeURIComponent(
    "Hi Dripside, I need help with my artist application."
  );

  return (
    <div className="relative min-h-screen bg-[#191B1C] flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <video
        src="/videos/banner1.mp4"
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#191B1C]/75" />
      <div className="relative z-10 flex flex-col items-center">
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
      <Dialog>
        <p
          className="text-xs text-[#F4F4ED]/25 mt-10"
          style={{ fontFamily: "satoshi" }}
        >
          Need help?{" "}
          <DialogTrigger className="text-[#F42D23] hover:underline">
            Contact support
          </DialogTrigger>
        </p>
        <DialogContent className="border border-[#F4F4ED]/10 bg-[#191B1C] text-[#F4F4ED] sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle
              className="text-xl uppercase tracking-[0.08em] text-[#F4F4ED]"
              style={{ fontFamily: "futuraCB" }}
            >
              Contact Support
            </DialogTitle>
            <DialogDescription
              className="text-[#F4F4ED]/50"
              style={{ fontFamily: "satoshi" }}
            >
              Choose how you would like to reach us.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 pt-2">
            <a
              href={`tel:${supportNumber}`}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#F42D23] px-5 text-sm uppercase tracking-[0.1em] text-[#F4F4ED] transition-colors duration-300 hover:bg-[#F4F4ED] hover:text-[#191B1C]"
              style={{ fontFamily: "futuraCB" }}
            >
              <Phone size={15} />
              Call
            </a>
            <a
              href={`https://wa.me/${supportNumber.replace("+", "")}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#F4F4ED]/15 px-5 text-sm uppercase tracking-[0.1em] text-[#F4F4ED] transition-colors duration-300 hover:border-[#F42D23] hover:text-[#F42D23]"
              style={{ fontFamily: "futuraCB" }}
            >
              <MessageCircle size={15} />
              Chat (Whatsapp)
            </a>
          </div>

          <p
            className="text-center text-xs text-[#F4F4ED]/35"
            style={{ fontFamily: "satoshi" }}
          >
            {displayNumber}
          </p>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
