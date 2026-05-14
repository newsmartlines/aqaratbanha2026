import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Building2, Heart, MessageCircle, Package, Settings,
  Plus, Eye, Phone, Star, Edit3, Trash2, MapPin, LogOut, Search,
  Bell, Mail, TrendingUp, TrendingDown, Crown, Zap, ChevronRight,
  ToggleLeft, ToggleRight, Image, Lock, Globe, Shield, Send,
  CheckCircle, X, Menu, BarChart3, Users, ArrowUpRight, Home,
  Megaphone, Check
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import logoColor from "@assets/rgb_1778457941418.png";
import { PROPERTIES } from "@/data/properties";

type Section = "overview" | "listings" | "favorites" | "messages" | "plans" | "settings";

const CHART_DATA = [
  { day: "السبت", مشاهدات: 320, اتصالات: 45 },
  { day: "الأحد", مشاهدات: 480, اتصالات: 62 },
  { day: "الاثنين", مشاهدات: 390, اتصالات: 38 },
  { day: "الثلاثاء", مشاهدات: 610, اتصالات: 88 },
  { day: "الأربعاء", مشاهدات: 520, اتصالات: 74 },
  { day: "الخميس", مشاهدات: 780, اتصالات: 102 },
  { day: "الجمعة", مشاهدات: 920, اتصالات: 130 },
];

const MESSAGES = [
  { id: 1, name: "محمد علي", text: "هل الشقة لا تزال متاحة؟ أرغب في المعاينة", time: "منذ 5 دق", unread: 2, avatar: "م" },
  { id: 2, name: "سارة أحمد", text: "هل يمكن التفاوض في السعر؟ شكراً جزيلاً", time: "منذ 22 دق", unread: 0, avatar: "س" },
  { id: 3, name: "خالد عمر", text: "متى يمكنني الزيارة لمعاينة الفيلا؟", time: "منذ 1 س", unread: 1, avatar: "خ" },
  { id: 4, name: "نور حسن", text: "هل الإيجار يشمل الخدمات؟ أحتاج للمعرفة", time: "منذ 3 س", unread: 0, avatar: "ن" },
];

const MY_LISTINGS = PROPERTIES.slice(0, 4).map((p, i) => ({
  ...p,
  active: i !== 2,
  phoneClicks: Math.floor(Math.random() * 60 + 10),
  favorites: Math.floor(Math.random() * 25 + 3),
}));

const QUICK_ACTIONS = [
  { label: "إضافة عقار", icon: Plus, color: "from-[#1EBFD5] to-[#17a8bd]", href: "/add-property" },
  { label: "إضافة إعلان", icon: Megaphone, color: "from-[#123C79] to-[#1a5499]", href: "#" },
  { label: "الرسائل", icon: MessageCircle, color: "from-violet-500 to-violet-600", href: "#" },
  { label: "تمييز الإعلانات", icon: Star, color: "from-amber-400 to-amber-500", href: "#" },
];

const SETTINGS_CARDS = [
  { label: "تعديل الحساب", icon: Users, desc: "تحديث بياناتك الشخصية" },
  { label: "تغيير كلمة المرور", icon: Lock, desc: "تأمين حسابك بكلمة مرور جديدة" },
  { label: "بيانات الشركة", icon: Building2, desc: "معلومات شركتك أو نشاطك التجاري" },
  { label: "الإشعارات والتنبيهات", icon: Bell, desc: "إدارة تفضيلات التنبيهات" },
  { label: "التواصل الاجتماعي", icon: Globe, desc: "ربط حساباتك على السوشيال ميديا" },
  { label: "الخصوصية والأمان", icon: Shield, desc: "ضبط إعدادات الخصوصية والوصول" },
];

function StatCard({ label, value, trend, icon: Icon, iconColor, delay = 0 }: {
  label: string; value: string; trend: string; icon: React.ElementType;
  iconColor: string; delay?: number;
}) {
  const isUp = trend.startsWith("+");
  const isFlat = trend === "–" || trend === "0";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        {!isFlat && (
          <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-xs font-semibold text-gray-400">{label}</p>
    </motion.div>
  );
}

function ListingCard({ listing, onToggle }: { listing: typeof MY_LISTINGS[0]; onToggle: () => void }) {
  const [deleted, setDeleted] = useState(false);
  if (deleted) return null;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1EBFD5]/20 transition-all p-5 flex gap-5 items-center group"
    >
      <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {listing.featured && (
          <span className="absolute top-2 right-2 bg-amber-400 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5" /> مميز
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-black text-gray-900 truncate text-sm leading-tight">{listing.title}</h3>
          <span className={`mr-2 text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${listing.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
            {listing.active ? "منشور" : "موقوف"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <MapPin className="w-3 h-3" />{listing.location}
        </div>
        <p className="text-[#1EBFD5] font-black text-sm mb-3">{listing.priceLabel}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold">
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-blue-400" />{listing.views}</span>
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-green-400" />{listing.phoneClicks}</span>
          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-400" />{listing.favorites}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 flex-shrink-0">
        <button onClick={onToggle} className="group/tog">
          {listing.active
            ? <ToggleRight className="w-9 h-9 text-[#1EBFD5]" />
            : <ToggleLeft className="w-9 h-9 text-gray-300" />}
        </button>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-500 flex items-center justify-center transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setDeleted(true)} className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState(MY_LISTINGS);
  const [activeMsg, setActiveMsg] = useState(MESSAGES[0]);
  const [msgInput, setMsgInput] = useState("");
  const [, navigate] = useLocation();

  const toggleListing = (id: number) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const NAV_ITEMS = [
    { id: "overview", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "listings", label: "إعلاناتي", icon: Building2, badge: listings.length },
    { id: "favorites", label: "المفضلة", icon: Heart },
    { id: "messages", label: "الرسائل", icon: MessageCircle, badge: 3 },
    { id: "plans", label: "باقتي", icon: Package },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  const STATS = [
    { label: "المشاهدات", value: "24,830", trend: "+12.5%", icon: Eye, iconColor: "bg-blue-50 text-blue-500" },
    { label: "ضغطات الهاتف", value: "1,247", trend: "+8.3%", icon: Phone, iconColor: "bg-green-50 text-green-500" },
    { label: "الرسائل", value: "83", trend: "+15.7%", icon: MessageCircle, iconColor: "bg-violet-50 text-violet-500" },
    { label: "العقارات المنشورة", value: "12", trend: "–", icon: Building2, iconColor: "bg-cyan-50 text-cyan-500" },
    { label: "العقارات المميزة", value: "5", trend: "+16.6%", icon: Star, iconColor: "bg-amber-50 text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FD] flex" dir="rtl">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`w-64 bg-white border-l border-gray-100 flex flex-col fixed h-full z-30 shadow-lg transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-50">
          <img src={logoColor} alt="عقارات بنها" className="h-8 w-auto" />
        </div>

        {/* User mini card */}
        <div className="mx-4 mt-4 mb-2 p-3 bg-gradient-to-l from-[#1EBFD5]/10 to-[#123C79]/10 rounded-2xl flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1EBFD5] to-[#123C79] flex items-center justify-center text-white font-black text-sm">أ</div>
            <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm">أحمد محمد</p>
            <p className="text-[11px] text-gray-400 font-medium">المسيّر</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id as Section); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${section === item.id
                  ? "bg-gradient-to-l from-[#1EBFD5]/15 to-[#123C79]/10 text-[#123C79] shadow-sm"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"}`}
            >
              <span className="flex items-center gap-3">
                <item.icon className={`w-4.5 h-4.5 ${section === item.id ? "text-[#1EBFD5]" : ""}`} style={{ width: 18, height: 18 }} />
                {item.label}
              </span>
              {item.badge && (
                <span className="bg-[#1EBFD5] text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}
              {section === item.id && <ChevronRight className="w-4 h-4 text-[#1EBFD5] opacity-60" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-50">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut style={{ width: 18, height: 18 }} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 lg:mr-64 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                className="bg-[#F4F7FD] text-sm py-2 pr-9 pl-4 rounded-xl border border-gray-100 outline-none w-64 lg:w-80 focus:border-[#1EBFD5]/50 focus:bg-white transition-all placeholder:text-gray-300"
                placeholder="ابحث عن عقار، إعلان، رسالة..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="relative w-9 h-9 rounded-xl bg-[#F4F7FD] hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
              <Bell className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <button className="relative w-9 h-9 rounded-xl bg-[#F4F7FD] hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
              <MessageCircle className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1EBFD5] rounded-full border border-white" />
            </button>
            <div className="flex items-center gap-2 pl-2 lg:pl-4 border-r border-gray-100 mr-1 lg:mr-2">
              <div className="text-left hidden sm:block">
                <p className="font-black text-gray-900 text-xs leading-tight">أحمد محمد</p>
                <p className="text-[10px] text-green-500 font-semibold">● متصل الآن</p>
              </div>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1EBFD5] to-[#123C79] flex items-center justify-center text-white font-black text-sm cursor-pointer">أ</div>
                <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 lg:p-8">
          <AnimatePresence mode="wait">

            {/* ─── OVERVIEW ─── */}
            {section === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Welcome card */}
                <motion.div
                  initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-[#123C79] to-[#1EBFD5] text-white p-7 flex items-center justify-between"
                >
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                  <div className="relative z-10">
                    <p className="text-white/70 text-sm font-semibold mb-1">مرحبًا بعودتك 👋</p>
                    <h2 className="text-2xl lg:text-3xl font-black mb-2">مرحبًا بك، أحمد</h2>
                    <p className="text-white/80 text-sm font-medium mb-5">إدارة عقاراتك أصبحت أسهل من أي وقت مضى</p>
                    <button
                      onClick={() => navigate("/add-property")}
                      className="bg-white text-[#123C79] px-6 py-2.5 rounded-xl font-black text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> إضافة عقار جديد
                    </button>
                  </div>
                  <div className="relative z-10 hidden md:block">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80"
                      alt="عقار"
                      className="w-44 h-32 object-cover rounded-2xl opacity-90 shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-xs font-black">
                      ● متصل الآن
                    </div>
                  </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {STATS.map((s, i) => (
                    <StatCard key={i} {...s} delay={i * 0.07} />
                  ))}
                </div>

                {/* Chart + Side widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-black text-gray-900">إحصائيات الأسبوع</h3>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">آخر 7 أيام</p>
                      </div>
                      <div className="flex gap-3 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-[#1EBFD5]"><span className="w-2 h-2 rounded-full bg-[#1EBFD5]" />مشاهدات</span>
                        <span className="flex items-center gap-1.5 text-[#123C79]"><span className="w-2 h-2 rounded-full bg-[#123C79]" />اتصالات</span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1EBFD5" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#1EBFD5" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#123C79" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#123C79" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px rgba(0,0,0,.08)", fontSize: 12 }} />
                        <Area type="monotone" dataKey="مشاهدات" stroke="#1EBFD5" strokeWidth={2.5} fill="url(#gV)" dot={false} />
                        <Area type="monotone" dataKey="اتصالات" stroke="#123C79" strokeWidth={2.5} fill="url(#gC)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Side: Messages + Plan */}
                  <div className="space-y-4">
                    {/* Recent messages */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-gray-900 text-sm">آخر الرسائل</h3>
                        <button onClick={() => setSection("messages")} className="text-[#1EBFD5] text-xs font-bold hover:underline">عرض الكل</button>
                      </div>
                      <div className="space-y-3">
                        {MESSAGES.slice(0, 3).map(msg => (
                          <div key={msg.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -mx-2 transition-colors" onClick={() => { setSection("messages"); setActiveMsg(msg); }}>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1EBFD5]/20 to-[#123C79]/20 flex items-center justify-center text-[#123C79] font-black text-sm flex-shrink-0">{msg.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-xs truncate">{msg.name}</p>
                              <p className="text-gray-400 text-[11px] truncate">{msg.text}</p>
                            </div>
                            {msg.unread > 0 && (
                              <span className="bg-[#1EBFD5] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{msg.unread}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current plan */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-500" />
                          <h3 className="font-black text-gray-900 text-sm">الباقة البريميوم</h3>
                        </div>
                        <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> نشطة
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3 font-medium">سارية حتى 1 يوليو 2025</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1.5">
                          <span>الإعلانات المستخدمة</span><span>8 / 15</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: "53%" }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-full bg-gradient-to-l from-[#1EBFD5] to-[#123C79] rounded-full"
                          />
                        </div>
                      </div>
                      <button onClick={() => setSection("plans")} className="w-full bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white text-xs font-black py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                        ترقية الباقة
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-4">إجراءات سريعة</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {QUICK_ACTIONS.map((action, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => action.href !== "#" ? navigate(action.href) : setSection("messages")}
                        className={`bg-gradient-to-br ${action.color} text-white rounded-2xl py-4 px-4 flex flex-col items-center gap-2.5 font-bold text-sm shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <action.icon className="w-6 h-6" />
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Recent listings preview */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900">آخر إعلاناتي</h3>
                    <button onClick={() => setSection("listings")} className="text-[#1EBFD5] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                      عرض الكل <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {listings.slice(0, 2).map(listing => (
                      <div key={listing.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        <img src={listing.image} className="w-14 h-10 rounded-lg object-cover flex-shrink-0" alt={listing.title} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 truncate">{listing.title}</p>
                          <p className="text-xs text-gray-400">{listing.priceLabel}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{listing.views}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${listing.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                            {listing.active ? "منشور" : "موقوف"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* ─── LISTINGS ─── */}
            {section === "listings" && (
              <motion.div key="listings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">إعلاناتي</h2>
                    <p className="text-sm text-gray-400 font-medium mt-0.5">{listings.length} إعلانات • {listings.filter(l => l.active).length} منشورة</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/add-property")}
                    className="bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> إضافة عقار
                  </motion.button>
                </div>
                <AnimatePresence>
                  {listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} onToggle={() => toggleListing(listing.id)} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ─── FAVORITES ─── */}
            {section === "favorites" && (
              <motion.div key="favorites" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <h2 className="text-xl font-black text-gray-900">المفضلة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {PROPERTIES.slice(2, 5).map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative h-44 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </button>
                        <span className="absolute top-3 right-3 bg-[#1EBFD5] text-white text-[11px] font-black px-2.5 py-1 rounded-lg">{p.type}</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-gray-900 text-sm mb-1 truncate">{p.title}</h3>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2"><MapPin className="w-3 h-3" />{p.location}</div>
                        <p className="text-[#1EBFD5] font-black text-sm">{p.priceLabel}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── MESSAGES ─── */}
            {section === "messages" && (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-xl font-black text-gray-900 mb-5">الرسائل</h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex" style={{ height: "calc(100vh - 220px)", minHeight: 480 }}>
                  {/* Contacts list */}
                  <div className="w-72 border-l border-gray-100 flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-gray-50">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input className="bg-[#F4F7FD] text-xs py-2 pr-9 pl-3 rounded-xl w-full outline-none placeholder:text-gray-300" placeholder="بحث في الرسائل..." />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {MESSAGES.map(msg => (
                        <div key={msg.id} onClick={() => setActiveMsg(msg)}
                          className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-50 transition-colors
                            ${activeMsg.id === msg.id ? "bg-[#1EBFD5]/5 border-r-2 border-r-[#1EBFD5]" : "hover:bg-gray-50"}`}>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1EBFD5]/20 to-[#123C79]/20 flex items-center justify-center text-[#123C79] font-black flex-shrink-0">{msg.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-gray-900 text-xs">{msg.name}</p>
                              <span className="text-[10px] text-gray-300 font-medium">{msg.time}</span>
                            </div>
                            <p className="text-gray-400 text-[11px] truncate mt-0.5">{msg.text}</p>
                          </div>
                          {msg.unread > 0 && (
                            <span className="bg-[#1EBFD5] text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0">{msg.unread}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chat area */}
                  <div className="flex-1 flex flex-col">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1EBFD5]/20 to-[#123C79]/20 flex items-center justify-center text-[#123C79] font-black text-sm">{activeMsg.avatar}</div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">{activeMsg.name}</p>
                        <p className="text-[11px] text-green-500 font-medium">متصل الآن</p>
                      </div>
                    </div>
                    <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-[#F9FAFB]">
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white text-sm font-semibold px-4 py-2.5 rounded-2xl rounded-tl-md max-w-xs shadow-sm">
                          مرحباً! شكراً على تواصلك معنا 😊
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-2xl rounded-tr-md max-w-xs shadow-sm border border-gray-100">
                          {activeMsg.text}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex gap-3">
                      <input
                        value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && setMsgInput("")}
                        className="flex-1 bg-[#F4F7FD] text-sm py-2.5 px-4 rounded-xl border border-gray-100 outline-none focus:border-[#1EBFD5]/50 placeholder:text-gray-300"
                        placeholder="اكتب رسالتك..."
                      />
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setMsgInput("")}
                        className="w-10 h-10 bg-gradient-to-br from-[#1EBFD5] to-[#123C79] rounded-xl flex items-center justify-center text-white shadow-sm"
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── PLANS ─── */}
            {section === "plans" && (
              <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">باقتي</h2>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">إدارة اشتراكك وتفاصيل باقتك الحالية</p>
                </div>

                {/* Current plan card */}
                <div className="bg-gradient-to-l from-[#123C79] to-[#1EBFD5] rounded-3xl p-7 text-white relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "25px 25px" }} />
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-amber-300" />
                        <span className="font-black text-lg">الباقة البريميوم</span>
                        <span className="bg-white/20 text-white text-[11px] font-black px-2 py-0.5 rounded-full">نشطة</span>
                      </div>
                      <p className="text-white/70 text-sm mb-1">تاريخ البداية: 1 يناير 2025</p>
                      <p className="text-white/70 text-sm">تاريخ الانتهاء: 1 يوليو 2025</p>
                    </div>
                    <button className="bg-white text-[#123C79] px-6 py-2.5 rounded-xl font-black text-sm hover:bg-white/90 transition-colors flex-shrink-0">
                      تجديد الباقة
                    </button>
                  </div>
                  <div className="relative z-10 mt-6">
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>استخدام الإعلانات</span><span>8 من 15 إعلان</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: "53%" }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                    <p className="text-white/60 text-xs mt-1.5">7 إعلانات متبقية</p>
                  </div>
                </div>

                {/* Upgrade plans */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { name: "الأساسية", price: "99", ads: "5 إعلانات", icon: Home, color: "border-gray-200", current: false },
                    { name: "البريميوم", price: "299", ads: "15 إعلاناً", icon: Crown, color: "border-[#1EBFD5]", current: true },
                    { name: "الاحترافية", price: "599", ads: "غير محدود", icon: Zap, color: "border-[#123C79]", current: false },
                  ].map((plan, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className={`bg-white rounded-2xl border-2 ${plan.color} shadow-sm p-6 relative`}>
                      {plan.current && (
                        <span className="absolute -top-3 right-5 bg-[#1EBFD5] text-white text-[11px] font-black px-3 py-1 rounded-full">
                          باقتك الحالية
                        </span>
                      )}
                      <plan.icon className={`w-7 h-7 mb-3 ${plan.current ? "text-[#1EBFD5]" : "text-gray-400"}`} />
                      <h3 className="font-black text-gray-900 text-lg mb-1">{plan.name}</h3>
                      <p className="text-3xl font-black text-gray-900 mb-0.5">{plan.price}<span className="text-sm text-gray-400 font-semibold"> ج.م / شهر</span></p>
                      <p className="text-sm text-gray-500 font-semibold mb-5">{plan.ads}</p>
                      <button className={`w-full py-2.5 rounded-xl font-black text-sm transition-colors ${plan.current
                        ? "bg-[#1EBFD5]/10 text-[#1EBFD5] cursor-default"
                        : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                        {plan.current ? "✓ باقتك الحالية" : "الترقية لهذه الباقة"}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── SETTINGS ─── */}
            {section === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">الإعدادات</h2>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">إدارة حسابك وتفضيلاتك</p>
                </div>

                {/* Settings cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SETTINGS_CARDS.map((card, i) => (
                    <motion.button key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-right flex items-start gap-4 hover:shadow-md hover:border-[#1EBFD5]/20 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1EBFD5]/10 to-[#123C79]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#1EBFD5]/20 group-hover:to-[#123C79]/20 transition-colors">
                        <card.icon className="w-5 h-5 text-[#1EBFD5]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-gray-900 text-sm">{card.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">{card.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1EBFD5] transition-colors mt-0.5 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>

                {/* Profile form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-black text-gray-900 mb-5 pb-4 border-b border-gray-50">تعديل الملف الشخصي</h3>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1EBFD5] to-[#123C79] flex items-center justify-center text-white font-black text-2xl">أ</div>
                      <button className="absolute -bottom-1 -left-1 w-6 h-6 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center">
                        <Image className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                    <div>
                      <p className="font-black text-gray-900">أحمد محمد</p>
                      <p className="text-sm text-gray-400">المسيّر — منذ يناير 2024</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: "الاسم الكامل", value: "أحمد محمد السيد", type: "text" },
                      { label: "البريد الإلكتروني", value: "ahmed@example.com", type: "email" },
                      { label: "رقم الهاتف", value: "01012345678", type: "tel" },
                      { label: "المدينة", value: "بنها، القليوبية", type: "text" },
                    ].map((f, i) => (
                      <div key={i}>
                        <label className="text-xs font-black text-gray-400 block mb-1.5">{f.label}</label>
                        <input
                          defaultValue={f.value}
                          type={f.type}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold text-gray-900 outline-none focus:border-[#1EBFD5]/50 focus:bg-white transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white px-8 py-2.5 rounded-xl font-black text-sm shadow-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> حفظ التغييرات
                    </motion.button>
                    <button className="px-6 py-2.5 rounded-xl font-black text-sm text-gray-400 hover:bg-gray-50 transition-colors">إلغاء</button>
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
