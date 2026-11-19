import { useState, useEffect, useRef } from "react";
import {
  User,
  ShieldCheck,
  Bell,
  CircleHelp,
  Info,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

export default function ProfileMenu({ user, role, onLogout }) {
  const [open, setOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const menuRef = useRef(null);

  const username =
    user?.displayName || user?.email?.split("@")[0] || "User";

  const initial = username.charAt(0).toUpperCase();
  const roleName = role === "admin" ? "Administrator" : "Peternak";

  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setActiveModal(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const menuItems = [
    { name: "My Profile", icon: User },
    { name: "Account Information", icon: ShieldCheck },
    { name: "Notification Info", icon: Bell },
    { name: "Help & Support", icon: CircleHelp },
    { name: "About DreamSheep", icon: Info },
  ];

  const openModal = (name) => {
    setActiveModal(name);
    setOpen(false);
  };

  const infoRow = (label, value) => (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-[#23436B] break-all">
        {value}
      </p>
    </div>
  );

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          title="Profile Menu"
          aria-label="Buka menu profil"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full bg-[#A7C6E8]
          flex items-center justify-center font-bold
          text-[#23436B] hover:ring-4 hover:ring-blue-100
          transition cursor-pointer"
        >
          {initial}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-3
          w-72 max-w-[calc(100vw-2rem)] bg-white rounded-2xl
          shadow-xl border border-slate-100 z-50 overflow-hidden">

            <div className="p-5 bg-[#F5F7FA] flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 rounded-full
              bg-[#A7C6E8] flex items-center justify-center
              text-[#23436B] font-bold text-lg">
                {initial}
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-[#23436B] capitalize truncate">
                  {username}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email}
                </p>
                <span className="inline-block mt-1 text-xs
                bg-blue-100 text-[#23436B] rounded-full px-2 py-1">
                  {roleName}
                </span>
              </div>
            </div>

            <div className="p-2">
              {menuItems.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => openModal(name)}
                  className="w-full flex items-center gap-3
                  px-3 py-3 rounded-xl text-sm text-slate-600
                  hover:bg-blue-50 hover:text-[#23436B]
                  transition cursor-pointer"
                >
                  <Icon size={18} className="text-[#4F7EB6]" />
                  <span className="flex-1 text-left">{name}</span>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 p-2">
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3
                px-3 py-3 rounded-xl text-sm font-medium
                text-red-500 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm
          z-[100] flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeModal}
            className="bg-white rounded-3xl shadow-2xl
            w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#23436B]">
                {activeModal}
              </h2>

              <button
                aria-label="Tutup"
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {activeModal === "My Profile" && (
              <div className="space-y-3">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full
                  bg-[#A7C6E8] flex items-center justify-center
                  text-3xl font-bold text-[#23436B]">
                    {initial}
                  </div>
                  <h3 className="mt-3 font-bold text-lg
                  text-[#23436B] capitalize">
                    {username}
                  </h3>
                  <p className="text-sm text-slate-500">{roleName}</p>
                </div>

                {infoRow("Username", username)}
                {infoRow("Email", user?.email || "-")}
                {infoRow("Role", roleName)}
              </div>
            )}

            {activeModal === "Account Information" && (
              <div className="space-y-3">
                {infoRow("Account Status", "Active")}
                {infoRow("Account Role", roleName)}
                {infoRow("Authentication", "Firebase Authentication")}
                {infoRow(
                  "Hak Akses",
                  role === "admin"
                    ? "Dashboard, Monitoring, Riwayat Data, Notifikasi, Pengaturan"
                    : "Dashboard, Monitoring, Riwayat Data, Notifikasi"
                )}
              </div>
            )}

            {activeModal === "Notification Info" && (
              <div className="space-y-3">
                {infoRow("Notification Channel", "WhatsApp Group")}
                {infoRow("Notification System", "DreamSheep Monitoring")}
                {infoRow("Parameter", "Suhu, Kelembapan, THI, dan Amonia")}

                <p className="text-sm text-slate-500 leading-relaxed">
                  Sistem dirancang untuk mengirimkan peringatan
                  otomatis melalui WhatsApp ketika kondisi
                  lingkungan kandang berada di luar batas parameter.
                  Pengiriman bergantung pada status backend.
                </p>
              </div>
            )}

            {activeModal === "Help & Support" && (
              <div className="space-y-3">
                {infoRow("Dashboard", "Melihat ringkasan kondisi kandang.")}
                {infoRow("Monitoring", "Memantau parameter sensor dan aktuator.")}
                {infoRow("Riwayat Data", "Melihat rekaman data sensor.")}
                {infoRow("Notifikasi", "Melihat peringatan kondisi kandang.")}
                {infoRow("Bantuan Teknis", "Hubungi administrator DreamSheep.")}
              </div>
            )}

            {activeModal === "About DreamSheep" && (
              <div className="text-center">
                <img
                  src="/dreamsheep-logo.png"
                  alt="DreamSheep Logo"
                  className="w-40 h-28 object-contain mx-auto mb-4"
                />

                <h3 className="text-xl font-bold text-[#23436B]">
                  DreamSheep
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Smart Livestock Monitoring System
                </p>

                <p className="text-sm text-slate-600 leading-relaxed mt-5">
                  Sistem monitoring lingkungan kandang domba
                  berbasis Internet of Things yang terintegrasi
                  dengan Firebase dan notifikasi WhatsApp untuk
                  mendukung pengelolaan peternakan.
                </p>

                <div className="mt-6 bg-slate-50 rounded-xl p-4">
                  <p className="font-semibold text-[#23436B]">
                    IPB University
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    DreamSheep © 2026
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 bg-[#23436B] text-white
              py-3 rounded-xl font-medium hover:bg-[#4F7EB6]
              transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}