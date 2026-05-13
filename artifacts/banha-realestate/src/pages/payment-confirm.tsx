import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Check, ChevronRight, Shield, CreditCard, Smartphone,
  Building2, Star, Crown, FileText, Sparkles, Lock,
  Clock, Image, TrendingUp, CheckCircle2,
} from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";

const PLAN_META: Record<string, {
  nameAr: string; color: string; icon: JSX.Element;
  priceMonthly: number; priceYearly: number;
  duration: string; listings: number; photos: number; visibility: string;
}> = {
  free: {
    nameAr: "مجاني", color: "#6B7280",
    icon: <FileText className="w-5 h-5" />,
    priceMonthly: 0, priceYearly: 0,
    duration: "30 يوم", listings: 1, photos: 5, visibility: "ظهور عادي",
  },
  featured: {
    nameAr: "مميز", color: "#8B5CF6",
    icon: <Star className="w-5 h-5" />,
    priceMonthly: 299, priceYearly: 2690,
    duration: "30 يوم", listings: 3, photos: 20, visibility: "أولوية في النتائج",
  },
  premium: {
    nameAr: "بريميوم", color: "#F59E0B",
    icon: <Crown className="w-5 h-5" />,
    priceMonthly: 599, priceYearly: 5390,
    duration: "60 يوم", listings: 10, photos: 50, visibility: "أول النتائج دائماً",
  },
  enterprise: {
    nameAr: "الشركات", color: "#1EBFD5",
    icon: <Building2 className="w-5 h-5" />,
    priceMonthly: 1499, priceYearly: 13490,
    duration: "90 يوم", listings: -1, photos: -1, visibility: "قمة النتائج + صفحة خاصة",
  },
};

const PAYMENT_METHODS = [
  { id: "card", label: "بطاقة ائتمان / خصم", icon: <CreditCard className="w-5 h-5" />, sub: "Visa · Mastercard · Meeza" },
  { id: "fawry", label: "فوري", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Fawry-logo.png/320px-Fawry-logo.png" className="h-5 object-contain" alt="Fawry" />, sub: "أكثر من 160,000 نقطة" },
  { id: "vodafone", label: "فودافون كاش", icon: <Smartphone className="w-5 h-5" />, sub: "01X XXXX XXXX" },
  { id: "instapay", label: "إنستا باي", icon: <Smartphone className="w-5 h-5" />, sub: "تحويل فوري" },
];

/* ─── Success Screen ─── */
function SuccessScreen({ planColor, planName, navigate }: { planColor: string; planName: string; navigate: (p: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => navigate("/"), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6" dir="rtl">
      {/* Confetti-like rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4 + i * 2, opacity: 0 }}
          transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
          className="absolute w-24 h-24 rounded-full border-2"
          style={{ borderColor: planColor }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${planColor}, ${planColor}99)` }}
      >
        <CheckCircle2 className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-3xl font-black text-white mb-2 text-center"
      >
        تم نشر إعلانك! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/50 text-center mb-8"
      >
        إعلانك الآن مرئي لآلاف المشترين في بنها بباقة {planName}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl p-4 mb-6"
      >
        {[
          "✓ تم تفعيل الباقة",
          "✓ إعلانك ظاهر في نتائج البحث",
          "✓ تم إرسال تأكيد على بريدك",
        ].map((t, i) => (
          <motion.p key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + i * 0.15 }} className="text-white/80 text-sm py-1">
            {t}
          </motion.p>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => navigate("/")}
        className="px-8 py-3 rounded-2xl font-bold text-white text-sm"
        style={{ background: `linear-gradient(135deg, ${planColor}, ${planColor}99)` }}
      >
        عودة للرئيسية
      </motion.button>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="text-white/30 text-xs mt-4">
        سيتم التوجيه تلقائياً خلال ثوانٍ...
      </motion.p>
    </div>
  );
}

/* ─── Main Page ─── */
export default function PaymentConfirmPage() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan") || "premium";
  const billing = (params.get("billing") || "monthly") as "monthly" | "yearly";

  const plan = PLAN_META[planId] || PLAN_META.premium;
  const price = billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const isFree = price === 0;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  function handlePay() {
    if (!isFree && !agreeTerms) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2200);
  }

  if (success) {
    return <SuccessScreen planColor={plan.color} planName={plan.nameAr} navigate={navigate} />;
  }

  const canPay = isFree
    ? agreeTerms
    : agreeTerms && (paymentMethod !== "card" || (cardNum.replace(/\s/g, "").length === 16 && cardName && expiry && cvv.length >= 3));

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button onClick={() => navigate("/plans")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm">
            <ChevronRight className="w-4 h-4" />
            رجوع
          </button>
          <img src={logoColor} alt="عقارات بنها" className="h-8 w-auto" />
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <Lock className="w-3.5 h-3.5" />
            SSL مشفّر
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-0">
            {["بيانات العقار", "اختر باقتك", "الدفع", "نشر الإعلان"].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i <= 2 ? "text-white" : "bg-gray-100 text-gray-300"
                }`} style={i <= 2 ? { background: plan.color } : {}}>
                  {i <= 1 ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className={`text-[10px] mx-1 font-medium ${i <= 2 ? "text-gray-700" : "text-gray-300"}`}>{s}</span>
                {i < 3 && <div className={`w-6 h-0.5 mx-1 ${i <= 1 ? "bg-gray-300" : "bg-gray-100"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Plan Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white"
        >
          <div className="p-1" style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}99)` }}>
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}99)` }}>
                    {plan.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">الباقة المختارة</p>
                    <h3 className="text-lg font-black text-gray-800">باقة {plan.nameAr}</h3>
                  </div>
                </div>
                <button onClick={() => navigate("/plans")}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors hover:bg-gray-50"
                  style={{ color: plan.color, borderColor: `${plan.color}40` }}>
                  تغيير
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Clock className="w-3.5 h-3.5" />, label: "المدة", val: plan.duration },
                  { icon: <FileText className="w-3.5 h-3.5" />, label: "الإعلانات", val: plan.listings === -1 ? "غير محدود" : plan.listings.toString() },
                  { icon: <Image className="w-3.5 h-3.5" />, label: "الصور", val: plan.photos === -1 ? "غير محدودة" : `${plan.photos}` },
                  { icon: <TrendingUp className="w-3.5 h-3.5" />, label: "الظهور", val: plan.visibility.split("+")[0].trim() },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-1.5" style={{ color: plan.color }}>{s.icon}<span className="text-[10px] text-gray-400">{s.label}</span></div>
                    <span className="text-xs font-bold text-gray-700">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Free Plan Direct Publish */}
        {isFree ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-1">الباقة المجانية</h3>
            <p className="text-gray-400 text-sm mb-4">لا يلزم دفع أي مبلغ — إعلانك سيُنشر مباشرةً</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-gray-700">مجاني بالكامل</span>
            </div>
          </motion.div>
        ) : (
          /* Payment Method */
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
            <h3 className="text-base font-black text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" style={{ color: plan.color }} />
              طريقة الدفع
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {PAYMENT_METHODS.map((m) => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-start gap-1.5 p-3.5 rounded-2xl border-2 text-right transition-all ${
                    paymentMethod === m.id ? "shadow-sm" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                  style={paymentMethod === m.id ? { borderColor: plan.color, background: `${plan.color}08` } : {}}>
                  <div style={{ color: paymentMethod === m.id ? plan.color : "#9ca3af" }}>{m.icon}</div>
                  <span className={`text-xs font-bold ${paymentMethod === m.id ? "text-gray-800" : "text-gray-400"}`}>{m.label}</span>
                  <span className="text-[10px] text-gray-400">{m.sub}</span>
                </button>
              ))}
            </div>

            {/* Card Fields */}
            <AnimatePresence>
              {paymentMethod === "card" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">رقم البطاقة</label>
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-3 focus-within:border-[#1EBFD5] focus-within:ring-2 focus-within:ring-[#1EBFD5]/10 transition-all bg-white">
                      <CreditCard className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <input
                        className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-300 bg-transparent"
                        placeholder="0000 0000 0000 0000" maxLength={19} value={cardNum}
                        onChange={e => {
                          const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCardNum(v.replace(/(.{4})/g, "$1 ").trim());
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">اسم حامل البطاقة</label>
                    <input className="rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/10 transition-all placeholder-gray-300 bg-white w-full"
                      placeholder="الاسم كما هو على البطاقة" value={cardName} onChange={e => setCardName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">تاريخ الانتهاء</label>
                      <input className="rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/10 transition-all placeholder-gray-300 bg-white w-full"
                        placeholder="MM/YY" maxLength={5} value={expiry}
                        onChange={e => {
                          let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                          setExpiry(v);
                        }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CVV</label>
                      <input className="rounded-xl border border-gray-200 px-3.5 py-3 text-sm outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/10 transition-all placeholder-gray-300 bg-white w-full"
                        placeholder="123" maxLength={4} type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Order Summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
          <h3 className="text-base font-black text-gray-800 mb-4">ملخص الطلب</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">باقة {plan.nameAr} ({billing === "yearly" ? "سنوي" : "شهري"})</span>
              <span className="font-bold text-gray-800">{isFree ? "مجاناً" : `${price.toLocaleString("ar-EG")} ج.م`}</span>
            </div>
            {!isFree && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ضريبة القيمة المضافة (14%)</span>
                <span className="font-bold text-gray-800">{Math.round(price * 0.14).toLocaleString("ar-EG")} ج.م</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-2.5 flex justify-between">
              <span className="font-bold text-gray-800">الإجمالي</span>
              <span className="font-black text-lg" style={{ color: plan.color }}>
                {isFree ? "مجاناً" : `${Math.round(price * 1.14).toLocaleString("ar-EG")} ج.م`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <div className="flex items-start gap-3">
          <button onClick={() => setAgreeTerms(!agreeTerms)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreeTerms ? "border-transparent" : "border-gray-300"}`}
            style={agreeTerms ? { background: plan.color } : {}}>
            {agreeTerms && <Check className="w-3 h-3 text-white" />}
          </button>
          <p className="text-xs text-gray-500 leading-relaxed">
            أوافق على{" "}
            <span className="underline cursor-pointer" style={{ color: plan.color }}>شروط الاستخدام</span>
            {" "}و{" "}
            <span className="underline cursor-pointer" style={{ color: plan.color }}>سياسة الخصوصية</span>
            {" "}لمنصة عقارات بنها
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 py-2">
          {[
            { icon: <Shield className="w-4 h-4 text-green-500" />, text: "دفع آمن" },
            { icon: <Lock className="w-4 h-4 text-blue-500" />, text: "SSL مشفر" },
            { icon: <Check className="w-4 h-4 text-amber-500" />, text: "ضمان الرضا" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {b.icon}
              <span className="text-xs text-gray-400 font-medium">{b.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: canPay ? 1.01 : 1 }}
          whileTap={{ scale: canPay ? 0.98 : 1 }}
          onClick={handlePay}
          disabled={!canPay || processing}
          className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canPay ? `linear-gradient(135deg, ${plan.color}, ${plan.color}bb)` : "#d1d5db",
            boxShadow: canPay ? `0 8px 32px ${plan.color}30` : "none",
          }}
        >
          {processing ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              جارٍ معالجة الطلب...
            </>
          ) : (
            <>
              {isFree ? <Sparkles className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              {isFree ? "نشر الإعلان مجاناً" : `ادفع ${Math.round(price * 1.14).toLocaleString("ar-EG")} ج.م وانشر`}
            </>
          )}
        </motion.button>

        <p className="text-center text-gray-300 text-xs pb-6">بياناتك محمية بتشفير SSL • لا رسوم خفية</p>
      </div>
    </div>
  );
}
