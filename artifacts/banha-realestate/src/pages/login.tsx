import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useSiteLogos } from "@/contexts/SiteLogosContext";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { logos } = useSiteLogos();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "forgot">("login");
  const [forgotSent, setForgotSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/"); }, 1500);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
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
            <img src={logos.headerLogo} alt="عقارات بنها" className="h-10 w-auto object-contain" />
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {tab === "login" && (
              <>
                <h1 className="text-3xl font-black text-gray-900 mb-1">مرحباً بعودتك</h1>
                <p className="text-gray-400 text-sm mb-8">سجّل دخولك للمتابعة</p>

                {/* Google Sign-In */}
                <GoogleAuthButton mode="login" className="mb-5" />

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-300 font-medium">أو سجّل بالإيميل</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      required
                      dir="ltr"
                      className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={() => setTab("forgot")}
                        className="text-xs text-[#1EBFD5] font-bold hover:underline"
                      >
                        نسيت كلمة المرور؟
                      </button>
                      <label className="text-sm font-bold text-gray-700">كلمة المرور</label>
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                        required
                        dir="ltr"
                        className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(v => !v)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
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
                      : "تسجيل الدخول"}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs text-gray-400">أو</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="w-full py-3.5 rounded-lg font-bold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    إنشاء حساب جديد
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-400">
                  أنت مسؤول النظام؟{" "}
                  <button onClick={() => navigate("/admin/login")} className="text-[#123C79] font-bold hover:underline">
                    تسجيل دخول الإدارة
                  </button>
                </p>
              </>
            )}

            {tab === "forgot" && (
              <>
                <button
                  onClick={() => setTab("login")}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors font-medium"
                >
                  <ChevronLeft className="w-4 h-4 rotate-180" /> العودة
                </button>
                <h1 className="text-3xl font-black text-gray-900 mb-1">استعادة كلمة المرور</h1>
                <p className="text-gray-400 text-sm mb-8">أدخل بريدك وسنرسل لك رابط إعادة التعيين</p>

                {forgotSent ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#1EBFD5" }}>
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-black text-gray-900 text-lg mb-2">تم الإرسال!</h3>
                    <p className="text-gray-400 text-sm mb-6">تحقق من بريدك الإلكتروني</p>
                    <button
                      onClick={() => { setTab("login"); setForgotSent(false); }}
                      className="text-[#1EBFD5] font-bold text-sm hover:underline"
                    >
                      العودة لتسجيل الدخول
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <input
                      type="email"
                      placeholder="example@email.com"
                      required
                      dir="ltr"
                      className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/15 transition-all"
                    />
                    <button
                      type="submit"
                      className="w-full text-white py-3.5 rounded-lg font-bold text-sm transition-all hover:opacity-90"
                      style={{ background: "#1EBFD5" }}
                    >
                      إرسال رابط الاستعادة
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right — Info panel */}
      <div
        className="hidden lg:flex w-[45%] flex-col justify-center px-16 py-12"
        style={{ background: "linear-gradient(145deg, #0e4d6e 0%, #1EBFD5 100%)" }}
      >
        <img src={logos.footerLogo} alt="عقارات بنها" className="h-12 w-auto object-contain mb-12 self-start" />

        <h2 className="text-4xl font-black text-white leading-tight mb-4">
          عقارات بنها
        </h2>
        <p className="text-2xl font-bold text-white/80 mb-4 leading-snug">
          اكتشف أفضل العقارات من<br />أيدٍ محلية موثوقة
        </p>
        <p className="text-white/60 text-sm leading-relaxed mb-10">
          المنصة الأولى في بنها المخصصة للعقارات — نجمع البائعين والمشترين في مكان واحد بكل شفافية وأمان.
        </p>

        <ul className="space-y-4">
          {[
            { icon: "🔒", text: "تسجيل دخول آمن وموثوق" },
            { icon: "🏠", text: "آلاف العقارات في بنها والمناطق المجاورة" },
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
