"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
  Package,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  CartItem,
} from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_API_URL ?? "";

function resolveImage(src: string) {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;
  return `${IMAGE_BASE}/${src.replace(/^\//, "")}`;
}

export default function CartPage() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, isFetching } = useGetCartQuery(undefined, {
    skip: !token,
  });
  const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeCartItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const items: CartItem[] = data?.data?.items ?? [];
  const total: number = data?.data?.total ?? 0;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleQty = async (itemId: string, current: number, dir: "inc" | "dec") => {
    const next = dir === "inc" ? current + 1 : current - 1;
    if (next < 1) return;
    const id = toast.loading("Updating…");
    try {
      await updateCartItem({ itemId, quantity: next }).unwrap();
      toast.success("Updated.", { id });
    } catch {
      toast.error("Failed to update.", { id });
    }
  };

  const handleRemove = async () => {
    if (!itemToRemove) return;
    const id = toast.loading("Removing…");
    try {
      await removeCartItem(itemToRemove).unwrap();
      toast.success("Item removed.", { id });
      setItemToRemove(null);
    } catch {
      toast.error("Failed to remove.", { id });
    }
  };

  const handleClear = async () => {
    const id = toast.loading("Clearing cart…");
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared.", { id });
      setShowClearDialog(false);
    } catch {
      toast.error("Failed to clear cart.", { id });
    }
  };

  // ── Not logged in ────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <PageShell>
        <EmptyState
          icon={<ShoppingBag size={36} className="text-[#F42D23]" />}
          title="Sign in to view your cart"
          sub="Your bag is waiting — log in to continue."
          action={
            <Link href="/login" className={primaryBtn}>
              Sign In <ArrowRight size={13} />
            </Link>
          }
        />
      </PageShell>
    );
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-32">
          <span className="w-8 h-8 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Page header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 mb-1"
            style={{ fontFamily: "satoshi" }}
          >
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
          <h1
            className="text-[#191B1C] text-4xl uppercase leading-none"
            style={{ fontFamily: "futuraCB" }}
          >
            Your Bag
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setShowClearDialog(true)}
            className="text-[10px] uppercase tracking-widest text-[#191B1C]/30 hover:text-[#F42D23] transition-colors"
            style={{ fontFamily: "satoshi" }}
          >
            Remove all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* ── Empty ── */
        <EmptyState
          icon={<ShoppingBag size={36} className="text-[#191B1C]/20" />}
          title="Your bag is empty"
          sub="Looks like you haven't added anything yet."
          action={
            <Link href="/" className={primaryBtn}>
              Explore Products <ArrowRight size={13} />
            </Link>
          }
        />
      ) : (
        /* ── Content ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ── Items list ── */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
            {items.map((item) => (
              <CartItemRow
                key={item._id}
                item={item}
                isFetching={isFetching}
                isUpdating={isUpdating}
                onQty={handleQty}
                onRemove={setItemToRemove}
              />
            ))}
          </div>

          {/* ── Summary panel ── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 flex flex-col gap-4">
              <OrderSummary items={items} total={total} />

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="
                  flex items-center justify-between
                  h-14 px-6 rounded-2xl
                  bg-[#F42D23] text-[#F4F4ED]
                  hover:bg-[#191B1C] hover:text-[#F4F4ED]
                  transition-colors duration-300 group
                "
                style={{ fontFamily: "futuraCB" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#F4F4ED]/20 group-hover:bg-[#F4F4ED]/20 flex items-center justify-center transition-colors">
                    <ShoppingBag size={13} />
                  </div>
                  <span className="text-sm uppercase tracking-[0.12em]">Checkout</span>
                </div>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>

              {/* Trust badge */}
              <div className="flex items-center justify-center gap-2 text-[#191B1C]/25">
                <ShieldCheck size={12} />
                <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "satoshi" }}>
                  Secure Checkout · 100% Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove confirm modal ── */}
      {itemToRemove && (
        <ConfirmModal
          title="Remove Item?"
          body="Are you sure you want to remove this item from your bag?"
          confirmLabel={isRemoving ? "Removing…" : "Remove"}
          loading={isRemoving}
          danger
          onConfirm={handleRemove}
          onCancel={() => setItemToRemove(null)}
        />
      )}

      {/* ── Clear cart confirm modal ── */}
      {showClearDialog && (
        <ConfirmModal
          title="Clear Entire Bag?"
          body="Every item will be removed. This cannot be undone."
          confirmLabel={isClearing ? "Clearing…" : "Clear Everything"}
          loading={isClearing}
          danger
          onConfirm={handleClear}
          onCancel={() => setShowClearDialog(false)}
        />
      )}
    </PageShell>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F4ED]">
      <Navbar />
      <div className="pt-28 pb-24 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  isFetching: boolean;
  isUpdating: boolean;
  onQty: (id: string, qty: number, dir: "inc" | "dec") => void;
  onRemove: (id: string) => void;
}

function CartItemRow({ item, isFetching, isUpdating, onQty, onRemove }: CartItemRowProps) {
  return (
    <div
      className={`
        flex items-start gap-4 p-4 sm:p-5
        rounded-2xl bg-white border border-[#191B1C]/[0.07]
        hover:border-[#000]/[0.14] hover:bg-white
        transition-all duration-200
        ${isFetching ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      {/* Image */}
      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#191B1C]/5 shrink-0">
        <img
          src={resolveImage(item.productImage)}
          alt={item.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              className="text-[#191B1C] text-sm uppercase tracking-tight leading-tight line-clamp-2"
              style={{ fontFamily: "futuraCB" }}
            >
              {item.productName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] uppercase tracking-wider text-[#191B1C]/40"
                style={{ fontFamily: "satoshi" }}
              >
                {item.size}
              </span>
              <span className="w-px h-3 bg-[#191B1C]/10" />
              <span
                className="text-[10px] uppercase tracking-wider text-[#191B1C]/40"
                style={{ fontFamily: "satoshi" }}
              >
                {item.colorName}
              </span>
            </div>
          </div>

          <button
            onClick={() => onRemove(item._id)}
            className="p-1.5 rounded-lg text-[#191B1C]/25 hover:text-[#F42D23] hover:bg-[#F42D23]/10 transition-all shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Delivery tag */}
        <div className="flex items-center gap-2">
          <Package size={11} className="text-[#191B1C]/30" />
          <span
            className="text-[10px] text-[#191B1C]/30 uppercase tracking-wider"
            style={{ fontFamily: "satoshi" }}
          >
            Express · 3–5 days
          </span>
        </div>

        {/* Price + qty row */}
        <div className="flex items-center justify-between">
          <p
            className="text-[#191B1C] text-base"
            style={{ fontFamily: "futuraCB" }}
          >
            ₹{(item.salePrice ?? item.price).toLocaleString("en-IN")}
          </p>

          {/* Qty stepper */}
          <div className="flex items-center gap-1 bg-[#191B1C]/5 border border-[#191B1C]/10 rounded-full p-1">
            <button
              onClick={() => onQty(item._id, item.quantity, "dec")}
              disabled={item.quantity <= 1 || isUpdating}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#191B1C]/10 disabled:opacity-30 transition-colors"
            >
              <Minus size={11} className="text-[#191B1C]" />
            </button>
            <span
              className="w-6 text-center text-sm text-[#191B1C]"
              style={{ fontFamily: "futuraCB" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onQty(item._id, item.quantity, "inc")}
              disabled={isUpdating}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#191B1C]/10 disabled:opacity-30 transition-colors"
            >
              <Plus size={11} className="text-[#191B1C]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ items, total }: { items: CartItem[]; total: number }) {
  const subtotal = items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.price) * i.quantity,
    0
  );

  return (
    <div className="rounded-2xl bg-white border border-[#191B1C]/[0.07] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#191B1C]/[0.07]">
        <p
          className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40"
          style={{ fontFamily: "satoshi" }}
        >
          Order Summary
        </p>
      </div>

      {/* Rows */}
      <div className="px-6 py-5 flex flex-col gap-4">
        {/* Item breakdown */}
        <div className="flex flex-col gap-3 pb-4 border-b border-[#191B1C]/[0.07]">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between gap-3">
              <span
                className="text-xs text-[#191B1C]/50 truncate"
                style={{ fontFamily: "satoshi" }}
              >
                {item.productName}
                <span className="text-[#191B1C]/25"> ×{item.quantity}</span>
              </span>
              <span
                className="text-xs text-[#191B1C]/70 shrink-0"
                style={{ fontFamily: "satoshi" }}
              >
                ₹{((item.salePrice ?? item.price) * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#191B1C]/50" style={{ fontFamily: "satoshi" }}>
            Subtotal
          </span>
          <span className="text-sm text-[#191B1C]/70" style={{ fontFamily: "satoshi" }}>
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Delivery */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#191B1C]/50" style={{ fontFamily: "satoshi" }}>
            Delivery
          </span>
          <span
            className="text-sm text-emerald-400 uppercase tracking-wider"
            style={{ fontFamily: "futuraCB" }}
          >
            Free
          </span>
        </div>

        {/* Coupon */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#191B1C]/50" style={{ fontFamily: "satoshi" }}>
            Discount
          </span>
          <span className="text-sm text-[#191B1C]/30" style={{ fontFamily: "satoshi" }}>
            —
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="px-6 py-5 bg-[#191B1C]/[0.02] border-t border-[#191B1C]/[0.07] flex items-center justify-between">
        <p
          className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40"
          style={{ fontFamily: "satoshi" }}
        >
          Total
        </p>
        <p
          className="text-2xl text-[#191B1C]"
          style={{ fontFamily: "futuraCB" }}
        >
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  sub: string;
  action: React.ReactNode;
}

function EmptyState({ icon, title, sub, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-[#191B1C]/5 border border-[#191B1C]/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h2
          className="text-[#191B1C] text-2xl uppercase leading-none mb-2"
          style={{ fontFamily: "futuraCB" }}
        >
          {title}
        </h2>
        <p className="text-[#191B1C]/40 text-sm" style={{ fontFamily: "satoshi" }}>
          {sub}
        </p>
      </div>
      {action}
    </div>
  );
}

interface ConfirmModalProps {
  title: string;
  body: string;
  confirmLabel: string;
  loading: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ title, body, confirmLabel, loading, danger = false, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm rounded-3xl bg-[#F4F4ED] border border-[#191B1C]/10 p-8 flex flex-col items-center gap-5 shadow-2xl">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${danger ? "bg-[#F42D23]/10" : "bg-[#191B1C]/5"}`}>
          <Trash2 size={22} className={danger ? "text-[#F42D23]" : "text-[#191B1C]/40"} />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3
            className="text-[#191B1C] text-xl uppercase leading-none mb-2"
            style={{ fontFamily: "futuraCB" }}
          >
            {title}
          </h3>
          <p
            className="text-[#191B1C]/40 text-xs leading-relaxed"
            style={{ fontFamily: "satoshi" }}
          >
            {body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              w-full h-11 rounded-xl text-sm uppercase tracking-[0.1em]
              flex items-center justify-center gap-2
              transition-colors duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              ${danger
                ? "bg-[#F42D23] text-[#191B1C] hover:bg-red-700"
                : "bg-[#F4F4ED] text-[#191B1C] hover:bg-white"
              }
            `}
            style={{ fontFamily: "futuraCB" }}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full h-11 rounded-xl text-sm text-[#191B1C]/40 hover:text-[#191B1C] transition-colors"
            style={{ fontFamily: "satoshi" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const primaryBtn =
  "flex items-center gap-2 h-11 px-6 rounded-full bg-[#F42D23] text-[#191B1C] text-sm uppercase tracking-[0.1em] hover:bg-[#F4F4ED] hover:text-[#191B1C] transition-colors duration-300";
