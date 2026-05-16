import { useState } from "react";
import { SlimToggle } from "../components/SlimToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle, XCircle, AlertCircle, Settings, Zap,
  RefreshCw, X, Eye, EyeOff, Copy, ExternalLink, ChevronRight,
  Activity, Globe, Mail, Shield,
  MessageSquare, Image, Brain, Map, BarChart2, Clock,
} from "lucide-react";

const ACCENT = "#2563EB";
const ACCENT_LIGHT = "#DBEAFE";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = "connected" | "disconnected" | "warning";
type Category = "all" | "google" | "seo" | "maps" | "notifications" | "performance" | "ai";

interface Integration {
  id: string;
  name: string;
  nameAr: string;
  desc: string;
  category: Category;
  status: Status;
  icon: string;
  color: string;
  docUrl?: string;
  fields: { key: string; label: string; type: "text" | "password"; ph: string }[];
  features: string[];
  lastSync?: string;
}

// ── Integration Data ──────────────────────────────────────────────────────────
const INTEGRATIONS: Integration[] = [
  // ── Google Services ──
  {
    id: "google-maps", name: "Google Maps API", nameAr: "خرائط جوجل",
    desc: "ربط الخرائط التفاعلية، Auto Location Picker، Street View، Geocoding تلقائي للعقارات",
    category: "google", status: "connected", icon: "🗺️", color: "#4285F4",
    lastSync: "منذ 5 دقائق",
    fields: [
      { key: "apiKey", label: "API Key", type: "password", ph: "AIzaSy..." },
      { key: "mapId",  label: "Map ID (اختياري)", type: "text", ph: "abc123" },
    ],
    features: ["Auto Location Picker", "Street View", "Nearby Places", "Geocoding", "Distance Matrix"],
  },
  {
    id: "google-analytics", name: "Google Analytics 4", nameAr: "تحليلات جوجل",
    desc: "تتبع الزوار والتحويلات ومشاهدات العقارات والنقر على الواتساب والاتصال",
    category: "google", status: "connected", icon: "📊", color: "#E37400",
    lastSync: "منذ 10 دقائق",
    fields: [
      { key: "measurementId", label: "Measurement ID", type: "text", ph: "G-XXXXXXXXXX" },
      { key: "apiSecret",     label: "API Secret",     type: "password", ph: "xxxx..." },
    ],
    features: ["تتبع الزوار", "تتبع التحويلات", "مشاهدات العقارات", "أحداث مخصصة", "تقارير الإيرادات"],
  },
  {
    id: "google-search-console", name: "Google Search Console", nameAr: "سيرش كونسول",
    desc: "إرسال Sitemap تلقائي، فحص الفهرسة، مراقبة الأخطاء، الكلمات المفتاحية، CTR",
    category: "google", status: "warning", icon: "🔍", color: "#34A853",
    lastSync: "منذ 3 ساعات",
    fields: [
      { key: "siteUrl",     label: "Site URL",     type: "text",     ph: "https://banha-realestate.com" },
      { key: "serviceKey",  label: "Service Account Key (JSON)", type: "password", ph: "{...}" },
    ],
    features: ["إرسال Sitemap", "فحص الفهرسة", "Impressions & CTR", "أخطاء الزحف", "الكلمات المفتاحية"],
  },
  {
    id: "google-tag-manager", name: "Google Tag Manager", nameAr: "مدير العلامات",
    desc: "إدارة جميع التاجات — Facebook Pixel، TikTok Pixel، Conversion Tracking من مكان واحد",
    category: "google", status: "disconnected", icon: "🏷️", color: "#4285F4",
    fields: [
      { key: "containerId", label: "Container ID", type: "text", ph: "GTM-XXXXXXX" },
    ],
    features: ["Facebook Pixel", "TikTok Pixel", "Conversion Tracking", "Custom Events", "A/B Testing"],
  },
  {
    id: "google-recaptcha", name: "Google reCAPTCHA", nameAr: "ريكابتشا",
    desc: "حماية نماذج التسجيل والدخول وإضافة العقارات من السبام والبوتات",
    category: "google", status: "connected", icon: "🤖", color: "#4285F4",
    lastSync: "نشط",
    fields: [
      { key: "siteKey",   label: "Site Key",   type: "text",     ph: "6Lcxxxxxxx..." },
      { key: "secretKey", label: "Secret Key", type: "password", ph: "6Lcxxxxxxx..." },
    ],
    features: ["reCAPTCHA v3", "reCAPTCHA v2", "حماية نماذج التسجيل", "حماية الدخول"],
  },
  {
    id: "google-oauth", name: "Google OAuth 2.0", nameAr: "تسجيل دخول جوجل",
    desc: "تسجيل الدخول السريع بحساب جوجل — يزيد معدل التسجيل بنسبة 40%",
    category: "google", status: "disconnected", icon: "🔐", color: "#DB4437",
    fields: [
      { key: "clientId",     label: "Client ID",     type: "text",     ph: "xxxx.apps.googleusercontent.com" },
      { key: "clientSecret", label: "Client Secret", type: "password", ph: "GOCSPX-..." },
    ],
    features: ["OAuth 2.0", "تسجيل دخول سريع", "حفظ البيانات تلقائي", "مزامنة الملف الشخصي"],
  },

  // ── SEO & Marketing ──
  {
    id: "microsoft-clarity", name: "Microsoft Clarity", nameAr: "مايكروسوفت كلاريتي",
    desc: "Heatmaps وSession Recordings مجانية لفهم سلوك الزوار على صفحات العقارات",
    category: "seo", status: "connected", icon: "🔥", color: "#0078D4",
    lastSync: "منذ 2 دقيقة",
    fields: [
      { key: "projectId", label: "Project ID", type: "text", ph: "xxxxxxxxxx" },
    ],
    features: ["Heatmaps", "Session Recording", "Rage Clicks", "Dead Clicks", "Scroll Maps"],
  },
  {
    id: "meta-pixel", name: "Meta Pixel", nameAr: "فيسبوك بيكسل",
    desc: "تتبع إعلانات Facebook وInstagram وقياس التحويلات من الزوار إلى المهتمين",
    category: "seo", status: "disconnected", icon: "📘", color: "#1877F2",
    fields: [
      { key: "pixelId",     label: "Pixel ID",     type: "text",     ph: "123456789012345" },
      { key: "accessToken", label: "Access Token", type: "password", ph: "EAAxxxx..." },
    ],
    features: ["Conversion Tracking", "Retargeting", "Custom Audiences", "Event Tracking", "Catalog Ads"],
  },
  {
    id: "tiktok-pixel", name: "TikTok Pixel", nameAr: "تيك توك بيكسل",
    desc: "تتبع الحملات الإعلانية على TikTok وقياس العائد من الإعلانات العقارية",
    category: "seo", status: "disconnected", icon: "🎵", color: "#000000",
    fields: [
      { key: "pixelCode",   label: "Pixel Code",   type: "text",     ph: "CXXXXXXXXXXXXXXX" },
      { key: "accessToken", label: "Access Token", type: "password", ph: "xxxx..." },
    ],
    features: ["Conversion API", "Custom Events", "Audience Targeting", "Campaign Analytics"],
  },
  {
    id: "schema-validator", name: "Schema Validator", nameAr: "مدقق البيانات المنظمة",
    desc: "اختبار وتحقق من صحة Structured Data لكل عقار قبل نشره",
    category: "seo", status: "connected", icon: "✅", color: "#10B981",
    lastSync: "تلقائي",
    fields: [],
    features: ["Property Schema", "Breadcrumb", "FAQ Schema", "Real-time Validation", "تقارير الأخطاء"],
  },

  // ── Maps & Geo ──
  {
    id: "mapbox", name: "Mapbox", nameAr: "مابوكس",
    desc: "بديل احترافي لخرائط جوجل بتحكم كامل في التصميم وعرض مئات العقارات بسرعة",
    category: "maps", status: "disconnected", icon: "🗾", color: "#1E293B",
    fields: [
      { key: "accessToken", label: "Access Token", type: "password", ph: "pk.eyJ1Ij..." },
      { key: "styleUrl",    label: "Style URL (اختياري)", type: "text", ph: "mapbox://styles/..." },
    ],
    features: ["Custom Map Styles", "3D Buildings", "Traffic Layer", "Offline Support", "Custom Icons"],
  },
  {
    id: "openstreetmap", name: "OpenStreetMap / Leaflet", nameAr: "أوبن ستريت ماب",
    desc: "خرائط مجانية 100% مع دعم كامل لعرض العقارات — بدون حد للطلبات",
    category: "maps", status: "connected", icon: "🌍", color: "#7AB648",
    lastSync: "مفعّل",
    fields: [
      { key: "tileServer", label: "Tile Server (اختياري)", type: "text", ph: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
    ],
    features: ["مجاني بالكامل", "لا حدود للطلبات", "Leaflet.js", "Custom Markers", "Polygon Drawing"],
  },
  {
    id: "nearby-services", name: "Nearby Services API", nameAr: "الخدمات المجاورة",
    desc: "عرض المدارس والمستشفيات والمولات والمواصلات تلقائياً حول أي عقار",
    category: "maps", status: "disconnected", icon: "📍", color: "#EC4899",
    fields: [
      { key: "apiKey", label: "Places API Key", type: "password", ph: "AIzaSy..." },
      { key: "radius", label: "نطاق البحث (متر)", type: "text", ph: "1000" },
    ],
    features: ["مدارس", "مستشفيات", "مولات", "محطات مترو", "مساجد", "بنوك"],
  },

  // ── Notifications ──
  {
    id: "whatsapp", name: "WhatsApp Business API", nameAr: "واتساب للأعمال",
    desc: "إرسال إشعارات فورية للعملاء والملاك عند قبول العقارات أو الاستفسارات",
    category: "notifications", status: "warning", icon: "💬", color: "#25D366",
    lastSync: "خطأ في الإرسال",
    fields: [
      { key: "phoneId",     label: "Phone Number ID", type: "text",     ph: "123456789" },
      { key: "accessToken", label: "Access Token",     type: "password", ph: "EAAxxxx..." },
      { key: "webhookUrl",  label: "Webhook URL",      type: "text",     ph: "https://..." },
    ],
    features: ["إشعارات قبول العقار", "إشعارات الاستفسار", "رسائل ترحيبية", "إشعارات الدفع"],
  },
  {
    id: "resend", name: "Resend", nameAr: "ريسند للبريد",
    desc: "إرسال بريد إلكتروني احترافي بمعدل تسليم 99%+ — تأكيد التسجيل، الإشعارات",
    category: "notifications", status: "connected", icon: "✉️", color: "#6366F1",
    lastSync: "منذ دقيقة",
    fields: [
      { key: "apiKey",     label: "API Key",     type: "password", ph: "re_xxxxxxxxxxxx" },
      { key: "fromEmail",  label: "From Email",  type: "text",     ph: "noreply@banha-realestate.com" },
      { key: "fromName",   label: "From Name",   type: "text",     ph: "عقارات بنها" },
    ],
    features: ["تأكيد التسجيل", "استرجاع كلمة المرور", "إشعارات العقارات", "نشرة بريدية", "تقارير التسليم"],
  },
  {
    id: "twilio-sms", name: "Twilio SMS", nameAr: "رسائل SMS",
    desc: "إرسال رسائل SMS التحقق وإشعارات العقارات للمستخدمين بشكل فوري",
    category: "notifications", status: "disconnected", icon: "📱", color: "#F22F46",
    fields: [
      { key: "accountSid", label: "Account SID", type: "text",     ph: "ACxxxxxxxxxxxxxxxxx" },
      { key: "authToken",  label: "Auth Token",  type: "password", ph: "xxxxxxxxxxxxxxxxxxxx" },
      { key: "fromPhone",  label: "From Number", type: "text",     ph: "+1234567890" },
    ],
    features: ["OTP التحقق", "إشعارات SMS", "قبول العقار", "تذكيرات الدفع"],
  },

  // ── Performance ──
  {
    id: "cloudflare", name: "Cloudflare", nameAr: "كلاود فلير",
    desc: "CDN عالمي + حماية DDoS + تسريع الموقع + ضغط الصور WebP تلقائياً",
    category: "performance", status: "connected", icon: "☁️", color: "#F38020",
    lastSync: "نشط",
    fields: [
      { key: "zoneId",  label: "Zone ID",   type: "text",     ph: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "apiKey",  label: "API Key",   type: "password", ph: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "email",   label: "Email",     type: "text",     ph: "admin@banha-realestate.com" },
    ],
    features: ["CDN عالمي", "حماية DDoS", "Cache ذكي", "WebP تلقائي", "SSL/TLS", "Firewall"],
  },
  {
    id: "image-optimizer", name: "Image Optimization", nameAr: "تحسين الصور",
    desc: "ضغط صور العقارات تلقائياً وتحويلها لـ WebP مع ALT Text ذكي",
    category: "performance", status: "connected", icon: "🖼️", color: "#8B5CF6",
    lastSync: "مفعّل",
    fields: [
      { key: "quality", label: "جودة الضغط (%)", type: "text", ph: "80" },
      { key: "maxWidth", label: "أقصى عرض (px)", type: "text", ph: "1920" },
    ],
    features: ["WebP تلقائي", "ضغط ذكي", "Lazy Loading", "ALT Text تلقائي", "Thumbnail Generator"],
  },
  {
    id: "uptime-monitor", name: "Uptime Monitoring", nameAr: "مراقبة التشغيل",
    desc: "مراقبة 24/7 للموقع مع تنبيهات فورية عند أي انقطاع",
    category: "performance", status: "disconnected", icon: "📡", color: "#14B8A6",
    fields: [
      { key: "apiKey",     label: "API Key",      type: "password", ph: "xxxx..." },
      { key: "alertEmail", label: "Alert Email",   type: "text",     ph: "admin@banha-realestate.com" },
    ],
    features: ["فحص كل دقيقة", "تنبيهات فورية", "تقارير الأداء", "SSL Monitor", "سرعة الاستجابة"],
  },

  // ── AI ──
  {
    id: "openai", name: "OpenAI GPT-4", nameAr: "الذكاء الاصطناعي",
    desc: "توليد وصف احترافي للعقارات، تحسين SEO، كتابة Meta Descriptions، مساعد دردشة",
    category: "ai", status: "connected", icon: "🧠", color: "#10A37F",
    lastSync: "منذ دقيقتين",
    fields: [
      { key: "apiKey",      label: "API Key",  type: "password", ph: "sk-xxxxxxxxxxxxxxxxxxxx" },
      { key: "model",       label: "Model",    type: "text",     ph: "gpt-4o" },
      { key: "maxTokens",   label: "Max Tokens", type: "text",   ph: "1000" },
    ],
    features: ["توليد الأوصاف", "تحسين SEO", "Meta Description", "AI Chat", "تحليل العقارات"],
  },
  {
    id: "ai-recommendations", name: "Smart Recommendations", nameAr: "اقتراحات ذكية",
    desc: "اقتراح عقارات مشابهة للزوار بناءً على سلوكهم وتفضيلاتهم تلقائياً",
    category: "ai", status: "disconnected", icon: "💡", color: "#F59E0B",
    fields: [
      { key: "apiKey",     label: "API Key",    type: "password", ph: "xxxx..." },
      { key: "maxResults", label: "عدد الاقتراحات", type: "text",  ph: "6" },
    ],
    features: ["عقارات مشابهة", "تخصيص للمستخدم", "Collaborative Filtering", "Real-time", "A/B Testing"],
  },
];

const CATEGORIES: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: "all",           label: "الكل",             icon: Globe },
  { id: "google",        label: "Google",           icon: Search },
  { id: "seo",           label: "SEO & Marketing",  icon: BarChart2 },
  { id: "maps",          label: "الخرائط",          icon: Map },
  { id: "notifications", label: "الإشعارات",        icon: MessageSquare },
  { id: "performance",   label: "الأداء",           icon: Zap },
  { id: "ai",            label: "الذكاء الاصطناعي", icon: Brain },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const cfg = {
    connected:    { label: "متصل",   bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    disconnected: { label: "غير متصل", bg: "bg-gray-100",  text: "text-gray-500",   dot: "bg-gray-400" },
    warning:      { label: "تحذير",  bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-500" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

function IntegrationCard({ integration, onConfigure }: { integration: Integration; onConfigure: (i: Integration) => void }) {
  const [enabled, setEnabled] = useState(integration.status === "connected");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: integration.color + "15" }}>
              {integration.icon}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{integration.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{integration.nameAr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusBadge status={enabled ? (integration.status === "warning" ? "warning" : "connected") : "disconnected"} />
            <SlimToggle on={enabled} onToggle={() => setEnabled(p => !p)} color={ACCENT} />
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{integration.desc}</p>
      </div>

      {/* Features */}
      <div className="px-5 py-3 border-b border-gray-50">
        <div className="flex flex-wrap gap-1.5">
          {integration.features.slice(0, 4).map((f, i) => (
            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{f}</span>
          ))}
          {integration.features.length > 4 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
              +{integration.features.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between">
        <div>
          {integration.lastSync && (
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {integration.lastSync}
            </p>
          )}
        </div>
        <button onClick={() => onConfigure(integration)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>
          <Settings className="w-3 h-3" /> إعداد
        </button>
      </div>
    </motion.div>
  );
}

function ConfigModal({ integration, onClose }: { integration: Integration; onClose: () => void }) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(integration.fields.map(f => [f.key, ""]))
  );
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "logs" | "docs">("config");

  const testConn = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult(Math.random() > 0.3 ? "success" : "error");
    }, 1800);
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const LOGS = [
    { time: "2026-05-16 12:30", type: "success", msg: "تم الاتصال بنجاح" },
    { time: "2026-05-16 10:15", type: "info",    msg: "تم تحديث الإعدادات" },
    { time: "2026-05-15 22:40", type: "warning", msg: "تأخر في الاستجابة (> 2s)" },
    { time: "2026-05-15 08:00", type: "success", msg: "تم اختبار الاتصال بنجاح" },
  ];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{integration.icon}</span>
            <div>
              <p className="font-bold text-gray-900">{integration.name}</p>
              <StatusBadge status={integration.status} />
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {[
            { id: "config", label: "الإعدادات" },
            { id: "logs",   label: "السجلات" },
            { id: "docs",   label: "التوثيق" },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)}
              className="px-5 py-3 text-xs font-semibold border-b-2 transition-all"
              style={activeTab === t.id
                ? { color: ACCENT, borderColor: ACCENT }
                : { color: "#94A3B8", borderColor: "transparent" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "config" && (
            <div className="space-y-4">
              {integration.fields.length === 0 && (
                <div className="py-8 text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">هذا التكامل لا يحتاج إعداد إضافي</p>
                  <p className="text-xs text-gray-400 mt-1">يعمل تلقائياً بدون مفاتيح</p>
                </div>
              )}

              {integration.fields.map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                  <div className="relative">
                    <input
                      type={f.type === "password" && !visible[f.key] ? "password" : "text"}
                      value={form[f.key]} placeholder={f.ph}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all pr-4"
                      style={{ paddingLeft: f.type === "password" ? "5rem" : "1rem" }}
                    />
                    {f.type === "password" && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <button onClick={() => { navigator.clipboard?.writeText(form[f.key]); }}
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                          <Copy className="w-3 h-3" />
                        </button>
                        <button onClick={() => setVisible(p => ({ ...p, [f.key]: !p[f.key] }))}
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                          {visible[f.key] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Test Connection */}
              {integration.fields.length > 0 && (
                <div className="pt-2">
                  <button onClick={testConn} disabled={testing}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm border-2 flex items-center justify-center gap-2 transition-all"
                    style={{ borderColor: ACCENT, color: ACCENT }}>
                    {testing
                      ? <><RefreshCw className="w-4 h-4 animate-spin" /> جاري الاختبار...</>
                      : <><Activity className="w-4 h-4" /> اختبار الاتصال</>}
                  </button>
                  {testResult && (
                    <div className={`mt-2 p-3 rounded-xl flex items-center gap-2 text-sm ${testResult === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                      {testResult === "success"
                        ? <><CheckCircle className="w-4 h-4" /> الاتصال ناجح! التكامل يعمل بشكل صحيح.</>
                        : <><XCircle className="w-4 h-4" /> فشل الاتصال. تحقق من الـ API Key.</>}
                    </div>
                  )}
                </div>
              )}

              {/* Features list */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 mb-2">الميزات المتاحة</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {integration.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-2">
              {LOGS.map((l, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                  l.type === "success" ? "bg-emerald-50 border-emerald-100" :
                  l.type === "warning" ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
                }`}>
                  {l.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> :
                   l.type === "warning" ? <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" /> :
                   <Activity className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-medium text-gray-700">{l.msg}</p>
                    <p className="text-gray-400 mt-0.5">{l.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "docs" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm font-bold text-blue-700 mb-1">روابط التوثيق</p>
                <p className="text-xs text-blue-600">اضغط على الروابط أدناه للوصول للتوثيق الرسمي</p>
              </div>
              {[
                { label: "التوثيق الرسمي", url: "https://developers.google.com" },
                { label: "Getting Started Guide", url: "#" },
                { label: "API Reference", url: "#" },
                { label: "SDK Downloads", url: "#" },
              ].map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <span className="text-sm text-gray-700 font-medium">{l.label}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === "config" && integration.fields.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={save}
              className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: saved ? "#10B981" : ACCENT }}>
              {saved
                ? <><CheckCircle className="w-4 h-4" /> تم الحفظ!</>
                : <><Settings className="w-4 h-4" /> حفظ الإعدادات</>}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function IntegrationsSection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [configuring, setConfiguring] = useState<Integration | null>(null);

  const connected    = INTEGRATIONS.filter(i => i.status === "connected").length;
  const disconnected = INTEGRATIONS.filter(i => i.status === "disconnected").length;
  const warnings     = INTEGRATIONS.filter(i => i.status === "warning").length;

  const filtered = INTEGRATIONS.filter(i =>
    (activeCategory === "all" || i.category === activeCategory) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) ||
     i.nameAr.includes(search) ||
     i.desc.includes(search))
  );

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "إجمالي التكاملات",  value: INTEGRATIONS.length, color: "#6366F1", icon: Globe },
          { label: "متصل",              value: connected,            color: "#10B981", icon: CheckCircle },
          { label: "تحذيرات",           value: warnings,             color: "#F59E0B", icon: AlertCircle },
          { label: "غير متصل",          value: disconnected,         color: "#94A3B8", icon: XCircle },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: s.color + "18" }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + category filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ابحث في التكاملات..."
              className="w-full pr-9 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              const active = activeCategory === c.id;
              return (
                <button key={c.id} onClick={() => setActiveCategory(c.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={active
                    ? { backgroundColor: ACCENT, color: "#fff" }
                    : { backgroundColor: "#F1F5F9", color: "#64748B" }}>
                  <Icon className="w-3.5 h-3.5" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-gray-400 px-1">
          {filtered.length} نتيجة للبحث عن "<strong className="text-gray-600">{search}</strong>"
        </p>
      )}

      {/* Integration cards grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onConfigure={setConfiguring}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
          <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">لا توجد تكاملات تطابق البحث</p>
        </div>
      )}

      {/* Configure Modal */}
      <AnimatePresence>
        {configuring && (
          <ConfigModal integration={configuring} onClose={() => setConfiguring(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
