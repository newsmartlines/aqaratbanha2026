import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Check, ChevronRight, CreditCard, Smartphone,
  Building2, Star, Crown, FileText, Sparkles, Lock,
  Clock, Image, TrendingUp, CheckCircle2,
} from "lucide-react";
import { useSiteLogos } from "@/contexts/SiteLogosContext";

const PLAN_META: Record<string, {
  nameAr: string; color: string; icon: React.ReactNode;
  priceMonthly: number; priceYearly: number;
  duration: string; listings: number; photos: number; visibility: string;
}> = {
  free: {
    nameAr: "مجانية", color: "#6B7280",
    icon: <FileText className="w-5 h-5" />,
    priceMonthly: 0, priceYearly: 0,
    duration: "30 يوماً", listings: 1, photos: 5, visibility: "ظهور عادي",
  },
  featured: {
    nameAr: "مميزة", color: "#8B5CF6",
    icon: <Star className="w-5 h-5" />,
    priceMonthly: 299, priceYearly: 2690,
    duration: "30 يوماً", listings: 3, photos: 20, visibility: "أولوية في النتائج",
  },
  premium: {
    nameAr: "بريميوم", color: "#F59E0B",
    icon: <Crown className="w-5 h-5" />,
    priceMonthly: 599, priceYearly: 5390,
    duration: "60 يوماً", listings: 10, photos: 50, visibility: "أول النتائج دائماً",
  },
  enterprise: {
    nameAr: "الشركات", color: "#1EBFD5",
    icon: <Building2 className="w-5 h-5" />,
    priceMonthly: 1499, priceYearly: 13490,
    duration: "90 يوماً", listings: -1, photos: -1, visibility: "قمة النتائج + صفحة خاصة",
  },
};

const PAYMENT_METHODS = [
  { id: "card", label: "بطاقة ائتمان", icon: <CreditCard className="w-5 h-5" />, sub: "فيزا · ماستركارد" },
  { id: "fawry", label: "فوري", icon: <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Fawry-logo.png/320px-Fawry-logo.png" className="h-5 object-contain" alt="فوري" />, sub: "أكثر من 160 ألف نقطة" },
  { id: "vodafone", label: "فودافون كاش", icon: <Smartphone className="w-5 h-5" />, sub: "محفظة إلكترونية" },
  { id: "instapay", label: "إنستا باي", icon: <Smartphone className="w-5 h-5" />, sub: "تحويل فوري" },
];

function SuccessScreen({ planName, navigate }: { planColor: string; planName: string; navigate: (p: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] p-12 border border-gray-100 shadow-xl max-w-lg w-full text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-3">تهانينا!</h2>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          تم نشر إعلانك بنجاح باستخدام باقة <span className="font-bold text-gray-900">{planName}</span>.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 rounded-2xl font-black text-white bg-[#1EBFD5] hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          العودة للوحة التحكم
        </button>
        
        <p className="text-gray-400 text-xs mt-6">
          سيتم تحويلك للصفحة الرئيسية خلال لحظات...
        </p>
      </motion.div>
    </div>
  );
}

export default function PaymentConfirmPage() {
  const [, navigate] = useLocation();
  const { logos } = useSiteLogos();
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan") || "premium";
  const billing = (params.get("billing") || "monthly") as "monthly" | "yearly";

  const plan = PLAN_META[planId] || PLAN_META.premium;
  const price = billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const isFree = price === 0;

  const [paymentMethod, setPaymentMethod] = useState("card");
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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button onClick={() => navigate("/plans")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm">
            <ChevronRight className="w-4 h-4" />
            رجوع
          </button>
          <img src={logos.headerLogo} alt="عقارات بنها" className="h-8 w-auto" />
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <Lock className="w-3.5 h-3.5" />
            مشفّر SSL
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white p-6">
            <h3 className="font-black text-gray-800 mb-4">تفاصيل الباقة</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                style={{ background: plan.color }}>{plan.icon}</div>
              <div>
                <p className="text-sm text-gray-400">الباقة المختارة</p>
                <h3 className="text-lg font-black text-gray-800">باقة {plan.nameAr}</h3>
              </div>
            </div>
        </div>

        {!isFree && (
            <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                <h3 className="text-base font-black text-gray-800 mb-4">طريقة الدفع</h3>
                <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((m) => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2 text-right transition-all ${
                        paymentMethod === m.id ? "shadow-sm border-[#1EBFD5]" : "border-gray-100 bg-gray-50"
                    }`}>
                    <div style={{ color: paymentMethod === m.id ? "#1EBFD5" : "#9ca3af" }}>{m.icon}</div>
                    <span className="text-xs font-bold text-gray-800">{m.label}</span>
                    </button>
                ))}
                </div>
            </div>
        )}

        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
            <h3 className="text-base font-black text-gray-800 mb-4">ملخص الطلب</h3>
            <div className="flex justify-between text-sm py-2">
                <span className="text-gray-500">الباقة</span>
                <span className="font-bold">{isFree ? "مجاناً" : `${price} ج.م`}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-black text-lg">
                <span>الإجمالي</span>
                <span style={{ color: plan.color }}>{isFree ? "مجاناً" : `${Math.round(price * 1.14)} ج.م`}</span>
            </div>
        </div>

        <button onClick={handlePay} disabled={!agreeTerms && !isFree}
            className="w-full py-4 rounded-2xl font-black text-white bg-[#1EBFD5] hover:opacity-90 transition-all disabled:opacity-50">
            {processing ? "جارٍ المعالجة..." : (isFree ? "نشر الإعلان" : "تأكيد الدفع")}
        </button>

        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" className="mt-1" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
          <p className="text-xs text-gray-400">أوافق على شروط الاستخدام وسياسة الخصوصية.</p>
        </div>
      </div>
    </div>
  );
}
