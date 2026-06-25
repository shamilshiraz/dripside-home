"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Gift,
  MapPin,
  Package,
  Shield,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import {
  useGetCartQuery,
  useGetUserProfileQuery,
  useGetAddressByUserIdQuery,
  usePlaceOrderMutation,
  IAddress,
} from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? "";

function resolveImage(src: string) {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;
  return `${IMAGE_BASE}/${src.replace(/^\//, "")}`;
}

// ── Payment option card ────────────────────────────────────────────────────────
function PaymentCard({
  label,
  description,
  icon: Icon,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
        selected
          ? "border-[#191B1C] bg-[#191B1C]/[0.03]"
          : "border-[#191B1C]/10 hover:border-[#191B1C]/25 bg-white"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          selected ? "bg-[#191B1C] text-[#F4F4ED]" : "bg-[#191B1C]/[0.06] text-[#191B1C]/50"
        }`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p
          className={`text-sm uppercase tracking-tight ${selected ? "text-[#191B1C]" : "text-[#191B1C]/60"}`}
          style={{ fontFamily: "futuraCB" }}
        >
          {label}
        </p>
        <p className="text-[11px] text-[#191B1C]/40 mt-0.5" style={{ fontFamily: "satoshi" }}>
          {description}
        </p>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selected ? "border-[#191B1C]" : "border-[#191B1C]/25"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#191B1C]" />}
      </div>
    </button>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-[#191B1C] text-[#F4F4ED] flex items-center justify-center shrink-0">
        <Icon size={15} />
      </div>
      <div>
        <h2 className="text-sm uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
          {title}
        </h2>
        <p className="text-[10px] text-[#191B1C]/40 uppercase tracking-wider mt-0.5" style={{ fontFamily: "satoshi" }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter();
  const { token, hydrated } = useSelector((state: RootState) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { data: profileData, isLoading: isProfileLoading } = useGetUserProfileQuery(undefined, { skip: !token });
  const userId = profileData?.data?._id;

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(undefined, { skip: !token });
  const items = cartData?.data?.items ?? [];
  const total = cartData?.data?.total ?? 0;
  const subtotal = cartData?.data?.subtotal ?? 0;

  const { data: addressData, isLoading: isAddressLoading } = useGetAddressByUserIdQuery(userId, {
    skip: !userId,
  });
  const addresses: IAddress[] = addressData?.data ?? [];

  const [placeOrder] = usePlaceOrderMutation();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault);
      setSelectedAddressId(def?._id ?? addresses[0]._id);
    }
  }, [addresses]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const toastId = toast.loading("Placing your order…");
    setIsPlacingOrder(true);
    try {
      const result = await placeOrder({
        addressId: selectedAddressId,
        paymentMethod: paymentMethod === "cod" ? "COD" : "ONLINE",
        couponCode: couponCode || undefined,
      }).unwrap();
      toast.success("Order placed!", { id: toastId });
      router.push(`/confirmed?orderId=${result?.data?._id ?? ""}`);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to place order.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!hydrated || (!token && hydrated)) {
    return (
      <div className="min-h-screen bg-[#F4F4ED] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4ED] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F4F4ED] pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <Link
              href="/cart"
              className="p-2.5 rounded-full bg-white border border-[#191B1C]/10 hover:border-[#191B1C]/25 transition-all"
            >
              <ArrowLeft size={18} className="text-[#191B1C]" />
            </Link>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 mb-0.5" style={{ fontFamily: "satoshi" }}>
                Complete your order
              </p>
              <h1 className="text-[#191B1C] text-3xl uppercase leading-none" style={{ fontFamily: "futuraCB" }}>
                Checkout
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Left column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-7 flex flex-col gap-5">

              {/* Delivery address */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] overflow-hidden">
                <div className="p-6 border-b border-[#191B1C]/[0.05] flex items-center justify-between">
                  <SectionHeader icon={MapPin} title="Delivery Address" sub="Where should we deliver?" />
                  <Link
                    href="/profile"
                    className="text-[10px] uppercase tracking-widest text-[#F42D23] hover:text-[#191B1C] transition-colors flex items-center gap-1"
                    style={{ fontFamily: "satoshi" }}
                  >
                    Manage
                    <ArrowRight size={11} />
                  </Link>
                </div>

                <div className="p-6 flex flex-col gap-3">
                  {isAddressLoading ? (
                    <div className="flex justify-center py-6">
                      <span className="w-6 h-6 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-[#191B1C]/10 rounded-2xl">
                      <MapPin size={28} className="mx-auto text-[#191B1C]/20 mb-3" />
                      <p className="text-sm text-[#191B1C]/40 mb-1" style={{ fontFamily: "futuraCB" }}>
                        No addresses saved
                      </p>
                      <p className="text-xs text-[#191B1C]/30 mb-4" style={{ fontFamily: "satoshi" }}>
                        Add a delivery address to continue
                      </p>
                      <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-wider rounded-xl hover:bg-[#F42D23] transition-colors"
                        style={{ fontFamily: "futuraCB" }}
                      >
                        Add Address <ArrowRight size={13} />
                      </Link>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                          selectedAddressId === addr._id
                            ? "border-[#191B1C] bg-[#191B1C]/[0.02]"
                            : "border-[#191B1C]/10 hover:border-[#191B1C]/25"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            selectedAddressId === addr._id ? "border-[#191B1C]" : "border-[#191B1C]/25"
                          }`}
                        >
                          {selectedAddressId === addr._id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#191B1C]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm uppercase tracking-tight text-[#191B1C] truncate" style={{ fontFamily: "futuraCB" }}>
                              {addr.name}
                            </p>
                            {addr.isDefault && (
                              <span
                                className="shrink-0 text-[9px] uppercase px-2 py-0.5 bg-[#191B1C] text-[#F4F4ED] rounded-full tracking-widest"
                                style={{ fontFamily: "futuraCB" }}
                              >
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#191B1C]/50 leading-relaxed" style={{ fontFamily: "satoshi" }}>
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                          </p>
                          <p className="text-xs text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>
                            {addr.city}, {addr.state} – {addr.postalCode}
                          </p>
                          <p className="text-[11px] text-[#191B1C]/40 mt-1" style={{ fontFamily: "satoshi" }}>
                            📞 {addr.phone}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Delivery options (static) */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] p-6">
                <div className="mb-5">
                  <SectionHeader icon={Truck} title="Delivery" sub="Estimated shipping time" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Standard Express", time: "3–5 business days", price: "Free", icon: Truck, active: true },
                    { label: "Same Day", time: "By end of today", price: "₹149", icon: Package, active: false },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                        opt.active ? "border-[#191B1C] bg-[#191B1C]/[0.02]" : "border-[#191B1C]/10 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          opt.active ? "bg-[#191B1C] text-[#F4F4ED]" : "bg-[#191B1C]/[0.06] text-[#191B1C]/40"
                        }`}
                      >
                        <opt.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                          {opt.label}
                        </p>
                        <p className="text-[10px] text-[#191B1C]/40 mt-0.5" style={{ fontFamily: "satoshi" }}>
                          {opt.time}
                        </p>
                      </div>
                      <span
                        className={`text-xs shrink-0 ${opt.active ? "text-green-600" : "text-[#191B1C]/40"}`}
                        style={{ fontFamily: "futuraCB" }}
                      >
                        {opt.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] p-6">
                <div className="mb-5">
                  <SectionHeader icon={CreditCard} title="Payment Method" sub="Choose how to pay" />
                </div>
                <div className="flex flex-col gap-3">
                  <PaymentCard
                    label="Pay Online"
                    description="UPI, Cards, Net Banking, Wallets"
                    icon={Wallet}
                    selected={paymentMethod === "online"}
                    onSelect={() => setPaymentMethod("online")}
                  />
                  <PaymentCard
                    label="Cash on Delivery"
                    description="Pay when your order arrives"
                    icon={Package}
                    selected={paymentMethod === "cod"}
                    onSelect={() => setPaymentMethod("cod")}
                  />
                </div>
              </div>
            </div>

            {/* ── Right column ─────────────────────────────────────────────── */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 flex flex-col gap-5">

                {/* Cart items */}
                <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] overflow-hidden">
                  <div className="p-5 border-b border-[#191B1C]/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#191B1C] text-[#F4F4ED] flex items-center justify-center">
                        <ShoppingBag size={15} />
                      </div>
                      <p className="text-sm uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                        Your Bag
                      </p>
                    </div>
                    <span
                      className="text-[11px] bg-[#191B1C]/[0.06] text-[#191B1C] px-2.5 py-1 rounded-full uppercase tracking-wider"
                      style={{ fontFamily: "futuraCB" }}
                    >
                      {items.length} {items.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <div className="divide-y divide-[#191B1C]/[0.05]">
                    {isCartLoading ? (
                      <div className="flex justify-center py-8">
                        <span className="w-6 h-6 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
                      </div>
                    ) : items.length === 0 ? (
                      <div className="py-10 text-center">
                        <ShoppingBag size={32} className="mx-auto text-[#191B1C]/10 mb-3" />
                        <p className="text-sm text-[#191B1C]/30" style={{ fontFamily: "satoshi" }}>
                          Your bag is empty
                        </p>
                      </div>
                    ) : (
                      items.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 p-4">
                          <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#191B1C]/[0.04] border border-[#191B1C]/[0.07] shrink-0">
                            <img
                              src={resolveImage(item.productImage)}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs uppercase tracking-tight text-[#191B1C] truncate"
                              style={{ fontFamily: "futuraCB" }}
                            >
                              {item.productName}
                            </p>
                            <div
                              className="flex gap-2 text-[10px] text-[#191B1C]/40 uppercase mt-1"
                              style={{ fontFamily: "satoshi" }}
                            >
                              <span>{item.size}</span>
                              <span>·</span>
                              <span>{item.colorName}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                                ₹{(item.salePrice ?? item.price).toLocaleString()}
                              </p>
                              <span
                                className="text-[10px] bg-[#191B1C]/[0.06] text-[#191B1C]/60 px-2 py-0.5 rounded-full"
                                style={{ fontFamily: "futuraCB" }}
                              >
                                Qty {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Coupon */}
                <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] p-5">
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 mb-3"
                    style={{ fontFamily: "satoshi" }}
                  >
                    Apply Coupon
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 bg-[#191B1C]/[0.03] border border-[#191B1C]/10 rounded-xl px-4 py-2.5 text-sm text-[#191B1C] placeholder:text-[#191B1C]/25 focus:outline-none focus:ring-2 focus:ring-[#191B1C]/10 focus:border-[#191B1C]/25 transition-all"
                      style={{ fontFamily: "satoshi" }}
                    />
                    <button
                      className="px-5 py-2.5 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest rounded-xl hover:bg-[#F42D23] transition-colors shrink-0"
                      style={{ fontFamily: "futuraCB" }}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Price breakdown + place order */}
                <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] overflow-hidden">
                  <div className="p-5 flex flex-col gap-3">
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 mb-1"
                      style={{ fontFamily: "satoshi" }}
                    >
                      Price Breakdown
                    </p>
                    {[
                      { label: "Subtotal", value: `₹${subtotal.toLocaleString()}`, dim: false },
                      { label: "Coupon Discount", value: "–₹0", dim: false, green: true },
                      { label: "Delivery", value: "Free", dim: false, green: true },
                      { label: "GST", value: "Incl.", dim: true },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center">
                        <span
                          className="text-sm text-[#191B1C]/50"
                          style={{ fontFamily: "satoshi" }}
                        >
                          {row.label}
                        </span>
                        <span
                          className={`text-sm ${row.green ? "text-green-600" : row.dim ? "text-[#191B1C]/30" : "text-[#191B1C]"}`}
                          style={{ fontFamily: "futuraCB" }}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 py-4 bg-[#191B1C]/[0.02] border-t border-[#191B1C]/[0.07] flex justify-between items-center">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>
                        Total
                      </p>
                      <p className="text-2xl text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                        ₹{total.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-green-600">
                      <Gift size={14} />
                      <span className="text-[11px] uppercase tracking-tight" style={{ fontFamily: "futuraCB" }}>
                        Save ₹0
                      </span>
                    </div>
                  </div>

                  {/* Place order CTA */}
                  <div className="p-5 pt-4">
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder || items.length === 0 || !selectedAddressId}
                      className="
                        w-full flex items-center justify-between
                        h-14 px-6 rounded-2xl
                        bg-[#F42D23] text-[#F4F4ED]
                        hover:bg-[#191B1C]
                        transition-colors duration-300 group
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                      style={{ fontFamily: "futuraCB" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#F4F4ED]/20 flex items-center justify-center">
                          <ShoppingBag size={13} />
                        </div>
                        <span className="text-sm uppercase tracking-[0.12em]">
                          {isPlacingOrder ? "Placing Order…" : "Place Order"}
                        </span>
                      </div>
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </button>

                    <div className="flex items-center justify-center gap-4 mt-4">
                      {[
                        { icon: Shield, label: "Secure" },
                        { icon: Truck, label: "Free Shipping" },
                        { icon: Package, label: "Easy Returns" },
                      ].map(({ icon: Icon, label }, i) => (
                        <div key={label} className="flex items-center gap-1.5 text-[#191B1C]/25">
                          {i > 0 && <span className="text-[#191B1C]/10 mr-2">|</span>}
                          <Icon size={11} />
                          <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "satoshi" }}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
