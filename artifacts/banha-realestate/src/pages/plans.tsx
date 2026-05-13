import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Check, X, Star, Zap, Crown, Building2, ChevronRight,
  Sparkles, Shield, TrendingUp, Image, Clock, FileText,
  ChevronDown, ChevronUp, Award, Flame,
} from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";

/* ─── Plan Data ─────────────────────────────────────── */
const PLANS = [
  {
    id: "free",
    nameAr: "مجاني",
    nameEn: "Free",
    icon: <FileText className="w-6 h-6" />,
    color: "#6B7280",
    gradient: "from-gray-400 to-gray-500",
    bg: "from-gray-50 to-white",
    border: "border-gray-200",
    priceMonthly: 0,
    priceYearly: 0,
    duration: "30 يوم",
    listings: 1,
    featured: false,
    featuredLabel: "—",
    photos: 5,
    visibility: "ظهور عادي",
    badge: null,
    support: "دعم ذاتي",
    highlight: false,
    description: "ابدأ مجاناً وانشر أول إعلانك",
    features: [
      { label: "إعلان واحد مجاني", ok: true },
      { label: "5 صور للإعلان", ok: true },
      { label: "مدة 30 يوم", ok: true },
      { label: "ظهور في نتائج البحث", ok: true },
      { label: "إعلان مميز", ok: false },
      { label: "أولوية في الظهور", ok: false },
      { label: "دعم مخصص", ok: false },
      { label: "إحصائيات متقدمة", ok: false },
    ],
  },
  {
    id: "featured",
    nameAr: "مميز",
    nameEn: "Featured",
    icon: <Star className="w-6 h-6" />,
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600",
    bg: "from-violet-50 to-white",
    border: "border-violet-200",
    priceMonthly: 299,
    priceYearly: 2690,
    duration: "30 يوم",
    listings: 3,
    featured: true,
    featuredLabel: "مميز ⭐",
    photos: 20,
    visibility: "أولوية في النتائج",
    badge: null,
    support: "دعم بالواتساب",
    highlight: false,
    description: "للمستخدمين الجادين الذين يريدون نتائج أسرع",
    features: [
      { label: "3 إعلانات في نفس الوقت", ok: true },
      { label: "20 صورة لكل إعلان", ok: true },
      { label: "مدة 30 يوم", ok: true },
      { label: "أولوية في نتائج البحث", ok: true },
      { label: "شارة مميز ⭐", ok: true },
      { label: "دعم واتساب", ok: true },
      { label: "أعلى النتائج", ok: false },
      { label: "إحصائيات متقدمة", ok: false },
    ],
  },
  {
    id: "premium",
    nameAr: "بريميوم",
    nameEn: "Premium",
    icon: <Crown className="w-6 h-6" />,
    color: "#F59E0B",
    gradient: "from-amber-400 to-orange-500",
    bg: "from-amber-50 to-white",
    border: "border-amber-300",
    priceMonthly: 599,
    priceYearly: 5390,
    duration: "60 يوم",
    listings: 10,
    featured: true,
    featuredLabel: "مميز جداً 🔥",
    photos: 50,
    visibility: "أول النتائج دائماً",
    badge: "الأكثر شيوعاً",
    support: "دعم مخصص 24/7",
    highlight: true,
    description: "الخيار الأمثل للوسطاء والمطورين العقاريين",
    features: [
      { label: "10 إعلانات متزامنة", ok: true },
      { label: "50 صورة لكل إعلان", ok: true },
      { label: "مدة 60 يوم", ok: true },
      { label: "أول النتائج دائماً", ok: true },
      { label: "شارة بريميوم 🔥", ok: true },
      { label: "دعم مخصص 24/7", ok: true },
      { label: "إحصائيات متقدمة", ok: true },
      { label: "فيديو ترويجي", ok: true },
    ],
  },
  {
    id: "enterprise",
    nameAr: "الشركات",
    nameEn: "Enterprise",
    icon: <Building2 className="w-6 h-6" />,
    color: "#1EBFD5",
    gradient: "from-cyan-500 to-blue-600",
    bg: "from-cyan-50 to-white",
    border: "border-cyan-300",
    priceMonthly: 1499,
    priceYearly: 13490,
    duration: "90 يوم",
    listings: -1,
    featured: true,
    featuredLabel: "شارة ذهبية 👑",
    photos: -1,
    visibility: "قمة النتائج + صفحة خاصة",
    badge: "للشركات",
    support: "مدير حساب مخصص",
    highlight: false,
    description: "حل متكامل للشركات والمطورين الكبار",
    features: [
      { label: "إعلانات غير محدودة", ok: true },
      { label: "صور غير محدودة", ok: true },
      { label: "مدة 90 يوم", ok: true },
      { label: "قمة النتائج + صفحة خاصة", ok: true },
      { label: "شارة ذهبية 👑", ok: true },
      { label: "مدير حساب مخصص", ok: true },
      { label: "لوحة تحكم متقدمة", ok: true },
      { label: "تقارير شهرية مخصصة", ok: true },
    ],
  },
];

const COMPARE_ROWS = [
  { label: "السعر الشهري", key: "price" },
  { label: "مدة الإعلان", key: "duration" },
  { label: "عدد الإعلانات", key: "listings" },
  { label: "عدد الصور", key: "photos" },
  { label: "تصنيف الإعلان", key: "featured" },
  { label: "الظهور في النتائج", key: "visibility" },
  { label: "الدعم", key: "support" },
];

function formatPrice(p: number) {
  if (p === 0) return "مجاني";
  return `${p.toLocaleString("ar-EG")} ج.م`;
}

function formatListings(n: number) {
  return n === -1 ? "غير محدود" : n.toString();
}
function formatPhotos(n: number) {
  return n === -1 ? "غير محدودة" : `${n} صورة`;
}

/* ─── Floating particles background ─── */
function ParticleBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-10"
          style={{
            width: 20 + (i % 4) * 30,
            height: 20 + (i % 4) * 30,
            background: i % 3 === 0 ? "#1EBFD5" : i % 3 === 1 ? "#F59E0B" : "#8B5CF6",
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 23 + 10) % 80}%`,
          }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

/* ─── Plan Card ─── */
function PlanCard({
  plan, selected, billing, onSelect,
}: {
  plan: typeof PLANS[0]; selected: boolean; billing: "monthly" | "yearly"; onSelect: () => void;
}) {
  const price = billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const monthlyEquiv = billing === "yearly" && plan.priceYearly > 0
    ? Math.round(plan.priceYearly / 12) : null;

  return (
    <motion.div
      layout
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onSelect}
      className={`relative cursor-pointer rounded-3xl border-2 overflow-hidden transition-all duration-300 ${
        plan.highlight
          ? "shadow-2xl shadow-amber-200/60"
          : "shadow-lg hover:shadow-xl"
      } ${selected ? `border-[${plan.color}]` : plan.border}`}
      style={{
        borderColor: selected ? plan.color : undefined,
        boxShadow: selected
          ? `0 0 0 3px ${plan.color}30, 0 20px 60px ${plan.color}20`
          : plan.highlight ? "0 20px 60px rgba(245,158,11,0.2)" : undefined,
      }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${plan.bg} opacity-60`} />

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      {/* Glow effect when selected */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${plan.color}15, transparent 70%)`,
          }}
        />
      )}

      {/* Recommended badge */}
      {plan.badge && (
        <div
          className="absolute top-0 left-0 right-0 py-1.5 text-center text-xs font-black text-white tracking-wider z-10"
          style={{ background: `linear-gradient(90deg, ${plan.color}, ${plan.color}cc)` }}
        >
          {plan.badge === "الأكثر شيوعاً" && <Flame className="w-3 h-3 inline ml-1" />}
          {plan.badge}
        </div>
      )}

      <div className={`relative z-10 p-6 ${plan.badge ? "pt-10" : ""}`}>
        {/* Icon + name */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{plan.nameEn}</p>
            <h3 className="text-xl font-black text-gray-800">{plan.nameAr}</h3>
          </div>
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}99)` }}
            whileHover={{ rotate: 10 }}
          >
            {plan.icon}
          </motion.div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-end gap-1">
            <motion.span
              key={billing}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black text-gray-800"
            >
              {price === 0 ? "مجاني" : price.toLocaleString("ar-EG")}
            </motion.span>
            {price > 0 && (
              <span className="text-gray-400 text-sm mb-1">
                ج.م / {billing === "yearly" ? "سنة" : "شهر"}
              </span>
            )}
          </div>
          {monthlyEquiv && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-gray-400 mt-0.5"
            >
              يعادل {monthlyEquiv.toLocaleString("ar-EG")} ج.م / شهر
            </motion.p>
          )}
          {billing === "yearly" && plan.priceYearly > 0 && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
              style={{ background: `linear-gradient(90deg, ${plan.color}, ${plan.color}bb)` }}>
              وفّر {Math.round((1 - plan.priceYearly / (plan.priceMonthly * 12)) * 100)}%
            </span>
          )}
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            { icon: <Clock className="w-3.5 h-3.5" />, label: plan.duration },
            { icon: <FileText className="w-3.5 h-3.5" />, label: `${formatListings(plan.listings)} إعلان` },
            { icon: <Image className="w-3.5 h-3.5" />, label: formatPhotos(plan.photos) },
            { icon: <TrendingUp className="w-3.5 h-3.5" />, label: plan.featuredLabel },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span style={{ color: plan.color }}>{stat.icon}</span>
              <span className="font-medium">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Features list */}
        <ul className="space-y-2 mb-5">
          {plan.features.slice(0, 4).map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 text-xs"
            >
              {f.ok ? (
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${plan.color}20` }}>
                  <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <X className="w-2.5 h-2.5 text-gray-300" />
                </div>
              )}
              <span className={f.ok ? "text-gray-700" : "text-gray-300 line-through"}>{f.label}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            selected
              ? "text-white shadow-lg"
              : plan.highlight
                ? "text-white shadow-md"
                : "text-gray-700 bg-white border border-gray-200 hover:border-gray-300"
          }`}
          style={
            selected || plan.highlight
              ? { background: `linear-gradient(135deg, ${plan.color}, ${plan.color}bb)` }
              : {}
          }
        >
          {selected ? (
            <>
              <Check className="w-4 h-4" />
              تم الاختيار
            </>
          ) : (
            <>
              {plan.highlight && <Sparkles className="w-4 h-4" />}
              اختر هذه الباقة
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Comparison Table ─── */
function CompareTable({ billing }: { billing: "monthly" | "yearly" }) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
      <table className="w-full text-sm" dir="rtl">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-right p-4 text-gray-500 font-semibold text-xs w-40">الميزة</th>
            {PLANS.map((p) => (
              <th key={p.id} className="p-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs"
                    style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}>
                    {p.icon}
                  </div>
                  <span className="font-black text-gray-800 text-xs">{p.nameAr}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row, ri) => (
            <tr key={row.key} className={`border-b border-gray-50 ${ri % 2 === 0 ? "bg-gray-50/50" : "bg-white"}`}>
              <td className="p-3 px-4 text-gray-600 font-medium text-xs">{row.label}</td>
              {PLANS.map((p) => {
                let val = "";
                if (row.key === "price") val = billing === "yearly" ? formatPrice(p.priceYearly) : formatPrice(p.priceMonthly);
                else if (row.key === "duration") val = p.duration;
                else if (row.key === "listings") val = formatListings(p.listings);
                else if (row.key === "photos") val = formatPhotos(p.photos);
                else if (row.key === "featured") val = p.featuredLabel;
                else if (row.key === "visibility") val = p.visibility;
                else if (row.key === "support") val = p.support;
                return (
                  <td key={p.id} className="p-3 text-center text-xs">
                    <span className={`font-semibold ${p.highlight ? "text-amber-600" : "text-gray-700"}`}>
                      {val}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main Page ─── */
export default function PlansPage() {
  const [, navigate] = useLocation();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selected, setSelected] = useState<string>("premium");
  const [showCompare, setShowCompare] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  function handleContinue() {
    setPublishing(true);
    setTimeout(() => {
      navigate("/payment-confirm?plan=" + selected + "&billing=" + billing);
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden" dir="rtl">
      <ParticleBg />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button onClick={() => navigate("/add-property")}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm">
            <ChevronRight className="w-4 h-4" />
            رجوع
          </button>
          <img src={logoColor} alt="عقارات بنها" className="h-8 w-auto brightness-0 invert" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
            <Shield className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-white/80 font-medium">مدفوعات آمنة</span>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-center gap-0 mb-8">
          {["بيانات العقار", "اختر باقتك", "الدفع", "نشر الإعلان"].map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i === 0 ? "bg-green-500 border-green-500 text-white"
                  : i === 1 ? "bg-white border-white text-slate-900"
                  : "bg-white/10 border-white/20 text-white/40"
                }`}>
                  {i === 0 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${i <= 1 ? "text-white" : "text-white/30"}`}>{s}</span>
              </div>
              {i < 3 && (
                <div className={`w-10 sm:w-16 h-0.5 mb-4 mx-1 ${i === 0 ? "bg-green-500" : "bg-white/15"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-32">
        {/* Hero text */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-4"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-white/90 text-sm font-medium">اختر الباقة المناسبة لإعلانك</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black text-white mb-3"
          >
            وصّل إعلانك
            <span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent"> للمشترين الصح</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm max-w-md mx-auto"
          >
            اختر الباقة التي تناسب احتياجاتك وابدأ في الوصول لآلاف المشترين في بنها
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className={`text-sm font-bold transition-colors ${billing === "monthly" ? "text-white" : "text-white/40"}`}>شهري</span>
          <button
            onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{ background: billing === "yearly" ? "linear-gradient(135deg, #1EBFD5, #123C79)" : "rgba(255,255,255,0.15)" }}
          >
            <motion.div
              animate={{ x: billing === "yearly" ? 28 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold transition-colors ${billing === "yearly" ? "text-white" : "text-white/40"}`}>سنوي</span>
            {billing === "yearly" && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 rounded-full text-[10px] font-black text-white bg-gradient-to-r from-green-500 to-emerald-500"
              >
                وفّر 25%
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <PlanCard
                plan={plan}
                selected={selected === plan.id}
                billing={billing}
                onSelect={() => setSelected(plan.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Comparison Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="w-full py-3.5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white/70 hover:text-white text-sm font-medium backdrop-blur-sm"
          >
            {showCompare ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showCompare ? "إخفاء المقارنة" : "مقارنة تفصيلية بين الباقات"}
          </button>

          <AnimatePresence>
            {showCompare && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <CompareTable billing={billing} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {[
            { icon: <Shield className="w-4 h-4 text-green-400" />, text: "دفع آمن 100%" },
            { icon: <Zap className="w-4 h-4 text-amber-400" />, text: "نشر فوري" },
            { icon: <Check className="w-4 h-4 text-cyan-400" />, text: "بدون رسوم خفية" },
            { icon: <Star className="w-4 h-4 text-violet-400" />, text: "ضمان الرضا" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              {b.icon}
              <span className="text-white/60 text-xs font-medium">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-6 pt-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent">
        <div className="max-w-lg mx-auto">
          {/* Selected plan summary */}
          <motion.div
            layout
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm mb-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${selectedPlan.color}, ${selectedPlan.color}99)` }}>
                {selectedPlan.icon}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{selectedPlan.nameAr}</p>
                <p className="text-white/40 text-xs">{selectedPlan.duration} · {formatListings(selectedPlan.listings)} إعلان</p>
              </div>
            </div>
            <div className="text-left">
              <AnimatePresence mode="wait">
                <motion.p
                  key={billing + selected}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-white font-black text-lg"
                >
                  {formatPrice(billing === "yearly" ? selectedPlan.priceYearly : selectedPlan.priceMonthly)}
                </motion.p>
              </AnimatePresence>
              <p className="text-white/40 text-xs">{billing === "yearly" ? "سنوياً" : "شهرياً"}</p>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            disabled={publishing}
            className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 shadow-2xl disabled:opacity-70 transition-all"
            style={{
              background: `linear-gradient(135deg, ${selectedPlan.color}, ${selectedPlan.color}bb)`,
              boxShadow: `0 8px 32px ${selectedPlan.color}40`,
            }}
          >
            {publishing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                جارٍ المتابعة...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                متابعة مع باقة {selectedPlan.nameAr}
                <ChevronRight className="w-5 h-5 rotate-180" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
