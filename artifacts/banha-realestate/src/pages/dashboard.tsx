import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Building2, Heart, MessageCircle, Package, Settings,
  Plus, Eye, Phone, Star, Edit3, Trash2, MapPin, LogOut, Search,
  Bell, TrendingUp, Crown, ChevronRight,
  ToggleLeft, ToggleRight, Lock, Globe, Shield, Send,
  CheckCircle, X, Menu, ArrowUpRight, Home,
  Check, Clock, XCircle, Zap, Image, Users,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import logoColor from "@assets/rgb_1778457941418.png";
import { PROPERTIES } from "@/data/properties";

type Section = "overview" | "listings" | "favorites" | "messages" | "plans" | "settings";

const CHART_DATA = [
  { day: "السبت",    مشاهدات: 320, اتصالات: 45 },
  { day: "الأحد",   مشاهدات: 480, اتصالات: 62 },
  { day: "الاثنين", مشاهدات: 390, اتصالات: 38 },
  { day: "الثلاثاء",مشاهدات: 610, اتصالات: 88 },
  { day: "الأربعاء",مشاهدات: 520, اتصالات: 74 },
  { day: "الخميس",  مشاهدات: 780, اتصالات: 102 },
  { day: "الجمعة",  مشاهدات: 920, اتصالات: 130 },
];

const MESSAGES = [
  { id: 1, name: "محمد علي",  text: "هل الشقة لا تزال متاحة؟", time: "5 دق",  unread: 2, avatar: "م" },
  { id: 2, name: "سارة أحمد", text: "هل يمكن التفاوض في السعر؟",  time: "22 دق", unread: 0, avatar: "س" },
  { id: 3, name: "خالد عمر",  text: "متى يمكنني الزيارة؟",         time: "1 س",  unread: 1, avatar: "خ" },
  { id: 4, name: "نور حسن",   text: "هل الإيجار يشمل الخدمات؟",  time: "3 س",  unread: 0, avatar: "ن" },
];

type ListingStatus = "الكل" | "نشط" | "قيد الموافقة" | "مرفوض";

const MY_LISTINGS_BASE = [
  ...PROPERTIES.slice(0, 3).map((p, i) => ({
    ...p,
    active: true,
    status: "نشط" as ListingStatus,
    phoneClicks: [47, 23, 61][i],
    favorites: [18, 9, 24][i],
  })),
  { ...PROPERTIES[3], active: false, status: "مرفوض" as ListingStatus, phoneClicks: 5,  favorites: 2 },
  { ...PROPERTIES[4], active: false, status: "قيد الموافقة" as ListingStatus, phoneClicks: 0, favorites: 0 },
];

const SETTINGS_CARDS = [
  { label: "تعديل الحساب",          icon: Users,    desc: "تحديث بياناتك الشخصية" },
  { label: "تغيير كلمة المرور",      icon: Lock,     desc: "تأمين حسابك بكلمة مرور جديدة" },
  { label: "بيانات الشركة",          icon: Building2,desc: "معلومات شركتك أو نشاطك التجاري" },
  { label: "الإشعارات والتنبيهات",  icon: Bell,     desc: "إدارة تفضيلات التنبيهات" },
  { label: "التواصل الاجتماعي",     icon: Globe,    desc: "ربط حساباتك على السوشيال ميديا" },
  { label: "الخصوصية والأمان",      icon: Shield,   desc: "ضبط إعدادات الخصوصية والوصول" },
];

type DashListing = typeof MY_LISTINGS_BASE[0];

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "نشط":          { color: "text-emerald-600", bg: "bg-emerald-50",  icon: CheckCircle },
  "قيد الموافقة": { color: "text-amber-600",   bg: "bg-amber-50",    icon: Clock },
  "مرفوض":        { color: "text-red-500",     bg: "bg-red-50",      icon: XCircle },
};

// ─── Boost packages ───────────────────────────────────────────────────────────
const BOOST_PKGS = [
  { id: "basic",   label: "أساسي",   days: 7,  price: 49,  desc: "مناسب للتجربة" },
  { id: "plus",    label: "بلس",     days: 14, price: 89,  desc: "الأكثر طلباً",  popular: true },
  { id: "premium", label: "بريميوم", days: 30, price: 149, desc: "أقصى ظهور ممكن" },
];

// ─── BoostModal ───────────────────────────────────────────────────────────────
function BoostModal({ listing, onClose }: { listing: DashListing; onClose: () => void }) {
  const [selected, setSelected] = useState("plus");
  const [done, setDone] = useState(false);
  const pkg = BOOST_PKGS.find(p => p.id === selected)!;

  const confirm = () => {
    setDone(true);
    setTimeout(onClose, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-gray-900">تمييز الإعلان</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Preview */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-3">معاينة الإعلان المميز</p>
            <div className="border-2 border-amber-400 rounded-xl p-3 flex gap-3 items-center bg-amber-50/30 relative">
              <span className="absolute -top-2.5 right-4 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-2.5 h-2.5" /> إعلان مميز
              </span>
              <img src={listing.image} alt={listing.title} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{listing.title}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{listing.location}
                </p>
                <p className="text-[#123C79] font-bold text-sm mt-1">{listing.priceLabel}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-600 font-semibold">+300% مشاهدات</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">يظهر في الصدارة</p>
              </div>
            </div>
          </div>

          {/* Packages */}
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-3">اختر باقة التمييز</p>
            <div className="grid grid-cols-3 gap-3">
              {BOOST_PKGS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`relative rounded-xl border-2 p-4 text-right transition-all ${
                    selected === p.id
                      ? "border-[#123C79] bg-[#123C79]/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 right-3 bg-[#123C79] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      الأشهر
                    </span>
                  )}
                  <p className="font-bold text-gray-900 text-sm">{p.label}</p>
                  <p className="text-[#123C79] font-bold text-lg mt-1">{p.price}<span className="text-xs font-medium text-gray-400"> ج.م</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.days} يوم</p>
                  <p className="text-[10px] text-gray-400 mt-1">{p.desc}</p>
                  {selected === p.id && (
                    <span className="absolute top-3 left-3 w-4 h-4 bg-[#123C79] rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* What you get */}
          <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
            {["يظهر في صدارة نتائج البحث", "شارة «مميز» على الإعلان", "زيادة المشاهدات حتى 3×", "إشعارات فورية للمهتمين"].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors">
            إلغاء
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={confirm}
            disabled={done}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
              done ? "bg-emerald-500" : "bg-[#123C79] hover:bg-[#0d2d5e]"
            }`}
          >
            {done ? <><CheckCircle className="w-4 h-4" /> تم التفعيل!</> : <>
              <Star className="w-4 h-4" /> تفعيل التمييز — {pkg.price} ج.م
            </>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ListingCard ──────────────────────────────────────────────────────────────
function ListingCard({ listing, onToggle, onEdit, onDelete, onBoost }: {
  listing: DashListing;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onBoost: () => void;
}) {
  const cfg = STATUS_CFG[listing.status] ?? { color: "text-gray-400", bg: "bg-gray-100", icon: Clock };
  const Ico = cfg.icon;
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 items-start hover:border-gray-200 transition-colors">
      {/* Thumb */}
      <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
        {listing.featured && (
          <span className="absolute top-1.5 right-1.5 bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Star className="w-2 h-2" /> مميز
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1 flex-1">{listing.title}</h3>
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
            <Ico className="w-3 h-3" />{listing.status}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{listing.location}</span>
          <span className="text-gray-200 mx-1">·</span>
          <span className="text-[#123C79] font-semibold">{listing.priceLabel}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{listing.views}</span>
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{listing.phoneClicks}</span>
          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{listing.favorites}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        {listing.status === "نشط" && (
          <button onClick={onToggle} title={listing.active ? "إيقاف" : "تفعيل"}>
            {listing.active
              ? <ToggleRight className="w-8 h-8 text-[#123C79]" />
              : <ToggleLeft className="w-8 h-8 text-gray-300" />}
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBoost}
            title="تمييز الإعلان"
            className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-500 flex items-center justify-center transition-colors"
          >
            <Star className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onEdit}
            title="تعديل"
            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="حذف"
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [section, setSection]           = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [listings, setListings]         = useState<DashListing[]>(MY_LISTINGS_BASE);
  const [statusFilter, setStatusFilter] = useState<ListingStatus>("الكل");
  const [activeMsg, setActiveMsg]       = useState(MESSAGES[0]);
  const [msgInput, setMsgInput]         = useState("");
  const [boostListing, setBoostListing] = useState<DashListing | null>(null);
  const [, navigate]                    = useLocation();

  const toggleListing = (id: number) =>
    setListings(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));

  const deleteListing = (id: number) =>
    setListings(prev => prev.filter(l => l.id !== id));

  const FILTER_TABS: { id: ListingStatus; count: number }[] = [
    { id: "الكل",          count: 169 },
    { id: "نشط",           count: 145 },
    { id: "قيد الموافقة", count: 0 },
    { id: "مرفوض",        count: 24 },
  ];

  const filteredListings = statusFilter === "الكل"
    ? listings
    : listings.filter(l => l.status === statusFilter);

  const NAV_ITEMS = [
    { id: "overview",   label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "listings",   label: "إعلاناتي",     icon: Building2, badge: listings.length },
    { id: "favorites",  label: "المفضلة",       icon: Heart },
    { id: "messages",   label: "الرسائل",       icon: MessageCircle, badge: 3 },
    { id: "plans",      label: "باقتي",         icon: Package },
    { id: "settings",   label: "الإعدادات",     icon: Settings },
  ];

  const STATS = [
    { label: "المشاهدات",        value: "24,830", sub: "+12.5% هذا الأسبوع", icon: Eye },
    { label: "ضغطات الهاتف",    value: "1,247",  sub: "+8.3% هذا الأسبوع",  icon: Phone },
    { label: "الرسائل",          value: "83",     sub: "+15.7% هذا الأسبوع", icon: MessageCircle },
    { label: "إعلانات منشورة",  value: "12",     sub: "نشطة الآن",           icon: Building2 },
    { label: "إعلانات مميزة",   value: "5",      sub: "+16.6%",              icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Boost Modal */}
      <AnimatePresence>
        {boostListing && <BoostModal listing={boostListing} onClose={() => setBoostListing(null)} />}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`w-60 bg-white border-l border-gray-100 flex flex-col fixed h-full z-30 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>

        <div className="px-5 py-4 border-b border-gray-100">
          <img src={logoColor} alt="عقارات بنها" className="h-7 w-auto" />
        </div>

        {/* User */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#123C79] flex items-center justify-center text-white font-bold text-sm">أ</div>
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">أحمد محمد</p>
            <p className="text-[11px] text-gray-400">المسيّر</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id as Section); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${section === item.id
                  ? "bg-[#EEF2F8] text-[#123C79]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <span className="flex items-center gap-2.5">
                <item.icon style={{ width: 17, height: 17 }} />
                {item.label}
              </span>
              {item.badge ? (
                <span className={`text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1
                  ${section === item.id ? "bg-[#123C79] text-white" : "bg-gray-100 text-gray-500"}`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut style={{ width: 17, height: 17 }} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 lg:mr-60 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="bg-gray-50 text-sm py-1.5 pr-9 pl-4 rounded-lg border border-gray-200 outline-none w-64 focus:border-[#123C79]/50 focus:bg-white transition-all placeholder:text-gray-400"
                placeholder="بحث..."
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors">
              <Bell style={{ width: 17, height: 17 }} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="relative w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors">
              <MessageCircle style={{ width: 17, height: 17 }} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#123C79] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#123C79] flex items-center justify-center text-white font-bold text-sm cursor-pointer mr-1">أ</div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-5 lg:p-7">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {section === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                {/* Welcome */}
                <div className="bg-[#123C79] rounded-xl px-6 py-5 flex items-center justify-between text-white">
                  <div>
                    <p className="text-white/80 text-sm mb-0.5">مرحبًا بعودتك 👋</p>
                    <h2 className="text-xl font-bold mb-3">أحمد محمد</h2>
                    <button
                      onClick={() => navigate("/add-property")}
                      className="bg-white text-[#123C79] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> إضافة عقار
                    </button>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=240&q=80"
                    alt=""
                    className="w-36 h-24 object-cover rounded-xl opacity-80 hidden sm:block"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {STATS.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-xl border border-gray-100 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <s.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                      <p className="text-[10px] text-[#123C79] mt-1 font-medium">{s.sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Chart + side */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">إحصائيات الأسبوع</h3>
                        <p className="text-xs text-gray-400 mt-0.5">آخر 7 أيام</p>
                      </div>
                      <div className="flex gap-3 text-xs">
                        <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2 h-2 rounded-full bg-[#123C79]" />مشاهدات</span>
                        <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2 h-2 rounded-full bg-[#93C5FD]" />اتصالات</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#123C79" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#123C79" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#93C5FD" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #f3f4f6", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }} />
                        <Area type="monotone" dataKey="مشاهدات" stroke="#123C79" strokeWidth={2} fill="url(#gV)" dot={false} />
                        <Area type="monotone" dataKey="اتصالات" stroke="#93C5FD" strokeWidth={2} fill="url(#gC)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    {/* Recent messages */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm">آخر الرسائل</h3>
                        <button onClick={() => setSection("messages")} className="text-[#123C79] text-xs font-medium hover:underline">الكل</button>
                      </div>
                      <div className="space-y-2">
                        {MESSAGES.slice(0, 3).map(msg => (
                          <div key={msg.id}
                            onClick={() => { setSection("messages"); setActiveMsg(msg); }}
                            className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-xs flex-shrink-0">{msg.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-xs truncate">{msg.name}</p>
                              <p className="text-gray-400 text-[11px] truncate">{msg.text}</p>
                            </div>
                            {msg.unread > 0 && (
                              <span className="bg-[#123C79] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{msg.unread}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plan */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <h3 className="font-semibold text-gray-900 text-sm">الباقة البريميوم</h3>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">نشطة</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3">سارية حتى 1 يوليو 2025</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                          <span>الإعلانات</span><span>8 / 15</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: "53%" }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-full bg-[#123C79] rounded-full"
                          />
                        </div>
                      </div>
                      <button onClick={() => setSection("plans")}
                        className="w-full bg-[#123C79] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#0d2d5e] transition-colors">
                        ترقية الباقة
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent listings */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm">آخر إعلاناتي</h3>
                    <button onClick={() => setSection("listings")} className="text-[#123C79] text-xs font-medium flex items-center gap-1">
                      عرض الكل <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {listings.slice(0, 3).map(l => (
                      <div key={l.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <img src={l.image} className="w-12 h-9 rounded-lg object-cover flex-shrink-0" alt={l.title} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">{l.title}</p>
                          <p className="text-xs text-gray-400">{l.priceLabel}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{l.views}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${l.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                            {l.active ? "نشط" : "موقوف"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* ── LISTINGS ── */}
            {section === "listings" && (
              <motion.div key="listings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">إعلاناتي</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{filteredListings.length} إعلان</p>
                  </div>
                  <button
                    onClick={() => navigate("/add-property")}
                    className="bg-[#123C79] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-[#0d2d5e] transition-colors"
                  >
                    <Plus className="w-4 h-4" /> إضافة إعلان
                  </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 border-b border-gray-100 overflow-x-auto">
                  {FILTER_TABS.map(tab => {
                    const dotColor: Record<ListingStatus, string> = {
                      "الكل": "bg-gray-400",
                      "نشط": "bg-emerald-500",
                      "قيد الموافقة": "bg-amber-500",
                      "مرفوض": "bg-red-500",
                    };
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                          statusFilter === tab.id
                            ? "border-[#123C79] text-[#123C79]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor[tab.id]}`} />
                        {tab.id}
                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                          statusFilter === tab.id ? "bg-[#123C79]/10 text-[#123C79]" : "bg-gray-100 text-gray-500"
                        }`}>{tab.count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "المشاهدات", val: listings.reduce((s, l) => s + l.views, 0).toLocaleString("ar"),       icon: Eye   },
                    { label: "الاتصالات", val: listings.reduce((s, l) => s + l.phoneClicks, 0).toLocaleString("ar"), icon: Phone },
                    { label: "المفضلة",   val: listings.reduce((s, l) => s + l.favorites, 0).toLocaleString("ar"),   icon: Heart },
                    { label: "مميزة",     val: String(listings.filter(l => l.featured).length),                      icon: Star  },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-2.5">
                      <s.icon className="w-4 h-4 text-[#123C79] flex-shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-gray-900">{s.val}</p>
                        <p className="text-[11px] text-gray-400">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cards */}
                <AnimatePresence mode="popLayout">
                  {filteredListings.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="bg-white rounded-xl border border-gray-100 py-16 flex flex-col items-center gap-3 text-center">
                      <Building2 className="w-10 h-10 text-gray-200" />
                      <p className="text-gray-500 font-medium">لا توجد إعلانات بهذه الحالة</p>
                      <button onClick={() => navigate("/add-property")} className="bg-[#123C79] text-white px-5 py-2 rounded-lg font-semibold text-sm">
                        إضافة إعلان
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {filteredListings.map(listing => (
                        <motion.div key={listing.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <ListingCard
                            listing={listing}
                            onToggle={() => toggleListing(listing.id)}
                            onEdit={() => navigate(`/dashboard/edit/${listing.id}`)}
                            onDelete={() => deleteListing(listing.id)}
                            onBoost={() => setBoostListing(listing)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>

              </motion.div>
            )}

            {/* ── FAVORITES ── */}
            {section === "favorites" && (
              <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">المفضلة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROPERTIES.slice(2, 5).map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-colors">
                      <div className="relative h-40 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        <button className="absolute top-2.5 left-2.5 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        </button>
                        <span className="absolute top-2.5 right-2.5 bg-[#123C79] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">{p.type}</span>
                      </div>
                      <div className="p-3.5">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{p.title}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2"><MapPin className="w-3 h-3" />{p.location}</div>
                        <p className="text-[#123C79] font-bold text-sm">{p.priceLabel}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── MESSAGES ── */}
            {section === "messages" && (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-lg font-bold text-gray-900 mb-4">الرسائل</h2>
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex" style={{ height: "calc(100vh - 200px)", minHeight: 440 }}>
                  {/* Contacts */}
                  <div className="w-64 border-l border-gray-100 flex flex-col flex-shrink-0">
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="bg-gray-50 text-xs py-2 pr-9 pl-3 rounded-lg w-full outline-none placeholder:text-gray-400 border border-gray-100" placeholder="بحث..." />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                      {MESSAGES.map(msg => (
                        <div key={msg.id} onClick={() => setActiveMsg(msg)}
                          className={`flex items-center gap-2.5 p-3 cursor-pointer transition-colors
                            ${activeMsg.id === msg.id ? "bg-[#EEF2F8]" : "hover:bg-gray-50"}`}>
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">{msg.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-800 text-xs">{msg.name}</p>
                              <span className="text-[10px] text-gray-400">{msg.time}</span>
                            </div>
                            <p className="text-gray-400 text-[11px] truncate mt-0.5">{msg.text}</p>
                          </div>
                          {msg.unread > 0 && (
                            <span className="bg-[#123C79] text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center flex-shrink-0">{msg.unread}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat */}
                  <div className="flex-1 flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">{activeMsg.avatar}</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{activeMsg.name}</p>
                        <p className="text-[11px] text-emerald-500">متصل الآن</p>
                      </div>
                    </div>
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                      <div className="flex justify-end">
                        <div className="bg-[#123C79] text-white text-sm px-4 py-2.5 rounded-xl rounded-tl-sm max-w-xs">
                          مرحباً! شكراً على تواصلك معنا 😊
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-700 text-sm px-4 py-2.5 rounded-xl rounded-tr-sm max-w-xs border border-gray-100">
                          {activeMsg.text}
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-100 flex gap-2">
                      <input
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && setMsgInput("")}
                        className="flex-1 bg-gray-50 text-sm py-2 px-3.5 rounded-lg border border-gray-200 outline-none focus:border-[#123C79]/50 placeholder:text-gray-400"
                        placeholder="اكتب رسالتك..."
                      />
                      <button
                        onClick={() => setMsgInput("")}
                        className="w-9 h-9 bg-[#123C79] rounded-lg flex items-center justify-center text-white hover:bg-[#0d2d5e] transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PLANS ── */}
            {section === "plans" && (
              <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">باقتي</h2>
                  <p className="text-sm text-gray-400">إدارة اشتراكك وتفاصيل باقتك الحالية</p>
                </div>

                {/* Current plan */}
                <div className="bg-[#123C79] rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-5 h-5 text-amber-300" />
                        <span className="font-bold text-lg">الباقة البريميوم</span>
                        <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">نشطة</span>
                      </div>
                      <p className="text-white/60 text-sm">تنتهي في 1 يوليو 2025</p>
                    </div>
                    <button className="bg-white text-[#123C79] px-5 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors flex-shrink-0">
                      تجديد
                    </button>
                  </div>
                  <div className="mt-5">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80">استخدام الإعلانات</span><span>8 / 15</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "53%" }} transition={{ delay: 0.3, duration: 0.9 }}
                        className="h-full bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: "الأساسية",   price: "99",  ads: "5 إعلانات",   icon: Home,  current: false },
                    { name: "البريميوم",  price: "299", ads: "15 إعلاناً",  icon: Crown, current: true  },
                    { name: "الاحترافية", price: "599", ads: "غير محدود",    icon: Zap,   current: false },
                  ].map((plan, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className={`bg-white rounded-xl border-2 p-5 relative ${plan.current ? "border-[#123C79]" : "border-gray-100"}`}>
                      {plan.current && (
                        <span className="absolute -top-3 right-4 bg-[#123C79] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                          باقتك الحالية
                        </span>
                      )}
                      <plan.icon className={`w-6 h-6 mb-3 ${plan.current ? "text-[#123C79]" : "text-gray-400"}`} />
                      <h3 className="font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-2xl font-bold text-gray-900 mb-0.5">{plan.price}<span className="text-sm text-gray-400 font-normal"> ج.م/شهر</span></p>
                      <p className="text-sm text-gray-500 mb-4">{plan.ads}</p>
                      <button className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${plan.current
                        ? "bg-[#123C79]/10 text-[#123C79] cursor-default"
                        : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                        {plan.current ? "✓ باقتك الحالية" : "الترقية"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── SETTINGS ── */}
            {section === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">الإعدادات</h2>
                  <p className="text-sm text-gray-400">إدارة حسابك وتفضيلاتك</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SETTINGS_CARDS.map((card, i) => (
                    <motion.button key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-xl border border-gray-100 p-4 text-right flex items-center gap-3 hover:border-gray-200 transition-colors group">
                      <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#EEF2F8] transition-colors">
                        <card.icon className="w-4.5 h-4.5 text-gray-500 group-hover:text-[#123C79] transition-colors" style={{ width: 18, height: 18 }} />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-semibold text-gray-900 text-sm">{card.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#123C79] transition-colors flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>

                {/* Profile form */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100 text-sm">تعديل الملف الشخصي</h3>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-[#123C79] flex items-center justify-center text-white font-bold text-xl">أ</div>
                      <button className="absolute -bottom-1 -left-1 w-5 h-5 bg-white rounded-full border border-gray-200 shadow flex items-center justify-center">
                        <Image className="w-2.5 h-2.5 text-gray-500" style={{ width: 10, height: 10 }} />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">أحمد محمد</p>
                      <p className="text-sm text-gray-400">المسيّر — منذ يناير 2024</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "الاسم الكامل",       value: "أحمد محمد السيد",   type: "text" },
                      { label: "البريد الإلكتروني",  value: "ahmed@example.com", type: "email" },
                      { label: "رقم الهاتف",          value: "01012345678",       type: "tel" },
                      { label: "المدينة",             value: "بنها، القليوبية",   type: "text" },
                    ].map((f, i) => (
                      <div key={i}>
                        <label className="text-xs font-medium text-gray-500 block mb-1.5">{f.label}</label>
                        <input
                          defaultValue={f.value}
                          type={f.type}
                          className="w-full py-2.5 px-3.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#123C79]/50 focus:bg-white transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="bg-[#123C79] text-white px-6 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-[#0d2d5e] transition-colors">
                      <CheckCircle className="w-4 h-4" /> حفظ
                    </button>
                    <button className="px-5 py-2 rounded-lg font-medium text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors">إلغاء</button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
