import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Home, Heart, MessageCircle, Package, Settings,
  Plus, Eye, Phone, Star, Building2, TrendingUp, TrendingDown,
  Edit3, Trash2, Zap, PauseCircle, MoreVertical, Bell, BellOff,
  Lock, User, Globe, Instagram, Facebook, Twitter, Youtube, Share2,
  Send, Search, Paperclip, Smile, CheckCheck, Check, X,
  ChevronRight, LogOut, Menu, Shield, Crown, Clock, Image,
  ArrowUpRight, MapPin, Calendar, Flame, Award, ChevronUp,
  Camera, Upload, RefreshCw, AlertCircle, FileText, BarChart2,
  Sparkles, BadgeCheck, ChevronDown,
} from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";
import { PROPERTIES } from "@/data/properties";

/* ─── Types ─── */
type Section = "overview" | "listings" | "favorites" | "messages" | "plans" | "settings";

/* ─── Mock Data ─── */
const USER = {
  name: "أحمد محمد السيد",
  company: "مكتب السيد للعقارات",
  role: "وسيط عقاري معتمد",
  avatar: null as string | null,
  initials: "أم",
  phone: "01012345678",
  email: "ahmed@albayt.com",
  city: "بنها، مصر",
  joinDate: "يناير 2023",
  verified: true,
  rating: 4.8,
  reviewCount: 127,
  instagram: "@albayt_realestate",
  facebook: "albayt.realestate",
};

const STATS = [
  { id: "views", label: "إجمالي المشاهدات", value: "24,830", change: +18.4, icon: Eye, color: "#1EBFD5", bg: "from-cyan-50 to-blue-50", trend: "up", period: "هذا الشهر" },
  { id: "calls", label: "نقرات الهاتف", value: "1,247", change: +12.1, icon: Phone, color: "#8B5CF6", bg: "from-violet-50 to-purple-50", trend: "up", period: "هذا الشهر" },
  { id: "messages", label: "رسائل واردة", value: "83", change: -4.2, icon: MessageCircle, color: "#F59E0B", bg: "from-amber-50 to-yellow-50", trend: "down", period: "هذا الشهر" },
  { id: "listed", label: "إعلانات منشورة", value: "12", change: +2, icon: Building2, color: "#10B981", bg: "from-emerald-50 to-green-50", trend: "up", period: "إجمالي" },
  { id: "featured", label: "إعلانات مميزة", value: "5", change: 0, icon: Star, color: "#EF4444", bg: "from-red-50 to-pink-50", trend: "neutral", period: "نشطة الآن" },
];

const MY_LISTINGS = PROPERTIES.slice(0, 6).map((p, i) => ({
  ...p,
  status: i === 2 ? "paused" : "active",
  phoneClicks: Math.floor(Math.random() * 200 + 30),
  favorites: Math.floor(Math.random() * 80 + 10),
  publishDate: `${Math.floor(Math.random() * 28 + 1)} ${["يناير", "فبراير", "مارس", "أبريل"][i % 4]} 2025`,
}));

const MY_FAVORITES = PROPERTIES.slice(8, 13).map(p => ({ ...p }));

const CONVERSATIONS = [
  { id: 1, name: "محمود إبراهيم", initials: "مإ", color: "#1EBFD5", lastMsg: "متى يمكن معاينة الشقة؟", time: "الآن", unread: 3, online: true, property: "شقة فاخرة في منطقة الفلل" },
  { id: 2, name: "سارة أحمد", initials: "سأ", color: "#8B5CF6", lastMsg: "هل السعر قابل للتفاوض؟", time: "منذ 5 دقائق", unread: 1, online: true, property: "فيلا بحي النخيل" },
  { id: 3, name: "كريم عبدالله", initials: "كع", color: "#F59E0B", lastMsg: "شكراً، سأتواصل معك قريباً", time: "منذ ساعة", unread: 0, online: false, property: "محل تجاري بالدور الأرضي" },
  { id: 4, name: "نور الدين", initials: "ند", color: "#10B981", lastMsg: "هل يوجد مصعد؟", time: "أمس", unread: 0, online: false, property: "شقة للإيجار - وسط البلد" },
  { id: 5, name: "هناء محمد", initials: "هم", color: "#EF4444", lastMsg: "ممتاز، سنتواصل", time: "منذ يومين", unread: 0, online: false, property: "دوبلكس بإطلالة النيل" },
];

const CHAT_MESSAGES: Record<number, { id: number; from: "me" | "them"; text: string; time: string; read?: boolean }[]> = {
  1: [
    { id: 1, from: "them", text: "السلام عليكم، رأيت إعلان الشقة في الفلل", time: "10:30 ص" },
    { id: 2, from: "me", text: "وعليكم السلام، أهلاً! كيف أستطيع مساعدتك؟", time: "10:31 ص", read: true },
    { id: 3, from: "them", text: "ما هي المساحة الدقيقة؟ وهل يوجد جراج؟", time: "10:32 ص" },
    { id: 4, from: "me", text: "المساحة 180م² وبها جراج خاص مع الشقة ✅", time: "10:33 ص", read: true },
    { id: 5, from: "them", text: "ممتاز! متى يمكن معاينة الشقة؟", time: "10:45 ص" },
  ],
  2: [
    { id: 1, from: "them", text: "مرحباً بخصوص الفيلا", time: "9:00 ص" },
    { id: 2, from: "me", text: "أهلاً، تفضلي", time: "9:05 ص", read: true },
    { id: 3, from: "them", text: "هل السعر قابل للتفاوض؟", time: "9:10 ص" },
  ],
};

const PLAN_DATA = {
  name: "بريميوم",
  color: "#F59E0B",
  icon: <Crown className="w-5 h-5" />,
  startDate: "1 أبريل 2025",
  endDate: "1 يوليو 2025",
  totalDays: 90,
  usedDays: 43,
  totalListings: 10,
  usedListings: 7,
  totalPhotos: 50,
  usedPhotos: 31,
  renewsIn: 47,
};

/* ─── Helpers ─── */
function fmt(n: number) { return n.toLocaleString("ar-EG"); }

function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gray-100" />
        <div className="w-16 h-5 rounded-full bg-gray-100" />
      </div>
      <div className="w-24 h-7 rounded-lg bg-gray-100 mb-1" />
      <div className="w-32 h-4 rounded bg-gray-100" />
    </div>
  );
}

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse flex gap-0">
      <div className="w-40 h-36 bg-gray-100 flex-shrink-0" />
      <div className="flex-1 p-4 space-y-2">
        <div className="w-2/3 h-5 bg-gray-100 rounded" />
        <div className="w-1/2 h-4 bg-gray-100 rounded" />
        <div className="w-1/3 h-4 bg-gray-100 rounded" />
        <div className="flex gap-2 mt-3">
          <div className="w-20 h-8 bg-gray-100 rounded-xl" />
          <div className="w-20 h-8 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Sidebar Item ─── */
function SidebarItem({ icon: Icon, label, active, badge, onClick }: {
  icon: React.ElementType; label: string; active: boolean; badge?: number; onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ x: active ? 0 : -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-right transition-all duration-200 relative group ${
        active
          ? "text-white shadow-lg shadow-cyan-200/40"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
      style={active ? { background: "linear-gradient(135deg, #1EBFD5, #123C79)" } : {}}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
      <span className="font-semibold text-sm flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
          active ? "bg-white/30 text-white" : "bg-red-500 text-white"
        }`}>
          {badge}
        </span>
      )}
    </motion.button>
  );
}

/* ─── Stat Card ─── */
function StatCard({ stat, delay }: { stat: typeof STATS[0]; delay: number }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3, shadow: "lg" }}
      className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-all cursor-default`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md"
          style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}bb)` }}>
          <Icon className="w-5 h-5" />
        </div>
        {stat.change !== 0 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
            stat.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
          }`}>
            {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(stat.change)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-gray-800 mb-0.5">{stat.value}</p>
      <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
      <p className="text-[10px] text-gray-400 mt-1">{stat.period}</p>
    </motion.div>
  );
}

/* ─── Listing Card ─── */
function ListingCard({ listing, onDelete, onToggle, onFeature }: {
  listing: typeof MY_LISTINGS[0];
  onDelete: () => void;
  onToggle: () => void;
  onFeature: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isPaused = listing.status === "paused";

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all group ${
        isPaused ? "border-gray-200 opacity-70" : "border-gray-100 hover:shadow-md hover:border-gray-200"
      }`}
    >
      <div className="flex gap-0 items-stretch">
        {/* Image */}
        <div className="relative w-36 sm:w-44 flex-shrink-0 overflow-hidden">
          <img src={listing.image} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Status badge */}
          <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            isPaused ? "bg-gray-500 text-white" : "bg-green-500 text-white"
          }`}>
            {isPaused ? "موقوف" : "نشط"}
          </div>
          {listing.featured && (
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
          )}
          {/* Type badge */}
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
            style={{ background: listing.type === "للبيع" ? "rgba(16,185,129,0.9)" : "rgba(30,191,213,0.9)" }}>
            {listing.type}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-800 text-sm leading-tight truncate">{listing.title}</h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 truncate">{listing.location}</span>
              </div>
            </div>
            {/* 3-dot menu */}
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    className="absolute left-0 top-9 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 min-w-[140px] overflow-hidden"
                  >
                    {[
                      { icon: <Edit3 className="w-3.5 h-3.5" />, label: "تعديل", color: "text-gray-700", action: () => {} },
                      { icon: <Zap className="w-3.5 h-3.5" />, label: "تمييز", color: "text-amber-600", action: onFeature },
                      { icon: <PauseCircle className="w-3.5 h-3.5" />, label: isPaused ? "تفعيل" : "إيقاف", color: "text-blue-600", action: onToggle },
                      { icon: <Trash2 className="w-3.5 h-3.5" />, label: "حذف", color: "text-red-500", action: onDelete },
                    ].map((item, i) => (
                      <button key={i} onClick={() => { item.action(); setMenuOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-right text-xs font-semibold hover:bg-gray-50 transition-colors ${item.color} ${i > 0 ? "border-t border-gray-50" : ""}`}>
                        {item.icon}{item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Price */}
          <p className="font-black text-base mb-2" style={{ color: "#1EBFD5" }}>{listing.priceLabel}</p>

          {/* Stats row */}
          <div className="flex items-center gap-3 mb-3">
            {[
              { icon: <Eye className="w-3 h-3" />, val: fmt(listing.views) },
              { icon: <Phone className="w-3 h-3" />, val: fmt(listing.phoneClicks) },
              { icon: <Heart className="w-3 h-3" />, val: fmt(listing.favorites) },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                <span className="text-gray-300">{s.icon}</span>{s.val}
              </div>
            ))}
            <div className="flex items-center gap-1 text-[11px] text-gray-300 mr-auto">
              <Calendar className="w-3 h-3" />
              <span>{listing.publishDate}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-[#1EBFD5] hover:text-[#1EBFD5] transition-all bg-white">
              <Edit3 className="w-3 h-3" /> تعديل
            </button>
            <button onClick={onFeature}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-all bg-amber-50/50">
              <Flame className="w-3 h-3" /> تمييز
            </button>
            <button onClick={onToggle}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isPaused
                  ? "border-green-200 text-green-600 bg-green-50/50 hover:bg-green-50"
                  : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"
              }`}>
              <PauseCircle className="w-3 h-3" /> {isPaused ? "تفعيل" : "إيقاف"}
            </button>
            <button onClick={onDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-100 text-xs font-bold text-red-400 hover:bg-red-50 transition-all">
              <Trash2 className="w-3 h-3" /> حذف
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Messages Section ─── */
function MessagesSection() {
  const [activeConv, setActiveConv] = useState<number | null>(1);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [search, setSearch] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv, messages]);

  function sendMessage() {
    if (!msg.trim() || !activeConv) return;
    setMessages(prev => ({
      ...prev,
      [activeConv]: [
        ...(prev[activeConv] || []),
        { id: Date.now(), from: "me", text: msg.trim(), time: "الآن", read: false },
      ],
    }));
    setMsg("");
  }

  const filteredConvs = CONVERSATIONS.filter(c =>
    c.name.includes(search) || c.property.includes(search)
  );
  const activeConvData = CONVERSATIONS.find(c => c.id === activeConv);
  const activeMessages = activeConv ? (messages[activeConv] || []) : [];

  return (
    <div className="flex gap-0 h-[calc(100vh-180px)] min-h-[500px] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Conversations List */}
      <div className="w-72 border-l border-gray-100 flex flex-col flex-shrink-0">
        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-gray-50 border border-gray-100">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="بحث في المحادثات..."
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-right" />
          </div>
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2 p-6">
              <MessageCircle className="w-10 h-10" />
              <p className="text-sm font-medium">لا توجد محادثات</p>
            </div>
          ) : filteredConvs.map(conv => (
            <button key={conv.id} onClick={() => setActiveConv(conv.id)}
              className={`w-full flex items-center gap-3 p-4 text-right border-b border-gray-50 transition-all hover:bg-gray-50 ${
                activeConv === conv.id ? "bg-gradient-to-l from-cyan-50 to-blue-50 border-l-2 border-l-[#1EBFD5]" : ""
              }`}>
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${conv.color}, ${conv.color}99)` }}>
                  {conv.initials}
                </div>
                {conv.online && (
                  <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-800">{conv.name}</span>
                  <span className="text-[10px] text-gray-400">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMsg}</p>
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{conv.property}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[#1EBFD5] flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      {activeConvData ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-sm font-black"
                style={{ background: `linear-gradient(135deg, ${activeConvData.color}, ${activeConvData.color}99)` }}>
                {activeConvData.initials}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{activeConvData.name}</p>
                <p className={`text-xs font-medium ${activeConvData.online ? "text-green-500" : "text-gray-400"}`}>
                  {activeConvData.online ? "متصل الآن" : "غير متصل"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 truncate max-w-[120px]">{activeConvData.property}</span>
            </div>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ background: "linear-gradient(180deg, #f9fafb, #ffffff)" }}>
            {activeMessages.map(m => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.from === "me"
                    ? "text-white rounded-tl-md"
                    : "bg-white text-gray-800 rounded-tr-md border border-gray-100"
                }`}
                  style={m.from === "me" ? { background: "linear-gradient(135deg, #1EBFD5, #123C79)" } : {}}>
                  {m.text}
                  <div className={`flex items-center gap-1 mt-1 ${m.from === "me" ? "justify-start" : "justify-end"}`}>
                    <span className={`text-[10px] ${m.from === "me" ? "text-white/60" : "text-gray-400"}`}>{m.time}</span>
                    {m.from === "me" && (m.read ? <CheckCheck className="w-3 h-3 text-cyan-300" /> : <Check className="w-3 h-3 text-white/60" />)}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 focus-within:border-[#1EBFD5] focus-within:ring-2 focus-within:ring-[#1EBFD5]/10 transition-all bg-white">
              <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"><Smile className="w-5 h-5" /></button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"><Paperclip className="w-5 h-5" /></button>
              <input
                value={msg} onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="اكتب رسالة..."
                className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent text-right"
              />
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={sendMessage} disabled={!msg.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 transition-all"
                style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-3">
          <MessageCircle className="w-16 h-16" />
          <p className="text-base font-bold text-gray-400">اختر محادثة</p>
          <p className="text-sm text-gray-300">اختر محادثة من القائمة لعرضها</p>
        </div>
      )}
    </div>
  );
}

/* ─── Plans Section ─── */
function PlansSection({ navigate }: { navigate: (p: string) => void }) {
  const p = PLAN_DATA;
  const daysPercent = Math.round((p.usedDays / p.totalDays) * 100);
  const listingsPercent = Math.round((p.usedListings / p.totalListings) * 100);
  const photosPercent = Math.round((p.usedPhotos / p.totalPhotos) * 100);

  function ProgressBar({ percent, color }: { percent: number; color: string }) {
    return (
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Current Plan Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-amber-200 shadow-lg"
        style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)" }}>
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: p.color, filter: "blur(60px)" }} />
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl"
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}>
                {p.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-black text-white" style={{ background: p.color }}>نشطة</span>
                  <span className="text-white/40 text-xs">باقة {p.name}</span>
                </div>
                <h3 className="text-2xl font-black text-white">باقة {p.name}</h3>
                <p className="text-white/50 text-sm mt-0.5">تنتهي في {p.endDate} · {p.renewsIn} يوم متبقٍ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/plans")}
                className="px-5 py-2.5 rounded-2xl font-bold text-white text-sm flex items-center gap-2 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}bb)` }}>
                <Sparkles className="w-4 h-4" /> ترقية الباقة
              </motion.button>
              <button className="px-4 py-2.5 rounded-2xl font-bold text-white/70 text-sm border border-white/20 hover:bg-white/10 transition-all">
                تجديد
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { label: "تاريخ البداية", val: p.startDate, icon: <Calendar className="w-4 h-4" /> },
              { label: "تاريخ الانتهاء", val: p.endDate, icon: <Clock className="w-4 h-4" /> },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/8 border border-white/10">
                <span className="text-white/40">{d.icon}</span>
                <div>
                  <p className="text-[10px] text-white/40 font-medium">{d.label}</p>
                  <p className="text-sm font-bold text-white">{d.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Usage Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-800 mb-5 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#1EBFD5]" /> استهلاك الباقة
        </h3>
        <div className="space-y-5">
          {[
            { label: "الأيام المستهلكة", used: p.usedDays, total: p.totalDays, unit: "يوم", percent: daysPercent, color: "#1EBFD5" },
            { label: "الإعلانات المستخدمة", used: p.usedListings, total: p.totalListings, unit: "إعلان", percent: listingsPercent, color: "#F59E0B" },
            { label: "الصور المرفوعة", used: p.usedPhotos, total: p.totalPhotos, unit: "صورة", percent: photosPercent, color: "#8B5CF6" },
          ].map((row, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{row.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-800">{row.used}</span>
                  <span className="text-gray-300 text-sm">/</span>
                  <span className="text-sm text-gray-400">{row.total} {row.unit}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    row.percent >= 80 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                  }`}>{row.percent}%</span>
                </div>
              </div>
              <ProgressBar percent={row.percent} color={row.color} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plan History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1EBFD5]" /> سجل الباقات
        </h3>
        {[
          { name: "بريميوم", period: "أبريل — يوليو 2025", status: "نشطة", color: "#F59E0B" },
          { name: "مميز", period: "يناير — مارس 2025", status: "منتهية", color: "#8B5CF6" },
          { name: "مجاني", period: "نوفمبر — ديسمبر 2024", status: "منتهية", color: "#6B7280" },
        ].map((h, i) => (
          <div key={i} className={`flex items-center justify-between py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${h.color}18`, color: h.color }}>
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">باقة {h.name}</p>
                <p className="text-xs text-gray-400">{h.period}</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              h.status === "نشطة" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
            }`}>{h.status}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Settings Section ─── */
function SettingsSection() {
  const [tab, setTab] = useState<"profile" | "password" | "notifications" | "company" | "social">("profile");
  const [name, setName] = useState(USER.name);
  const [phone, setPhone] = useState(USER.phone);
  const [email, setEmail] = useState(USER.email);
  const [city, setCity] = useState(USER.city);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ messages: true, views: true, offers: false, news: true });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const TABS = [
    { id: "profile", label: "الحساب", icon: <User className="w-4 h-4" /> },
    { id: "password", label: "كلمة المرور", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "الإشعارات", icon: <Bell className="w-4 h-4" /> },
    { id: "company", label: "الشركة", icon: <Building2 className="w-4 h-4" /> },
    { id: "social", label: "التواصل", icon: <Globe className="w-4 h-4" /> },
  ];

  function SettingField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
        {children}
      </div>
    );
  }
  function SettingInput({ value, onChange, placeholder, type = "text" }: {
    value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  }) {
    return (
      <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/10 transition-all placeholder-gray-300 bg-white" />
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              tab === t.id
                ? "text-white shadow-lg"
                : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200"
            }`}
            style={tab === t.id ? { background: "linear-gradient(135deg, #1EBFD5, #123C79)" } : {}}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

        {tab === "profile" && (
          <div className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
                  style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
                  {USER.initials}
                </div>
                <button className="absolute -bottom-2 -left-2 w-7 h-7 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:border-[#1EBFD5] transition-colors">
                  <Camera className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              <div>
                <p className="font-black text-gray-800">{USER.name}</p>
                <p className="text-sm text-gray-400">{USER.role}</p>
                <div className="flex items-center gap-1 mt-1">
                  <BadgeCheck className="w-4 h-4 text-[#1EBFD5]" />
                  <span className="text-xs text-[#1EBFD5] font-bold">موثّق</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingField label="الاسم الكامل"><SettingInput value={name} onChange={setName} /></SettingField>
              <SettingField label="رقم الهاتف"><SettingInput value={phone} onChange={setPhone} /></SettingField>
              <SettingField label="البريد الإلكتروني"><SettingInput value={email} onChange={setEmail} type="email" /></SettingField>
              <SettingField label="المدينة"><SettingInput value={city} onChange={setCity} /></SettingField>
            </div>
          </div>
        )}

        {tab === "password" && (
          <div className="space-y-4 max-w-sm">
            <SettingField label="كلمة المرور الحالية">
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/10 transition-all bg-white" />
            </SettingField>
            <SettingField label="كلمة المرور الجديدة">
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/10 transition-all bg-white" />
            </SettingField>
            <SettingField label="تأكيد كلمة المرور الجديدة">
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/10 transition-all bg-white" />
            </SettingField>
          </div>
        )}

        {tab === "notifications" && (
          <div className="space-y-1">
            {[
              { key: "messages", label: "رسائل جديدة", sub: "إشعار عند وصول رسالة جديدة" },
              { key: "views", label: "مشاهدات الإعلان", sub: "إشعار عند زيادة المشاهدات" },
              { key: "offers", label: "العروض والتخفيضات", sub: "إشعار بعروض الباقات" },
              { key: "news", label: "الأخبار والتحديثات", sub: "مستجدات المنصة" },
            ].map((n, i) => {
              const val = notifs[n.key as keyof typeof notifs];
              return (
                <div key={n.key} className={`flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors ${i > 0 ? "" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${val ? "bg-[#1EBFD5]/10" : "bg-gray-100"}`}>
                      {val ? <Bell className="w-4 h-4 text-[#1EBFD5]" /> : <BellOff className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.sub}</p>
                    </div>
                  </div>
                  <button onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !val }))}
                    className="relative w-12 h-6 rounded-full transition-all duration-300"
                    style={{ background: val ? "linear-gradient(135deg, #1EBFD5, #123C79)" : "#e5e7eb" }}>
                    <motion.div animate={{ x: val ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === "company" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingField label="اسم الشركة / المكتب">
                <SettingInput value={USER.company} onChange={() => {}} />
              </SettingField>
              <SettingField label="رقم السجل التجاري">
                <SettingInput value="12345678" onChange={() => {}} />
              </SettingField>
              <SettingField label="رقم الترخيص العقاري">
                <SettingInput value="EG-RE-2023-0891" onChange={() => {}} />
              </SettingField>
              <SettingField label="عنوان المكتب">
                <SettingInput value="شارع المحطة، بنها، القليوبية" onChange={() => {}} />
              </SettingField>
            </div>
          </div>
        )}

        {tab === "social" && (
          <div className="space-y-4">
            {[
              { icon: <Instagram className="w-4 h-4" />, label: "إنستغرام", placeholder: "@yourhandle", color: "#E1306C", val: USER.instagram },
              { icon: <Facebook className="w-4 h-4" />, label: "فيسبوك", placeholder: "yourpage", color: "#1877F2", val: USER.facebook },
              { icon: <Youtube className="w-4 h-4" />, label: "يوتيوب", placeholder: "@yourchannel", color: "#FF0000", val: "" },
              { icon: <Globe className="w-4 h-4" />, label: "الموقع الإلكتروني", placeholder: "https://yourwebsite.com", color: "#1EBFD5", val: "" },
            ].map((s, i) => (
              <SettingField key={i} label={s.label}>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 focus-within:border-[#1EBFD5] focus-within:ring-2 focus-within:ring-[#1EBFD5]/10 transition-all bg-white overflow-hidden">
                  <div className="px-3 py-3 flex items-center justify-center" style={{ color: s.color }}>{s.icon}</div>
                  <input defaultValue={s.val} placeholder={s.placeholder}
                    className="flex-1 py-3 pl-3 text-sm text-gray-800 outline-none bg-transparent placeholder-gray-300" />
                </div>
              </SettingField>
            ))}
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl font-bold text-white text-sm flex items-center gap-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Check className="w-4 h-4" /> تم الحفظ!
                </motion.span>
              ) : (
                <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  حفظ التغييرات
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <button className="px-5 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all bg-white">
            إلغاء
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Favorites Section ─── */
function FavoritesSection({ navigate }: { navigate: (p: string) => void }) {
  const [favs, setFavs] = useState(MY_FAVORITES);
  if (favs.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
        <Heart className="w-16 h-16 text-gray-200 mb-4" />
        <h3 className="text-lg font-black text-gray-400 mb-1">لا توجد عقارات مفضلة</h3>
        <p className="text-sm text-gray-300 mb-6">أضف عقارات إلى قائمة مفضلاتك لتجدها هنا</p>
        <button onClick={() => navigate("/")} className="px-6 py-2.5 rounded-2xl font-bold text-white text-sm shadow-lg"
          style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
          استعرض العقارات
        </button>
      </motion.div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {favs.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="relative h-44 overflow-hidden">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button onClick={() => setFavs(prev => prev.filter(x => x.id !== p.id))}
              className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-sm">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </button>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl text-xs font-bold text-white"
              style={{ background: p.type === "للبيع" ? "rgba(16,185,129,0.9)" : "rgba(30,191,213,0.9)" }}>
              {p.type}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{p.title}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <MapPin className="w-3 h-3" />{p.location}
            </div>
            <p className="font-black text-base" style={{ color: "#1EBFD5" }}>{p.priceLabel}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Overview Section ─── */
function OverviewSection({ setSection, navigate }: {
  setSection: (s: Section) => void;
  navigate: (p: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }}>
        {/* Glow blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-20" style={{ background: "#1EBFD5", filter: "blur(50px)" }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-15" style={{ background: "#8B5CF6", filter: "blur(50px)" }} />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl"
                style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
                {USER.initials}
              </div>
              <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BadgeCheck className="w-4 h-4 text-[#1EBFD5]" />
                <span className="text-xs text-white/50 font-medium">موثّق · {USER.role}</span>
              </div>
              <h2 className="text-xl font-black text-white">أهلاً، {USER.name.split(" ")[0]}! 👋</h2>
              <p className="text-white/40 text-sm mt-0.5">{USER.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/30">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-black text-sm">{USER.rating}</span>
              <span className="text-white/40 text-xs">({USER.reviewCount})</span>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/add-property")}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-white font-bold text-sm shadow-lg"
              style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
              <Plus className="w-4 h-4" /> إعلان جديد
            </motion.button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: "عضو منذ", val: USER.joinDate },
            { label: "التقييم", val: `${USER.rating}/5` },
            { label: "التقييمات", val: USER.reviewCount.toString() },
            { label: "الباقة", val: "بريميوم 🔥" },
          ].map((q, i) => (
            <div key={i} className="px-3 py-2.5 rounded-2xl bg-white/8 border border-white/10 text-center">
              <p className="text-xs text-white/40 mb-0.5">{q.label}</p>
              <p className="text-sm font-black text-white">{q.val}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div>
        <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[#1EBFD5]" /> إحصائياتك
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {loading
            ? Array(5).fill(0).map((_, i) => <StatSkeleton key={i} />)
            : STATS.map((s, i) => <StatCard key={s.id} stat={s} delay={i * 0.07} />)
          }
        </div>
      </div>

      {/* Recent Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#1EBFD5]" /> آخر إعلاناتي
          </h3>
          <button onClick={() => setSection("listings")}
            className="flex items-center gap-1 text-sm font-bold text-[#1EBFD5] hover:underline">
            عرض الكل <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
        <div className="space-y-3">
          {loading
            ? [0,1,2].map(i => <PropertyCardSkeleton key={i} />)
            : MY_LISTINGS.slice(0, 3).map(listing => (
                <ListingCard key={listing.id} listing={listing}
                  onDelete={() => {}} onToggle={() => {}} onFeature={() => {}} />
              ))
          }
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#1EBFD5]" /> إجراءات سريعة
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "إضافة عقار", icon: <Plus className="w-6 h-6" />, color: "#1EBFD5", action: () => navigate("/add-property") },
            { label: "ترقية الباقة", icon: <Crown className="w-6 h-6" />, color: "#F59E0B", action: () => navigate("/plans") },
            { label: "الرسائل", icon: <MessageCircle className="w-6 h-6" />, color: "#8B5CF6", action: () => setSection("messages") },
            { label: "الإعدادات", icon: <Settings className="w-6 h-6" />, color: "#10B981", action: () => setSection("settings") },
          ].map((a, i) => (
            <motion.button key={i} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={a.action}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${a.color}, ${a.color}bb)` }}>
                {a.icon}
              </div>
              <span className="text-sm font-bold text-gray-700">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function DashboardPage() {
  const [, navigate] = useLocation();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listings, setListings] = useState(MY_LISTINGS);

  const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "listings", label: "إعلاناتي", icon: Building2, badge: listings.length },
    { id: "favorites", label: "المفضلة", icon: Heart, badge: MY_FAVORITES.length },
    { id: "messages", label: "الرسائل", icon: MessageCircle, badge: 4 },
    { id: "plans", label: "باقاتي", icon: Package },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];

  const SECTION_TITLES: Record<Section, string> = {
    overview: "لوحة التحكم",
    listings: "إعلاناتي",
    favorites: "المفضلة",
    messages: "الرسائل",
    plans: "باقاتي",
    settings: "الإعدادات",
  };

  function deleteListing(id: number) {
    setListings(prev => prev.filter(p => p.id !== id));
  }
  function toggleListing(id: number) {
    setListings(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "paused" : "active" } : p));
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo + breadcrumb */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="flex-shrink-0">
              <img src={logoColor} alt="عقارات بنها" className="h-8 w-auto" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-gray-400 text-sm">
              <span>/</span>
              <span className="text-gray-700 font-bold">{SECTION_TITLES[section]}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Add Property */}
            <button onClick={() => navigate("/add-property")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-sm"
              style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
              <Plus className="w-4 h-4" /> إضافة عقار
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black cursor-pointer shadow-sm"
              style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
              {USER.initials}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-72 bg-white border-l border-gray-100 shadow-2xl z-50 lg:hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <img src={logoColor} alt="" className="h-7 w-auto" />
                  <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="p-4 space-y-1">
                  {NAV_ITEMS.map(item => (
                    <SidebarItem key={item.id} icon={item.icon} label={item.label}
                      active={section === item.id} badge={item.badge}
                      onClick={() => { setSection(item.id); setSidebarOpen(false); }} />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 sticky top-[57px] h-[calc(100vh-57px)] border-l border-gray-100 bg-white">
          {/* User mini-profile */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-md"
                style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
                {USER.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-black text-sm text-gray-800 truncate">{USER.name}</p>
                  <BadgeCheck className="w-3.5 h-3.5 text-[#1EBFD5] flex-shrink-0" />
                </div>
                <p className="text-xs text-gray-400 truncate">{USER.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-amber-600">باقة بريميوم · {PLAN_DATA.renewsIn} يوم</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(item => (
              <SidebarItem key={item.id} icon={item.icon} label={item.label}
                active={section === item.id} badge={item.badge}
                onClick={() => setSection(item.id)} />
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button onClick={() => navigate("/add-property")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white font-bold text-sm shadow-md"
              style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
              <Plus className="w-4 h-4" /> إضافة عقار
            </button>
            <button onClick={() => navigate("/")}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-gray-400 text-sm font-medium hover:bg-gray-50 hover:text-gray-700 transition-all">
              <LogOut className="w-4 h-4" /> الرئيسية
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-black text-gray-800">{SECTION_TITLES[section]}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {section === "overview" && `مرحباً ${USER.name.split(" ")[0]}، هذه نظرة عامة على أداء حسابك`}
                {section === "listings" && `${listings.length} إعلان منشور`}
                {section === "favorites" && `${MY_FAVORITES.length} عقار في المفضلة`}
                {section === "messages" && `${CONVERSATIONS.reduce((a, c) => a + c.unread, 0)} رسائل غير مقروءة`}
                {section === "plans" && `باقة ${PLAN_DATA.name} · تنتهي في ${PLAN_DATA.endDate}`}
                {section === "settings" && "إدارة بيانات حسابك وتفضيلاتك"}
              </p>
            </div>
            {section === "listings" && (
              <button onClick={() => navigate("/add-property")}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-bold shadow-lg"
                style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
                <Plus className="w-4 h-4" /> إعلان جديد
              </button>
            )}
          </div>

          {/* Section Content */}
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

              {section === "overview" && (
                <OverviewSection setSection={setSection} navigate={navigate} />
              )}

              {section === "listings" && (
                <div className="space-y-4">
                  {listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <Building2 className="w-16 h-16 text-gray-200 mb-4" />
                      <h3 className="text-lg font-black text-gray-400 mb-1">لا توجد إعلانات بعد</h3>
                      <p className="text-sm text-gray-300 mb-6">أضف أول إعلانك عقاري الآن</p>
                      <button onClick={() => navigate("/add-property")}
                        className="px-6 py-2.5 rounded-2xl font-bold text-white text-sm shadow-lg"
                        style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)" }}>
                        إضافة إعلان
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {listings.map(listing => (
                        <ListingCard key={listing.id} listing={listing}
                          onDelete={() => deleteListing(listing.id)}
                          onToggle={() => toggleListing(listing.id)}
                          onFeature={() => navigate("/plans")} />
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              )}

              {section === "favorites" && <FavoritesSection navigate={navigate} />}
              {section === "messages" && <MessagesSection />}
              {section === "plans" && <PlansSection navigate={navigate} />}
              {section === "settings" && <SettingsSection />}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 z-30 shadow-lg safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.slice(0, 5).map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button key={item.id} onClick={() => setSection(item.id)}
                className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl relative transition-all">
                <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  active ? "text-white shadow-md" : "text-gray-400"
                }`} style={active ? { background: "linear-gradient(135deg, #1EBFD5, #123C79)" } : {}}>
                  <Icon className="w-4 h-4" />
                  {item.badge !== undefined && item.badge > 0 && !active && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[9px] font-bold ${active ? "text-[#1EBFD5]" : "text-gray-400"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
