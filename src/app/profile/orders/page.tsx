"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  RotateCcw,
  ShoppingBag,
  Truck,
  User2,
  XCircle,
} from "lucide-react";
import { RootState } from "@/redux/store";
import { useGetUserOrdersQuery } from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";

type OrderStatus = "all" | "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface IOrderItem {
  productImage: string;
  productName: string;
  size: string;
  colorName: string;
  salePrice: number;
  quantity: number;
}

interface IOrder {
  _id: string;
  status: string;
  createdAt: string;
  items: IOrderItem[];
  addressId?: { addressLine1: string; city: string; state: string };
  paymentMethod: string;
  totalAmount: number;
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; bg: string; text: string; dot: string }> = {
  PENDING:    { label: "Pending",    icon: Clock,        bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  CONFIRMED:  { label: "Confirmed",  icon: CheckCircle2, bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-400" },
  PROCESSING: { label: "Processing", icon: Package,      bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  SHIPPED:    { label: "Shipped",    icon: Truck,        bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-400" },
  DELIVERED:  { label: "Delivered",  icon: CheckCircle2, bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-400" },
  CANCELLED:  { label: "Cancelled",  icon: XCircle,      bg: "bg-red-50",    text: "text-[#F42D23]",  dot: "bg-[#F42D23]" },
};

const tabs: { key: OrderStatus; label: string; apiStatus?: string }[] = [
  { key: "all",       label: "All Orders" },
  { key: "PENDING",    label: "Pending",    apiStatus: "PENDING" },
  { key: "PROCESSING", label: "Processing", apiStatus: "PROCESSING" },
  { key: "SHIPPED",    label: "Shipped",    apiStatus: "SHIPPED" },
  { key: "DELIVERED",  label: "Delivered",  apiStatus: "DELIVERED" },
  { key: "CANCELLED",  label: "Cancelled",  apiStatus: "CANCELLED" },
];

const navLinks = [
  { href: "/profile",        label: "Profile",    icon: User2 },
  { href: "/profile/orders", label: "My Orders",  icon: ShoppingBag },
];

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? "";
function resolveImage(src: string) {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;
  return `${IMAGE_BASE}/${src.replace(/^\//, "")}`;
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({ order }: { order: IOrder }) {
  const s = statusConfig[order.status] ?? statusConfig["PENDING"];
  const addr = order.addressId;
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] overflow-hidden">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-[#191B1C]/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#191B1C]/[0.06] flex items-center justify-center">
            <Package size={16} className="text-[#191B1C]/50" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
              Order #{order._id?.slice(-8).toUpperCase()}
            </p>
            <p className="text-[10px] text-[#191B1C]/40 mt-0.5" style={{ fontFamily: "satoshi" }}>{date}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${s.bg}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className={`text-[10px] uppercase tracking-wider ${s.text}`} style={{ fontFamily: "futuraCB" }}>{s.label}</span>
        </div>
      </div>

      {/* Items */}
      <div className="p-5 flex flex-col gap-4">
        {order.items?.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-14 h-20 rounded-xl overflow-hidden bg-[#191B1C]/[0.04] border border-[#191B1C]/[0.07] shrink-0">
              {item.productImage ? (
                <img src={resolveImage(item.productImage)} alt={item.productName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={16} className="text-[#191B1C]/20" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-tight text-[#191B1C] truncate" style={{ fontFamily: "futuraCB" }}>
                {item.productName}
              </p>
              <div className="flex gap-2 mt-1 text-[10px] text-[#191B1C]/40 uppercase" style={{ fontFamily: "satoshi" }}>
                <span>{item.size}</span>
                <span className="text-[#191B1C]/20">·</span>
                <span>{item.colorName}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                ₹{item.salePrice?.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#191B1C]/40 uppercase mt-0.5" style={{ fontFamily: "satoshi" }}>
                Qty {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Address */}
      {addr && (
        <div className="px-5 pb-3 flex items-center gap-2 text-[11px] text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>
          <MapPin size={11} />
          <span className="truncate">{addr.addressLine1}, {addr.city}, {addr.state}</span>
          <span className="ml-auto shrink-0 uppercase tracking-wider" style={{ fontFamily: "futuraCB" }}>
            {order.paymentMethod}
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#191B1C]/[0.02] border-t border-[#191B1C]/[0.05]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>Total Paid</p>
          <p className="text-lg text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
            ₹{order.totalAmount?.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {order.status === "DELIVERED" && (
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-[#191B1C]/10 text-[10px] uppercase tracking-wider text-[#191B1C]/40 hover:border-[#191B1C]/25 hover:text-[#191B1C] transition-all" style={{ fontFamily: "futuraCB" }}>
              <RotateCcw size={11} /> Return
            </button>
          )}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#191B1C] text-[#F4F4ED] text-[10px] uppercase tracking-wider hover:bg-[#F42D23] transition-all" style={{ fontFamily: "futuraCB" }}>
            Details <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: OrderStatus }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#191B1C]/[0.07]">
      <div className="w-16 h-16 rounded-2xl bg-[#191B1C]/[0.04] flex items-center justify-center mb-5">
        <Box size={28} className="text-[#191B1C]/20" />
      </div>
      <p className="text-base uppercase tracking-tight text-[#191B1C] mb-2" style={{ fontFamily: "futuraCB" }}>No orders yet</p>
      <p className="text-xs text-[#191B1C]/40 max-w-xs leading-relaxed mb-8" style={{ fontFamily: "satoshi" }}>
        {tab === "all"
          ? "You haven't placed any orders yet. Start shopping!"
          : `No ${tab.toLowerCase()} orders found.`}
      </p>
      <Link
        href="/#products"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest rounded-xl hover:bg-[#F42D23] transition-colors"
        style={{ fontFamily: "futuraCB" }}
      >
        <ShoppingBag size={14} /> Shop Now
      </Link>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const router = useRouter();
  const { token, hydrated } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");

  useEffect(() => {
    if (hydrated && !token) router.replace("/login");
  }, [hydrated, token]);

  const activeTabConfig = tabs.find((t) => t.key === activeTab);
  const { data, isLoading, isError } = useGetUserOrdersQuery(
    activeTab !== "all" ? { status: activeTabConfig?.apiStatus } : undefined,
    { skip: !token, refetchOnMountOrArgChange: true }
  );

  const orders = (data?.data?.orders ?? []) as IOrder[];
  const total: number = data?.data?.pagination?.total ?? 0;

  if (!hydrated) {
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

          {/* Page header */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-full bg-white border border-[#191B1C]/10 hover:border-[#191B1C]/25 transition-all"
            >
              <ArrowLeft size={18} className="text-[#191B1C]" />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 mb-0.5" style={{ fontFamily: "satoshi" }}>
                Account
              </p>
              <h1 className="text-[#191B1C] text-3xl uppercase leading-none" style={{ fontFamily: "futuraCB" }}>
                My Orders
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <div className="lg:col-span-3 flex flex-col gap-4">

              {/* Order count card */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F42D23] text-[#F4F4ED] flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>My Orders</p>
                  <p className="text-[10px] text-[#191B1C]/40 mt-0.5" style={{ fontFamily: "satoshi" }}>
                    {total} order{total !== 1 ? "s" : ""} total
                  </p>
                </div>
              </div>

              {/* Nav links */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] p-2 flex flex-col gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = href === "/profile/orders";
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        isActive ? "bg-[#191B1C] text-[#F4F4ED]" : "hover:bg-[#191B1C]/[0.04] text-[#191B1C]/50"
                      }`}
                    >
                      <Icon size={15} className={isActive ? "text-[#F4F4ED]" : "text-[#191B1C]/40 group-hover:text-[#191B1C]"} />
                      <span className={`text-xs uppercase tracking-widest ${isActive ? "text-[#F4F4ED]" : ""}`} style={{ fontFamily: "futuraCB" }}>
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Status legend */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] p-5 flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 mb-1" style={{ fontFamily: "satoshi" }}>
                  Order Status
                </p>
                {Object.entries(statusConfig).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={13} className={cfg.text} />
                        <span className="text-xs text-[#191B1C]/50" style={{ fontFamily: "satoshi" }}>{cfg.label}</span>
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Main content ──────────────────────────────────────────── */}
            <div className="lg:col-span-9">

              {/* Filter tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`shrink-0 px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest transition-all ${
                        isActive
                          ? "bg-[#191B1C] text-[#F4F4ED]"
                          : "bg-white border border-[#191B1C]/10 text-[#191B1C]/50 hover:border-[#191B1C]/20"
                      }`}
                      style={{ fontFamily: "futuraCB" }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Orders list */}
              {isLoading ? (
                <div className="flex justify-center py-20 bg-white rounded-2xl border border-[#191B1C]/[0.07]">
                  <span className="w-10 h-10 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
                </div>
              ) : isError ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-[#191B1C]/[0.07]">
                  <XCircle size={32} className="mx-auto text-[#F42D23]/40 mb-3" />
                  <p className="text-sm text-[#191B1C]/40" style={{ fontFamily: "futuraCB" }}>Failed to load orders</p>
                  <p className="text-xs text-[#191B1C]/30 mt-1" style={{ fontFamily: "satoshi" }}>Please try again later</p>
                </div>
              ) : orders.length === 0 ? (
                <EmptyState tab={activeTab} />
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
