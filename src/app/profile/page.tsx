"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShoppingBag,
  Star,
  User,
  User2,
} from "lucide-react";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import {
  useGetUserProfileQuery,
  useGetAddressByUserIdQuery,
  useUpdateProfileMutation,
  useSetDefaultAddressMutation,
  IAddress,
} from "@/redux/api/UserApi";
import Navbar from "@/components/Navbar";
import AddressModal from "@/components/AddressModal";

type FormField = "name" | "username" | "email" | "phone";

const fieldConfig: {
  key: FormField;
  label: string;
  type: string;
  icon: React.ElementType;
  disabled?: boolean;
  placeholder: string;
}[] = [
  { key: "name", label: "Full Name", type: "text", icon: User, placeholder: "John Doe" },
  { key: "username", label: "Username", type: "text", icon: User2, placeholder: "@username" },
  { key: "email", label: "Email Address", type: "email", icon: Mail, disabled: true, placeholder: "you@email.com" },
  { key: "phone", label: "Mobile Number", type: "text", icon: Phone, disabled: true, placeholder: "+91 98765 43210" },
];

const navLinks = [
  { href: "/profile", label: "Profile", icon: User2 },
  { href: "/profile/orders", label: "My Orders", icon: ShoppingBag },
];

const inputCls = (disabled?: boolean) =>
  `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
    disabled
      ? "bg-[#191B1C]/[0.03] border-[#191B1C]/[0.05] text-[#191B1C]/30 cursor-not-allowed"
      : "bg-white border-[#191B1C]/10 text-[#191B1C] focus:ring-2 focus:ring-[#191B1C]/10 focus:border-[#191B1C]/25"
  }`;

function SectionHeader({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-[#191B1C] text-[#F4F4ED] flex items-center justify-center shrink-0">
        <Icon size={15} />
      </div>
      <div>
        <h2 className="text-sm uppercase tracking-tight text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>{title}</h2>
        <p className="text-[10px] text-[#191B1C]/40 uppercase tracking-wider mt-0.5" style={{ fontFamily: "satoshi" }}>{sub}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, hydrated } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<FormField, string>>({
    name: "", username: "", email: "", phone: "",
  });

  const { data: profile, isLoading: isProfileLoading } = useGetUserProfileQuery(undefined, { skip: !token });
  const user = profile?.data;
  const userId = user?._id;

  const { data: addressData, isLoading: isAddressLoading, refetch } = useGetAddressByUserIdQuery(userId, { skip: !userId });
  const addresses: IAddress[] = addressData?.data ?? [];

  const [updateProfile] = useUpdateProfileMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  useEffect(() => {
    if (hydrated && !token) router.replace("/login");
  }, [hydrated, token]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    const unchanged =
      formData.name === user?.name &&
      formData.username === user?.username;
    if (unchanged) { toast.error("No changes to save."); return; }
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ME";

  if (!hydrated || isProfileLoading) {
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
            <Link
              href="/"
              className="p-2.5 rounded-full bg-white border border-[#191B1C]/10 hover:border-[#191B1C]/25 transition-all"
            >
              <ArrowLeft size={18} className="text-[#191B1C]" />
            </Link>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#191B1C]/40 mb-0.5" style={{ fontFamily: "satoshi" }}>
                Account
              </p>
              <h1 className="text-[#191B1C] text-3xl uppercase leading-none" style={{ fontFamily: "futuraCB" }}>
                My Profile
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <div className="lg:col-span-3 flex flex-col gap-4">

              {/* Avatar card */}
              <div className="bg-white rounded-3xl border border-[#191B1C]/[0.07] overflow-hidden">
                <div className="h-20 bg-[#191B1C] relative">
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#F42D23] text-[#F4F4ED] flex items-center justify-center text-xl border-4 border-white" style={{ fontFamily: "futuraCB" }}>
                      {initials}
                    </div>
                  </div>
                </div>
                <div className="pt-11 pb-5 px-6">
                  <p className="text-base uppercase tracking-tight truncate text-[#191B1C]" style={{ fontFamily: "futuraCB" }}>
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-[#191B1C]/40 truncate mt-0.5" style={{ fontFamily: "satoshi" }}>{user?.email}</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <Star size={11} className="text-[#F42D23] fill-[#F42D23]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>
                      Dripside Member
                    </span>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] p-2 flex flex-col gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = href === "/profile";
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
            </div>

            {/* ── Main content ──────────────────────────────────────────── */}
            <div className="lg:col-span-9 flex flex-col gap-5">

              {/* Personal info */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] overflow-hidden">
                <div className="p-6 border-b border-[#191B1C]/[0.05]">
                  <SectionHeader icon={User} title="Basic Details" sub="Your personal information" />
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fieldConfig.map(({ key, label, type, icon: Icon, disabled, placeholder }) => (
                      <div key={key}>
                        <label
                          className="block text-[10px] uppercase tracking-[0.15em] text-[#191B1C]/40 mb-2"
                          style={{ fontFamily: "satoshi" }}
                        >
                          {label}
                          {disabled && (
                            <span className="ml-2 normal-case font-medium tracking-normal text-[#191B1C]/25">(locked)</span>
                          )}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Icon size={15} className={disabled ? "text-[#191B1C]/20" : "text-[#191B1C]/40"} />
                          </div>
                          <input
                            type={type}
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                            disabled={disabled}
                            placeholder={placeholder}
                            className={inputCls(disabled)}
                            style={{ fontFamily: "satoshi" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest rounded-xl hover:bg-[#F42D23] active:scale-95 transition-all"
                      style={{ fontFamily: "futuraCB" }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-white rounded-2xl border border-[#191B1C]/[0.07] overflow-hidden">
                <div className="p-6 border-b border-[#191B1C]/[0.05] flex items-center justify-between">
                  <SectionHeader
                    icon={MapPin}
                    title="Delivery Addresses"
                    sub={`${addresses.length} ${addresses.length === 1 ? "address" : "addresses"} saved`}
                  />
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-widest rounded-xl hover:bg-[#F42D23] transition-all"
                    style={{ fontFamily: "futuraCB" }}
                  >
                    <Plus size={14} /> Add New
                  </button>
                </div>

                <div className="p-6">
                  {isAddressLoading ? (
                    <div className="flex justify-center py-10">
                      <span className="w-7 h-7 border-2 border-t-transparent border-[#F42D23] rounded-full animate-spin" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#191B1C]/[0.08] rounded-2xl">
                      <MapPin size={32} className="mx-auto text-[#191B1C]/15 mb-3" />
                      <p className="text-sm text-[#191B1C]/40 mb-1" style={{ fontFamily: "futuraCB" }}>No addresses yet</p>
                      <p className="text-xs text-[#191B1C]/30 mb-5" style={{ fontFamily: "satoshi" }}>
                        Add a delivery address to get started
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#191B1C] text-[#F4F4ED] text-xs uppercase tracking-wider rounded-xl hover:bg-[#F42D23] transition-colors"
                        style={{ fontFamily: "futuraCB" }}
                      >
                        <Plus size={13} /> Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr: IAddress) => (
                        <div
                          key={addr._id}
                          className={`relative p-5 rounded-2xl border-2 transition-all duration-200 ${
                            addr.isDefault
                              ? "border-[#191B1C] bg-[#191B1C]/[0.02]"
                              : "border-[#191B1C]/10 hover:border-[#191B1C]/20"
                          }`}
                        >
                          {addr.isDefault && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#191B1C] text-[#F4F4ED] text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ fontFamily: "futuraCB" }}>
                              <CheckCircle2 size={9} /> Default
                            </div>
                          )}

                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${addr.isDefault ? "bg-[#191B1C] text-[#F4F4ED]" : "bg-[#191B1C]/[0.06] text-[#191B1C]/40"}`}>
                              <MapPin size={15} />
                            </div>
                            <div className="flex-1 min-w-0 pr-10">
                              <p className="text-sm uppercase tracking-tight text-[#191B1C] truncate" style={{ fontFamily: "futuraCB" }}>
                                {addr.name}
                              </p>
                              <p className="text-xs text-[#191B1C]/50 mt-1 leading-relaxed" style={{ fontFamily: "satoshi" }}>
                                {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                              </p>
                              <p className="text-xs text-[#191B1C]/40" style={{ fontFamily: "satoshi" }}>
                                {addr.city}, {addr.state} – {addr.postalCode}
                              </p>
                              <p className="text-[11px] text-[#191B1C]/40 mt-1" style={{ fontFamily: "satoshi" }}>
                                📞 {addr.phone}
                              </p>
                            </div>
                          </div>

                          {!addr.isDefault && (
                            <button
                              onClick={async () => {
                                try {
                                  await setDefaultAddress(addr._id).unwrap();
                                  toast.success("Default address updated!");
                                  refetch();
                                } catch {
                                  toast.error("Failed to set default address.");
                                }
                              }}
                              className="mt-4 w-full py-2 border border-[#191B1C]/10 rounded-xl text-[10px] uppercase tracking-widest text-[#191B1C]/40 hover:border-[#191B1C]/30 hover:text-[#191B1C] transition-all"
                              style={{ fontFamily: "futuraCB" }}
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddressModal
          onClose={() => setIsModalOpen(false)}
          onAddressAdded={() => refetch()}
        />
      )}
    </>
  );
}
