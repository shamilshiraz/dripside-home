"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateAddressMutation, useGetUserProfileQuery } from "@/redux/api/UserApi";

interface Props {
  onClose: () => void;
  onAddressAdded: () => void;
}

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-[#191B1C]/10 bg-[#191B1C]/[0.02] text-sm text-[#191B1C] placeholder:text-[#191B1C]/25 focus:outline-none focus:ring-2 focus:ring-[#191B1C]/10 focus:border-[#191B1C]/25 transition-all";

export default function AddressModal({ onClose, onAddressAdded }: Props) {
  const { data: profile } = useGetUserProfileQuery(undefined);
  const [createAddress, { isLoading }] = useCreateAddressMutation();

  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? target.checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.country) {
      toast.error("Please fill in all required fields");
      return;
    }
    const toastId = toast.loading("Saving address…");
    try {
      await createAddress({
        name: profile?.data?.name,
        phone: profile?.data?.phone,
        ...form,
      }).unwrap();
      toast.success("Address saved!", { id: toastId });
      onAddressAdded();
      onClose();
    } catch {
      toast.error("Failed to save address.", { id: toastId });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#F4F4ED] rounded-3xl w-full max-w-lg overflow-hidden border border-[#191B1C]/[0.07]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#191B1C]/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#191B1C] text-[#F4F4ED] flex items-center justify-center">
              <MapPin size={16} />
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                Add New Address
              </h2>
              <p className="text-[10px] text-[#191B1C]/40 uppercase tracking-wider mt-0.5" style={{ fontFamily: "satoshi" }}>
                Fill in your delivery details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#191B1C]/[0.06] hover:bg-[#191B1C]/10 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-[#191B1C]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/40 mb-2" style={{ fontFamily: "satoshi" }}>
              Address Line 1 <span className="text-[#F42D23]">*</span>
            </label>
            <textarea
              name="addressLine1"
              placeholder="House no., Street name, Locality…"
              value={form.addressLine1}
              onChange={handleChange}
              rows={2}
              className={inputCls + " resize-none"}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/40 mb-2" style={{ fontFamily: "satoshi" }}>
              Address Line 2
              <span className="ml-2 normal-case font-medium tracking-normal text-[#191B1C]/25">(optional)</span>
            </label>
            <input name="addressLine2" placeholder="Apartment, suite, floor…" value={form.addressLine2} onChange={handleChange} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "city", label: "City", placeholder: "Mumbai", required: true },
              { name: "state", label: "State", placeholder: "Maharashtra", required: true },
              { name: "postalCode", label: "Postal Code", placeholder: "400001", required: true },
              { name: "country", label: "Country", placeholder: "India", required: true },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/40 mb-2" style={{ fontFamily: "satoshi" }}>
                  {f.label} {f.required && <span className="text-[#F42D23]">*</span>}
                </label>
                <input
                  name={f.name}
                  placeholder={f.placeholder}
                  value={form[f.name as keyof typeof form] as string}
                  onChange={handleChange}
                  required={f.required}
                  className={inputCls}
                />
              </div>
            ))}
          </div>

          {/* Default toggle */}
          <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#191B1C]/10 cursor-pointer hover:border-[#191B1C]/20 transition-colors">
            <div className="relative shrink-0">
              <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} className="sr-only peer" />
              <div className="w-10 h-6 rounded-full bg-[#191B1C]/10 peer-checked:bg-[#191B1C] transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>Set as default address</p>
              <p className="text-[10px] text-[#191B1C]/40 mt-0.5" style={{ fontFamily: "satoshi" }}>Pre-selected at checkout</p>
            </div>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-[#191B1C]/10 text-xs uppercase tracking-widest text-[#191B1C]/50 hover:border-[#191B1C]/25 hover:text-[#191B1C] transition-all"
              style={{ fontFamily: "futuraCB" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest hover:bg-[#F42D23] active:scale-95 transition-all disabled:opacity-50"
              style={{ fontFamily: "futuraCB" }}
            >
              {isLoading ? "Saving…" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
