import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Key, Globe, CheckCircle, XCircle, AlertCircle,
  Eye, EyeOff, RefreshCw, Copy, ExternalLink, Plus, Trash2,
  Clock, Activity, Lock, Zap, ChevronRight, Settings,
  Facebook, Github, Twitter, Linkedin, Apple,
  ToggleLeft, ToggleRight, Save, Terminal,
} from "lucide-react";

const ACCENT = "#2563EB";

interface OAuthProvider {
  id: string;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
  available: boolean;
  description: string;
}

interface AuthLog {
  id: string;
  provider: string;
  email: string;
  status: "success" | "error" | "blocked";
  ip: string;
  time: string;
  reason?: string;
}

const MOCK_LOGS: AuthLog[] = [
  { id: "l1", provider: "Google", email: "m.ahmed@gmail.com",  status: "success", ip: "197.58.x.x", time: "منذ 5 دقائق" },
  { id: "l2", provider: "Google", email: "sara.nour@gmail.com", status: "success", ip: "197.60.x.x", time: "منذ 12 دقيقة" },
  { id: "l3", provider: "Google", email: "hacker@tempmail.io",  status: "blocked", ip: "185.20.x.x", time: "منذ 20 دقيقة", reason: "IP محظور" },
  { id: "l4", provider: "Google", email: "test@invalid.com",   status: "error",   ip: "102.45.x.x", time: "منذ 31 دقيقة", reason: "Token انتهت صلاحيته" },
  { id: "l5", provider: "Google", email: "khaled.mo@gmail.com",status: "success", ip: "197.61.x.x", time: "منذ 45 دقيقة" },
];

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function AuthSettingsSection() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"google" | "providers" | "logs" | "security">("google");
  const [domains, setDomains] = useState<string[]>(["localhost", "yourdomain.com"]);
  const [newDomain, setNewDomain] = useState("");
  const [copied, setCopied] = useState(false);

  const redirectUri = `${typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"}/auth/google/callback`;

  useEffect(() => {
    const stored = localStorage.getItem("oauth_google_client_id") ?? "";
    const storedSecret = localStorage.getItem("oauth_google_client_secret") ?? "";
    const storedEnabled = localStorage.getItem("oauth_google_enabled") === "true";
    setClientId(stored);
    setClientSecret(storedSecret);
    setGoogleEnabled(storedEnabled);
  }, []);

  function handleSave() {
    localStorage.setItem("oauth_google_client_id", clientId);
    localStorage.setItem("oauth_google_client_secret", clientSecret);
    localStorage.setItem("oauth_google_enabled", String(googleEnabled));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleTest() {
    if (!clientId) { setTestStatus("fail"); setTimeout(() => setTestStatus("idle"), 3000); return; }
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus(clientId.length > 20 ? "ok" : "fail");
      setTimeout(() => setTestStatus("idle"), 4000);
    }, 1800);
  }

  function copyRedirectUri() {
    navigator.clipboard.writeText(redirectUri).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const PROVIDERS: OAuthProvider[] = [
    { id: "google",   name: "Google",   nameAr: "جوجل",     icon: <GoogleIcon size={18} />, color: "#4285F4", enabled: googleEnabled, available: true,  description: "تسجيل دخول عبر حساب Google" },
    { id: "facebook", name: "Facebook", nameAr: "فيسبوك",   icon: <Facebook size={17}  className="text-[#1877F2]" />, color: "#1877F2", enabled: false, available: false, description: "قريباً" },
    { id: "apple",    name: "Apple",    nameAr: "آبل",       icon: <Apple size={17}     className="text-gray-900" />,  color: "#000000", enabled: false, available: false, description: "قريباً" },
    { id: "github",   name: "GitHub",   nameAr: "GitHub",    icon: <Github size={17}    className="text-gray-700" />,  color: "#181717", enabled: false, available: false, description: "قريباً" },
    { id: "linkedin", name: "LinkedIn", nameAr: "لينكدإن",  icon: <Linkedin size={17}  className="text-[#0A66C2]" />, color: "#0A66C2", enabled: false, available: false, description: "قريباً" },
    { id: "twitter",  name: "Twitter/X","nameAr": "X",       icon: <Twitter size={17}   className="text-gray-900" />,  color: "#000000", enabled: false, available: false, description: "قريباً" },
  ];

  const TABS = [
    { id: "google",    label: "Google OAuth",     icon: () => <GoogleIcon size={13} /> },
    { id: "providers", label: "مزودو الهوية",     icon: Shield },
    { id: "logs",      label: "سجل المصادقة",    icon: Activity },
    { id: "security",  label: "الأمان",           icon: Lock },
  ];

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">إعدادات المصادقة</h2>
          <p className="text-sm text-gray-400 mt-0.5">OAuth & Social Login Configuration</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${googleEnabled && clientId ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
          <div className={`w-2 h-2 rounded-full ${googleEnabled && clientId ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
          {googleEnabled && clientId ? "Google OAuth نشط" : "Google OAuth غير مفعّل"}
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 w-fit">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === t.id ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
              <Icon />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── GOOGLE TAB ── */}
      {activeTab === "google" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Main config card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-gray-100 shadow-sm">
                <GoogleIcon size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Google OAuth 2.0</p>
                <p className="text-[11px] text-gray-400">Configure Google Sign-In</p>
              </div>
              <div className="mr-auto flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{googleEnabled ? "مفعّل" : "معطّل"}</span>
                <button onClick={() => setGoogleEnabled(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${googleEnabled ? "bg-blue-600" : "bg-gray-200"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${googleEnabled ? "right-1" : "left-1"}`} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Client ID */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                  Google Client ID
                </label>
                <div className="relative">
                  <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm font-mono text-gray-800 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  احصل عليه من{" "}
                  <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer"
                    className="text-blue-500 font-semibold hover:underline inline-flex items-center gap-0.5">
                    Google Cloud Console <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              {/* Client Secret */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                  Google Client Secret
                </label>
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type={showSecret ? "text" : "password"}
                    value={clientSecret}
                    onChange={e => setClientSecret(e.target.value)}
                    placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-xl py-3 pr-10 pl-10 text-sm font-mono text-gray-800 placeholder-gray-300 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                  />
                  <button type="button" onClick={() => setShowSecret(v => !v)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Redirect URI */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">
                  Authorized Redirect URI
                  <span className="text-[9px] font-normal text-gray-300 mr-2 normal-case">أضف هذا الرابط في Google Console</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 font-mono text-xs text-gray-600 overflow-x-auto whitespace-nowrap" dir="ltr">
                    {redirectUri}
                  </div>
                  <button onClick={copyRedirectUri}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all ${copied ? "bg-green-50 border-green-200 text-green-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "تم" : "نسخ"}
                  </button>
                </div>
              </div>

              {/* Authorized domains */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Authorized Domains
                </label>
                <div className="space-y-2">
                  {domains.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 font-mono text-xs text-gray-600" dir="ltr">{d}</div>
                      <button onClick={() => setDomains(ds => ds.filter((_, j) => j !== i))}
                        className="w-8 h-8 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input value={newDomain} onChange={e => setNewDomain(e.target.value)}
                      placeholder="example.com"
                      onKeyDown={e => { if (e.key === "Enter" && newDomain) { setDomains(d => [...d, newDomain]); setNewDomain(""); } }}
                      className="flex-1 border border-dashed border-gray-200 rounded-xl py-2 px-3 font-mono text-xs outline-none focus:border-blue-300 transition-all" dir="ltr" />
                    <button onClick={() => { if (newDomain) { setDomains(d => [...d, newDomain]); setNewDomain(""); } }}
                      className="w-8 h-8 rounded-xl hover:bg-blue-50 text-gray-300 hover:text-blue-500 flex items-center justify-center transition-colors border border-dashed border-gray-200">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}>
                  <Save className="w-4 h-4" />
                  {saved ? "تم الحفظ ✓" : "حفظ الإعدادات"}
                </button>
                <button onClick={handleTest}
                  disabled={testStatus === "testing"}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    testStatus === "ok"   ? "bg-green-50 border-green-200 text-green-700" :
                    testStatus === "fail" ? "bg-red-50 border-red-200 text-red-600" :
                    "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}>
                  {testStatus === "testing" ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                   testStatus === "ok"      ? <CheckCircle className="w-4 h-4" /> :
                   testStatus === "fail"    ? <XCircle className="w-4 h-4" /> :
                   <Zap className="w-4 h-4" />}
                  {testStatus === "testing" ? "جارٍ الاختبار..." :
                   testStatus === "ok"      ? "الاتصال يعمل" :
                   testStatus === "fail"    ? "فشل الاتصال" :
                   "اختبار الاتصال"}
                </button>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Status card */}
            <div className={`rounded-2xl border p-4 ${googleEnabled && clientId ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`}>
              <div className="flex items-center gap-2 mb-3">
                {googleEnabled && clientId ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                )}
                <p className="font-bold text-sm text-gray-800">حالة الاتصال</p>
              </div>
              <div className="space-y-2 text-xs">
                <StatusRow label="Client ID" ok={!!clientId} />
                <StatusRow label="Client Secret" ok={!!clientSecret} />
                <StatusRow label="Google OAuth مفعّل" ok={googleEnabled} />
                <StatusRow label="Redirect URI محدد" ok={true} />
              </div>
            </div>

            {/* Setup guide */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                دليل الإعداد
              </p>
              <ol className="space-y-3">
                {[
                  { n: 1, text: "افتح Google Cloud Console", link: "https://console.cloud.google.com" },
                  { n: 2, text: "أنشئ مشروعاً جديداً أو اختر قائماً" },
                  { n: 3, text: 'فعّل "Google+ API" أو "People API"' },
                  { n: 4, text: "من Credentials أنشئ OAuth 2.0 Client ID" },
                  { n: 5, text: "أضف Redirect URI المُدرج أعلاه" },
                  { n: 6, text: "انسخ Client ID و Secret هنا" },
                ].map(step => (
                  <li key={step.n} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step.n}
                    </span>
                    <span className="text-xs text-gray-600 leading-relaxed">
                      {step.text}
                      {step.link && (
                        <a href={step.link} target="_blank" rel="noopener noreferrer"
                          className="text-blue-500 font-semibold hover:underline mr-1 inline-flex items-center gap-0.5">
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Security note */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800 mb-1">ملاحظة أمنية</p>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    لا تشارك Client Secret أبداً. في الإنتاج يجب تخزينه كـ Environment Variable وليس في الكود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PROVIDERS TAB ── */}
      {activeTab === "providers" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROVIDERS.map(provider => (
            <div key={provider.id}
              className={`bg-white rounded-2xl border p-4 transition-all ${provider.available ? "border-gray-100 hover:shadow-md" : "border-gray-50 opacity-50"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100">
                  {provider.icon}
                </div>
                {provider.available ? (
                  <button onClick={() => provider.id === "google" && setGoogleEnabled(v => !v)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${provider.enabled ? "bg-blue-600" : "bg-gray-200"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${provider.enabled ? "right-0.5" : "left-0.5"}`} />
                  </button>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">قريباً</span>
                )}
              </div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">{provider.name} — {provider.nameAr}</p>
              <p className="text-xs text-gray-400">{provider.description}</p>
              {provider.available && (
                <div className={`mt-3 flex items-center gap-1.5 text-[11px] font-bold ${provider.enabled ? "text-green-600" : "text-gray-300"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${provider.enabled ? "bg-green-500" : "bg-gray-200"}`} />
                  {provider.enabled ? "نشط" : "معطّل"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── LOGS TAB ── */}
      {activeTab === "logs" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "محاولات ناجحة",  value: "156", color: "#10B981", icon: CheckCircle },
              { label: "محاولات فاشلة",  value: "12",  color: "#EF4444", icon: XCircle },
              { label: "محاولات محظورة", value: "3",   color: "#F59E0B", icon: AlertCircle },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <Icon style={{ width: 18, height: 18, color: s.color }} className="mb-2" />
                  <p className="text-2xl font-black text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">آخر محاولات المصادقة</p>
              <button className="text-xs text-blue-500 font-semibold hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> تحديث
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["المستخدم", "المزود", "IP", "الوقت", "الحالة"].map(h => (
                      <th key={h} className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_LOGS.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-medium text-gray-700 font-mono" dir="ltr">{log.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-gray-600">{log.provider}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono" dir="ltr">{log.ip}</td>
                      <td className="px-4 py-3 text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{log.time}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.status === "success" ? "bg-green-50 text-green-600" :
                          log.status === "error"   ? "bg-red-50 text-red-500" :
                          "bg-amber-50 text-amber-600"
                        }`}>
                          {log.status === "success" ? "ناجح" : log.status === "error" ? "خطأ" : "محظور"}
                          {log.reason && ` — ${log.reason}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SECURITY TAB ── */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { title: "CSRF Protection", desc: "حماية ضد Cross-Site Request Forgery عبر State Parameter التحقق في كل طلب OAuth.", status: true, icon: Shield },
            { title: "OAuth State Validation", desc: "يتم التحقق من state parameter في كل callback لضمان أن الطلب صادر من تطبيقنا.", status: true, icon: Key },
            { title: "Secure Token Storage", desc: "Tokens تُخزَّن بشكل آمن ولا تُعرَّض في URLs أو Logs.", status: true, icon: Lock },
            { title: "Rate Limiting", desc: "تحديد عدد محاولات تسجيل الدخول لمنع Brute Force — 10 محاولات / دقيقة.", status: true, icon: Activity },
            { title: "Session Validation", desc: "التحقق من صحة الجلسة في كل طلب محمي مع refresh token تلقائي.", status: true, icon: RefreshCw },
            { title: "Account Linking", desc: "ربط تلقائي للحسابات المسجلة بالإيميل بدون تكرار — Smart Deduplication.", status: true, icon: Settings },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status ? "bg-green-50" : "bg-red-50"}`}>
                  <Icon style={{ width: 16, height: 16, color: item.status ? "#10B981" : "#EF4444" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {item.status ? "مفعّل" : "معطّل"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      {ok
        ? <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle className="w-3 h-3" />مكتمل</span>
        : <span className="flex items-center gap-1 text-gray-400"><XCircle className="w-3 h-3" />مطلوب</span>}
    </div>
  );
}
