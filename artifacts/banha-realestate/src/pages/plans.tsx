import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Check, Star, Crown, Building2, FileText, ArrowRight, ChevronLeft } from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";

const PLANS = [
  {
    id: "free",
    name: "مجانية",
    icon: <FileText className="w-6 h-6" />,
    color: "#6B7280",
    priceMonthly: 0,
    description: "ابدأ مجاناً وانشر أول إعلان لك.",
    features: ["إعلان واحد", "5 صور لكل إعلان", "مدة 30 يوماً"],
  },
  {
    id: "featured",
    name: "مميزة",
    icon: <Star className="w-6 h-6" />,
    color: "#8B5CF6",
    priceMonthly: 299,
    description: "للجادين الذين يريدون نتائج أسرع.",
    features: ["3 إعلانات متزامنة", "20 صورة لكل إعلان", "أولوية في نتائج البحث"],
  },
  {
    id: "premium",
    name: "بريميوم",
    icon: <Crown className="w-6 h-6" />,
    color: "#F59E0B",
    priceMonthly: 599,
    description: "الخيار الأمثل للمحترفين.",
    features: ["10 إعلانات متزامنة", "50 صورة لكل إعلان", "أولوية قصوى في البحث"],
  },
  {
    id: "enterprise",
    name: "الشركات",
    icon: <Building2 className="w-6 h-6" />,
    color: "#1EBFD5",
    priceMonthly: 1499,
    description: "حل متكامل للمطورين والشركات.",
    features: ["إعلانات غير محدودة", "صور غير محدودة", "مدير حساب مخصص"],
  },
];

export default function PlansPage() {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPlan = PLANS.find((p) => p.id === selectedId);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-12">
            <img src={logoColor} alt="شعار عقارات بنها" className="h-10 w-auto" />
        </div>
        
        <AnimatePresence mode="wait">
          {!selectedPlan ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-gray-900 mb-4">باقات تناسب طموحاتك</h1>
                <p className="text-gray-500 text-lg">اختر الباقة المثالية لتنمية أعمالك العقارية.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white rounded-3xl p-8 border-2 border-gray-100 flex flex-col h-full"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6" style={{ background: plan.color }}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-400 mb-6 font-medium">{plan.description}</p>
                    
                    <div className="text-3xl font-black text-gray-900 mb-8">
                      {plan.priceMonthly === 0 ? "مجاناً" : `${plan.priceMonthly} ج.م`}
                      <span className="text-xs text-gray-400 font-medium mr-1">/ شهر</span>
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                          <Check className="w-4 h-4 text-[#1EBFD5]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedId(plan.id)}
                      className="w-full py-3 rounded-xl font-black text-sm bg-gray-100 text-gray-600 hover:bg-[#1EBFD5] hover:text-white transition-all"
                    >
                      اختيار الباقة
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto bg-white rounded-3xl p-10 border border-gray-200 shadow-xl"
            >
              <button 
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold mb-8 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" /> العودة للباقات
              </button>

              <h2 className="text-3xl font-black text-gray-900 mb-2">مراجعة الباقة</h2>
              <p className="text-gray-500 mb-8">لقد اخترت باقة <span className="font-bold text-gray-900">{selectedPlan.name}</span>.</p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg">باقة {selectedPlan.name}</h3>
                  <span className="text-2xl font-black">{selectedPlan.priceMonthly === 0 ? "مجاناً" : `${selectedPlan.priceMonthly} ج.م`}</span>
                </div>
                <ul className="space-y-3">
                  {selectedPlan.features.map((f, i) => (
                    <li key={i} className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#1EBFD5]" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate("/payment-confirm?plan=" + selectedPlan.id)}
                className="w-full py-4 rounded-xl font-black text-white bg-[#1EBFD5] hover:opacity-90 flex items-center justify-center gap-2"
              >
                تأكيد الاختيار <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
