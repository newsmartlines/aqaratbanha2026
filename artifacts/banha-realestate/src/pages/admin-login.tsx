import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("admin@banha.com");
  const [password, setPassword] = useState("admin123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === "admin@banha.com" && password === "admin123") {
      setLoading(true);
      setTimeout(() => navigate("/admin"), 1200);
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #1E3A8A 0%, transparent 60%), radial-gradient(circle at 70% 20%, #2563EB 0%, transparent 50%)" }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10 text-center">
          <img src={logoColor} alt="عقارات بنها" className="h-16 w-auto mx-auto mb-8 brightness-0 invert opacity-90" />
          <h1 className="text-4xl font-bold text-white mb-4">لوحة تحكم المسؤول</h1>
          <p className="text-slate-400 text-lg max-w-sm mx-auto leading-relaxed">
            منصة إدارة عقارات بنها — تحكم كامل في العقارات، المستخدمين، والإحصائيات
          </p>
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[{ n: "+2,400", l: "عقار مسجّل" }, { n: "189", l: "مستخدم نشط" }, { n: "48,320", l: "جنيه إيرادات" }].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-slate-400 text-xs mt-1">{s.l}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#1E3A8A" }}>
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">تسجيل دخول المسؤول</h2>
                <p className="text-sm text-gray-400">عقارات بنها — لوحة الإدارة</p>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full pr-11 pl-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-gray-300 outline-none transition-all"
                    placeholder="admin@banha.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-2">كلمة المرور</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full pr-11 pl-11 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-gray-300 outline-none transition-all"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">تلميح: admin@banha.com / admin123</p>
              </div>

              <motion.button type="submit" whileTap={{ scale: 0.98 }} disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all"
                style={{ backgroundColor: "#1E3A8A" }}>
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg> جاري الدخول...</>
                ) : "دخول إلى لوحة التحكم"}
              </motion.button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <button onClick={() => window.history.back()} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                ← العودة إلى الموقع
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
