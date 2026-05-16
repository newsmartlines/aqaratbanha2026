import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Package, Plus, Edit2, Trash2, Copy, ChevronDown, ChevronUp,
  Check, X, Star, Crown, Zap, Shield, TrendingUp, TrendingDown,
  DollarSign, Users, CreditCard, Percent, Bell, Tag, Gift,
  ToggleLeft, ToggleRight, Eye, EyeOff, ArrowUpDown,
  Building2, User, Briefcase, Award, Settings,
  Save, AlertCircle, CheckCircle, BarChart2, Activity,
  RefreshCw, Download, Upload, Search, Filter,
} from "lucide-react";

const ACCENT = "#2563EB";
const SB_ACTIVE = "#1E3A8A";

// ── Types ────────────────────────────────────────────────────────────────────

type UserRole = "normal" | "broker" | "company" | "developer" | "vip" | "all";
type PlanStatus = "active" | "inactive" | "archived";
type CommissionType = "percentage" | "fixed" | "city" | "property_type" | "plan" | "user_role";
type BillingCycle = "monthly" | "quarterly" | "yearly" | "lifetime";

interface PlanLimits {
  properties: number;
  images: number;
  videos: number;
  featured: number;
  pinned: number;
  messages: number;
  leads: number;
  contacts: number;
}

interface PlanFeatures {
  homepageFeatured: boolean;
  topSearch: boolean;
  verifiedBadge: boolean;
  premiumBadge: boolean;
  prioritySupport: boolean;
  advancedAnalytics: boolean;
  advancedSEO: boolean;
  aiTools: boolean;
  autoBoost: boolean;
}

interface Plan {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: "EGP" | "USD";
  billing: BillingCycle;
  targetRoles: UserRole[];
  status: PlanStatus;
  isRecommended: boolean;
  isMostPopular: boolean;
  color: string;
  icon: string;
  order: number;
  limits: PlanLimits;
  features: PlanFeatures;
  commission: number;
  subscribers: number;
  revenue: number;
}

interface CommissionRule {
  id: string;
  name: string;
  type: CommissionType;
  role?: UserRole;
  value: number;
  isPercentage: boolean;
  appliesTo: string;
  active: boolean;
  priority: number;
}

interface Coupon {
  id: string;
  code: string;
  discount: number;
  isPercentage: boolean;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
  applicablePlans: string[];
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const REVENUE_DATA = [
  { m: "يناير", revenue: 12400, subscriptions: 34, commissions: 3200 },
  { m: "فبراير", revenue: 15800, subscriptions: 41, commissions: 4100 },
  { m: "مارس",  revenue: 13200, subscriptions: 38, commissions: 3600 },
  { m: "أبريل", revenue: 19600, subscriptions: 52, commissions: 5200 },
  { m: "مايو",  revenue: 22400, subscriptions: 61, commissions: 5900 },
  { m: "يونيو", revenue: 28100, subscriptions: 78, commissions: 7400 },
];

const DAILY_DATA = [
  { d: "السبت",  v: 1200 }, { d: "الأحد",   v: 1800 },
  { d: "الإثنين", v: 2400 }, { d: "الثلاثاء", v: 1900 },
  { d: "الأربعاء", v: 2800 }, { d: "الخميس", v: 3200 },
  { d: "الجمعة", v: 2100 },
];

const INIT_PLANS: Plan[] = [
  {
    id: "free", name: "مجاني", nameEn: "Free", description: "للمستخدمين الجدد الذين يريدون تجربة المنصة",
    price: 0, currency: "EGP", billing: "monthly", targetRoles: ["normal"],
    status: "active", isRecommended: false, isMostPopular: false,
    color: "#6B7280", icon: "free", order: 1,
    limits: { properties: 3, images: 5, videos: 0, featured: 0, pinned: 0, messages: 10, leads: 5, contacts: 5 },
    features: { homepageFeatured: false, topSearch: false, verifiedBadge: false, premiumBadge: false, prioritySupport: false, advancedAnalytics: false, advancedSEO: false, aiTools: false, autoBoost: false },
    commission: 10, subscribers: 842, revenue: 0,
  },
  {
    id: "basic", name: "الأساسية", nameEn: "Basic", description: "مثالية للأفراد والسماسرة المبتدئين",
    price: 199, currency: "EGP", billing: "monthly", targetRoles: ["normal", "broker"],
    status: "active", isRecommended: false, isMostPopular: false,
    color: "#3B82F6", icon: "basic", order: 2,
    limits: { properties: 10, images: 15, videos: 2, featured: 1, pinned: 0, messages: 50, leads: 20, contacts: 20 },
    features: { homepageFeatured: false, topSearch: false, verifiedBadge: true, premiumBadge: false, prioritySupport: false, advancedAnalytics: false, advancedSEO: false, aiTools: false, autoBoost: false },
    commission: 7, subscribers: 312, revenue: 62088,
  },
  {
    id: "pro", name: "الاحترافية", nameEn: "Professional", description: "للسماسرة والوكلاء العقاريين المحترفين",
    price: 499, originalPrice: 699, currency: "EGP", billing: "monthly", targetRoles: ["broker", "company"],
    status: "active", isRecommended: true, isMostPopular: true,
    color: "#2563EB", icon: "pro", order: 3,
    limits: { properties: 50, images: 30, videos: 5, featured: 5, pinned: 2, messages: 200, leads: 100, contacts: 100 },
    features: { homepageFeatured: true, topSearch: true, verifiedBadge: true, premiumBadge: true, prioritySupport: true, advancedAnalytics: true, advancedSEO: false, aiTools: false, autoBoost: false },
    commission: 4, subscribers: 189, revenue: 94311,
  },
  {
    id: "enterprise", name: "الشركات", nameEn: "Enterprise", description: "للشركات العقارية والمطورين الكبار",
    price: 1299, currency: "EGP", billing: "monthly", targetRoles: ["company", "developer"],
    status: "active", isRecommended: false, isMostPopular: false,
    color: "#7C3AED", icon: "enterprise", order: 4,
    limits: { properties: 999, images: 100, videos: 20, featured: 20, pinned: 10, messages: 999, leads: 999, contacts: 999 },
    features: { homepageFeatured: true, topSearch: true, verifiedBadge: true, premiumBadge: true, prioritySupport: true, advancedAnalytics: true, advancedSEO: true, aiTools: true, autoBoost: true },
    commission: 0, subscribers: 47, revenue: 61053,
  },
  {
    id: "vip", name: "VIP", nameEn: "VIP Agent", description: "حصري للوكلاء المتميزين والمنتخبين",
    price: 2499, currency: "EGP", billing: "monthly", targetRoles: ["vip"],
    status: "active", isRecommended: false, isMostPopular: false,
    color: "#F59E0B", icon: "vip", order: 5,
    limits: { properties: 999, images: 999, videos: 999, featured: 999, pinned: 999, messages: 999, leads: 999, contacts: 999 },
    features: { homepageFeatured: true, topSearch: true, verifiedBadge: true, premiumBadge: true, prioritySupport: true, advancedAnalytics: true, advancedSEO: true, aiTools: true, autoBoost: true },
    commission: 0, subscribers: 12, revenue: 29988,
  },
];

const INIT_COMMISSIONS: CommissionRule[] = [
  { id: "c1", name: "عمولة المستخدم العادي", type: "user_role", role: "normal", value: 10, isPercentage: true, appliesTo: "بيع وإيجار", active: true, priority: 1 },
  { id: "c2", name: "عمولة السمسار", type: "user_role", role: "broker", value: 5, isPercentage: true, appliesTo: "بيع وإيجار", active: true, priority: 2 },
  { id: "c3", name: "عمولة الشركات", type: "user_role", role: "company", value: 0, isPercentage: true, appliesTo: "اشتراك شهري فقط", active: true, priority: 3 },
  { id: "c4", name: "عمولة VIP مخفضة", type: "user_role", role: "vip", value: 2, isPercentage: true, appliesTo: "جميع المعاملات", active: true, priority: 4 },
  { id: "c5", name: "عمولة الإيجار", type: "property_type", value: 8, isPercentage: true, appliesTo: "عقود الإيجار", active: true, priority: 5 },
  { id: "c6", name: "عمولة التمييز", type: "plan", value: 50, isPercentage: false, appliesTo: "إعلانات مميزة", active: true, priority: 6 },
  { id: "c7", name: "عمولة التجديد", type: "plan", value: 3, isPercentage: true, appliesTo: "تجديد الاشتراكات", active: false, priority: 7 },
];

const INIT_COUPONS: Coupon[] = [
  { id: "cp1", code: "WELCOME30", discount: 30, isPercentage: true, usageLimit: 100, usedCount: 47, expiresAt: "2026-06-30", active: true, applicablePlans: ["basic", "pro"] },
  { id: "cp2", code: "SUMMER50", discount: 50, isPercentage: true, usageLimit: 50, usedCount: 12, expiresAt: "2026-08-31", active: true, applicablePlans: ["pro", "enterprise"] },
  { id: "cp3", code: "VIP2026", discount: 500, isPercentage: false, usageLimit: 20, usedCount: 8, expiresAt: "2026-12-31", active: true, applicablePlans: ["vip"] },
  { id: "cp4", code: "FREE3MONTHS", discount: 100, isPercentage: true, usageLimit: 30, usedCount: 30, expiresAt: "2026-03-31", active: false, applicablePlans: ["basic"] },
];

// ── Helper Components ────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  normal:    { label: "مستخدم عادي",   color: "#6B7280", bg: "#F9FAFB", icon: User      },
  broker:    { label: "سمسار",         color: "#2563EB", bg: "#EFF6FF", icon: Briefcase  },
  company:   { label: "شركة عقارية",  color: "#7C3AED", bg: "#F5F3FF", icon: Building2  },
  developer: { label: "مطور عقاري",   color: "#0EA5E9", bg: "#F0F9FF", icon: Settings   },
  vip:       { label: "VIP Agent",     color: "#F59E0B", bg: "#FFFBEB", icon: Crown      },
  all:       { label: "الجميع",        color: "#10B981", bg: "#ECFDF5", icon: Users      },
};

const BILLING_LABELS: Record<BillingCycle, string> = {
  monthly: "شهري", quarterly: "ربع سنوي", yearly: "سنوي", lifetime: "مدى الحياة",
};

function RoleBadge({ role }: { role: UserRole }) {
  const cfg = ROLE_CONFIG[role];
  const Icon = cfg.icon;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      <Icon style={{ width: 9, height: 9 }} />{cfg.label}
    </span>
  );
}

function StatCard({ label, value, sub, trend, color, icon: Icon }: {
  label: string; value: string; sub?: string;
  trend?: number; color: string; icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
          <Icon style={{ width: 18, height: 18, color }} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      {sub && <p className="text-[11px] text-gray-300 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, onEdit, onDuplicate, onDelete, onToggle }: {
  plan: Plan;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = plan.status === "active";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${plan.isMostPopular ? "shadow-md" : "border-gray-100"}`}
      style={plan.isMostPopular ? { borderColor: plan.color } : {}}>

      {/* Popular / Recommended badge */}
      {plan.isMostPopular && (
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: plan.color }} />
      )}
      {plan.isMostPopular && (
        <div className="absolute top-3 left-3">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1"
            style={{ backgroundColor: plan.color }}>
            <Star style={{ width: 8, height: 8 }} /> الأكثر شيوعاً
          </span>
        </div>
      )}
      {plan.isRecommended && !plan.isMostPopular && (
        <div className="absolute top-3 left-3">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
            <Check style={{ width: 8, height: 8 }} /> موصى به
          </span>
        </div>
      )}

      {/* Status indicator */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${isActive ? "bg-green-400" : "bg-gray-300"}`} />

      <div className="p-5 pt-8">
        {/* Icon + Name */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: plan.color + "15" }}>
            {plan.icon === "vip" ? <Crown style={{ width: 16, height: 16, color: plan.color }} /> :
             plan.icon === "enterprise" ? <Building2 style={{ width: 16, height: 16, color: plan.color }} /> :
             plan.icon === "pro" ? <Zap style={{ width: 16, height: 16, color: plan.color }} /> :
             <Package style={{ width: 16, height: 16, color: plan.color }} />}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{plan.name}</p>
            <p className="text-[10px] text-gray-400">{plan.nameEn}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          {plan.originalPrice && (
            <span className="text-xs text-gray-300 line-through ml-1">{plan.originalPrice} {plan.currency}</span>
          )}
          <span className="text-2xl font-black text-gray-900">{plan.price}</span>
          <span className="text-xs text-gray-400 mr-1">{plan.currency} / {BILLING_LABELS[plan.billing]}</span>
        </div>

        {/* Target roles */}
        <div className="flex flex-wrap gap-1 mb-3">
          {plan.targetRoles.map(r => <RoleBadge key={r} role={r} />)}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-gray-800">{plan.subscribers}</p>
            <p className="text-[10px] text-gray-400">مشترك</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <p className="text-sm font-bold text-gray-800">{(plan.revenue / 1000).toFixed(1)}K</p>
            <p className="text-[10px] text-gray-400">إيرادات</p>
          </div>
        </div>

        {/* Key limits preview */}
        <div className="space-y-1.5 mb-4 text-[11px]">
          <div className="flex items-center justify-between text-gray-500">
            <span>عقارات</span>
            <span className="font-bold text-gray-700">{plan.limits.properties === 999 ? "∞" : plan.limits.properties}</span>
          </div>
          <div className="flex items-center justify-between text-gray-500">
            <span>عمولة</span>
            <span className="font-bold text-gray-700">{plan.commission}%</span>
          </div>
          <div className="flex items-center justify-between text-gray-500">
            <span>AI Tools</span>
            <span>{plan.features.aiTools ? <Check className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-gray-300" />}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all">
            <Edit2 className="w-3 h-3" /> تعديل
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-all">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="absolute left-0 top-10 bg-white border border-gray-100 rounded-xl shadow-lg z-10 py-1 w-36 text-xs"
                  onMouseLeave={() => setMenuOpen(false)}>
                  <button onClick={() => { onToggle(); setMenuOpen(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-600">
                    {isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {isActive ? "إيقاف" : "تفعيل"}
                  </button>
                  <button onClick={() => { onDuplicate(); setMenuOpen(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 text-gray-600">
                    <Copy className="w-3 h-3" /> نسخ
                  </button>
                  <button onClick={() => { onDelete(); setMenuOpen(false); }}
                    className="w-full text-right px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-500">
                    <Trash2 className="w-3 h-3" /> حذف
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Plan Editor Modal ────────────────────────────────────────────────────────

function PlanEditor({ plan, onClose, onSave }: { plan: Plan | null; onClose: () => void; onSave: (p: Plan) => void }) {
  const isNew = !plan?.id || plan.id.startsWith("new-");
  const [draft, setDraft] = useState<Plan>(plan ?? {
    id: `new-${Date.now()}`, name: "", nameEn: "", description: "",
    price: 0, currency: "EGP", billing: "monthly", targetRoles: ["normal"],
    status: "active", isRecommended: false, isMostPopular: false,
    color: "#2563EB", icon: "basic", order: 99,
    limits: { properties: 5, images: 10, videos: 0, featured: 0, pinned: 0, messages: 20, leads: 10, contacts: 10 },
    features: { homepageFeatured: false, topSearch: false, verifiedBadge: false, premiumBadge: false, prioritySupport: false, advancedAnalytics: false, advancedSEO: false, aiTools: false, autoBoost: false },
    commission: 10, subscribers: 0, revenue: 0,
  });
  const [tab, setTab] = useState<"basic" | "limits" | "features" | "commission">("basic");

  function setVal<K extends keyof Plan>(k: K, v: Plan[K]) { setDraft(d => ({ ...d, [k]: v })); }
  function setLimit<K extends keyof PlanLimits>(k: K, v: number) { setDraft(d => ({ ...d, limits: { ...d.limits, [k]: v } })); }
  function setFeature<K extends keyof PlanFeatures>(k: K, v: boolean) { setDraft(d => ({ ...d, features: { ...d.features, [k]: v } })); }
  function toggleRole(r: UserRole) {
    const cur = draft.targetRoles;
    setVal("targetRoles", cur.includes(r) ? cur.filter(x => x !== r) : [...cur, r]);
  }

  const TABS = [
    { id: "basic", label: "المعلومات الأساسية" },
    { id: "limits", label: "الحدود والقيود" },
    { id: "features", label: "المميزات" },
    { id: "commission", label: "العمولة" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">{isNew ? "إنشاء باقة جديدة" : `تعديل: ${draft.name}`}</h3>
            <p className="text-xs text-gray-400 mt-0.5">ضبط كل إعدادات الباقة</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-all ${tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {tab === "basic" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">اسم الباقة (عربي)</label>
                  <input value={draft.name} onChange={e => setVal("name", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">اسم الباقة (English)</label>
                  <input value={draft.nameEn} onChange={e => setVal("nameEn", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all" dir="ltr" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">الوصف</label>
                <textarea value={draft.description} onChange={e => setVal("description", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all resize-none h-20" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">السعر</label>
                  <input type="number" value={draft.price} onChange={e => setVal("price", Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">العملة</label>
                  <select value={draft.currency} onChange={e => setVal("currency", e.target.value as "EGP" | "USD")}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all">
                    <option value="EGP">جنيه مصري</option>
                    <option value="USD">دولار أمريكي</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">دورة الفوترة</label>
                  <select value={draft.billing} onChange={e => setVal("billing", e.target.value as BillingCycle)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all">
                    {Object.entries(BILLING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-2">المستخدمون المستهدفون</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG[UserRole]][]).filter(([r]) => r !== "all").map(([role, cfg]) => {
                    const Icon = cfg.icon;
                    const active = draft.targetRoles.includes(role);
                    return (
                      <button key={role} onClick={() => toggleRole(role)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${active ? "shadow-sm" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                        style={active ? { borderColor: cfg.color, color: cfg.color, backgroundColor: cfg.bg } : {}}>
                        <Icon style={{ width: 12, height: 12 }} />{cfg.label}
                        {active && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft.isRecommended} onChange={e => setVal("isRecommended", e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700 font-medium">موصى به</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft.isMostPopular} onChange={e => setVal("isMostPopular", e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700 font-medium">الأكثر شيوعاً</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={draft.status === "active"} onChange={e => setVal("status", e.target.checked ? "active" : "inactive")} className="w-4 h-4 accent-green-500" />
                  <span className="text-sm text-gray-700 font-medium">مفعّلة</span>
                </label>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-2">لون الباقة</label>
                <div className="flex gap-2 flex-wrap">
                  {["#6B7280","#3B82F6","#2563EB","#7C3AED","#F59E0B","#10B981","#EF4444","#0EA5E9"].map(c => (
                    <button key={c} onClick={() => setVal("color", c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${draft.color === c ? "border-gray-900 scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "limits" && (
            <div className="grid grid-cols-2 gap-4">
              {(Object.entries({
                properties: "عدد العقارات",
                images: "عدد الصور",
                videos: "عدد الفيديوهات",
                featured: "إعلانات مميزة",
                pinned: "إعلانات مثبتة",
                messages: "الرسائل",
                leads: "العملاء المحتملون",
                contacts: "طلبات التواصل",
              }) as [keyof PlanLimits, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">{label}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={draft.limits[key] === 999 ? "" : draft.limits[key]}
                      placeholder="999 = ∞"
                      onChange={e => setLimit(key, e.target.value === "" ? 999 : Number(e.target.value))}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 transition-all" />
                    {draft.limits[key] === 999 && <span className="text-lg text-gray-300">∞</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "features" && (
            <div className="space-y-3">
              {(Object.entries({
                homepageFeatured:   "ظهور في الصفحة الرئيسية",
                topSearch:          "ظهور أعلى البحث",
                verifiedBadge:      "شارة Verified",
                premiumBadge:       "شارة Premium",
                prioritySupport:    "دعم الأولوية",
                advancedAnalytics:  "Analytics متقدمة",
                advancedSEO:        "SEO متقدم",
                aiTools:            "AI Tools",
                autoBoost:          "Auto Boost",
              }) as [keyof PlanFeatures, string][]).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <button onClick={() => setFeature(key, !draft.features[key])}
                    className={`relative w-10 h-5 rounded-full transition-colors ${draft.features[key] ? "bg-blue-600" : "bg-gray-200"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${draft.features[key] ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "commission" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">نسبة العمولة لهذه الباقة</p>
                <p className="text-xs text-blue-600">هذه العمولة تُطبَّق على كل معاملة يُجريها مشتركو هذه الباقة</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">نسبة العمولة (%)</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={20} step={0.5} value={draft.commission}
                    onChange={e => setVal("commission", Number(e.target.value))}
                    className="flex-1 accent-blue-600" />
                  <div className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-center text-blue-600">
                    {draft.commission}%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 5, 10].map(v => (
                  <button key={v} onClick={() => setVal("commission", v)}
                    className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${draft.commission === v ? "border-blue-600 text-blue-600 bg-blue-50" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                    {v}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-white transition-all">
            إلغاء
          </button>
          <button onClick={() => onSave(draft)}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT }}>
            <Save className="w-4 h-4" />
            {isNew ? "إنشاء الباقة" : "حفظ التغييرات"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Commission Row ────────────────────────────────────────────────────────────

function CommissionRow({ rule, onToggle, onEdit, onDelete }: {
  rule: CommissionRule; onToggle: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const role = rule.role ? ROLE_CONFIG[rule.role] : null;
  const RoleIcon = role?.icon;
  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: (role?.color ?? "#6B7280") + "15" }}>
            {RoleIcon && <RoleIcon style={{ width: 14, height: 14, color: role?.color ?? "#6B7280" }} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{rule.name}</p>
            <p className="text-[10px] text-gray-400">{rule.appliesTo}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs px-2 py-1 rounded-lg font-medium"
          style={{ backgroundColor: "#EFF6FF", color: ACCENT }}>
          {rule.isPercentage ? `${rule.value}%` : `${rule.value} EGP`}
        </span>
      </td>
      <td className="px-4 py-3">
        {role && <RoleBadge role={rule.role!} />}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400 font-medium">{rule.priority}</td>
      <td className="px-4 py-3">
        <button onClick={onToggle}
          className={`relative w-9 h-5 rounded-full transition-colors ${rule.active ? "bg-green-500" : "bg-gray-200"}`}>
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${rule.active ? "right-0.5" : "left-0.5"}`} />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-400 flex items-center justify-center transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function PlansCommissionsSection() {
  const [tab, setTab] = useState<"overview" | "plans" | "commissions" | "coupons">("overview");
  const [plans, setPlans] = useState<Plan[]>(INIT_PLANS);
  const [commissions, setCommissions] = useState<CommissionRule[]>(INIT_COMMISSIONS);
  const [coupons, setCoupons] = useState<Coupon[]>(INIT_COUPONS);
  const [editingPlan, setEditingPlan] = useState<Plan | null | "new">(null);
  const [toast, setToast] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function handleSavePlan(p: Plan) {
    setPlans(ps => ps.some(x => x.id === p.id) ? ps.map(x => x.id === p.id ? p : x) : [...ps, p]);
    setEditingPlan(null);
    showToast("تم حفظ الباقة بنجاح ✓");
  }

  function handleDuplicatePlan(p: Plan) {
    const copy: Plan = { ...p, id: `copy-${Date.now()}`, name: `نسخة من ${p.name}`, nameEn: `Copy of ${p.nameEn}`, subscribers: 0, revenue: 0 };
    setPlans(ps => [...ps, copy]);
    showToast("تم نسخ الباقة");
  }

  function handleDeletePlan(id: string) {
    setPlans(ps => ps.filter(p => p.id !== id));
    showToast("تم حذف الباقة");
  }

  function handleTogglePlan(id: string) {
    setPlans(ps => ps.map(p => p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
  }

  const totalRevenue = plans.reduce((s, p) => s + p.revenue, 0);
  const totalSubscribers = plans.reduce((s, p) => s + p.subscribers, 0);
  const topPlan = [...plans].sort((a, b) => b.revenue - a.revenue)[0];

  const TABS = [
    { id: "overview", label: "نظرة عامة", icon: BarChart2 },
    { id: "plans", label: "الباقات", icon: Package },
    { id: "commissions", label: "العمولات", icon: Percent },
    { id: "coupons", label: "الكوبونات", icon: Gift },
  ];

  return (
    <div className="space-y-5">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-xl bg-green-600">
            <CheckCircle className="w-4 h-4" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Plans & Commissions Manager</h2>
          <p className="text-sm text-gray-400 mt-0.5">إدارة الباقات والعمولات والاشتراكات</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all">
            <Download className="w-3.5 h-3.5" /> تصدير
          </button>
          <button onClick={() => { setTab("plans"); setEditingPlan("new"); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: ACCENT }}>
            <Plus className="w-3.5 h-3.5" /> باقة جديدة
          </button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.id ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
              <Icon style={{ width: 13, height: 13 }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div className="space-y-5">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="إجمالي الإيرادات" value={`${(totalRevenue / 1000).toFixed(1)}K EGP`}
              sub="هذا الشهر" trend={18} color="#2563EB" icon={DollarSign} />
            <StatCard label="إجمالي المشتركين" value={totalSubscribers.toString()}
              sub={`${plans.filter(p => p.status === "active").length} باقات نشطة`} trend={12} color="#7C3AED" icon={Users} />
            <StatCard label="أفضل باقة" value={topPlan?.name ?? "—"}
              sub={`${topPlan?.subscribers ?? 0} مشترك`} color="#F59E0B" icon={Crown} />
            <StatCard label="عمولات الشهر" value="24,800 EGP"
              sub="من جميع المعاملات" trend={-4} color="#10B981" icon={Percent} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-900 text-sm">نمو الإيرادات</p>
                  <p className="text-xs text-gray-400">آخر 6 أشهر</p>
                </div>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18%
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                  <Area type="monotone" dataKey="revenue" stroke={ACCENT} strokeWidth={2.5} fill="url(#revGrad)" name="الإيرادات" />
                  <Area type="monotone" dataKey="commissions" stroke="#10B981" strokeWidth={2} fill="transparent" strokeDasharray="4 2" name="العمولات" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Plans distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="font-bold text-gray-900 text-sm mb-1">توزيع الإيرادات</p>
              <p className="text-xs text-gray-400 mb-4">حسب الباقة</p>
              <div className="space-y-3">
                {plans.filter(p => p.revenue > 0).sort((a, b) => b.revenue - a.revenue).map(p => (
                  <div key={p.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700">{p.name}</span>
                      <span className="text-xs font-bold text-gray-500">{((p.revenue / totalRevenue) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${(p.revenue / totalRevenue) * 100}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Revenue */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="font-bold text-gray-900 text-sm mb-1">الإيرادات اليومية</p>
            <p className="text-xs text-gray-400 mb-4">هذا الأسبوع</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={DAILY_DATA} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                <Bar dataKey="v" name="الإيرادات" fill={ACCENT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-sm">AI Insights</span>
              <span className="text-xs text-white/40 mr-auto">تحليلات ذكية</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: "أفضل باقة للترويج", body: "الباقة الاحترافية تحقق أعلى ROI — ارفع الإنفاق الإعلاني عليها", tag: "🚀 فرصة" },
                { title: "مستخدمون قابلون للترقية", body: "47 مستخدم من الباقة الأساسية يستخدمون 90%+ من حدودهم", tag: "📈 ترقية" },
                { title: "تسعير مقترح", body: "رفع سعر الباقة المجانية إلى 49 جنيه قد يرفع الإيرادات 15%", tag: "💡 تسعير" },
              ].map((i, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <span className="text-[10px] font-bold text-yellow-400 block mb-1">{i.tag}</span>
                  <p className="text-xs font-semibold mb-1">{i.title}</p>
                  <p className="text-[11px] text-white/60 leading-relaxed">{i.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PLANS TAB ── */}
      {tab === "plans" && (
        <div className="space-y-4">
          {/* Billing toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{plans.length} باقة — {plans.filter(p => p.status === "active").length} نشطة</p>
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${billingCycle === "monthly" ? "bg-white shadow text-gray-900" : "text-gray-400"}`}>
                شهري
              </button>
              <button onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${billingCycle === "yearly" ? "bg-white shadow text-gray-900" : "text-gray-400"}`}>
                سنوي <span className="text-[9px] font-bold text-green-600 bg-green-100 px-1 py-0.5 rounded">وفّر 20%</span>
              </button>
            </div>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {plans.map(plan => (
                <PlanCard key={plan.id} plan={plan}
                  onEdit={() => setEditingPlan(plan)}
                  onDuplicate={() => handleDuplicatePlan(plan)}
                  onDelete={() => handleDeletePlan(plan.id)}
                  onToggle={() => handleTogglePlan(plan.id)} />
              ))}
            </AnimatePresence>
            {/* Add plan card */}
            <button onClick={() => setEditingPlan("new")}
              className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-blue-300 hover:text-blue-400 transition-all min-h-[280px]">
              <div className="w-12 h-12 rounded-2xl border-2 border-current flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold">إضافة باقة جديدة</p>
            </button>
          </div>
        </div>
      )}

      {/* ── COMMISSIONS TAB ── */}
      {tab === "commissions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{commissions.length} قاعدة عمولة — {commissions.filter(c => c.active).length} نشطة</p>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: ACCENT }}>
              <Plus className="w-3.5 h-3.5" /> قاعدة جديدة
            </button>
          </div>

          {/* Role summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(["normal", "broker", "company", "vip", "developer"] as UserRole[]).map(role => {
              const cfg = ROLE_CONFIG[role];
              const Icon = cfg.icon;
              const rule = commissions.find(c => c.role === role);
              return (
                <div key={role} className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: cfg.color + "15" }}>
                    <Icon style={{ width: 16, height: 16, color: cfg.color }} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{cfg.label}</p>
                  <p className="text-xl font-black" style={{ color: cfg.color }}>
                    {rule ? (rule.isPercentage ? `${rule.value}%` : `${rule.value} EGP`) : "—"}
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5">عمولة</p>
                </div>
              );
            })}
          </div>

          {/* Commission rules table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">قواعد العمولات</p>
              <p className="text-xs text-gray-400">مرتبة حسب الأولوية</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">القاعدة</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">القيمة</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">المستخدم</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">الأولوية</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">الحالة</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {commissions.map(rule => (
                    <CommissionRow key={rule.id} rule={rule}
                      onToggle={() => setCommissions(cs => cs.map(c => c.id === rule.id ? { ...c, active: !c.active } : c))}
                      onEdit={() => {}}
                      onDelete={() => { setCommissions(cs => cs.filter(c => c.id !== rule.id)); showToast("تم حذف القاعدة"); }} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── COUPONS TAB ── */}
      {tab === "coupons" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{coupons.length} كوبون — {coupons.filter(c => c.active).length} نشط</p>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: ACCENT }}>
              <Plus className="w-3.5 h-3.5" /> كوبون جديد
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map(coupon => {
              const usedPct = (coupon.usedCount / coupon.usageLimit) * 100;
              const expired = new Date(coupon.expiresAt) < new Date();
              return (
                <motion.div key={coupon.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${coupon.active && !expired ? "border-gray-100" : "border-gray-50 opacity-60"}`}>
                  {/* Top strip */}
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${ACCENT}, #7C3AED)` }} />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono font-black text-lg text-gray-900 tracking-widest">{coupon.code}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ينتهي: {coupon.expiresAt}</p>
                      </div>
                      <span className="text-xl font-black" style={{ color: ACCENT }}>
                        {coupon.isPercentage ? `${coupon.discount}%` : `${coupon.discount} EGP`}
                      </span>
                    </div>

                    {/* Usage bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">الاستخدام</span>
                        <span className="text-[10px] font-bold text-gray-600">{coupon.usedCount}/{coupon.usageLimit}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(usedPct, 100)}%`, backgroundColor: usedPct >= 90 ? "#EF4444" : ACCENT }} />
                      </div>
                    </div>

                    {/* Applicable plans */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {coupon.applicablePlans.map(pid => {
                        const p = plans.find(x => x.id === pid);
                        return p ? (
                          <span key={pid} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ color: p.color, backgroundColor: p.color + "15" }}>
                            {p.name}
                          </span>
                        ) : null;
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${expired ? "bg-red-50 text-red-500" : coupon.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {expired ? "منتهي" : coupon.active ? "نشط" : "موقوف"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 flex items-center justify-center transition-colors">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => { setCoupons(cs => cs.filter(c => c.id !== coupon.id)); showToast("تم حذف الكوبون"); }}
                          className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Add coupon */}
            <button className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-blue-300 hover:text-blue-400 transition-all min-h-[200px]">
              <div className="w-10 h-10 rounded-2xl border-2 border-current flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold">كوبون جديد</p>
            </button>
          </div>
        </div>
      )}

      {/* Plan Editor Modal */}
      <AnimatePresence>
        {editingPlan !== null && (
          <PlanEditor
            plan={editingPlan === "new" ? null : editingPlan}
            onClose={() => setEditingPlan(null)}
            onSave={handleSavePlan} />
        )}
      </AnimatePresence>
    </div>
  );
}
