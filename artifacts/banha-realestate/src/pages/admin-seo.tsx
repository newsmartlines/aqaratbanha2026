import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Search, BarChart2, FileText, Settings, AlertCircle, CheckCircle,
  TrendingUp, Zap, RefreshCw, Download, Edit2, Trash2, Plus, Eye,
  Link, ExternalLink, Target, Activity, Brain, ArrowRight, Copy,
  Shield, Image, Code2, Repeat, Map, ChevronRight, X, Save,
  ToggleLeft, ToggleRight, Star, Clock, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const ACCENT = "#2563EB";
const ACCENT_LIGHT = "#DBEAFE";

// ── SEO Mock Data ─────────────────────────────────────────────────────────────
const SEO_PROPERTIES = [
  { id: 1, title: "شقة 3 غرف - ميدان بنها",      score: 92, indexed: true,  issues: 0, slug: "shaqqa-3-ghuraf-maydan-banha",       views: 841 },
  { id: 2, title: "فيلا للبيع في الفلل",          score: 78, indexed: true,  issues: 2, slug: "villa-lilbay-fi-alfilal",             views: 532 },
  { id: 3, title: "محل تجاري - وسط البلد",        score: 61, indexed: false, issues: 4, slug: "mahal-tijari-wasat-albalad",          views: 211 },
  { id: 4, title: "أرض للبيع - طوخ",              score: 44, indexed: true,  issues: 3, slug: "ard-lilbay-tukh",                     views: 178 },
  { id: 5, title: "شقة مفروشة - قليوب",           score: 87, indexed: true,  issues: 1, slug: "shaqqa-mafrusha-qalyub",              views: 650 },
  { id: 6, title: "مكتب للإيجار - شارع النيل",   score: 33, indexed: false, issues: 5, slug: "maktab-lilijar-shari-alnil",           views: 89  },
  { id: 7, title: "دوبلكس - بنها الجديدة",        score: 95, indexed: true,  issues: 0, slug: "dupliks-banha-aljadida",              views: 920 },
  { id: 8, title: "شقة 2 غرف - كفر شكر",         score: 0,  indexed: false, issues: 6, slug: "",                                    views: 0   },
];

const REDIRECTS = [
  { id: 1, from: "/old-property-1",      to: "/property/1",    type: "301", hits: 124, date: "10 مايو 26" },
  { id: 2, from: "/listing/villa-12",    to: "/property/7",    type: "301", hits: 56,  date: "5 مايو 26"  },
  { id: 3, from: "/search/apartments",   to: "/search?type=شقة", type: "302", hits: 234, date: "1 مايو 26" },
];

const BROKEN_LINKS = [
  { id: 1, page: "/property/3",    link: "/images/property-3-hero.jpg", code: 404, type: "صورة"  },
  { id: 2, page: "/property/6",    link: "/contact-old",                 code: 404, type: "رابط داخلي" },
  { id: 3, page: "/search",        link: "https://old-api.banha.com",   code: 503, type: "رابط خارجي" },
  { id: 4, page: "/dashboard/listings", link: "/api/v1/properties",     code: 404, type: "API"   },
];

const TRAFFIC_DATA = [
  { d: "يناير",  organic: 1200, direct: 400, social: 200 },
  { d: "فبراير", organic: 1500, direct: 450, social: 280 },
  { d: "مارس",   organic: 1800, direct: 520, social: 310 },
  { d: "أبريل",  organic: 2100, direct: 480, social: 390 },
  { d: "مايو",   organic: 2600, direct: 600, social: 450 },
  { d: "يونيو",  organic: 3100, direct: 720, social: 520 },
];

const TOP_PAGES = [
  { page: "/",               views: 4521, bounce: "32%", time: "3:21" },
  { page: "/property/7",     views: 920,  bounce: "28%", time: "4:45" },
  { page: "/property/1",     views: 841,  bounce: "31%", time: "3:55" },
  { page: "/search",         views: 740,  bounce: "45%", time: "2:10" },
  { page: "/property/5",     views: 650,  bounce: "29%", time: "4:02" },
  { page: "/property/2",     views: 532,  bounce: "37%", time: "3:18" },
];

const SITEMAP_URLS = [
  { url: "https://banha-realestate.com/",                    priority: "1.0", freq: "daily",   lastMod: "2026-05-16" },
  { url: "https://banha-realestate.com/search",             priority: "0.9", freq: "daily",   lastMod: "2026-05-16" },
  { url: "https://banha-realestate.com/property/1",         priority: "0.8", freq: "weekly",  lastMod: "2026-05-14" },
  { url: "https://banha-realestate.com/property/2",         priority: "0.8", freq: "weekly",  lastMod: "2026-05-12" },
  { url: "https://banha-realestate.com/property/5",         priority: "0.8", freq: "weekly",  lastMod: "2026-05-10" },
  { url: "https://banha-realestate.com/property/7",         priority: "0.8", freq: "weekly",  lastMod: "2026-05-08" },
  { url: "https://banha-realestate.com/location/banha",     priority: "0.7", freq: "monthly", lastMod: "2026-05-01" },
  { url: "https://banha-realestate.com/location/qalyub",    priority: "0.7", freq: "monthly", lastMod: "2026-05-01" },
  { url: "https://banha-realestate.com/category/apartments",priority: "0.7", freq: "weekly",  lastMod: "2026-05-15" },
  { url: "https://banha-realestate.com/category/villas",    priority: "0.7", freq: "weekly",  lastMod: "2026-05-15" },
];

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /login
Disallow: /register

User-agent: Googlebot
Allow: /
Crawl-delay: 1

Sitemap: https://banha-realestate.com/sitemap.xml`;

// ── Sub-components ────────────────────────────────────────────────────────────
function SeoCard({ icon: Icon, label, value, sub, color, warn }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string; warn?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + "18" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold" style={{ color: warn ? "#EF4444" : "#1E293B" }}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : score === 0 ? "#94A3B8" : "#EF4444";
  const label = score >= 80 ? "ممتاز" : score >= 60 ? "جيد" : score === 0 ? "لا يوجد" : "يحتاج تحسين";
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke="#E2E8F0" strokeWidth="3" />
          <circle cx="16" cy="16" r="13" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${(score / 100) * 81.7} 81.7`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

function GooglePreview({ title, slug, description }: { title: string; slug: string; description: string }) {
  const url = `banha-realestate.com/${slug || "property/example"}`;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 font-sans max-w-lg">
      <p className="text-xs text-gray-400 mb-1">معاينة Google</p>
      <p className="text-[13px] text-gray-500 mb-0.5 truncate">{url}</p>
      <p className="text-[18px] text-blue-700 font-medium leading-snug mb-1 line-clamp-1">
        {title || "عنوان الصفحة | عقارات بنها"}
      </p>
      <p className="text-[13px] text-gray-600 line-clamp-2">
        {description || "ابحث عن أفضل العقارات في بنها والقليوبية. شقق، فيلات، محلات وأراضي للبيع والإيجار بأسعار مناسبة."}
      </p>
    </div>
  );
}

function OGPreview({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden max-w-lg">
      <div className="h-[140px] bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
        <Globe className="w-12 h-12 text-white/40" />
      </div>
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">banha-realestate.com</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-1">
          {title || "عقارات بنها - أفضل منصة عقارية"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {description || "ابحث عن عقارك المثالي في بنها والقليوبية"}
        </p>
      </div>
    </div>
  );
}

// ── Tab: General SEO ──────────────────────────────────────────────────────────
function GeneralSeoTab() {
  const [form, setForm] = useState({
    siteTitle: "عقارات بنها | أفضل منصة عقارية في القليوبية",
    titleSep: "|",
    titleSuffix: "عقارات بنها",
    metaDesc: "ابحث عن أفضل العقارات في بنها والقليوبية. شقق، فيلات، محلات وأراضي للبيع والإيجار بأسعار مناسبة.",
    keywords: "عقارات بنها, شقق للبيع, فيلات, القليوبية, عقارات مصر",
    googleVerify: "abc123xyz",
    bingVerify: "",
    canonical: true,
    noIndexAdmin: true,
    ogType: "website",
  });
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <Globe className="w-4 h-4" style={{ color: ACCENT }} /> إعدادات الموقع العامة
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">عنوان الموقع الرئيسي</label>
              <input value={form.siteTitle} onChange={e => set("siteTitle", e.target.value)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
              <p className="text-xs text-gray-400 mt-1">{form.siteTitle.length}/60 حرف</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">الوصف العام (Meta Description)</label>
              <textarea value={form.metaDesc} onChange={e => set("metaDesc", e.target.value)} rows={3}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all resize-none" />
              <p className="text-xs text-gray-400 mt-1">{form.metaDesc.length}/160 حرف</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">الكلمات المفتاحية</label>
              <input value={form.keywords} onChange={e => set("keywords", e.target.value)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <h5 className="font-semibold text-gray-700 text-sm">التحقق من محركات البحث</h5>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Google Site Verification</label>
              <input value={form.googleVerify} onChange={e => set("googleVerify", e.target.value)}
                placeholder="أدخل كود التحقق"
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Bing Webmaster Verification</label>
              <input value={form.bingVerify} onChange={e => set("bingVerify", e.target.value)}
                placeholder="أدخل كود التحقق"
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <h5 className="font-semibold text-gray-700 text-sm">إعدادات متقدمة</h5>
            {[
              { label: "إضافة Canonical URL تلقائياً", key: "canonical" },
              { label: "NoIndex لصفحات Admin/Dashboard", key: "noIndexAdmin" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <button onClick={() => set(item.key, !(form as any)[item.key])}>
                  {(form as any)[item.key]
                    ? <ToggleRight className="w-6 h-6" style={{ color: ACCENT }} />
                    : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                </button>
              </div>
            ))}
          </div>

          <button onClick={save}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: saved ? "#10B981" : ACCENT }}>
            {saved ? <><CheckCircle className="w-4 h-4" /> تم الحفظ!</> : <><Save className="w-4 h-4" /> حفظ الإعدادات</>}
          </button>
        </div>

        {/* Right: previews */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" style={{ color: ACCENT }} /> معاينة Google
            </h4>
            <GooglePreview title={form.siteTitle} slug="" description={form.metaDesc} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Image className="w-4 h-4" style={{ color: ACCENT }} /> معاينة Open Graph
            </h4>
            <OGPreview title={form.siteTitle} description={form.metaDesc} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Property SEO ─────────────────────────────────────────────────────────
function PropertySeoTab() {
  const [props, setProps] = useState(SEO_PROPERTIES);
  const [editProp, setEditProp] = useState<typeof SEO_PROPERTIES[0] | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", slug: "", keywords: "", noIndex: false });

  const openEdit = (p: typeof SEO_PROPERTIES[0]) => {
    setEditForm({
      title: p.title + " | عقارات بنها",
      description: `اكتشف ${p.title} في منطقة بنها والقليوبية. تفاصيل كاملة وصور وأسعار محدثة.`,
      slug: p.slug,
      keywords: `${p.title}, عقارات بنها, عقارات للبيع`,
      noIndex: !p.indexed,
    });
    setEditProp(p);
  };
  const saveEdit = () => {
    setProps(prev => prev.map(p => p.id === editProp!.id
      ? { ...p, slug: editForm.slug, indexed: !editForm.noIndex, score: Math.min(100, p.score + 10), issues: Math.max(0, p.issues - 1) }
      : p));
    setEditProp(null);
  };

  const noSeoCount = props.filter(p => p.score === 0).length;
  const issuesCount = props.reduce((a, p) => a + p.issues, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-800">{props.length}</p>
          <p className="text-xs text-gray-400 mt-1">إجمالي العقارات</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-500">{noSeoCount}</p>
          <p className="text-xs text-gray-400 mt-1">بدون SEO</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-amber-500">{issuesCount}</p>
          <p className="text-xs text-gray-400 mt-1">مشاكل SEO</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h4 className="font-bold text-gray-800">SEO العقارات</h4>
          <button className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600">
            <Zap className="w-3.5 h-3.5" style={{ color: ACCENT }} /> توليد تلقائي للكل
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                {["العقار", "SEO Score", "الـ Slug", "الحالة", "المشاكل", "المشاهدات", "إجراءات"].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-800 max-w-[180px] truncate">{p.title}</p>
                  </td>
                  <td className="px-4 py-3"><ScoreBadge score={p.score} /></td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 max-w-[120px] truncate block">
                      {p.slug || "—"}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.indexed ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.indexed ? "مؤرشف" : "غير مؤرشف"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.issues > 0
                      ? <span className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{p.issues}</span>
                      : <span className="text-xs text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> لا مشاكل</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-medium">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => openEdit(p)}
                      className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center" style={{ color: ACCENT }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {editProp && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditProp(null)} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">تعديل SEO: {editProp.title}</h3>
                <button onClick={() => setEditProp(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Meta Title", key: "title", max: 60 },
                  { label: "Meta Description", key: "description", max: 160 },
                  { label: "Slug URL", key: "slug", max: 80 },
                  { label: "Focus Keywords", key: "keywords", max: 100 },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                    <input value={(editForm as any)[f.key]}
                      onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
                    <p className="text-xs text-gray-400 mt-0.5">{(editForm as any)[f.key].length}/{f.max}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">منع الفهرسة (NoIndex)</span>
                  <button onClick={() => setEditForm(p => ({ ...p, noIndex: !p.noIndex }))}>
                    {editForm.noIndex
                      ? <ToggleRight className="w-6 h-6 text-red-400" />
                      : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                  </button>
                </div>
                <div className="pt-2">
                  <GooglePreview title={editForm.title} slug={editForm.slug} description={editForm.description} />
                </div>
                <button onClick={saveEdit}
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: ACCENT }}>
                  <Save className="w-4 h-4" /> حفظ إعدادات SEO
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Tab: Sitemap ──────────────────────────────────────────────────────────────
function SitemapTab() {
  const [urls, setUrls] = useState(SITEMAP_URLS);
  const [generated, setGenerated] = useState("2026-05-16 12:30");
  const [loading, setLoading] = useState(false);

  const regenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(new Date().toLocaleString("ar-EG"));
      setLoading(false);
    }, 1500);
  };

  const xmlPreview = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.slice(0, 3).map(u =>
    `  <url>\n    <loc>${u.url}</loc>\n    <lastmod>${u.lastMod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  ).join("\n")}\n  ...\n</urlset>`;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Map className="w-4 h-4" style={{ color: ACCENT }} /> XML Sitemap
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">آخر تحديث: {generated} · {urls.length} رابط</p>
          </div>
          <div className="flex gap-2">
            <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
              <ExternalLink className="w-3.5 h-3.5" /> عرض Sitemap
            </a>
            <button onClick={regenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
              style={{ backgroundColor: ACCENT }} disabled={loading}>
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              {loading ? "جاري التوليد..." : "توليد جديد"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                {["الـ URL", "الأولوية", "التحديث", "آخر تعديل", "إجراءات"].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {urls.map((u, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <code className="text-xs text-gray-600 max-w-[260px] truncate block">{u.url}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>
                      {u.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.freq}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{u.lastMod}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setUrls(prev => prev.filter((_, j) => j !== i))}
                      className="w-6 h-6 rounded hover:bg-red-50 text-red-400 flex items-center justify-center">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Code2 className="w-4 h-4" style={{ color: ACCENT }} /> معاينة XML
        </h4>
        <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto leading-relaxed font-mono">
          {xmlPreview}
        </pre>
        <button className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
          <Download className="w-3.5 h-3.5" /> تحميل sitemap.xml
        </button>
      </div>
    </div>
  );
}

// ── Tab: Robots.txt ───────────────────────────────────────────────────────────
function RobotsTab() {
  const [content, setContent] = useState(DEFAULT_ROBOTS);
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: ACCENT }} /> robots.txt
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">تحكم في ما يتم زحفه من قِبل محركات البحث</p>
          </div>
          <a href="#" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600">
            <ExternalLink className="w-3.5 h-3.5" /> عرض robots.txt
          </a>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={16}
          className="w-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-xl outline-none resize-none leading-relaxed" />
        <div className="flex gap-2 mt-3">
          <button onClick={save}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
            style={{ backgroundColor: saved ? "#10B981" : ACCENT }}>
            {saved ? <><CheckCircle className="w-4 h-4" /> تم الحفظ</> : <><Save className="w-4 h-4" /> حفظ</>}
          </button>
          <button onClick={() => setContent(DEFAULT_ROBOTS)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
            <RefreshCw className="w-3.5 h-3.5" /> إعادة تعيين
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50">
            <Download className="w-3.5 h-3.5" /> تحميل
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: CheckCircle, label: "Googlebot", status: "مسموح", ok: true },
          { icon: CheckCircle, label: "Bingbot", status: "مسموح", ok: true },
          { icon: Shield, label: "صفحات Admin", status: "محظور", ok: false },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <item.icon className="w-5 h-5" style={{ color: item.ok ? "#10B981" : "#EF4444" }} />
            <div>
              <p className="text-sm font-semibold text-gray-700">{item.label}</p>
              <p className="text-xs" style={{ color: item.ok ? "#10B981" : "#EF4444" }}>{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Schema Generator ─────────────────────────────────────────────────────
function SchemaTab() {
  const [activeSchema, setActiveSchema] = useState<"property" | "breadcrumb" | "faq">("property");
  const [copied, setCopied] = useState(false);

  const schemas = {
    property: {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": "شقة 3 غرف - ميدان بنها",
      "description": "شقة 3 غرف للبيع في ميدان بنها بمساحة 150 م²",
      "url": "https://banha-realestate.com/property/1",
      "price": { "@type": "MonetaryAmount", "currency": "EGP", "value": 850000 },
      "address": { "@type": "PostalAddress", "addressLocality": "بنها", "addressRegion": "القليوبية", "addressCountry": "EG" },
      "numberOfRooms": 3,
      "floorSize": { "@type": "QuantitativeValue", "value": 150, "unitCode": "MTK" },
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://banha-realestate.com" },
        { "@type": "ListItem", "position": 2, "name": "شقق للبيع", "item": "https://banha-realestate.com/search?type=شقة" },
        { "@type": "ListItem", "position": 3, "name": "شقة 3 غرف - ميدان بنها" },
      ],
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "ما هو سعر الشقة؟", "acceptedAnswer": { "@type": "Answer", "text": "سعر الشقة 850,000 جنيه مصري." } },
        { "@type": "Question", "name": "أين تقع الشقة؟", "acceptedAnswer": { "@type": "Answer", "text": "تقع في ميدان بنها، محافظة القليوبية." } },
      ],
    },
  };

  const json = JSON.stringify(schemas[activeSchema], null, 2);
  const copy = () => { navigator.clipboard?.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Code2 className="w-4 h-4" style={{ color: ACCENT }} /> Structured Data Schema
        </h4>
        <div className="flex gap-2 mb-4">
          {(["property", "breadcrumb", "faq"] as const).map(s => (
            <button key={s} onClick={() => setActiveSchema(s)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={activeSchema === s ? { backgroundColor: ACCENT, color: "#fff" } : { backgroundColor: "#F1F5F9", color: "#64748B" }}>
              {s === "property" ? "عقار" : s === "breadcrumb" ? "Breadcrumb" : "FAQ"}
            </button>
          ))}
        </div>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto leading-relaxed font-mono max-h-72">
            {json}
          </pre>
          <button onClick={copy}
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all">
            {copied ? <><CheckCircle className="w-3 h-3 text-green-400" /> تم!</> : <><Copy className="w-3 h-3" /> نسخ</>}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          أضف هذا الكود داخل <code className="bg-gray-100 px-1 rounded">&lt;script type="application/ld+json"&gt;</code> في الصفحة
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Property Schema", desc: "تفاصيل العقار للـ Google", icon: "🏠" },
          { label: "Breadcrumb Schema", desc: "مسار التنقل للـ SERP", icon: "📍" },
          { label: "FAQ Schema", desc: "الأسئلة الشائعة في نتائج البحث", icon: "❓" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className="text-sm font-bold text-gray-800">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
            <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">مفعّل</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Redirect Manager ─────────────────────────────────────────────────────
function RedirectTab() {
  const [rows, setRows] = useState(REDIRECTS);
  const [form, setForm] = useState({ from: "", to: "", type: "301" });
  const [adding, setAdding] = useState(false);

  const add = () => {
    if (!form.from || !form.to) return;
    setRows(prev => [...prev, { id: Date.now(), ...form, hits: 0, date: "اليوم" }]);
    setForm({ from: "", to: "", type: "301" });
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Repeat className="w-4 h-4" style={{ color: ACCENT }} /> إدارة الـ Redirects
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">{rows.length} إعادة توجيه نشطة</p>
          </div>
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ backgroundColor: ACCENT }}>
            <Plus className="w-3.5 h-3.5" /> إضافة Redirect
          </button>
        </div>

        {adding && (
          <div className="px-5 py-4 bg-blue-50/40 border-b border-gray-100">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">من (From)</label>
                <input value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                  placeholder="/old-page" className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">إلى (To)</label>
                <input value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                  placeholder="/new-page" className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">النوع</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white text-sm outline-none">
                  <option>301</option>
                  <option>302</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={add} className="px-4 py-1.5 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: ACCENT }}>حفظ</button>
              <button onClick={() => setAdding(false)} className="px-4 py-1.5 rounded-xl text-sm text-gray-500 border border-gray-200 hover:bg-gray-50">إلغاء</button>
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {["من", "إلى", "النوع", "الضربات", "التاريخ", "حذف"].map(h => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-3"><code className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{r.from}</code></td>
                <td className="px-4 py-3"><code className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{r.to}</code></td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.type === "301" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                    {r.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{r.hits}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{r.date}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setRows(p => p.filter(x => x.id !== r.id))}
                    className="w-6 h-6 rounded hover:bg-red-50 text-red-400 flex items-center justify-center">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: Broken Links ─────────────────────────────────────────────────────────
function BrokenLinksTab() {
  const [links, setLinks] = useState(BROKEN_LINKS);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState("2026-05-15 14:22");

  const scan = () => {
    setScanning(true);
    setTimeout(() => {
      setLastScan(new Date().toLocaleString("ar-EG"));
      setScanning(false);
    }, 2500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Link className="w-4 h-4 text-red-500" /> الروابط المكسورة
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">آخر فحص: {lastScan} · {links.length} رابط مكسور</p>
          </div>
          <button onClick={scan} disabled={scanning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: scanning ? "#94A3B8" : ACCENT }}>
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {scanning ? "جاري الفحص..." : "فحص الآن"}
          </button>
        </div>

        {scanning && (
          <div className="mb-4 p-3 bg-blue-50 rounded-xl flex items-center gap-3">
            <RefreshCw className="w-4 h-4 animate-spin" style={{ color: ACCENT }} />
            <p className="text-sm text-gray-600">جاري فحص كافة الروابط...</p>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/60 border-b border-gray-100">
              {["الصفحة", "الرابط المكسور", "الكود", "النوع", "إجراء"].map(h => (
                <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {links.map(l => (
              <tr key={l.id} className="border-b border-gray-50 hover:bg-red-50/20">
                <td className="px-4 py-3"><code className="text-xs text-gray-600">{l.page}</code></td>
                <td className="px-4 py-3"><code className="text-xs text-red-500 max-w-[160px] truncate block">{l.link}</code></td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">{l.code}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500">{l.type}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setLinks(p => p.filter(x => x.id !== l.id))}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-gray-100 text-gray-500">
                    تجاهل
                  </button>
                </td>
              </tr>
            ))}
            {links.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                لا توجد روابط مكسورة
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tab: Analytics ────────────────────────────────────────────────────────────
function AnalyticsTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h4 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: ACCENT }} /> حركة الزوار العضوية
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={TRAFFIC_DATA}>
            <defs>
              <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ACCENT} stopOpacity={0.2} />
                <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="d" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="organic" name="عضوي" stroke={ACCENT} fill="url(#orgGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="direct" name="مباشر" stroke="#6366F1" fill="transparent" strokeWidth={1.5} strokeDasharray="4 2" />
            <Area type="monotone" dataKey="social" name="سوشيال" stroke="#F59E0B" fill="transparent" strokeWidth={1.5} strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" style={{ color: ACCENT }} /> أكثر الصفحات زيارة
          </h4>
          <div className="space-y-2">
            {TOP_PAGES.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <code className="text-xs text-gray-600 flex-1 truncate">{p.page}</code>
                <span className="text-xs font-bold text-gray-800">{p.views.toLocaleString()}</span>
                <span className="text-xs text-gray-400">{p.bounce}</span>
                <span className="text-xs text-gray-400">{p.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: ACCENT }} /> Core Web Vitals
          </h4>
          <div className="space-y-4">
            {[
              { label: "LCP (Largest Contentful Paint)", value: "2.1s", score: 88, status: "جيد", color: "#10B981" },
              { label: "FID (First Input Delay)",        value: "42ms", score: 95, status: "ممتاز", color: "#10B981" },
              { label: "CLS (Cumulative Layout Shift)",  value: "0.08", score: 79, status: "يحتاج تحسين", color: "#F59E0B" },
              { label: "TTFB (Time to First Byte)",      value: "380ms", score: 82, status: "جيد", color: "#10B981" },
            ].map((v, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{v.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">{v.value}</span>
                    <span className="text-xs font-semibold" style={{ color: v.color }}>{v.status}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${v.score}%`, backgroundColor: v.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab: AI SEO Generator ─────────────────────────────────────────────────────
function AiSeoTab() {
  const [input, setInput] = useState({ title: "", type: "شقة", city: "بنها", price: "", desc: "" });
  const [result, setResult] = useState<null | {
    metaTitle: string; metaDesc: string; slug: string;
    keywords: string[]; score: number; suggestions: string[];
    ogTitle: string; twitterTitle: string;
  }>(null);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    if (!input.title) return;
    setGenerating(true);
    setTimeout(() => {
      const slug = input.title.trim().toLowerCase()
        .replace(/[\u0600-\u06FF]+/g, (m) => m)
        .replace(/\s+/g, "-")
        .replace(/[^\u0600-\u06FF\w-]/g, "")
        .substring(0, 60);

      const score = Math.floor(70 + Math.random() * 25);
      setResult({
        metaTitle: `${input.title} ${input.price ? `بسعر ${input.price} جنيه` : ""} | عقارات بنها`.trim(),
        metaDesc: `${input.type} ${input.desc ? input.desc.slice(0, 80) : `متميزة`} في ${input.city}، القليوبية. ${input.price ? `السعر: ${input.price} جنيه.` : ""} تواصل الآن لمزيد من التفاصيل والمعاينة.`.trim(),
        slug: slug || `${input.type}-${input.city}`.replace(/\s+/g, "-"),
        keywords: [
          `${input.type} في ${input.city}`,
          `${input.type} للبيع`,
          `عقارات ${input.city}`,
          `عقارات القليوبية`,
          `${input.type} ${input.price ? `${input.price}` : ""}`,
        ].filter(Boolean),
        score,
        suggestions: [
          "أضف وصفاً أطول (150+ كلمة) لتحسين الـ SEO",
          "أضف صوراً بعدد 5 على الأقل مع ALT Text وصفي",
          "أضف موقع جغرافي دقيق (خط الطول والعرض)",
          score < 90 ? "أضف مميزات تفصيلية (عدد الغرف، المساحة، الطابق)" : "محتوى ممتاز! يمكن إضافة FAQ للمزيد",
        ],
        ogTitle: `${input.title} | عقارات بنها`,
        twitterTitle: `🏠 ${input.title} - عقارات بنها`,
      });
      setGenerating(false);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <Brain className="w-4 h-4" style={{ color: ACCENT }} /> AI SEO Generator
          </h4>
          <p className="text-xs text-gray-400">أدخل بيانات العقار وسيتولى النظام توليد كل بيانات SEO تلقائياً</p>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">عنوان العقار *</label>
            <input value={input.title} onChange={e => setInput(p => ({ ...p, title: e.target.value }))}
              placeholder="مثل: شقة 3 غرف في ميدان بنها"
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">نوع العقار</label>
              <select value={input.type} onChange={e => setInput(p => ({ ...p, type: e.target.value }))}
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none">
                {["شقة", "فيلا", "محل", "أرض", "مكتب", "دوبلكس"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1.5">المدينة</label>
              <select value={input.city} onChange={e => setInput(p => ({ ...p, city: e.target.value }))}
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none">
                {["بنها", "طوخ", "قليوب", "شبين الكنائر", "كفر شكر", "منية القمح"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">السعر (اختياري)</label>
            <input value={input.price} onChange={e => setInput(p => ({ ...p, price: e.target.value }))}
              placeholder="850,000"
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1.5">الوصف (اختياري)</label>
            <textarea value={input.desc} onChange={e => setInput(p => ({ ...p, desc: e.target.value }))}
              rows={3} placeholder="وصف مختصر للعقار..."
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:bg-white focus:border-blue-300 transition-all resize-none" />
          </div>

          <button onClick={generate} disabled={generating || !input.title}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            style={{ backgroundColor: ACCENT }}>
            {generating
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> جاري التوليد...</>
              : <><Brain className="w-4 h-4" /> توليد SEO بالذكاء الاصطناعي</>}
          </button>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {!result && !generating && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center text-center">
              <Brain className="w-12 h-12 text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">أدخل بيانات العقار واضغط "توليد"</p>
              <p className="text-gray-300 text-xs mt-1">سيتم توليد كل بيانات SEO تلقائياً</p>
            </div>
          )}

          {generating && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center">
              <RefreshCw className="w-10 h-10 animate-spin mb-3" style={{ color: ACCENT }} />
              <p className="text-gray-600 text-sm font-medium">يحلل النظام بيانات العقار...</p>
              <div className="mt-4 space-y-1 text-xs text-gray-400 text-right w-full max-w-xs">
                {["توليد Meta Title...", "توليد Meta Description...", "إنشاء Slug URL...", "اقتراح Keywords...", "حساب SEO Score..."].map((s, i) => (
                  <p key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {s}
                  </p>
                ))}
              </div>
            </div>
          )}

          {result && !generating && (
            <div className="space-y-3">
              {/* Score */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                    <circle cx="32" cy="32" r="26" fill="none"
                      stroke={result.score >= 80 ? "#10B981" : result.score >= 60 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="5" strokeDasharray={`${(result.score / 100) * 163.4} 163.4`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800">{result.score}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800">SEO Score</p>
                  <p className="text-sm font-semibold" style={{ color: result.score >= 80 ? "#10B981" : "#F59E0B" }}>
                    {result.score >= 80 ? "ممتاز ✓" : "جيد - يمكن التحسين"}
                  </p>
                </div>
              </div>

              {/* Generated fields */}
              {[
                { label: "Meta Title", value: result.metaTitle, max: 60 },
                { label: "Meta Description", value: result.metaDesc, max: 160 },
                { label: "Slug URL", value: result.slug, max: 80 },
              ].map(f => (
                <div key={f.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-500">{f.label}</label>
                    <span className="text-xs text-gray-400">{f.value.length}/{f.max}</span>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">{f.value}</p>
                </div>
              ))}

              {/* Keywords */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <label className="text-xs font-bold text-gray-500 block mb-2">Keywords المقترحة</label>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((k, i) => (
                    <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: ACCENT_LIGHT, color: ACCENT }}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <label className="text-xs font-bold text-gray-500 block mb-2">اقتراحات التحسين</label>
                <div className="space-y-1.5">
                  {result.suggestions.map((s, i) => (
                    <p key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: ACCENT }} /> {s}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main SEO Section ──────────────────────────────────────────────────────────
const SEO_TABS = [
  { id: "general",   label: "General SEO",      icon: Globe },
  { id: "property",  label: "Property SEO",     icon: Building2 },
  { id: "sitemap",   label: "Sitemap",           icon: Map },
  { id: "robots",    label: "Robots.txt",        icon: Shield },
  { id: "schema",    label: "Schema",            icon: Code2 },
  { id: "redirects", label: "Redirects",         icon: Repeat },
  { id: "broken",    label: "Broken Links",      icon: Link },
  { id: "analytics", label: "Analytics",         icon: BarChart2 },
  { id: "ai",        label: "AI Generator",      icon: Brain },
];

type SeoTab = typeof SEO_TABS[number]["id"];

// re-export Building2 usage (needed inside this file)
import { Building2 } from "lucide-react";

export function SEOSection() {
  const [tab, setTab] = useState<SeoTab>("general");

  const STAT_CARDS = [
    { icon: Globe,         label: "الصفحات المؤرشفة",       value: "247",  sub: "+12 هذا الأسبوع",   color: "#2563EB" },
    { icon: AlertCircle,   label: "عقارات بدون SEO",        value: "8",    sub: "تحتاج اهتمام فوري", color: "#EF4444", warn: true },
    { icon: AlertTriangle, label: "مشاكل SEO",              value: "14",   sub: "4 حرجة",             color: "#F59E0B", warn: true },
    { icon: Zap,           label: "سرعة الموقع",            value: "92",   sub: "PageSpeed Score",    color: "#10B981" },
    { icon: Activity,      label: "Core Web Vitals",        value: "87",   sub: "Good",               color: "#6366F1" },
    { icon: TrendingUp,    label: "أكثر صفحة زيارة",       value: "4,521",sub: "الصفحة الرئيسية",   color: "#8B5CF6" },
  ];

  const TAB_CONTENT: Record<SeoTab, React.ReactNode> = {
    general:   <GeneralSeoTab />,
    property:  <PropertySeoTab />,
    sitemap:   <SitemapTab />,
    robots:    <RobotsTab />,
    schema:    <SchemaTab />,
    redirects: <RedirectTab />,
    broken:    <BrokenLinksTab />,
    analytics: <AnalyticsTab />,
    ai:        <AiSeoTab />,
  };

  return (
    <div className="space-y-5">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_CARDS.map((c, i) => <SeoCard key={i} {...c} />)}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto border-b border-gray-100">
          <div className="flex min-w-max">
            {SEO_TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id as SeoTab)}
                  className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold transition-all border-b-2 whitespace-nowrap"
                  style={active
                    ? { color: ACCENT, borderColor: ACCENT, backgroundColor: ACCENT_LIGHT + "60" }
                    : { color: "#94A3B8", borderColor: "transparent" }}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-5">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}>
              {TAB_CONTENT[tab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
