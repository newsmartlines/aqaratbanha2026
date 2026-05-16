import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard, Building2, Heart, MessageCircle, Package, Settings,
  Plus, Eye, Phone, Star, Edit3, Trash2, MapPin, LogOut, Search,
  Bell, TrendingUp, Crown, ChevronRight, TrendingDown,
  ToggleLeft, ToggleRight, Lock, Globe, Shield, Send,
  CheckCircle, X, Menu, ArrowUpRight, Home,
  Check, Clock, XCircle, Zap, Image, Users, BarChart2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from "recharts";
import logoColor from "@assets/rgb_1778457941418.png";
import { PROPERTIES } from "@/data/properties";

const PRIMARY = "#123C79";
const PRIMARY_LIGHT = "#EEF2F8";
const PRIMARY_HOVER = "#0d2d5e";

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
  { id: 1, name: "محمد علي",  text: "هل الشقة لا تزال متاحة؟",    time: "5 دق",  unread: 2, avatar: "م" },
  { id: 2, name: "سارة أحمد", text: "هل يمكن التفاوض في السعر؟",   time: "22 دق", unread: 0, avatar: "س" },
  { id: 3, name: "خالد عمر",  text: "متى يمكنني الزيارة؟",          time: "1 س",  unread: 1, avatar: "خ" },
  { id: 4, name: "نور حسن",   text: "هل الإيجار يشمل الخدمات؟",   time: "3 س",  unread: 0, avatar: "ن" },
];

type ListingStatus = "الكل" | "نشط" | "قيد الموافقة" | "مرفوض";

const MY_LISTINGS_BASE = [
  ...PROPERTIES.slice(0, 3).map((p, i) => ({
    ...p, active: true,
    status: "نشط" as ListingStatus,
    phoneClicks: [47, 23, 61][i],
    favorites: [18, 9, 24][i],
  })),
  { ...PROPERTIES[3], active: false, status: "مرفوض" as ListingStatus,        phoneClicks: 5,  favorites: 2 },
  { ...PROPERTIES[4], active: false, status: "قيد الموافقة" as ListingStatus, phoneClicks: 0,  favorites: 0 },
];

const SETTINGS_CARDS = [
  { label: "تعديل الحساب",         icon: Users,    desc: "تحديث بياناتك الشخصية" },
  { label: "تغيير كلمة المرور",     icon: Lock,     desc: "تأمين حسابك بكلمة مرور جديدة" },
  { label: "بيانات الشركة",         icon: Building2,desc: "معلومات شركتك أو نشاطك التجاري" },
  { label: "الإشعارات",             icon: Bell,     desc: "إدارة تفضيلات التنبيهات" },
  { label: "التواصل الاجتماعي",    icon: Globe,    desc: "ربط حساباتك على السوشيال ميديا" },
  { label: "الخصوصية والأمان",     icon: Shield,   desc: "ضبط إعدادات الخصوصية والوصول" },
];

type DashListing = typeof MY_LISTINGS_BASE[0];

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string; icon: React.ElementType }> = {
  "نشط":          { label: "نشط",          color: "text-emerald-700", bg: "bg-emerald-50",  dot: "bg-emerald-500", icon: CheckCircle },
  "قيد الموافقة": { label: "قيد الموافقة", color: "text-amber-700",   bg: "bg-amber-50",    dot: "bg-amber-400",   icon: Clock },
  "مرفوض":        { label: "مرفوض",        color: "text-red-600",     bg: "bg-red-50",      dot: "bg-red-500",     icon: XCircle },
};

const BOOST_PKGS = [
  { id: "basic",   label: "أساسي",   days: 7,  price: 49,  desc: "مناسب للتجربة" },
  { id: "plus",    label: "بلس",     days: 14, price: 89,  desc: "الأكثر طلباً",  popular: true },
  { id: "premium", label: "بريميوم", days: 30, price: 149, desc: "أقصى ظهور" },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, icon: Icon }: {
  label: string; value: string; sub: string; trend?: "up" | "down"; icon: React.ElementType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100/80"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: PRIMARY_LIGHT }}>
          <Icon className="w-4 h-4" style={{ color: PRIMARY }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {trend === "up"
            ? <TrendingUp className="w-3 h-3 text-emerald-500" />
            : trend === "down"
            ? <TrendingDown className="w-3 h-3 text-red-400" />
            : null}
          <span className={`text-[11px] font-medium ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-gray-400"}`}>
            {sub}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Boost Modal ──────────────────────────────────────────────────────────────
function BoostModal({ listing, onClose }: { listing: DashListing; onClose: () => void }) {
  const [selected, setSelected] = useState("plus");
  const [done, setDone] = useState(false);
  const pkg = BOOST_PKGS.find(p => p.id === selected)!;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-gray-900 text-sm">تمييز الإعلان</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-xl p-3 flex gap-3 items-center border border-gray-100">
            <img src={listing.image} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{listing.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{listing.location}</p>
              <p className="font-bold text-sm mt-0.5" style={{ color: PRIMARY }}>{listing.priceLabel}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {BOOST_PKGS.map(p => (
              <button key={p.id} onClick={() => setSelected(p.id)}
                className={`relative rounded-xl border-2 p-4 text-right transition-all ${
                  selected === p.id ? "border-[#123C79] bg-[#EEF2F8]" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 right-3 text-white text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: PRIMARY }}>
                    الأشهر
                  </span>
                )}
                <p className="font-bold text-gray-900 text-sm">{p.label}</p>
                <p className="font-bold text-lg mt-1" style={{ color: PRIMARY }}>{p.price}<span className="text-xs font-medium text-gray-400"> ج.م</span></p>
                <p className="text-[11px] text-gray-400">{p.days} يوم</p>
                {selected === p.id && (
                  <span className="absolute top-3 left-3 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["يظهر في صدارة البحث", "شارة «مميز» على الإعلان", "زيادة المشاهدات حتى 3×", "إشعارات فورية للمهتمين"].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{f}
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors">
            إلغاء
          </button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setDone(true); setTimeout(onClose, 1500); }} disabled={done}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${done ? "bg-emerald-500" : ""}`}
            style={done ? {} : { backgroundColor: PRIMARY }}
          >
            {done ? <><CheckCircle className="w-4 h-4" /> تم التفعيل!</> : <><Star className="w-4 h-4" /> تفعيل — {pkg.price} ج.م</>}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Listing Row ──────────────────────────────────────────────────────────────
function ListingRow({ listing, onToggle, onEdit, onDelete, onBoost }: {
  listing: DashListing; onToggle: () => void; onEdit: () => void; onDelete: () => void; onBoost: () => void;
}) {
  const cfg = STATUS_CFG[listing.status] ?? { color: "text-gray-500", bg: "bg-gray-100", dot: "bg-gray-400", icon: Clock };
  const Ico = cfg.icon;
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50/70 transition-colors group border-b border-gray-100/80 last:border-0">
      <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
        <img src={listing.image} alt="" className="w-full h-full object-cover" />
        {listing.featured && (
          <span className="absolute inset-0 bg-amber-400/20 flex items-center justify-center">
            <Star className="w-3 h-3 text-amber-500" />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{listing.title}</p>
        <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
          <MapPin className="w-3 h-3" /><span className="truncate">{listing.location}</span>
          <span className="text-gray-200 mx-1">·</span>
          <span className="font-semibold" style={{ color: PRIMARY }}>{listing.priceLabel}</span>
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-5 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{listing.views}</span>
        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{listing.phoneClicks}</span>
        <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" />{listing.favorites}</span>
      </div>
      <div className={`hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {listing.status}
      </div>
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {listing.status === "نشط" && (
          <button onClick={onToggle} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            {listing.active
              ? <ToggleRight className="w-5 h-5" style={{ color: PRIMARY }} />
              : <ToggleLeft className="w-5 h-5 text-gray-300" />}
          </button>
        )}
        <button onClick={onBoost} className="w-7 h-7 rounded-lg hover:bg-amber-50 text-amber-500 flex items-center justify-center transition-colors" title="تمييز">
          <Star className="w-3.5 h-3.5" />
        </button>
        <button onClick={onEdit} className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 flex items-center justify-center transition-colors">
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-gray-500">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-bold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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
    { id: "الكل",          count: listings.length },
    { id: "نشط",           count: listings.filter(l => l.status === "نشط").length },
    { id: "قيد الموافقة",  count: listings.filter(l => l.status === "قيد الموافقة").length },
    { id: "مرفوض",         count: listings.filter(l => l.status === "مرفوض").length },
  ];

  const filteredListings = statusFilter === "الكل"
    ? listings : listings.filter(l => l.status === statusFilter);

  const NAV = [
    { id: "overview",  label: "نظرة عامة",  icon: LayoutDashboard },
    { id: "listings",  label: "إعلاناتي",   icon: Building2, badge: listings.length },
    { id: "favorites", label: "المفضلة",    icon: Heart },
    { id: "messages",  label: "الرسائل",    icon: MessageCircle, badge: MESSAGES.filter(m => m.unread > 0).length },
    { id: "plans",     label: "الباقة",     icon: Package },
    { id: "settings",  label: "الإعدادات",  icon: Settings },
  ];

  const STATS = [
    { label: "المشاهدات",       value: "24,830", sub: "+12.5% هذا الأسبوع", trend: "up" as const,   icon: Eye },
    { label: "ضغطات الهاتف",   value: "1,247",  sub: "+8.3% هذا الأسبوع",  trend: "up" as const,   icon: Phone },
    { label: "الرسائل",         value: "83",     sub: "+15.7% هذا الأسبوع", trend: "up" as const,   icon: MessageCircle },
    { label: "إعلانات نشطة",   value: "12",     sub: "من 15 إعلان",         trend: undefined,        icon: Building2 },
  ];

  const sectionTitles: Record<Section, string> = {
    overview: "نظرة عامة",
    listings: "إعلاناتي",
    favorites: "المفضلة",
    messages: "الرسائل",
    plans: "الباقة",
    settings: "الإعدادات",
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#F8F9FC] flex pt-16" dir="rtl">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden" />
        )}
      </AnimatePresence>

      {/* Boost Modal */}
      <AnimatePresence>
        {boostListing && <BoostModal listing={boostListing} onClose={() => setBoostListing(null)} />}
      </AnimatePresence>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside
        className={`w-56 flex flex-col fixed h-full z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: PRIMARY }}
      >
        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-white/10">
          <img src={logoColor} alt="عقارات بنها" className="h-7 w-auto brightness-0 invert" />
        </div>

        {/* User */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-sm">أ</div>
              <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2" style={{ borderColor: PRIMARY }} />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">أحمد محمد</p>
              <p className="text-[11px] text-white/50">المسيّر</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-2">القائمة</p>
          {NAV.map(item => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSection(item.id as Section); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? "bg-white text-[#123C79] shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon style={{ width: 16, height: 16 }} />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className={`text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 ${
                    active ? "bg-[#123C79] text-white" : "bg-white/20 text-white"
                  }`}>{item.badge}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut style={{ width: 16, height: 16 }} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:mr-56 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="font-bold text-gray-900 text-sm">{sectionTitles[section]}</p>
              <p className="text-[11px] text-gray-400">لوحة التحكم / {sectionTitles[section]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="bg-gray-50 text-sm py-2 pr-9 pl-4 rounded-xl border border-gray-200 outline-none w-52 focus:bg-white focus:border-gray-300 transition-all placeholder:text-gray-400"
                placeholder="بحث سريع..."
              />
            </div>
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-200 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            {/* Add */}
            <button
              onClick={() => navigate("/add-property")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: PRIMARY }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">إضافة عقار</span>
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
            {section === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Welcome bar */}
                <div className="rounded-2xl px-6 py-5 flex items-center justify-between text-white overflow-hidden relative" style={{ backgroundColor: PRIMARY }}>
                  <div className="relative z-10">
                    <p className="text-white/60 text-sm mb-0.5">مرحبًا بعودتك 👋</p>
                    <h2 className="text-xl font-bold">أحمد محمد</h2>
                    <p className="text-white/50 text-xs mt-1">الخميس، 14 مايو 2026</p>
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="text-left hidden sm:block">
                      <p className="text-white/60 text-xs">الباقة الحالية</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Crown className="w-4 h-4 text-amber-300" />
                        <p className="font-bold text-white text-sm">البريميوم</p>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-white/20 hidden sm:block" />
                    <button
                      onClick={() => setSection("listings")}
                      className="px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
                    >
                      إعلاناتي
                    </button>
                  </div>
                  {/* Decorative */}
                  <div className="absolute left-0 top-0 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translate(-30%, -30%)" }} />
                  <div className="absolute left-20 bottom-0 w-24 h-24 rounded-full opacity-5" style={{ background: "radial-gradient(circle, white, transparent)", transform: "translateY(40%)" }} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {STATS.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <StatCard {...s} />
                    </motion.div>
                  ))}
                </div>

                {/* Chart + Recent */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                  {/* Area Chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">أداء الأسبوع</h3>
                        <p className="text-xs text-gray-400 mt-0.5">المشاهدات والاتصالات خلال آخر 7 أيام</p>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIMARY }} />مشاهدات
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#93C5FD]" />اتصالات
                        </span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={190}>
                      <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.12} />
                            <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#93C5FD" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#93C5FD" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="مشاهدات" stroke={PRIMARY} strokeWidth={2} fill="url(#gV)" dot={false} />
                        <Area type="monotone" dataKey="اتصالات" stroke="#93C5FD" strokeWidth={2} fill="url(#gC)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">

                    {/* Recent Messages */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-sm">آخر الرسائل</h3>
                        <button onClick={() => setSection("messages")}
                          className="text-xs font-semibold flex items-center gap-0.5 hover:opacity-70 transition-opacity"
                          style={{ color: PRIMARY }}>
                          عرض الكل <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        {MESSAGES.slice(0, 3).map(msg => (
                          <div key={msg.id} onClick={() => { setSection("messages"); setActiveMsg(msg); }}
                            className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -mx-1 transition-colors">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-xs flex-shrink-0">{msg.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-xs">{msg.name}</p>
                              <p className="text-gray-400 text-[11px] truncate">{msg.text}</p>
                            </div>
                            {msg.unread > 0 && (
                              <span className="text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PRIMARY }}>
                                {msg.unread}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plan card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <h3 className="font-bold text-gray-900 text-sm">البريميوم</h3>
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">نشطة</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3">تنتهي في 1 يوليو 2025</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-[11px] mb-1.5">
                          <span className="text-gray-500">استخدام الإعلانات</span>
                          <span className="font-semibold text-gray-700">8 / 15</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "53%" }} transition={{ delay: 0.6, duration: 0.8 }}
                            className="h-full rounded-full" style={{ backgroundColor: PRIMARY }} />
                        </div>
                      </div>
                      <button onClick={() => setSection("plans")}
                        className="w-full text-white text-xs font-bold py-2 rounded-xl transition-colors"
                        style={{ backgroundColor: PRIMARY }}>
                        ترقية الباقة
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Listings table-style */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 text-sm">آخر إعلاناتي</h3>
                    <button onClick={() => setSection("listings")}
                      className="text-xs font-semibold flex items-center gap-0.5 hover:opacity-70" style={{ color: PRIMARY }}>
                      عرض الكل <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                  {listings.slice(0, 3).map(l => (
                    <div key={l.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/60 transition-colors border-b border-gray-100/60 last:border-0">
                      <img src={l.image} className="w-12 h-9 rounded-lg object-cover flex-shrink-0" alt="" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{l.title}</p>
                        <p className="text-xs text-gray-400">{l.priceLabel}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{l.views}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${l.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                          {l.active ? "نشط" : "موقوف"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* ── LISTINGS ─────────────────────────────────────────────────── */}
            {section === "listings" && (
              <motion.div key="listings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "إجمالي المشاهدات", val: listings.reduce((s, l) => s + l.views, 0).toLocaleString("ar"), icon: Eye },
                    { label: "إجمالي الاتصالات", val: listings.reduce((s, l) => s + l.phoneClicks, 0).toLocaleString("ar"), icon: Phone },
                    { label: "المحفوظة في مفضلة", val: listings.reduce((s, l) => s + l.favorites, 0).toLocaleString("ar"), icon: Heart },
                    { label: "إعلانات مميزة", val: String(listings.filter(l => l.featured).length), icon: Star },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PRIMARY_LIGHT }}>
                        <s.icon className="w-4 h-4" style={{ color: PRIMARY }} />
                      </div>
                      <div>
                        <p className="font-bold text-base text-gray-900">{s.val}</p>
                        <p className="text-[11px] text-gray-400">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="flex gap-1">
                      {FILTER_TABS.map(tab => (
                        <button key={tab.id} onClick={() => setStatusFilter(tab.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            statusFilter === tab.id
                              ? "text-white shadow-sm"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                          style={statusFilter === tab.id ? { backgroundColor: PRIMARY } : {}}
                        >
                          {tab.id}
                          <span className={`min-w-[16px] h-4 rounded-full text-[9px] flex items-center justify-center px-1 font-bold ${
                            statusFilter === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                          }`}>{tab.count}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => navigate("/add-property")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors"
                      style={{ backgroundColor: PRIMARY }}>
                      <Plus className="w-3.5 h-3.5" /> إضافة إعلان
                    </button>
                  </div>

                  {/* Rows */}
                  <AnimatePresence mode="popLayout">
                    {filteredListings.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-16 flex flex-col items-center gap-3">
                        <Building2 className="w-10 h-10 text-gray-200" />
                        <p className="text-gray-400 text-sm font-medium">لا توجد إعلانات بهذه الحالة</p>
                      </motion.div>
                    ) : (
                      filteredListings.map(listing => (
                        <motion.div key={listing.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <ListingRow
                            listing={listing}
                            onToggle={() => toggleListing(listing.id)}
                            onEdit={() => navigate(`/dashboard/edit/${listing.id}`)}
                            onDelete={() => deleteListing(listing.id)}
                            onBoost={() => setBoostListing(listing)}
                          />
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* ── FAVORITES ────────────────────────────────────────────────── */}
            {section === "favorites" && (
              <motion.div key="favorites" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900">المفضلة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROPERTIES.slice(2, 5).map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-44 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        <button className="absolute top-3 left-3 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        </button>
                        <span className="absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ backgroundColor: PRIMARY }}>
                          {p.type}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{p.title}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2"><MapPin className="w-3 h-3" />{p.location}</div>
                        <p className="font-bold text-sm" style={{ color: PRIMARY }}>{p.priceLabel}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── MESSAGES ─────────────────────────────────────────────────── */}
            {section === "messages" && (
              <motion.div key="messages" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden flex" style={{ height: "calc(100vh - 170px)", minHeight: 480 }}>
                  {/* Contacts */}
                  <div className="w-64 border-l border-gray-100 flex flex-col flex-shrink-0">
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="bg-gray-50 text-xs py-2.5 pr-9 pl-3 rounded-xl w-full outline-none placeholder:text-gray-400 border border-gray-100" placeholder="بحث..." />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {MESSAGES.map(msg => (
                        <div key={msg.id} onClick={() => setActiveMsg(msg)}
                          className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors border-b border-gray-50 ${
                            activeMsg.id === msg.id ? "bg-[#EEF2F8]" : "hover:bg-gray-50"
                          }`}>
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                            activeMsg.id === msg.id ? "text-white" : "bg-gray-100 text-gray-600"
                          }`} style={activeMsg.id === msg.id ? { backgroundColor: PRIMARY } : {}}>
                            {msg.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-800 text-xs">{msg.name}</p>
                              <span className="text-[10px] text-gray-400">{msg.time}</span>
                            </div>
                            <p className="text-gray-400 text-[11px] truncate mt-0.5">{msg.text}</p>
                          </div>
                          {msg.unread > 0 && (
                            <span className="text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PRIMARY }}>
                              {msg.unread}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat */}
                  <div className="flex-1 flex flex-col">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: PRIMARY }}>
                        {activeMsg.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{activeMsg.name}</p>
                        <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />متصل الآن
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gray-50/50">
                      <div className="flex justify-end">
                        <div className="text-white text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-xs shadow-sm" style={{ backgroundColor: PRIMARY }}>
                          مرحباً! شكراً على تواصلك معنا 😊
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs shadow-sm border border-gray-100">
                          {activeMsg.text}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex gap-2">
                      <input
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && setMsgInput("")}
                        className="flex-1 bg-gray-50 text-sm py-2.5 px-4 rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-gray-300 transition-all placeholder:text-gray-400"
                        placeholder="اكتب رسالتك..."
                      />
                      <button onClick={() => setMsgInput("")}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors"
                        style={{ backgroundColor: PRIMARY }}>
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PLANS ────────────────────────────────────────────────────── */}
            {section === "plans" && (
              <motion.div key="plans" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

                {/* Current */}
                <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ backgroundColor: PRIMARY }}>
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-5 h-5 text-amber-300" />
                        <span className="font-bold text-lg">الباقة البريميوم</span>
                        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">نشطة</span>
                      </div>
                      <p className="text-white/50 text-sm">تنتهي في 1 يوليو 2025</p>
                    </div>
                    <button className="bg-white font-bold text-sm px-5 py-2 rounded-xl transition-colors hover:bg-white/90 flex-shrink-0" style={{ color: PRIMARY }}>
                      تجديد
                    </button>
                  </div>
                  <div className="relative z-10 mt-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">استخدام الإعلانات</span>
                      <span className="font-bold">8 / 15</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "53%" }} transition={{ delay: 0.3, duration: 0.9 }}
                        className="h-full bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="absolute -left-6 -top-6 w-32 h-32 rounded-full opacity-10 bg-white" />
                  <div className="absolute left-16 bottom-0 w-20 h-20 rounded-full opacity-5 bg-white translate-y-1/2" />
                </div>

                {/* Plans grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: "الأساسية",   price: "99",  ads: "5 إعلانات",  icon: Home,  current: false },
                    { name: "البريميوم",  price: "299", ads: "15 إعلاناً", icon: Crown, current: true  },
                    { name: "الاحترافية", price: "599", ads: "غير محدود",   icon: Zap,   current: false },
                  ].map((plan, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className={`bg-white rounded-2xl border-2 p-6 relative shadow-sm ${plan.current ? "" : "border-gray-100"}`}
                      style={plan.current ? { borderColor: PRIMARY } : {}}>
                      {plan.current && (
                        <span className="absolute -top-3 right-5 text-white text-[10px] font-bold px-3 py-1 rounded-full" style={{ backgroundColor: PRIMARY }}>
                          باقتك الحالية
                        </span>
                      )}
                      <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: plan.current ? PRIMARY_LIGHT : "#F9FAFB" }}>
                        <plan.icon className="w-5 h-5" style={{ color: plan.current ? PRIMARY : "#9CA3AF" }} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-base mb-1">{plan.name}</h3>
                      <p className="text-3xl font-bold text-gray-900 mb-0.5">{plan.price}
                        <span className="text-sm text-gray-400 font-normal"> ج.م/شهر</span>
                      </p>
                      <p className="text-sm text-gray-400 mb-5">{plan.ads}</p>
                      <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${
                        plan.current ? "cursor-default text-white" : "bg-gray-900 text-white hover:bg-gray-800"
                      }`} style={plan.current ? { backgroundColor: PRIMARY } : {}}>
                        {plan.current ? "✓ باقتك الحالية" : "الترقية الآن"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── SETTINGS ─────────────────────────────────────────────────── */}
            {section === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SETTINGS_CARDS.map((card, i) => (
                    <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl border border-gray-100/80 p-4 text-right flex items-center gap-3 hover:shadow-md transition-all shadow-sm group">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ backgroundColor: PRIMARY_LIGHT }}>
                        <card.icon className="w-[18px] h-[18px]" style={{ color: PRIMARY }} />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-bold text-gray-900 text-sm">{card.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>

                {/* Profile form */}
                <div className="bg-white rounded-2xl border border-gray-100/80 p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100 text-sm">تعديل الملف الشخصي</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: PRIMARY }}>أ</div>
                      <button className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                        <Image className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">أحمد محمد</p>
                      <p className="text-sm text-gray-400">المسيّر — منذ يناير 2024</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "الاسم الكامل",      value: "أحمد محمد السيد",   type: "text" },
                      { label: "البريد الإلكتروني", value: "ahmed@example.com", type: "email" },
                      { label: "رقم الهاتف",         value: "01012345678",       type: "tel" },
                      { label: "المدينة",            value: "بنها، القليوبية",   type: "text" },
                    ].map((f, i) => (
                      <div key={i}>
                        <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                        <input defaultValue={f.value} type={f.type}
                          className="w-full py-2.5 px-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-300 focus:bg-white transition-all" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                      style={{ backgroundColor: PRIMARY }}>
                      <CheckCircle className="w-4 h-4" /> حفظ التغييرات
                    </button>
                    <button className="px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors">
                      إلغاء
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
    </>
  );
}
