import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Users, Building2, Tag, MapPin, MessageSquare,
  CreditCard, Repeat, BarChart2, Settings, LogOut, Bell, Search,
  Plus, Edit2, Trash2, Eye, Check, X, ChevronRight, Menu,
  TrendingUp, TrendingDown, Home, Star, Shield, Globe, Lock,
  ToggleLeft, ToggleRight, Download, RefreshCw, Filter,
  AlertCircle, CheckCircle, Clock, XCircle, Zap, Crown,
  Phone, Mail, User, ChevronDown, MoreVertical, Map,
  FileText, Activity, DollarSign, Package, UserPlus, Percent,
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import logoColor from "@assets/rgb_1778457941418.png";

// ── Design tokens ────────────────────────────────────────────────────────────
const SB = "#1E293B";          // sidebar bg
const SB_ACTIVE = "#123C79";   // active nav item
const ACCENT = "#0D9488";      // primary accent (teal)
const ACCENT_LIGHT = "#CCFBF1";

// ── Mock data ────────────────────────────────────────────────────────────────
const REVENUE_DATA = [
  { m: "يناير", v: 4200 }, { m: "فبراير", v: 5100 }, { m: "مارس", v: 4800 },
  { m: "أبريل", v: 6200 }, { m: "مايو", v: 7400 }, { m: "يونيو", v: 9100 },
];
const WEEKLY_DATA = [
  { d: "أسبوع 1", conv: 1.9, rev: 3200 },
  { d: "أسبوع 2", conv: 2.4, rev: 4800 },
  { d: "أسبوع 3", conv: 3.8, rev: 4200 },
  { d: "أسبوع 4", conv: 3.2, rev: 5100 },
];
const CATS_PIE = [
  { name: "شقق", value: 45, color: ACCENT },
  { name: "فيلات", value: 25, color: "#6366F1" },
  { name: "محلات", value: 18, color: "#F59E0B" },
  { name: "أراضي", value: 12, color: "#EC4899" },
];
const TOP_CATS = [
  { name: "شقق", count: 184 }, { name: "فيلات", count: 115 },
  { name: "محلات", count: 95 }, { name: "أراضي", count: 78 }, { name: "مكاتب", count: 36 },
];
const ACTIVITY = [
  { text: "تسجيل مستخدم جديد: محمد علي", time: "منذ ساعتين", dot: ACCENT },
  { text: "تمت الموافقة على إعلان شقة 3 غرف", time: "منذ 4 ساعات", dot: "#6366F1" },
  { text: "دفعة جديدة بقيمة 2,500 جنيه", time: "منذ 5 ساعات", dot: "#F59E0B" },
  { text: "تحديث باقة مستخدم إلى البريميوم", time: "أمس", dot: "#EC4899" },
  { text: "إبلاغ عن إعلان رقم #234", time: "أمس", dot: "#EF4444" },
];

const USERS = [
  { id: 27, name: "ffffffff",  email: "sales@smartlines.com", phone: "01099...", region: "—",           role: "مستخدم", status: "نشط",    date: "5 مايو 26" },
  { id: 24, name: "a",         email: "a@aa.com",             phone: "—",        region: "—",           role: "مستخدم", status: "نشط",    date: "29 أبريل" },
  { id: 20, name: "8",         email: "com.8@8",              phone: "—",        region: "منطقة الجوف", role: "مستخدم", status: "نشط",    date: "20 أبريل" },
  { id: 17, name: "Test User", email: "test@example.com",     phone: "—",        region: "—",           role: "مستخدم", status: "نشط",    date: "19 أبريل" },
  { id: 11, name: "ee",        email: "aa@saasfd.com",        phone: "—",        region: "—",           role: "مستخدم", status: "نشط",    date: "19 أبريل" },
  { id: 10, name: "fffff",     email: "ISLA@smartlines.com",  phone: "—",        region: "—",           role: "مستخدم", status: "موقوف",  date: "19 أبريل" },
  { id: 8,  name: "ttt",       email: "ISLAM@smartlines.com", phone: "—",        region: "—",           role: "مسؤول",  status: "نشط",    date: "19 أبريل" },
];

const CLIENTS = [
  { id: 1,  name: "محمد إبراهيم",    email: "m.ibrahim@gmail.com",     phone: "01001234567", region: "بنها",       city: "ميدان بنها",  inquiries: 5,  spent: "2,500", status: "نشط",    date: "14 مايو 26" },
  { id: 2,  name: "سارة أحمد",       email: "sara.ahmed@outlook.com",  phone: "01112345678", region: "طوخ",         city: "طوخ الجديدة", inquiries: 3,  spent: "750",   status: "نشط",    date: "13 مايو 26" },
  { id: 3,  name: "خالد محمود",      email: "khalid@hotmail.com",      phone: "01223456789", region: "قليوب",       city: "قليوب",        inquiries: 8,  spent: "4,200", status: "نشط",    date: "11 مايو 26" },
  { id: 4,  name: "نور حسين",        email: "nour.h@yahoo.com",        phone: "01334567890", region: "شبين الكنائر",city: "شبين",         inquiries: 2,  spent: "300",   status: "معلق",   date: "10 مايو 26" },
  { id: 5,  name: "أحمد سلامة",      email: "a.salama@gmail.com",      phone: "01445678901", region: "بنها",       city: "وسط البلد",   inquiries: 12, spent: "8,900", status: "نشط",    date: "8 مايو 26"  },
  { id: 6,  name: "منى يوسف",        email: "mona.y@corp.com",         phone: "01556789012", region: "كفر شكر",    city: "كفر شكر",     inquiries: 1,  spent: "0",     status: "جديد",   date: "7 مايو 26"  },
  { id: 7,  name: "هاني عبد الله",   email: "hany.a@gmail.com",        phone: "01667890123", region: "بنها",       city: "الشروق",      inquiries: 6,  spent: "3,100", status: "نشط",    date: "5 مايو 26"  },
  { id: 8,  name: "رانيا فاروق",     email: "rania.f@mail.com",        phone: "01778901234", region: "طوخ",         city: "طوخ",          inquiries: 4,  spent: "1,600", status: "موقوف",  date: "2 مايو 26"  },
  { id: 9,  name: "كريم عصام",       email: "karim.e@outlook.com",     phone: "01889012345", region: "منية القمح", city: "منية القمح",  inquiries: 9,  spent: "5,400", status: "نشط",    date: "29 أبريل 26"},
  { id: 10, name: "لمياء صلاح",      email: "lamia.s@gmail.com",       phone: "01990123456", region: "بنها",       city: "بنها الجديدة",inquiries: 7,  spent: "2,800", status: "نشط",    date: "25 أبريل 26"},
];

const PROPERTIES = [
  { id: 1, title: "شقة 3 غرف - ميدان بنها",      type: "شقة",   loc: "ميدان بنها",    price: "850,000",  status: "نشط",     date: "14 مايو" },
  { id: 2, title: "فيلا كمبوند الشروق",           type: "فيلا",  loc: "الشروق",        price: "3,200,000",status: "نشط",     date: "13 مايو" },
  { id: 3, title: "محل تجاري شارع سعد",           type: "محل",   loc: "شارع سعد",      price: "320,000",  status: "معلق",    date: "12 مايو" },
  { id: 4, title: "أرض للبيع - طريق القاهرة",     type: "أرض",   loc: "طريق القاهرة",  price: "1,500,000",status: "نشط",     date: "10 مايو" },
  { id: 5, title: "شقة تشطيب سوبر لوكس",          type: "شقة",   loc: "كفر الشيخ",     price: "620,000",  status: "معلق",    date: "9 مايو" },
  { id: 6, title: "دوبلكس 4 غرف مع حديقة",       type: "دوبلكس",loc: "بنها الجديدة",  price: "1,100,000",status: "مرفوض",   date: "8 مايو" },
  { id: 7, title: "استوديو مفروش للإيجار",        type: "شقة",   loc: "وسط البلد",     price: "2,500/شهر",status: "نشط",     date: "7 مايو" },
];

const CATEGORIES = [
  { id: 1, name: "شقق",     nameEn: "Apartments", slug: "apartments", icon: "Home",     count: 184, active: true,  subs: ["شقق مفروشة", "شقق للإيجار"] },
  { id: 2, name: "فيلات",   nameEn: "Villas",     slug: "villas",     icon: "Building", count: 115, active: true,  subs: [] },
  { id: 3, name: "محلات",   nameEn: "Shops",      slug: "shops",      icon: "Store",    count: 95,  active: true,  subs: ["محلات تجارية"] },
  { id: 4, name: "أراضي",   nameEn: "Land",       slug: "land",       icon: "Map",      count: 78,  active: true,  subs: [] },
  { id: 5, name: "مكاتب",   nameEn: "Offices",    slug: "offices",    icon: "Briefcase",count: 36,  active: false, subs: [] },
  { id: 6, name: "مستودعات",nameEn: "Warehouses", slug: "warehouses", icon: "Package",  count: 12,  active: false, subs: [] },
];

const LOCATIONS = [
  { id: 1,  name: "محافظة القليوبية", nameEn: "Qalyubia Governorate",  type: "منطقة", active: true  },
  { id: 2,  name: "مركز بنها",        nameEn: "Banha Center",          type: "منطقة", active: true  },
  { id: 3,  name: "مركز طوخ",         nameEn: "Tookh Center",          type: "منطقة", active: true  },
  { id: 4,  name: "بنها",             nameEn: "Banha",                 type: "مدينة", active: true  },
  { id: 5,  name: "منية القمح",       nameEn: "Minyet El-Qamh",        type: "مدينة", active: true  },
  { id: 6,  name: "شبين الكنائر",    nameEn: "Shebin El-Kanater",     type: "مدينة", active: true  },
  { id: 7,  name: "طوخ",              nameEn: "Tookh",                 type: "مدينة", active: true  },
  { id: 8,  name: "قليوب",            nameEn: "Qaliub",                type: "مدينة", active: false },
  { id: 9,  name: "كفر شكر",          nameEn: "Kafr Shukr",            type: "مدينة", active: true  },
  { id: 10, name: "ميدان بنها",       nameEn: "Banha Square",          type: "حي",    active: true  },
  { id: 11, name: "الشروق",           nameEn: "El-Shorouk",            type: "حي",    active: true  },
  { id: 12, name: "وسط البلد",        nameEn: "Downtown",              type: "حي",    active: true  },
  { id: 13, name: "كفر سعد",          nameEn: "Kafr Saad",             type: "حي",    active: false },
  { id: 14, name: "سراي القبة",       nameEn: "Saraya Al-Qobba",       type: "حي",    active: true  },
];

const COMMISSION_PLANS = [
  { id: 1, name: "مجاني",    nameEn: "Free",    price: 0,   days: 30, limit: "3",  featured: "0",  commPct: 15, priority: "—" },
  { id: 2, name: "برونزي",   nameEn: "Bronze",  price: 99,  days: 30, limit: "10", featured: "3",  commPct: 10, priority: "1" },
  { id: 3, name: "بريميوم",  nameEn: "Premium", price: 349, days: 30, limit: "∞",  featured: "∞",  commPct: 7,  priority: "2" },
];

const CATEGORY_COMMISSIONS = [
  { name: "شقق",      nameEn: "Apartments", pct: 15 },
  { name: "فيلات",    nameEn: "Villas",      pct: 15 },
  { name: "محلات",    nameEn: "Shops",       pct: 15 },
  { name: "أراضي",    nameEn: "Land",        pct: 15 },
  { name: "مكاتب",    nameEn: "Offices",     pct: 15 },
  { name: "مستودعات", nameEn: "Warehouses",  pct: 15 },
];

const MESSAGES_DATA = [
  { id: 1, from: "محمد علي",   subject: "هل الشقة لا تزال متاحة؟",    status: "جديد",    priority: "عالية",  time: "5 دق"  },
  { id: 2, from: "سارة أحمد",  subject: "هل يمكن التفاوض في السعر؟",   status: "مفتوح",   priority: "متوسطة", time: "22 دق" },
  { id: 3, from: "خالد عمر",   subject: "متى يمكنني الزيارة؟",          status: "مغلق",    priority: "منخفضة", time: "1 س"   },
  { id: 4, from: "نور حسن",    subject: "هل الإيجار يشمل الخدمات؟",    status: "جديد",    priority: "عالية",  time: "3 س"   },
  { id: 5, from: "أحمد سلامة", subject: "طلب استفسار عن الإعلان #124", status: "مفتوح",   priority: "متوسطة", time: "أمس"   },
];

const PAYMENTS_DATA = [
  { id: "TXN-001", user: "محمد علي",   type: "اشتراك بريميوم", amount: "299",  status: "مكتمل",  date: "14 مايو" },
  { id: "TXN-002", user: "سارة أحمد",  type: "تمييز إعلان",    amount: "89",   status: "مكتمل",  date: "13 مايو" },
  { id: "TXN-003", user: "خالد عمر",   type: "اشتراك أساسي",   amount: "99",   status: "معلق",   date: "12 مايو" },
  { id: "TXN-004", user: "نور حسن",    type: "اشتراك بريميوم", amount: "299",  status: "فاشل",   date: "11 مايو" },
  { id: "TXN-005", user: "أمير حسام",  type: "تمييز إعلان",    amount: "149",  status: "مكتمل",  date: "10 مايو" },
];

const SUBS_DATA = [
  { user: "q@q.com",          plan: "مجاني",    status: "نشط",  start: "3 مايو 26",   end: "2 يونيو 26",  amount: "0" },
  { user: "5.5g5.com",        plan: "مجاني",    status: "نشط",  start: "24 أبريل",   end: "24 مايو 26",  amount: "0" },
  { user: "aa.apa.com",       plan: "مجاني",    status: "نشط",  start: "19 أبريل",   end: "19 مايو 26",  amount: "0" },
  { user: "taher.tgit.com",   plan: "مجاني",    status: "نشط",  start: "19 أبريل",   end: "19 مايو 26",  amount: "0" },
  { user: "شنن.mgm.com",      plan: "برونزي",   status: "نشط",  start: "19 أبريل",   end: "19 مايو 26",  amount: "99" },
  { user: "hanood@dalel.sa",  plan: "برونزي",   status: "منته", start: "7 مايو 26",  end: "7 يونيو 26",  amount: "99" },
  { user: "mona@dalel.sa",    plan: "برونزي",   status: "منته", start: "7 مايو 26",  end: "7 يونيو 26",  amount: "99" },
];

type Section = "dashboard" | "users" | "clients" | "properties" | "categories" | "locations" | "messages" | "payments" | "subscriptions" | "commissions" | "reports" | "settings";

// ── Helpers ──────────────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: "green" | "amber" | "red" | "blue" | "gray" }) {
  const cfg = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red:   "bg-red-50 text-red-600",
    blue:  "bg-blue-50 text-blue-700",
    gray:  "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cfg[color]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${color === "green" ? "bg-emerald-500" : color === "amber" ? "bg-amber-400" : color === "red" ? "bg-red-500" : color === "blue" ? "bg-blue-500" : "bg-gray-400"}`} />
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, trend, color }: { label: string; value: string; sub?: string; trend?: "up" | "down"; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && (
        <div className="flex items-center gap-1 mt-1.5">
          {trend === "up" ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : trend === "down" ? <TrendingDown className="w-3 h-3 text-red-400" /> : null}
          <span className={`text-[11px] font-medium ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-gray-400"}`}>{sub}</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, desc, action, onAction }: { title: string; desc?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {desc && <p className="text-sm text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {action && (
        <button onClick={onAction} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
          <Plus className="w-4 h-4" />{action}
        </button>
      )}
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map(h => (
              <th key={h} className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr onClick={onClick} className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${onClick ? "cursor-pointer" : ""}`}>
      {children}
    </tr>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-gray-700 whitespace-nowrap ${className}`}>{children}</td>;
}

function ActionBtns({ onEdit, onDelete, onView }: { onEdit?: () => void; onDelete?: () => void; onView?: () => void }) {
  return (
    <div className="flex items-center gap-1">
      {onView && <button onClick={e => { e.stopPropagation(); onView(); }} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-400 flex items-center justify-center"><Eye className="w-3.5 h-3.5" /></button>}
      {onEdit && <button onClick={e => { e.stopPropagation(); onEdit(); }} className="w-7 h-7 rounded-lg hover:bg-amber-50 text-amber-500 flex items-center justify-center"><Edit2 className="w-3.5 h-3.5" /></button>}
      {onDelete && <button onClick={e => { e.stopPropagation(); onDelete(); }} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>}
    </div>
  );
}

function AdminModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

// ── Dashboard Section ────────────────────────────────────────────────────────
function DashboardSection() {
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: "إجمالي مقدمي الخدمة", value: "247",    sub: "+12 هذا الشهر", trend: "up" as const,   color: ACCENT },
          { label: "مقدمو الخدمة النشطون", value: "189",   sub: "76.5% نشاط",   trend: "up" as const,   color: "#6366F1" },
          { label: "إجمالي المستخدمين",    value: "1,842", sub: "+45 هذا الشهر", trend: "up" as const,   color: "#F59E0B" },
          { label: "إجمالي الخدمات",       value: "534",   sub: "12 بانتظار",    trend: undefined,        color: "#EC4899" },
          { label: "إجمالي الإيرادات",     value: "48,320",sub: "+18% هذا الشهر",trend: "up" as const,   color: "#10B981" },
          { label: "بانتظار الموافقة",     value: "12",    sub: "إعلانات معلقة", trend: undefined,        color: "#EF4444" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">الإيرادات عبر الوقت</h3>
              <p className="text-xs text-gray-400 mt-0.5">نمو الإيرادات الشهرية بالجنيه المصري</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f1f5f9", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }} />
              <Area type="monotone" dataKey="v" name="الإيرادات" stroke={ACCENT} strokeWidth={2.5} fill="url(#gRev)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">أبرز التصنيفات</h3>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={CATS_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {CATS_PIE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {CATS_PIE.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + Bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">النشاط الأخير</h3>
          <div className="space-y-4">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: a.dot }} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top categories bars */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">أبرز التصنيفات (حسب عدد العقارات)</h3>
          <div className="space-y-3">
            {TOP_CATS.map((c, i) => {
              const pct = Math.round((c.count / TOP_CATS[0].count) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{c.name}</span>
                    <span className="font-semibold text-gray-800">{c.count} عقار</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-full" style={{ backgroundColor: ACCENT }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Users Section ────────────────────────────────────────────────────────────
function UsersSection() {
  const [search, setSearch] = useState("");
  const [userList, setUserList] = useState(USERS);
  const [viewUser, setViewUser] = useState<typeof USERS[0] | null>(null);
  const [editUser, setEditUser] = useState<typeof USERS[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "", status: "" });

  const filtered = userList.filter(u => u.name.includes(search) || u.email.includes(search));

  const handleDelete = (id: number) => {
    if (window.confirm("هل تريد حذف هذا المستخدم نهائياً؟"))
      setUserList(prev => prev.filter(u => u.id !== id));
  };

  const openEdit = (u: typeof USERS[0]) => {
    setEditForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, status: u.status });
    setEditUser(u);
  };

  const saveEdit = () => {
    setUserList(prev => prev.map(u => u.id === editUser!.id ? { ...u, ...editForm } : u));
    setEditUser(null);
  };

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي المستخدمين", value: userList.length,                                     Icon: Users,        bg: "#EFF6FF", clr: "#2563EB" },
          { label: "النشطون",           value: userList.filter(u => u.status === "نشط").length,    Icon: CheckCircle,  bg: "#F0FDF4", clr: "#16A34A" },
          { label: "الموقوفون",         value: userList.filter(u => u.status === "موقوف").length,  Icon: XCircle,      bg: "#FEF2F2", clr: "#DC2626" },
          { label: "جدد هذا الشهر",    value: 1,                                                    Icon: UserPlus,     bg: "#F5F3FF", clr: "#7C3AED" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              <s.Icon className="w-5 h-5" style={{ color: s.clr }} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">المستخدمون المسجّلون</h3>
            <p className="text-xs text-gray-400 mt-0.5">عرض {filtered.length} مستخدم بعد التصفية والبحث</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو البريد..." className="pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none w-52" />
            </div>
            <select className="py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-600">
              <option>كل المناطق</option>
              <option>بنها</option>
              <option>القاهرة</option>
            </select>
            <select className="py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-600">
              <option>كل المدن</option>
              <option>طوخ</option>
              <option>قليوب</option>
            </select>
            <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <Table headers={["#", "المستخدم", "البريد الإلكتروني", "الهاتف", "المنطقة", "المدينة", "الدور", "الحالة", "تاريخ الانضمام", "إجراءات"]}>
          {filtered.map((u, i) => {
            const palette = ["#0D9488","#6366F1","#F59E0B","#EC4899","#3B82F6","#10B981","#EF4444"];
            const avatarBg = palette[u.id % palette.length];
            return (
              <Tr key={u.id}>
                <Td className="text-gray-400 text-xs">{i + 1}</Td>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: avatarBg }}>
                      {u.name[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
                  </div>
                </Td>
                <Td className="text-gray-500 text-xs">{u.email}</Td>
                <Td className="text-gray-400 text-xs">{u.phone}</Td>
                <Td className="text-gray-500 text-xs">{u.region || "—"}</Td>
                <Td className="text-gray-400 text-xs">—</Td>
                <Td>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === "مسؤول" ? "bg-purple-50 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                    {u.role}
                  </span>
                </Td>
                <Td><Badge label={u.status} color={u.status === "نشط" ? "green" : "red"} /></Td>
                <Td className="text-gray-400 text-xs">{u.date}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewUser(u)} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-400 flex items-center justify-center" title="عرض">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => openEdit(u)} className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-500 flex items-center justify-center" title="تعديل">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-500 flex items-center justify-center" title="إدارة">
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center" title="حذف">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewUser && (
          <AdminModal title="تفاصيل المستخدم" onClose={() => setViewUser(null)}>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: ACCENT }}>
                  {viewUser.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{viewUser.name}</p>
                  <p className="text-sm text-gray-400">{viewUser.role}</p>
                </div>
                <Badge label={viewUser.status} color={viewUser.status === "نشط" ? "green" : "red"} />
              </div>
              {[
                { label: "البريد الإلكتروني", value: viewUser.email },
                { label: "الهاتف",            value: viewUser.phone },
                { label: "المنطقة",           value: viewUser.region },
                { label: "تاريخ الانضمام",   value: viewUser.date },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-medium text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editUser && (
          <AdminModal title="تعديل المستخدم" onClose={() => setEditUser(null)}>
            <div className="space-y-4">
              {[
                { label: "الاسم",             key: "name",  type: "text" },
                { label: "البريد الإلكتروني", key: "email", type: "email" },
                { label: "الهاتف",            key: "phone", type: "tel" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                  <input type={f.type} value={(editForm as any)[f.key]}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">الحالة</label>
                <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none">
                  <option>نشط</option>
                  <option>موقوف</option>
                </select>
              </div>
              <button onClick={saveEdit}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}>
                <CheckCircle className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Clients Section ──────────────────────────────────────────────────────────
function ClientsSection() {
  const [clientList, setClientList] = useState(CLIENTS);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("كل المناطق");
  const [viewClient, setViewClient] = useState<typeof CLIENTS[0] | null>(null);
  const [editClient, setEditClient] = useState<typeof CLIENTS[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", status: "" });

  const filtered = clientList.filter(c =>
    (c.name.includes(search) || c.email.includes(search) || c.phone.includes(search)) &&
    (regionFilter === "كل المناطق" || c.region === regionFilter)
  );

  const handleDelete = (id: number) => {
    if (window.confirm("هل تريد حذف هذا العميل نهائياً؟"))
      setClientList(prev => prev.filter(c => c.id !== id));
  };
  const openEdit = (c: typeof CLIENTS[0]) => {
    setEditForm({ name: c.name, email: c.email, phone: c.phone, status: c.status });
    setEditClient(c);
  };
  const saveEdit = () => {
    setClientList(prev => prev.map(c => c.id === editClient!.id ? { ...c, ...editForm } : c));
    setEditClient(null);
  };

  const regions = ["كل المناطق", ...Array.from(new Set(CLIENTS.map(c => c.region)))];
  const cities  = ["كل المدن",   ...Array.from(new Set(CLIENTS.map(c => c.city)))];

  const palette = ["#0D9488","#6366F1","#F59E0B","#EC4899","#3B82F6","#10B981","#EF4444","#8B5CF6","#F97316","#06B6D4"];

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي العملاء",  value: clientList.length,                                          Icon: Users,       bg: "#EFF6FF", clr: "#2563EB" },
          { label: "النشطون",         value: clientList.filter(c => c.status === "نشط").length,          Icon: CheckCircle, bg: "#F0FDF4", clr: "#16A34A" },
          { label: "الجدد",           value: clientList.filter(c => c.status === "جديد").length,         Icon: UserPlus,    bg: "#F5F3FF", clr: "#7C3AED" },
          { label: "الموقوفون",       value: clientList.filter(c => c.status === "موقوف").length,        Icon: XCircle,     bg: "#FEF2F2", clr: "#DC2626" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              <s.Icon className="w-5 h-5" style={{ color: s.clr }} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">العملاء المسجّلون</h3>
            <p className="text-xs text-gray-400 mt-0.5">عرض {filtered.length} عميل بعد التصفية والبحث</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو البريد أو الهاتف..."
                className="pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none w-56" />
            </div>
            <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
              className="py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-600">
              {regions.map(r => <option key={r}>{r}</option>)}
            </select>
            <select className="py-2 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-600">
              {cities.map(c => <option key={c}>{c}</option>)}
            </select>
            <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <Table headers={["#", "العميل", "البريد الإلكتروني", "الهاتف", "المنطقة", "المدينة", "الاستفسارات", "الإجمالي", "الحالة", "تاريخ الانضمام", "إجراءات"]}>
          {filtered.map((c, i) => {
            const avatarBg = palette[c.id % palette.length];
            return (
              <Tr key={c.id}>
                <Td className="text-gray-400 text-xs">{i + 1}</Td>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: avatarBg }}>
                      {c.name[0]}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                  </div>
                </Td>
                <Td className="text-gray-500 text-xs">{c.email}</Td>
                <Td className="text-gray-400 text-xs">{c.phone}</Td>
                <Td className="text-gray-500 text-xs">{c.region}</Td>
                <Td className="text-gray-400 text-xs">{c.city}</Td>
                <Td>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>
                    {c.inquiries} استفسار
                  </span>
                </Td>
                <Td className="font-semibold text-gray-700 text-xs">{c.spent} ج.م</Td>
                <Td>
                  <Badge label={c.status}
                    color={c.status === "نشط" ? "green" : c.status === "جديد" ? "blue" : c.status === "معلق" ? "amber" : "red"} />
                </Td>
                <Td className="text-gray-400 text-xs">{c.date}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewClient(c)} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-400 flex items-center justify-center" title="عرض">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => openEdit(c)} className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-500 flex items-center justify-center" title="تعديل">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-500 flex items-center justify-center" title="إدارة">
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center" title="حذف">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewClient && (
          <AdminModal title="تفاصيل العميل" onClose={() => setViewClient(null)}>
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: palette[viewClient.id % palette.length] }}>
                  {viewClient.name[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{viewClient.name}</p>
                  <p className="text-sm text-gray-400">{viewClient.city} · {viewClient.region}</p>
                </div>
                <Badge label={viewClient.status} color={viewClient.status === "نشط" ? "green" : viewClient.status === "جديد" ? "blue" : viewClient.status === "معلق" ? "amber" : "red"} />
              </div>
              {[
                { label: "البريد الإلكتروني", value: viewClient.email },
                { label: "الهاتف",            value: viewClient.phone },
                { label: "المنطقة",           value: viewClient.region },
                { label: "المدينة",           value: viewClient.city },
                { label: "عدد الاستفسارات",   value: `${viewClient.inquiries} استفسار` },
                { label: "الإجمالي المدفوع",  value: `${viewClient.spent} ج.م` },
                { label: "تاريخ الانضمام",    value: viewClient.date },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-medium text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editClient && (
          <AdminModal title="تعديل العميل" onClose={() => setEditClient(null)}>
            <div className="space-y-4">
              {[
                { label: "الاسم",             key: "name",  type: "text" },
                { label: "البريد الإلكتروني", key: "email", type: "email" },
                { label: "الهاتف",            key: "phone", type: "tel" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                  <input type={f.type} value={(editForm as any)[f.key]}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">الحالة</label>
                <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none">
                  <option>نشط</option>
                  <option>جديد</option>
                  <option>معلق</option>
                  <option>موقوف</option>
                </select>
              </div>
              <button onClick={saveEdit}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}>
                <CheckCircle className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Properties Section ───────────────────────────────────────────────────────
function PropertiesSection() {
  const [, navigate] = useLocation();
  const [statusF, setStatusF] = useState("الكل");
  const [search, setSearch] = useState("");
  const [propList, setPropList] = useState(PROPERTIES);
  const tabs = ["الكل", "نشط", "معلق", "مرفوض"];
  const filtered = propList.filter(p => (statusF === "الكل" || p.status === statusF) && (p.title.includes(search) || p.loc.includes(search)));

  const handleDelete = (id: number) => {
    if (window.confirm("هل تريد حذف هذا العقار نهائياً؟"))
      setPropList(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي العقارات", value: String(propList.length), sub: "+22 هذا الشهر", trend: "up" as const, color: ACCENT },
          { label: "نشط",             value: String(propList.filter(p => p.status === "نشط").length),    color: "#10B981" },
          { label: "معلق",            value: String(propList.filter(p => p.status === "معلق").length),   color: "#F59E0B" },
          { label: "مرفوض",           value: String(propList.filter(p => p.status === "مرفوض").length),  color: "#EF4444" },
        ].map((s, i) => <StatCard key={i} {...s} />)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t} onClick={() => setStatusF(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusF === t ? "text-white" : "text-gray-500 hover:bg-gray-50"}`}
                style={statusF === t ? { backgroundColor: ACCENT } : {}}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في العقارات..." className="pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none w-48" />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
              <Plus className="w-3.5 h-3.5" /> إضافة
            </button>
          </div>
        </div>
        <Table headers={["#", "العنوان", "النوع", "الموقع", "السعر", "الحالة", "تاريخ الإضافة", "إجراءات"]}>
          {filtered.map(p => (
            <Tr key={p.id}>
              <Td className="text-gray-400 text-xs">{p.id}</Td>
              <Td><span className="font-medium text-gray-800 text-sm">{p.title}</span></Td>
              <Td><span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{p.type}</span></Td>
              <Td className="text-gray-500 text-xs">{p.loc}</Td>
              <Td className="font-semibold text-gray-800 text-xs">{p.price} ج.م</Td>
              <Td>
                <Badge label={p.status}
                  color={p.status === "نشط" ? "green" : p.status === "معلق" ? "amber" : "red"} />
              </Td>
              <Td className="text-gray-400 text-xs">{p.date}</Td>
              <Td>
                <ActionBtns
                  onView={() => navigate(`/property/${p.id}`)}
                  onEdit={() => navigate(`/dashboard/edit/${p.id}`)}
                  onDelete={() => handleDelete(p.id)}
                />
              </Td>
            </Tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

// ── Categories Section ───────────────────────────────────────────────────────
function CategoriesSection() {
  const [cats, setCats] = useState(CATEGORIES);
  const [expanded, setExpanded] = useState<number[]>([]);

  // Add category modal
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [addCatForm, setAddCatForm] = useState({ name: "", nameEn: "", slug: "", icon: "" });

  // Edit category modal
  const [editCat, setEditCat] = useState<typeof CATEGORIES[0] | null>(null);
  const [editCatForm, setEditCatForm] = useState({ name: "", nameEn: "", slug: "", icon: "" });

  // Add sub-category modal
  const [addSubCatId, setAddSubCatId] = useState<number | null>(null);
  const [addSubName, setAddSubName] = useState("");

  // Edit sub-category modal
  const [editSub, setEditSub] = useState<{ catId: number; idx: number; value: string } | null>(null);
  const [editSubValue, setEditSubValue] = useState("");

  const toggleExpand = (id: number) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // Category CRUD
  const addCategory = () => {
    if (!addCatForm.name.trim()) return;
    const newId = Math.max(...cats.map(c => c.id)) + 1;
    setCats(prev => [...prev, { id: newId, ...addCatForm, count: 0, active: true, subs: [] }]);
    setAddCatForm({ name: "", nameEn: "", slug: "", icon: "" });
    setAddCatOpen(false);
  };
  const openEditCat = (c: typeof CATEGORIES[0]) => {
    setEditCatForm({ name: c.name, nameEn: c.nameEn, slug: c.slug, icon: c.icon });
    setEditCat(c);
  };
  const saveEditCat = () => {
    setCats(prev => prev.map(c => c.id === editCat!.id ? { ...c, ...editCatForm } : c));
    setEditCat(null);
  };
  const deleteCat = (id: number) => {
    if (window.confirm("حذف هذا التصنيف وكل تصنيفاته الفرعية؟"))
      setCats(prev => prev.filter(c => c.id !== id));
  };

  // Sub-category CRUD
  const addSub = () => {
    if (!addSubName.trim() || addSubCatId === null) return;
    setCats(prev => prev.map(c => c.id === addSubCatId
      ? { ...c, subs: [...c.subs, addSubName.trim()] } : c));
    if (!expanded.includes(addSubCatId)) setExpanded(prev => [...prev, addSubCatId]);
    setAddSubName("");
    setAddSubCatId(null);
  };
  const openEditSub = (catId: number, idx: number, value: string) => {
    setEditSub({ catId, idx, value });
    setEditSubValue(value);
  };
  const saveEditSub = () => {
    if (!editSub) return;
    setCats(prev => prev.map(c => c.id === editSub.catId
      ? { ...c, subs: c.subs.map((s, i) => i === editSub.idx ? editSubValue : s) } : c));
    setEditSub(null);
  };
  const deleteSub = (catId: number, idx: number) => {
    if (window.confirm("حذف هذا التصنيف الفرعي؟"))
      setCats(prev => prev.map(c => c.id === catId
        ? { ...c, subs: c.subs.filter((_, i) => i !== idx) } : c));
  };

  const totalSubs = cats.reduce((acc, c) => acc + c.subs.length, 0);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">تصنيفات العقارات</h3>
            <p className="text-xs text-gray-400 mt-0.5">{cats.length} تصنيف · {totalSubs} تصنيف فرعي</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCats(CATEGORIES)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
              <RefreshCw className="w-3.5 h-3.5" /> تحديث
            </button>
            <button onClick={() => setAddCatOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
              <Plus className="w-3.5 h-3.5" /> إضافة تصنيف
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="w-10 px-4 py-3"></th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الاسم بالعربي</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الاسم بالإنجليزي</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">الأيقونة</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">المعرّف (Slug)</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">التصنيفات الفرعية</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <>
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleExpand(c.id)}
                        className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-all"
                        style={{ transform: expanded.includes(c.id) ? "rotate(90deg)" : "rotate(0deg)" }}>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{c.nameEn}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{c.icon}</span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{c.slug}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>
                        {c.subs.length} فرعي
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => deleteCat(c.id)}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center" title="حذف التصنيف">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openEditCat(c)}
                          className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-500 flex items-center justify-center" title="تعديل التصنيف">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setAddSubCatId(c.id); setAddSubName(""); }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-teal-50 transition-colors" style={{ color: ACCENT }}>
                          <Plus className="w-3 h-3" /> إضافة فرعي
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expanded.includes(c.id) && c.subs.map((sub, si) => (
                    <tr key={`${c.id}-${si}`} className="border-b border-gray-50 bg-gray-50/40">
                      <td className="px-4 py-2.5"></td>
                      <td className="px-4 py-2.5" colSpan={5}>
                        <div className="flex items-center gap-2 mr-3">
                          <div className="w-1 h-4 rounded-full bg-gray-300 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{sub}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => deleteSub(c.id, si)}
                            className="w-6 h-6 rounded hover:bg-red-50 text-red-400 flex items-center justify-center" title="حذف الفرعي">
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button onClick={() => openEditSub(c.id, si, sub)}
                            className="w-6 h-6 rounded hover:bg-green-50 text-green-500 flex items-center justify-center" title="تعديل الفرعي">
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {expanded.includes(c.id) && c.subs.length === 0 && (
                    <tr key={`${c.id}-empty`} className="border-b border-gray-50 bg-gray-50/20">
                      <td className="px-4 py-3" colSpan={7}>
                        <p className="text-center text-xs text-gray-400">لا توجد تصنيفات فرعية — اضغط "إضافة فرعي" لإضافة واحد</p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Add Category ── */}
      <AnimatePresence>
        {addCatOpen && (
          <AdminModal title="إضافة تصنيف جديد" onClose={() => setAddCatOpen(false)}>
            <div className="space-y-4">
              {[
                { label: "الاسم بالعربي",    key: "name",   ph: "مثل: شقق" },
                { label: "الاسم بالإنجليزي", key: "nameEn", ph: "e.g. Apartments" },
                { label: "المعرّف (Slug)",    key: "slug",   ph: "e.g. apartments" },
                { label: "الأيقونة",         key: "icon",   ph: "مثل: Home" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                  <input value={(addCatForm as any)[f.key]} placeholder={f.ph}
                    onChange={e => setAddCatForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
                </div>
              ))}
              <button onClick={addCategory}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}>
                <Plus className="w-4 h-4" /> إضافة التصنيف
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* ── Modal: Edit Category ── */}
      <AnimatePresence>
        {editCat && (
          <AdminModal title={`تعديل تصنيف: ${editCat.name}`} onClose={() => setEditCat(null)}>
            <div className="space-y-4">
              {[
                { label: "الاسم بالعربي",    key: "name" },
                { label: "الاسم بالإنجليزي", key: "nameEn" },
                { label: "المعرّف (Slug)",    key: "slug" },
                { label: "الأيقونة",         key: "icon" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                  <input value={(editCatForm as any)[f.key]}
                    onChange={e => setEditCatForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
                </div>
              ))}
              <button onClick={saveEditCat}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}>
                <CheckCircle className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* ── Modal: Add Sub-Category ── */}
      <AnimatePresence>
        {addSubCatId !== null && (
          <AdminModal
            title={`إضافة فرعي لـ: ${cats.find(c => c.id === addSubCatId)?.name ?? ""}`}
            onClose={() => setAddSubCatId(null)}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">اسم التصنيف الفرعي</label>
                <input value={addSubName} placeholder="مثل: شقق مفروشة"
                  onChange={e => setAddSubName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addSub()}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
              </div>
              <button onClick={addSub}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}>
                <Plus className="w-4 h-4" /> إضافة
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* ── Modal: Edit Sub-Category ── */}
      <AnimatePresence>
        {editSub && (
          <AdminModal title="تعديل التصنيف الفرعي" onClose={() => setEditSub(null)}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">اسم التصنيف الفرعي</label>
                <input value={editSubValue}
                  onChange={e => setEditSubValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveEditSub()}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
              </div>
              <button onClick={saveEditSub}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}>
                <CheckCircle className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Locations Section ────────────────────────────────────────────────────────
function LocationsSection() {
  const [locs, setLocs] = useState(LOCATIONS);
  const [tab, setTab] = useState<"منطقة" | "مدينة" | "حي">("منطقة");
  const [editLoc, setEditLoc] = useState<typeof LOCATIONS[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", nameEn: "" });

  const toggle = (id: number) => setLocs(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  const handleDelete = (id: number) => {
    if (window.confirm("حذف هذا الموقع؟")) setLocs(prev => prev.filter(l => l.id !== id));
  };
  const openEdit = (l: typeof LOCATIONS[0]) => {
    setEditForm({ name: l.name, nameEn: l.nameEn });
    setEditLoc(l);
  };
  const saveEdit = () => {
    setLocs(prev => prev.map(l => l.id === editLoc!.id ? { ...l, ...editForm } : l));
    setEditLoc(null);
  };

  const filtered = locs.filter(l => l.type === tab);
  const tabConfig = [
    { key: "منطقة" as const, label: "المناطق",  bg: "#FFF7ED", clr: "#EA580C" },
    { key: "مدينة" as const, label: "المدن",    bg: "#EFF6FF", clr: "#2563EB" },
    { key: "حي"    as const, label: "الأحياء",  bg: "#F0FDF4", clr: "#16A34A" },
  ];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">إدارة المواقع الجغرافية</h2>
        <p className="text-sm text-gray-400 mt-0.5">إدارة المدن والأحياء ومناطق الخدمة</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {tabConfig.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setTab(t.key)}>
            <p className="text-3xl font-black text-gray-900">{locs.filter(l => l.type === t.key).length}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: t.bg, border: `2px solid ${t.clr}22` }}></div>
              <p className="text-sm font-medium text-gray-500">{t.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          {/* Pill tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {tabConfig.map(t => {
              const count = locs.filter(l => l.type === t.key).length;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${tab === t.key ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
                  {t.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${tab === t.key ? "text-white" : "bg-gray-200 text-gray-500"}`}
                    style={tab === t.key ? { backgroundColor: ACCENT } : {}}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
            <Plus className="w-3.5 h-3.5" /> إضافة {tab === "منطقة" ? "منطقة" : tab === "مدينة" ? "مدينة" : "حي"}
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map((l, i) => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
              <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{l.name}</p>
                <p className="text-xs text-gray-400">{l.nameEn}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${l.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                  {l.active ? "في الواجهة" : "مخفي"}
                </span>
                <button onClick={() => toggle(l.id)}>
                  {l.active
                    ? <ToggleRight className="w-8 h-8" style={{ color: ACCENT }} />
                    : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                </button>
                <button onClick={() => openEdit(l)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                  <Edit2 className="w-3 h-3" /> تعديل
                </button>
                <button onClick={() => handleDelete(l.id)}
                  className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-sm">لا توجد عناصر في هذا التصنيف</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editLoc && (
          <AdminModal title={`تعديل: ${editLoc.name}`} onClose={() => setEditLoc(null)}>
            <div className="space-y-4">
              {[
                { label: "الاسم بالعربي",    key: "name" },
                { label: "الاسم بالإنجليزي", key: "nameEn" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                  <input value={(editForm as any)[f.key]}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
                </div>
              ))}
              <button onClick={saveEdit}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: ACCENT }}>
                <CheckCircle className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Commissions Section ───────────────────────────────────────────────────────
function CommissionsSection() {
  const [plans, setPlans] = useState(COMMISSION_PLANS);
  const [catComms, setCatComms] = useState(CATEGORY_COMMISSIONS);
  const [featPrices, setFeatPrices] = useState({ d7: 99, d14: 149, d30: 249 });
  const [editPlan, setEditPlan] = useState<typeof COMMISSION_PLANS[0] | null>(null);
  const [editPlanForm, setEditPlanForm] = useState({ price: 0, commPct: 0 });

  const planStyle = (id: number) =>
    id === 1 ? "bg-gray-100 text-gray-600" :
    id === 2 ? "bg-amber-50 text-amber-700" :
               "bg-purple-50 text-purple-700";

  return (
    <div className="space-y-6">

      {/* ── Section 1: Subscription Plans ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: ACCENT_LIGHT }}>
              <Package className="w-4 h-4" style={{ color: ACCENT }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">خطط الاشتراك</h3>
              <p className="text-xs text-gray-400">إدارة الباقات الشهرية ونسب العمولة</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["الباقة", "السعر/شهر (ج.م)", "المدة (يوم)", "حد العقارات", "خانات التميز", "العمولة %", "الأولوية", "إجراءات"].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-4">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${planStyle(p.id)}`}>{p.name}</span>
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-800">{p.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-gray-600">{p.days}</td>
                  <td className="px-4 py-4 text-gray-600">{p.limit}</td>
                  <td className="px-4 py-4 text-gray-600">{p.featured}</td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-emerald-600">{p.commPct}.00%</span>
                  </td>
                  <td className="px-4 py-4 text-gray-400">{p.priority}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => { setEditPlanForm({ price: p.price, commPct: p.commPct }); setEditPlan(p); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                      <Edit2 className="w-3 h-3" /> تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 2: Per-category commission ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: ACCENT_LIGHT }}>
            <Percent className="w-4 h-4" style={{ color: ACCENT }} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">إعدادات العمولة لكل تصنيف</h3>
            <p className="text-xs text-gray-400">اضبط نسب عمولة مختلفة لكل تصنيف، تُحفظ التغييرات على كل تصنيف على حدة.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["التصنيف", "الاسم بالإنجليزي", "العمولة %", "حفظ"].map(h => (
                  <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catComms.map((c, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 font-semibold text-gray-800 text-sm">{c.name}</td>
                  <td className="px-5 py-3 text-gray-500 text-sm">{c.nameEn}</td>
                  <td className="px-5 py-3">
                    <input type="number" value={c.pct} min={0} max={100}
                      onChange={e => setCatComms(prev => prev.map((cc, ii) => ii === i ? { ...cc, pct: Number(e.target.value) } : cc))}
                      className="w-20 py-1.5 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-300 bg-gray-50 text-center font-bold" />
                  </td>
                  <td className="px-5 py-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: ACCENT }}>
                      <CheckCircle className="w-3 h-3" /> حفظ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 3: Featured pricing ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">تسعير العقارات المميزة</h3>
            <p className="text-xs text-gray-400">حدد رسوم تمييز العقارات في نتائج البحث</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "تمييز 7 أيام (ج.م)",  key: "d7"  as const },
            { label: "تمييز 14 يوم (ج.م)", key: "d14" as const },
            { label: "تمييز 30 يوم (ج.م)", key: "d30" as const },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-gray-500 block mb-2">{f.label}</label>
              <input type="number" value={featPrices[f.key]}
                onChange={e => setFeatPrices(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all text-center font-bold" />
            </div>
          ))}
        </div>
        <button className="mt-5 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
          <CheckCircle className="w-4 h-4" /> حفظ التسعير
        </button>
      </div>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {editPlan && (
          <AdminModal title={`تعديل خطة: ${editPlan.name}`} onClose={() => setEditPlan(null)}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">السعر/شهر (ج.م)</label>
                <input type="number" value={editPlanForm.price}
                  onChange={e => setEditPlanForm(p => ({ ...p, price: Number(e.target.value) }))}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">نسبة العمولة %</label>
                <input type="number" value={editPlanForm.commPct}
                  onChange={e => setEditPlanForm(p => ({ ...p, commPct: Number(e.target.value) }))}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white transition-all" />
              </div>
              <button onClick={() => {
                setPlans(prev => prev.map(p => p.id === editPlan.id ? { ...p, ...editPlanForm } : p));
                setEditPlan(null);
              }} className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2" style={{ backgroundColor: ACCENT }}>
                <CheckCircle className="w-4 h-4" /> حفظ التغييرات
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Messages Section ─────────────────────────────────────────────────────────
function MessagesSection() {
  const [msgList, setMsgList] = useState(MESSAGES_DATA);
  const [viewMsg, setViewMsg] = useState<typeof MESSAGES_DATA[0] | null>(null);

  const handleDelete = (id: number) => {
    if (window.confirm("حذف هذه الرسالة؟")) setMsgList(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "جديد",      value: String(msgList.filter(m => m.status === "جديد").length),   color: "#EF4444" },
          { label: "مفتوح",     value: String(msgList.filter(m => m.status === "مفتوح").length),  color: "#F59E0B" },
          { label: "مغلق",      value: String(msgList.filter(m => m.status === "مغلق").length),   color: "#10B981" },
          { label: "الإجمالي",  value: String(msgList.length),                                    color: ACCENT },
        ].map((s, i) => <StatCard key={i} {...s} />)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">الرسائل والاستفسارات</h3>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
            <Filter className="w-3.5 h-3.5" /> تصفية
          </button>
        </div>
        <Table headers={["#", "المُرسِل", "الموضوع", "الأولوية", "الحالة", "الوقت", "إجراءات"]}>
          {msgList.map(m => (
            <Tr key={m.id} onClick={() => setViewMsg(m)}>
              <Td className="text-gray-400 text-xs">{m.id}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: ACCENT }}>
                    {m.from[0]}
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{m.from}</span>
                </div>
              </Td>
              <Td className="text-gray-600 text-sm">{m.subject}</Td>
              <Td>
                <Badge label={m.priority} color={m.priority === "عالية" ? "red" : m.priority === "متوسطة" ? "amber" : "gray"} />
              </Td>
              <Td>
                <Badge label={m.status} color={m.status === "جديد" ? "blue" : m.status === "مفتوح" ? "amber" : "green"} />
              </Td>
              <Td className="text-gray-400 text-xs">{m.time}</Td>
              <Td><ActionBtns onView={() => setViewMsg(m)} onDelete={() => handleDelete(m.id)} /></Td>
            </Tr>
          ))}
        </Table>
      </div>

      <AnimatePresence>
        {viewMsg && (
          <AdminModal title="تفاصيل الرسالة" onClose={() => setViewMsg(null)}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: ACCENT }}>
                  {viewMsg.from[0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{viewMsg.from}</p>
                  <p className="text-xs text-gray-400">{viewMsg.time}</p>
                </div>
                <div className="mr-auto flex gap-2">
                  <Badge label={viewMsg.priority} color={viewMsg.priority === "عالية" ? "red" : viewMsg.priority === "متوسطة" ? "amber" : "gray"} />
                  <Badge label={viewMsg.status} color={viewMsg.status === "جديد" ? "blue" : viewMsg.status === "مفتوح" ? "amber" : "green"} />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-2">الموضوع</p>
                <p className="text-sm text-gray-600">{viewMsg.subject}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setMsgList(prev => prev.map(m => m.id === viewMsg.id ? { ...m, status: "مغلق" } : m)); setViewMsg(null); }}
                  className="flex-1 py-2 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
                  إغلاق الرسالة
                </button>
                <button onClick={() => setViewMsg(null)}
                  className="flex-1 py-2 rounded-xl text-sm font-bold text-gray-500 border border-gray-200 hover:bg-gray-50">
                  إغلاق
                </button>
              </div>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Payments Section ─────────────────────────────────────────────────────────
function PaymentsSection() {
  const [viewPayment, setViewPayment] = useState<typeof PAYMENTS_DATA[0] | null>(null);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "إجمالي المحصّل",     value: "48,320 ج.م", sub: "في الفترة المحددة", trend: "up" as const, color: "#10B981" },
          { label: "تسويات معلّقة",      value: "3,200 ج.م",  sub: "في الفترة المحددة", trend: undefined,      color: "#F59E0B" },
          { label: "المعاملات الفاشلة",  value: "580 ج.م",    sub: "في الفترة المحددة", trend: "down" as const,color: "#EF4444" },
        ].map((s, i) => <StatCard key={i} {...s} />)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">أحدث المعاملات</h3>
          <div className="flex items-center gap-2">
            <input type="date" className="text-sm py-1.5 px-3 border border-gray-200 rounded-xl outline-none text-gray-600 bg-gray-50" />
            <input type="date" className="text-sm py-1.5 px-3 border border-gray-200 rounded-xl outline-none text-gray-600 bg-gray-50" />
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
              تطبيق
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>
        </div>
        <Table headers={["رقم المعاملة", "المستخدم", "النوع", "المبلغ", "الحالة", "التاريخ", "إجراءات"]}>
          {PAYMENTS_DATA.map(p => (
            <Tr key={p.id} onClick={() => setViewPayment(p)}>
              <Td><code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{p.id}</code></Td>
              <Td><span className="font-medium text-gray-800">{p.user}</span></Td>
              <Td className="text-gray-500 text-sm">{p.type}</Td>
              <Td><span className="font-bold text-gray-800">{p.amount} ج.م</span></Td>
              <Td>
                <Badge label={p.status} color={p.status === "مكتمل" ? "green" : p.status === "معلق" ? "amber" : "red"} />
              </Td>
              <Td className="text-gray-400 text-xs">{p.date}</Td>
              <Td><ActionBtns onView={() => setViewPayment(p)} /></Td>
            </Tr>
          ))}
        </Table>
      </div>

      <AnimatePresence>
        {viewPayment && (
          <AdminModal title="تفاصيل المعاملة" onClose={() => setViewPayment(null)}>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <p className="text-3xl font-black text-gray-900">{viewPayment.amount} ج.م</p>
                <Badge label={viewPayment.status} color={viewPayment.status === "مكتمل" ? "green" : viewPayment.status === "معلق" ? "amber" : "red"} />
              </div>
              {[
                { label: "رقم المعاملة", value: viewPayment.id },
                { label: "المستخدم",     value: viewPayment.user },
                { label: "نوع الدفعة",   value: viewPayment.type },
                { label: "التاريخ",      value: viewPayment.date },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Subscriptions Section ────────────────────────────────────────────────────
function SubscriptionsSection() {
  const [subsList, setSubsList] = useState(SUBS_DATA);
  const [viewSub, setViewSub] = useState<typeof SUBS_DATA[0] | null>(null);

  const handleDelete = (idx: number) => {
    if (window.confirm("إلغاء هذا الاشتراك؟")) setSubsList(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "الإيراد المتكرر شهرياً", value: "4,455 ج.م", color: "#10B981" },
          { label: "اشتراكات نشطة",           value: String(subsList.filter(s => s.status === "نشط").length),  color: ACCENT },
          { label: "اشتراكات منتهية",          value: String(subsList.filter(s => s.status === "منته").length), color: "#6366F1" },
        ].map((s, i) => <StatCard key={i} {...s} />)}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">جميع الاشتراكات <span className="text-gray-400 font-normal">({subsList.length})</span></h3>
        </div>
        <Table headers={["مقدم الخدمة", "الباقة", "الحالة", "تاريخ البداية", "تاريخ الانتهاء", "المبلغ", "إجراءات"]}>
          {subsList.map((s, i) => (
            <Tr key={i} onClick={() => setViewSub(s)}>
              <Td className="text-gray-500 text-xs">{s.user}</Td>
              <Td>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.plan === "مجاني" ? "bg-gray-100 text-gray-500" : "text-white"}`}
                  style={s.plan !== "مجاني" ? { backgroundColor: ACCENT } : {}}>
                  {s.plan}
                </span>
              </Td>
              <Td><Badge label={s.status} color={s.status === "نشط" ? "green" : "red"} /></Td>
              <Td className="text-gray-400 text-xs">{s.start}</Td>
              <Td className="text-gray-400 text-xs">{s.end}</Td>
              <Td><span className="font-bold text-gray-700">{s.amount} ج.م</span></Td>
              <Td><ActionBtns onView={() => setViewSub(s)} onDelete={() => handleDelete(i)} /></Td>
            </Tr>
          ))}
        </Table>
      </div>

      <AnimatePresence>
        {viewSub && (
          <AdminModal title="تفاصيل الاشتراك" onClose={() => setViewSub(null)}>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${viewSub.plan === "مجاني" ? "bg-gray-100 text-gray-500" : "text-white"}`}
                  style={viewSub.plan !== "مجاني" ? { backgroundColor: ACCENT } : {}}>
                  {viewSub.plan}
                </span>
                <Badge label={viewSub.status} color={viewSub.status === "نشط" ? "green" : "red"} />
              </div>
              {[
                { label: "المستخدم",         value: viewSub.user },
                { label: "تاريخ البداية",    value: viewSub.start },
                { label: "تاريخ الانتهاء",  value: viewSub.end },
                { label: "المبلغ",           value: `${viewSub.amount} ج.م` },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-400">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Reports Section ──────────────────────────────────────────────────────────
function ReportsSection() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue this month */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-1">الإيرادات (هذا الشهر)</h3>
          <p className="text-xs text-gray-400 mb-4">نمو الإيرادات الأسبوعية</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f1f5f9", fontSize: 12 }} />
              <Line type="monotone" dataKey="rev" name="الإيرادات" stroke={ACCENT} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion rate */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-1">معدل التحويل (من البحث إلى الحجز)</h3>
          <p className="text-xs text-gray-400 mb-4">النسبة المئوية أسبوعياً</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={WEEKLY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #f1f5f9", fontSize: 12 }} />
              <Line type="monotone" dataKey="conv" name="معدل التحويل" stroke="#6366F1" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top cats */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">أبرز التصنيفات (حسب عدد الخدمات)</h3>
          <div className="space-y-3">
            {TOP_CATS.map((c, i) => {
              const pct = Math.round((c.count / TOP_CATS[0].count) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{c.name}</span>
                    <span className="font-semibold text-gray-800">{c.count} خدمة</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
                      className="h-full rounded-full" style={{ backgroundColor: ACCENT }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top providers */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4">أعلى 5 مستخدمين (حسب الأرباح)</h3>
          <div className="space-y-3">
            {[
              { name: "أحمد عبدالله",  cat: "شقق",  val: "12,450" },
              { name: "سارة خالد",     cat: "فيلات", val: "9,820" },
              { name: "فاطمة آل سعود", cat: "محلات", val: "8,100" },
              { name: "محمد علي",      cat: "أراضي", val: "7,040" },
              { name: "عمر فهد",       cat: "شقق",  val: "5,300" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gray-100 text-gray-500">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.cat}</p>
                  </div>
                </div>
                <span className="font-bold text-sm" style={{ color: ACCENT }}>{p.val} ج.م</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Settings Section ─────────────────────────────────────────────────────────
function SettingsSection() {
  const [tab, setTab] = useState("عام");
  const tabs = ["عام", "التواصل", "محتوى الصفحات", "الأمان", "الأسئلة الشائعة"];
  return (
    <div className="space-y-5">
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto pb-0">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-all ${tab === t ? "border-current" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            style={tab === t ? { color: ACCENT, borderColor: ACCENT } : {}}>
            {t}
          </button>
        ))}
      </div>

      {tab === "عام" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-4 h-4" style={{ color: ACCENT }} />
            <div>
              <h3 className="font-bold text-gray-900 text-sm">الإعدادات العامة</h3>
              <p className="text-xs text-gray-400">اسم الموقع، الشعار، والهوية المعروضة في الواجهة</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "اسم الموقع (عربي)",       placeholder: "عقارات بنها",          type: "text" },
              { label: "اسم الموقع (إنجليزي)",    placeholder: "Banha Real Estate",    type: "text" },
              { label: "ساعات العمل (عربي)",       placeholder: "يومياً 9:00 ص - 10:00 م", type: "text" },
              { label: "ساعات العمل (إنجليزي)",   placeholder: "Daily 9:00 AM - 10:00 PM", type: "text" },
              { label: "رابط الشعار",              placeholder: "https://example.com/logo.png", type: "url" },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
              </div>
            ))}
          </div>
          <button className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
            <CheckCircle className="w-4 h-4" /> حفظ الإعدادات العامة
          </button>
        </div>
      )}

      {tab === "التواصل" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 text-sm mb-5">معلومات التواصل</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "البريد الإلكتروني", placeholder: "admin@banha.com",   type: "email" },
              { label: "رقم الهاتف",        placeholder: "+20 10 1234 5678",  type: "tel" },
              { label: "فيسبوك",            placeholder: "https://facebook.com/...", type: "url" },
              { label: "واتساب",            placeholder: "+20 10 ...",         type: "tel" },
              { label: "يوتيوب",            placeholder: "https://youtube.com/...",  type: "url" },
              { label: "تيك توك",           placeholder: "https://tiktok.com/...",   type: "url" },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
              </div>
            ))}
          </div>
          <button className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
            <CheckCircle className="w-4 h-4" /> حفظ بيانات التواصل
          </button>
        </div>
      )}

      {tab === "الأمان" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4" style={{ color: ACCENT }} />
            <h3 className="font-bold text-gray-900 text-sm">الأمان وبيانات المسؤول</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
            {[
              { label: "البريد الإلكتروني الحالي", placeholder: "admin@banha.com",  type: "email" },
              { label: "كلمة المرور الحالية",      placeholder: "••••••••",         type: "password" },
              { label: "كلمة المرور الجديدة",      placeholder: "••••••••",         type: "password" },
              { label: "تأكيد كلمة المرور",        placeholder: "••••••••",         type: "password" },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-gray-300 transition-all" />
              </div>
            ))}
          </div>
          <button className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>
            <Lock className="w-4 h-4" /> تحديث بيانات الأمان
          </button>
        </div>
      )}

      {(tab === "محتوى الصفحات" || tab === "الأسئلة الشائعة") && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center">
          <FileText className="w-12 h-12 text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">هذا القسم قيد التطوير</p>
          <p className="text-gray-300 text-sm mt-1">سيتم إضافته قريباً</p>
        </div>
      )}
    </div>
  );
}

// ── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const NAV = [
    { id: "dashboard",     label: "لوحة التحكم",     icon: LayoutDashboard },
    { id: "users",         label: "المستخدمون",       icon: Users },
    { id: "clients",       label: "العملاء",           icon: UserPlus },
    { id: "properties",   label: "العقارات",          icon: Building2 },
    { id: "categories",   label: "التصنيفات",         icon: Tag },
    { id: "locations",    label: "المناطق والأحياء",  icon: MapPin },
    { id: "messages",     label: "الرسائل",           icon: MessageSquare, badge: 2 },
    { id: "payments",      label: "المدفوعات",         icon: CreditCard },
    { id: "subscriptions", label: "الاشتراكات",        icon: Repeat },
    { id: "commissions",   label: "العمولات",          icon: Percent },
    { id: "reports",       label: "التقارير",          icon: BarChart2 },
    { id: "settings",     label: "الإعدادات",         icon: Settings },
  ];

  const sectionLabel = NAV.find(n => n.id === section)?.label ?? "";

  const SECTION_MAP: Record<Section, React.ReactNode> = {
    dashboard:     <DashboardSection />,
    users:         <UsersSection />,
    clients:       <ClientsSection />,
    properties:    <PropertiesSection />,
    categories:    <CategoriesSection />,
    locations:     <LocationsSection />,
    messages:      <MessagesSection />,
    payments:      <PaymentsSection />,
    subscriptions: <SubscriptionsSection />,
    commissions:   <CommissionsSection />,
    reports:       <ReportsSection />,
    settings:      <SettingsSection />,
  };

  return (
    <div className="min-h-screen flex bg-[#F1F5F9]" dir="rtl">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-20 lg:hidden" />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside
        className={`w-56 flex flex-col fixed h-full z-30 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: SB }}
      >
        {/* Logo */}
        <div className="h-14 px-5 flex items-center border-b border-white/5">
          <img src={logoColor} alt="عقارات بنها" className="h-6 w-auto brightness-0 invert opacity-80" />
          <span className="text-white/40 text-xs mr-2 font-medium">— المسؤول</span>
        </div>

        {/* Admin user */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: ACCENT }}>
            أ
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Admin</p>
            <p className="text-white/40 text-[10px]">مسؤول عام</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest px-3 mb-2">القائمة</p>
          {NAV.map(item => {
            const active = section === item.id;
            return (
              <button key={item.id} onClick={() => { setSection(item.id as Section); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
                style={active ? { backgroundColor: SB_ACTIVE } : {}}>
                <span className="flex items-center gap-2.5">
                  <item.icon style={{ width: 15, height: 15 }} />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className="text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1 bg-red-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-white/5 space-y-0.5">
          <button onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors">
            <Home style={{ width: 14, height: 14 }} /> العودة إلى الموقع
          </button>
          <button onClick={() => navigate("/admin/login")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-white/5 transition-colors">
            <LogOut style={{ width: 14, height: 14 }} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <div className="flex-1 lg:mr-56 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-400 hidden sm:flex items-center gap-1.5">
              <span className="font-bold text-gray-700">عقارات بنها</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold" style={{ color: ACCENT }}>{sectionLabel}</span>
            </div>
            <span className="sm:hidden font-bold text-gray-800 text-sm">{sectionLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="bg-gray-50 text-sm py-1.5 pr-9 pl-4 rounded-xl border border-gray-200 outline-none w-48 focus:bg-white focus:border-gray-300 transition-all placeholder:text-gray-400" placeholder="بحث سريع..." />
            </div>
            <button className="relative w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-200">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold ml-1 cursor-pointer" style={{ backgroundColor: ACCENT }}>
              أ
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {SECTION_MAP[section]}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-6 py-3 border-t border-gray-100 bg-white text-xs text-gray-400 text-center">
          عقارات بنها — لوحة تحكم المسؤول © 2026
        </footer>
      </div>
    </div>
  );
}
