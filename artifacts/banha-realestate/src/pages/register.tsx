import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Briefcase, ChevronLeft } from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";
import logoWhite from "@assets/footer_1778457955133.png";

type AccountType = "user" | "company" | "broker" | null;

const ACCOUNT_TYPES = [
  {
    key: "user" as const,
    icon: <User className="w-6 h-6" />,
    title: "مستخدم عادي",
    desc: "أبحث عن عقار للشراء أو الإيجار",
    iconColor: "text-[#123C79]",
  },
  {
    key: "company" as const,
    icon: <Building2 className="w-6 h-6" />,
    title: "شركة عقارية",
    desc: "أريد نشر عقارات باسم شركتي",
    iconColor: "text-[#1EBFD5]",
  },
  {
    key: "broker" as const,
    icon: <Briefcase className="w-6 h-6" />,
    title: "سمسار / وسيط",
    desc: "أعمل كوسيط عقاري مستقل",
    iconColor: "text-amber-600",
  },
];

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", companyName: "", phone: "", email: "", password: "", licenseNo: "",
  });

  const selectedType = ACCOUNT_TYPES.find(t => t.key === accountType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/"); }, 1800);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left — Form panel */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top nav */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1EBFD5] transition-colors font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            العودة إلى الرئيسية
          </button>
          <button onClick={() => navigate("/")}>
            <img src={logoColor} alt="عقارات بنها" className="h-10 w-auto object-contain" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full"
            style={{ background: "#1EBFD5" }}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-10 overflow-y-auto">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-bold text-[#1EBFD5] uppercase tracking-widest mb-1">خطوة 1 من 2</p>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">إنشاء حساب جديد</h1>
                  <p className="text-gray-400 text-sm mb-8">اختر نوع حسابك للمتابعة</p>

                  <div className="space-y-3 mb-6">
                    {ACCOUNT_TYPES.map(type => (
                      <button
                        key={type.key}
                        onClick={() => setAccountType(type.key)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-right transition-all duration-200 ${
                          accountType === type.key
                            ? "border-[#1EBFD5] bg-[#1EBFD5]/5"
                            : "border-gray-100 hover:border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm ${type.iconColor}`}>
                          {type.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-gray-900 text-sm">{type.title}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{type.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          accountType === type.key ? "border-[#1EBFD5] bg-[#1EBFD5]" : "border-gray-300"
                        }`}>
                          {accountType === type.key && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!accountType}
                    onClick={() => setStep(2)}
                    className="w-full text-white py-3.5 rounded-lg font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "#1EBFD5" }}
                  >
                    التالي
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-5">
                    لديك حساب؟{" "}
                    <button onClick={() => navigate("/login")} className="text-[#1EBFD5] font-bold hover:underline">
                      سجّل دخولك
                    </button>
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors font-medium"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" /> تغيير نوع الحساب
                  </button>

                  <p className="text-xs font-bold text-[#1EBFD5] uppercase tracking-widest mb-1">خطوة 2 من 2</p>
                  <h1 className="text-3xl font-black text-gray-900 mb-1">{selectedType?.title}</h1>
                  <p className="text-gray-400 text-sm mb-7">أدخل بياناتك لإتمام التسجيل</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">
                        {accountType === "company" ? "اسم الشركة" : "الاسم الكامل"}
                      </label>
                      <div className="relative">
                        {accountType === "company"
                          ? <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          : <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
                        <input
                          type="text"
                          placeholder={accountType === "company" ? "شركة النجوم العقارية" : "محمد أحمد"}
                          value={accountType === "company" ? form.companyName : form.name}
                          onChange={e => setForm(p => accountType === "company"
                            ? { ...p, companyName: e.target.value }
                            : { ...p, name: e.target.value })}
                          required
                          className="w-full bg-white border border-gray-200 rounded-lg py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                        />
                      </div>
                    </div>

                    {(accountType === "broker" || accountType === "company") && (
                      <div>
                        <label className="text-sm font-bold text-gray-700 mb-2 block">
                          {accountType === "company" ? "رقم السجل التجاري" : "رقم ترخيص السمسار"}
                        </label>
                        <input
                          type="text"
                          placeholder="123456789"
                          value={form.licenseNo}
                          onChange={e => setForm(p => ({ ...p, licenseNo: e.target.value }))}
                          dir="ltr"
                          className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">رقم الهاتف</label>
                      <div className="relative">
                        <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          required
                          dir="ltr"
                          className="w-full bg-white border border-gray-200 rounded-lg py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          placeholder="example@email.com"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          required
                          dir="ltr"
                          className="w-full bg-white border border-gray-200 rounded-lg py-3 pr-10 pl-4 text-sm focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-gray-700 mb-2 block">كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPass ? "text" : "password"}
                          placeholder="8 أحرف على الأقل"
                          value={form.password}
                          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                          required
                          minLength={8}
                          dir="ltr"
                          className="w-full bg-white border border-gray-200 rounded-lg py-3 pr-10 pl-10 text-sm focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                        />
                        <button type="button" onClick={() => setShowPass(v => !v)}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-white py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: "#1EBFD5" }}
                    >
                      {loading
                        ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : "إنشاء الحساب"}
                    </button>

                    <p className="text-center text-xs text-gray-400 leading-relaxed">
                      بالتسجيل توافق على{" "}
                      <button type="button" className="text-[#1EBFD5] font-bold hover:underline">شروط الاستخدام</button>
                      {" "}و{" "}
                      <button type="button" className="text-[#1EBFD5] font-bold hover:underline">سياسة الخصوصية</button>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right — Info panel */}
      <div
        className="hidden lg:flex w-[45%] flex-col justify-center px-16 py-12"
        style={{ background: "linear-gradient(145deg, #0e4d6e 0%, #1EBFD5 100%)" }}
      >
        <img src={logoWhite} alt="عقارات بنها" className="h-12 w-auto object-contain mb-12 self-start" />

        <h2 className="text-4xl font-black text-white leading-tight mb-4">
          انضم إلى<br />عقارات بنها
        </h2>
        <p className="text-2xl font-bold text-white/80 mb-4 leading-snug">
          أفضل منصة عقارية<br />في بنها والقليوبية
        </p>
        <p className="text-white/60 text-sm leading-relaxed mb-10">
          سواء كنت تبحث عن شقة أو تريد بيع عقارك — نحن نوصلك بالشخص المناسب بكل سهولة وأمان.
        </p>

        <ul className="space-y-4">
          {[
            { icon: "🏠", text: "آلاف العقارات في بنها والمناطق المجاورة" },
            { icon: "✅", text: "إعلانات موثّقة من مالكين وشركات موثوقة" },
            { icon: "🔒", text: "تسجيل آمن وحماية كاملة للبيانات" },
            { icon: "⭐", text: "تقييمات حقيقية من مستخدمين فعليين" },
          ].map(({ icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-white/90 text-sm font-medium">
              <span className="text-lg">{icon}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
