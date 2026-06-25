"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ShoppingBag, CheckCircle2, Package, Truck, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F4F4ED] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-md">

          {/* Success card */}
          <div className="bg-white rounded-3xl border border-[#191B1C]/[0.07] overflow-hidden">

            {/* Top accent band */}
            <div className="h-1.5 w-full bg-[#F42D23]" />

            <div className="p-8 flex flex-col items-center text-center">

              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-[#F42D23]/[0.08] flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-[#F42D23]" strokeWidth={1.5} />
              </div>

              {/* Heading */}
              <p
                className="text-[10px] uppercase tracking-[0.3em] text-[#191B1C]/40 mb-2"
                style={{ fontFamily: "satoshi" }}
              >
                Order confirmed
              </p>
              <h1
                className="text-3xl sm:text-4xl uppercase text-[#191B1C] leading-none mb-3"
                style={{ fontFamily: "futuraCB" }}
              >
                You&apos;re all set!
              </h1>
              <p
                className="text-sm text-[#191B1C]/50 leading-relaxed max-w-xs"
                style={{ fontFamily: "satoshi" }}
              >
                Thank you for your purchase. We&apos;re getting your order ready and will notify you once it ships.
              </p>

              {/* Order ID pill */}
              {orderId && (
                <div className="mt-5 px-4 py-2 bg-[#191B1C]/[0.04] rounded-full border border-[#191B1C]/[0.08]">
                  <span
                    className="text-[10px] uppercase tracking-widest text-[#191B1C]/40"
                    style={{ fontFamily: "satoshi" }}
                  >
                    Order ID&nbsp;&nbsp;
                  </span>
                  <span
                    className="text-[11px] uppercase tracking-wider text-[#191B1C]"
                    style={{ fontFamily: "futuraCB" }}
                  >
                    {orderId}
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="w-full h-px bg-[#191B1C]/[0.06] my-7" />

              {/* Info pills */}
              <div className="grid grid-cols-3 gap-3 w-full mb-8">
                {[
                  { icon: Package, label: "Processing" },
                  { icon: Truck, label: "Free Shipping" },
                  { icon: Shield, label: "Secure" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 py-3 px-2 bg-[#191B1C]/[0.03] rounded-2xl border border-[#191B1C]/[0.05]"
                  >
                    <Icon size={16} className="text-[#191B1C]/40" strokeWidth={1.5} />
                    <span
                      className="text-[9px] uppercase tracking-wider text-[#191B1C]/40"
                      style={{ fontFamily: "satoshi" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => router.push("/")}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-12 px-6 rounded-2xl
                    border-2 border-[#191B1C]/10
                    text-[#191B1C] hover:border-[#191B1C]/30 hover:bg-[#191B1C]/[0.03]
                    transition-all duration-200
                  "
                  style={{ fontFamily: "futuraCB" }}
                >
                  <ArrowLeft size={14} />
                  <span className="text-xs uppercase tracking-widest">Back to Home</span>
                </button>

                <button
                  onClick={() => router.push("/profile/orders")}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    h-12 px-6 rounded-2xl
                    bg-[#F42D23] text-[#F4F4ED]
                    hover:bg-[#191B1C]
                    transition-colors duration-300
                  "
                  style={{ fontFamily: "futuraCB" }}
                >
                  <ShoppingBag size={14} />
                  <span className="text-xs uppercase tracking-widest">View Order</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F4ED] flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  );
}
