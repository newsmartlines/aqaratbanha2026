import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "wouter";
import {
  ArrowRight, CheckCircle, Save, Upload, Trash2, MapPin, Phone,
  MessageCircle, Image as ImageIcon, Star, AlertCircle, Home,
  Building2, Store, Trees, Wifi, Wind, Car, Dumbbell,
  Shield, Waves, Coffee, Sun, Zap, Droplets, Navigation, PawPrint,
  Plus, ToggleLeft, ToggleRight, X, LogOut, LayoutDashboard,
  Heart, Package, Settings, Bell, Menu, ChevronRight,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import logoColor from "@assets/rgb_1778457941418.png";
import { PROPERTIES } from "@/data/properties";

const DEAL_TYPES = ["للبيع", "للإيجار"];

const CATEGORIES = [
  "شقة", "فيلا", "دوبلكس", "بنتهاوس", "استوديو", "استراحة",
  "محل تجاري", "مكتب", "مقر إداري", "عيادة",
  "أرض سكنية", "أرض تجارية", "أرض زراعية", "عمارة", "كومباوند",
];

const AREAS = [
  "الفلل", "الزهور", "المطرية", "البساتين", "النزهة",
  "الكورنيش", "المنشية", "وسط البلد", "شبرا", "الشوربجي",
];

const AMENITIES = [
  { id: "wifi",      label: "إنترنت فايبر",     icon: Wifi },
  { id: "ac",        label: "تكييف مركزي",      icon: Wind },
  { id: "parking",   label: "جراج / موقف",      icon: Car },
  { id: "gym",       label: "جيم",              icon: Dumbbell },
  { id: "security",  label: "حراسة 24/7",       icon: Shield },
  { id: "pool",      label: "حمام سباحة",       icon: Waves },
  { id: "cafe",      label: "كافيه",            icon: Coffee },
  { id: "pets",      label: "يسمح بالحيوانات", icon: PawPrint },
  { id: "solar",     label: "طاقة شمسية",       icon: Sun },
  { id: "generator", label: "جنريتور",          icon: Zap },
  { id: "water",     label: "خزان مياه",        icon: Droplets },
  { id: "elevator",  label: "مصعد",             icon: Navigation },
  { id: "balcony",   label: "بلكونة",           icon: Home },
  { id: "garden",    label: "حديقة خاصة",       icon: Trees },
];

const TABS = [
  { id: "info",     label: "البيانات الأساسية", icon: Building2 },
  { id: "photos",   label: "الصور",              icon: ImageIcon },
  { id: "location", label: "الموقع",             icon: MapPin },
  { id: "contact",  label: "التواصل",            icon: Phone },
] as const;

type TabId       = typeof TABS[number]["id"];
type ContactMode = "phone" | "whatsapp" | "both";

// ─── Map ──────────────────────────────────────────────────────────────────────
function LeafletMap({ onPick }: { onPick: (coords: string) => void }) {
  const ref    = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    import("leaflet").then(mod => {
      const L = mod.default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const map    = L.map(ref.current!).setView([30.4634, 31.1833], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      const marker = L.marker([30.4634, 31.1833], { draggable: true }).addTo(map);
      marker.on("dragend", (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        onPick(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      });
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onPick(`${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
      });
      mapRef.current = map;
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  return (
    <div>
      <div ref={ref} className="w-full rounded-xl border border-gray-200 overflow-hidden" style={{ height: 320 }} />
      <p className="text-xs text-gray-400 text-center mt-2">اضغط على الخريطة أو اسحب الدبوس لتحديد الموقع</p>
    </div>
  );
}

// ─── Photo Grid ───────────────────────────────────────────────────────────────
function PhotoGrid({ images, onAdd, onRemove, onSetMain }: {
  images: string[];
  onAdd: (srcs: string[]) => void;
  onRemove: (i: number) => void;
  onSetMain: (i: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const reads: string[] = [];
    let done = 0;
    if (!files.length) return;
    files.forEach((f, idx) => {
      const r = new FileReader();
      r.onload = ev => { reads[idx] = ev.target!.result as string; if (++done === files.length) onAdd(reads); };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{images.length} صورة مرفوعة</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 bg-[#1EBFD5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#17a8bd] transition-colors"
        >
          <Upload className="w-4 h-4" /> رفع صور
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handle} />
      </div>

      {images.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl py-14 flex flex-col items-center gap-3 cursor-pointer hover:border-[#1EBFD5]/40 hover:bg-gray-50 transition-all"
        >
          <ImageIcon className="w-10 h-10 text-gray-300" />
          <p className="font-medium text-gray-400 text-sm">اضغط لرفع صور العقار</p>
          <p className="text-xs text-gray-300">PNG · JPG · WEBP · حتى 20 صورة</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <motion.div
              key={i} layout
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 cursor-pointer"
              onClick={() => onSetMain(i)}
            >
              <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {i === 0 && (
                <span className="absolute top-2 right-2 bg-[#1EBFD5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  رئيسية
                </span>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {i !== 0 && (
                  <button onClick={e => { e.stopPropagation(); onSetMain(i); }}
                    className="w-7 h-7 bg-[#1EBFD5] rounded-full flex items-center justify-center text-white text-[10px]" title="رئيسية">★</button>
                )}
                <button onClick={e => { e.stopPropagation(); onRemove(i); }}
                  className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white" title="حذف">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
          <motion.div whileHover={{ scale: 1.02 }}
            onClick={() => inputRef.current?.click()}
            className="aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#1EBFD5]/40 hover:bg-gray-50 transition-all">
            <Plus className="w-5 h-5 text-gray-300" />
            <span className="text-xs text-gray-300">إضافة</span>
          </motion.div>
        </div>
      )}

      <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3.5 border border-blue-100">
        <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-600 leading-relaxed">
          الصور الواضحة تزيد المشاهدات حتى 70٪. اضغط على أي صورة لجعلها رئيسية.
        </p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
        {label} {required && <span className="text-[#1EBFD5]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls  = "w-full py-2.5 px-3.5 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#1EBFD5]/60 focus:bg-white transition-all placeholder:text-gray-400";
const selectCls = inputCls + " appearance-none cursor-pointer";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EditListingPage() {
  const params    = useParams<{ id: string }>();
  const [, navigate]      = useLocation();
  const [tab, setTab]     = useState<TabId>("info");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  const property = PROPERTIES.find(p => p.id === Number(params.id)) ?? PROPERTIES[0];

  const [title,       setTitle]       = useState(property.title);
  const [dealType,    setDealType]    = useState(property.type);
  const [category,    setCategory]    = useState(property.category);
  const [area,        setArea]        = useState(property.area);
  const [price,       setPrice]       = useState(String(property.price));
  const [beds,        setBeds]        = useState(String(property.beds));
  const [baths,       setBaths]       = useState(String(property.baths));
  const [size,        setSize]        = useState(String(property.size));
  const [floor,       setFloor]       = useState(String(property.floor ?? ""));
  const [totalFloors, setTotalFloors] = useState(String(property.totalFloors ?? ""));
  const [yearBuilt,   setYearBuilt]   = useState(String(property.yearBuilt));
  const [description, setDescription] = useState(property.description);
  const [amenities,   setAmenities]   = useState<string[]>(property.amenities);
  const [featured,    setFeatured]    = useState(property.featured);
  const [active,      setActive]      = useState(true);
  const [images,      setImages]      = useState<string[]>(property.images.length ? property.images : [property.image]);
  const [address,     setAddress]     = useState(property.address);
  const [mapCoords,   setMapCoords]   = useState("");
  const [contactMode, setContactMode] = useState<ContactMode>("both");
  const [phone,       setPhone]       = useState(property.agent.phone.replace("+20", ""));
  const [whatsapp,    setWhatsapp]    = useState(property.agent.whatsapp.replace("+20", ""));

  const toggleAmenity = (label: string) =>
    setAmenities(prev => prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]);

  const addImages  = useCallback((srcs: string[]) => setImages(prev => [...prev, ...srcs]), []);
  const removeImage = useCallback((i: number)     => setImages(prev => prev.filter((_, idx) => idx !== i)), []);
  const setMain    = useCallback((i: number)      => setImages(prev => {
    const n = [...prev]; [n[0], n[i]] = [n[i], n[0]]; return n;
  }), []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => navigate("/dashboard"), 1200); }, 1000);
  };

  const NAV = [
    { id: "overview",  label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "listings",  label: "إعلاناتي",     icon: Building2 },
    { id: "favorites", label: "المفضلة",       icon: Heart },
    { id: "messages",  label: "الرسائل",       icon: MessageCircle },
    { id: "plans",     label: "باقتي",         icon: Package },
    { id: "settings",  label: "الإعدادات",     icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`w-60 bg-white border-l border-gray-100 flex flex-col fixed h-full z-30 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>

        <div className="px-5 py-4 border-b border-gray-100">
          <img src={logoColor} alt="عقارات بنها" className="h-7 w-auto" />
        </div>

        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1EBFD5] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">أ</div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">أحمد محمد</p>
            <p className="text-[11px] text-gray-400">المسيّر</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { navigate("/dashboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${item.id === "listings"
                  ? "bg-[#EBF9FB] text-[#1EBFD5]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <item.icon style={{ width: 17, height: 17 }} />
              {item.label}
              {item.id === "listings" && <ChevronRight className="w-3.5 h-3.5 mr-auto text-[#1EBFD5]" />}
            </button>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut style={{ width: 17, height: 17 }} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 lg:mr-60 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500">
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#1EBFD5] font-medium text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:block">إعلاناتي</span>
            </button>
            <span className="text-gray-300 hidden sm:block">/</span>
            <span className="text-gray-700 font-semibold text-sm hidden sm:block truncate max-w-48">{title || "تعديل الإعلان"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActive(p => !p)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                active ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-100 text-gray-400 border-gray-200"
              }`}
            >
              {active
                ? <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />نشط</>
                : <><span className="w-1.5 h-1.5 rounded-full bg-gray-300" />موقوف</>}
            </button>

            <button className="relative w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-500">
              <Bell style={{ width: 17, height: 17 }} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                saved   ? "bg-emerald-500 text-white" :
                saving  ? "bg-gray-200 text-gray-400 cursor-not-allowed" :
                          "bg-[#1EBFD5] text-white hover:bg-[#17a8bd]"
              }`}
            >
              {saved   ? <><CheckCircle className="w-4 h-4" /> تم الحفظ</> :
               saving  ? <><Save className="w-4 h-4 animate-spin" /> جار الحفظ...</> :
                         <><Save className="w-4 h-4" /> حفظ التغييرات</>}
            </motion.button>
          </div>
        </header>

        {/* PAGE BODY */}
        <div className="flex-1 p-5 lg:p-7 max-w-4xl mx-auto w-full">

          {/* Property mini card */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3 items-center mb-5">
            <img src={images[0] ?? property.image} alt={title} className="w-16 h-11 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{title || "بدون عنوان"}</p>
              <p className="text-xs text-gray-400 mt-0.5">{area} · <span className="text-[#1EBFD5] font-medium">{Number(price || 0).toLocaleString("ar")} ج.م</span></p>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
              {active ? "نشط" : "موقوف"}
            </span>
          </div>

          {/* Horizontal Tabs */}
          <div className="bg-white rounded-xl border border-gray-100 mb-5 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px flex-1 justify-center ${
                    tab === t.id
                      ? "border-[#1EBFD5] text-[#1EBFD5] bg-[#EBF9FB]/40"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 ${
                    tab === t.id ? "bg-[#1EBFD5] text-white" : "bg-gray-100 text-gray-400"
                  }`}>{i + 1}</span>
                  <t.icon style={{ width: 15, height: 15 }} />
                  <span className="hidden sm:block">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">

            {/* ══ INFO ══ */}
            {tab === "info" && (
              <motion.div key="info"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                {/* Main info */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm">البيانات الأساسية</h3>

                  <Field label="عنوان الإعلان" required>
                    <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls}
                      placeholder="مثال: شقة فاخرة في منطقة الفلل" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="نوع الصفقة" required>
                      <div className="flex rounded-lg overflow-hidden border border-gray-200">
                        {DEAL_TYPES.map(dt => (
                          <button key={dt} type="button" onClick={() => setDealType(dt as any)}
                            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                              dealType === dt ? "bg-[#1EBFD5] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}>
                            {dt}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="التصنيف" required>
                      <select value={category} onChange={e => setCategory(e.target.value)} className={selectCls}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="المنطقة / الحي" required>
                      <select value={area} onChange={e => setArea(e.target.value)} className={selectCls}>
                        {AREAS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </Field>

                    <Field label="السعر (ج.م)" required>
                      <div className="relative">
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                          className={inputCls + " pl-14"} placeholder="0" />
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">ج.م</span>
                      </div>
                    </Field>
                  </div>
                </div>

                {/* Specs */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm">مواصفات العقار</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "غرف النوم",     val: beds,        set: setBeds,        ph: "3" },
                      { label: "الحمامات",       val: baths,       set: setBaths,       ph: "2" },
                      { label: "المساحة (م²)",   val: size,        set: setSize,        ph: "150" },
                      { label: "الطابق",         val: floor,       set: setFloor,       ph: "2" },
                      { label: "إجمالي الطوابق", val: totalFloors, set: setTotalFloors, ph: "8" },
                      { label: "سنة البناء",     val: yearBuilt,   set: setYearBuilt,   ph: "2020" },
                    ].map(f => (
                      <Field key={f.label} label={f.label}>
                        <input type="number" value={f.val} onChange={e => f.set(e.target.value)}
                          className={inputCls + " text-center"} placeholder={f.ph} />
                      </Field>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">وصف العقار</h3>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    rows={5} className={inputCls + " resize-none"} placeholder="اكتب وصفاً تفصيلياً..." />
                  <p className="text-xs text-gray-400 text-left">{description.length} / 2000 حرف</p>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm">المميزات والخدمات</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {AMENITIES.map(a => (
                      <button key={a.id} type="button" onClick={() => toggleAmenity(a.label)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                          amenities.includes(a.label)
                            ? "bg-[#EBF9FB] border-[#1EBFD5]/40 text-[#1EBFD5]"
                            : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"
                        }`}>
                        <a.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">إعلان مميز</p>
                      <p className="text-xs text-gray-400">يظهر في الصدارة ويحصل على مشاهدات أكثر</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setFeatured(p => !p)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${featured ? "bg-amber-400" : "bg-gray-200"}`}>
                    <motion.span
                      animate={{ right: featured ? 4 : "auto", left: featured ? "auto" : 4 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    />
                  </button>
                </div>

                <div className="flex justify-end">
                  <button onClick={() => setTab("photos")}
                    className="bg-[#1EBFD5] text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-[#17a8bd] transition-colors">
                    التالي: الصور <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ══ PHOTOS ══ */}
            {tab === "photos" && (
              <motion.div key="photos"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-4">صور العقار</h3>
                  <PhotoGrid images={images} onAdd={addImages} onRemove={removeImage} onSetMain={setMain} />
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setTab("info")}
                    className="px-4 py-2.5 rounded-lg font-medium text-sm text-gray-500 hover:bg-white border border-gray-200 transition-colors">
                    السابق
                  </button>
                  <button onClick={() => setTab("location")}
                    className="bg-[#1EBFD5] text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-[#17a8bd] transition-colors">
                    التالي: الموقع <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ══ LOCATION ══ */}
            {tab === "location" && (
              <motion.div key="location"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm">موقع العقار</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="المنطقة / الحي" required>
                      <select value={area} onChange={e => setArea(e.target.value)} className={selectCls}>
                        {AREAS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </Field>
                    <Field label="العنوان التفصيلي">
                      <input value={address} onChange={e => setAddress(e.target.value)} className={inputCls}
                        placeholder="مثال: شارع الجمهورية، بجوار قاعة سونيستا" />
                    </Field>
                  </div>
                  <LeafletMap onPick={setMapCoords} />
                  {mapCoords && (
                    <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-4 py-2.5 border border-emerald-100">
                      <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <p className="text-xs font-medium text-emerald-700" dir="ltr">{mapCoords}</p>
                      <span className="text-xs text-emerald-500 font-medium">✓ تم تحديد الموقع</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setTab("photos")}
                    className="px-4 py-2.5 rounded-lg font-medium text-sm text-gray-500 hover:bg-white border border-gray-200 transition-colors">السابق</button>
                  <button onClick={() => setTab("contact")}
                    className="bg-[#1EBFD5] text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-1.5 hover:bg-[#17a8bd] transition-colors">
                    التالي: التواصل <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ══ CONTACT ══ */}
            {tab === "contact" && (
              <motion.div key="contact"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
                  <h3 className="font-semibold text-gray-900 text-sm">وسائل التواصل</h3>

                  {/* Mode selector */}
                  <div>
                    <p className="text-xs text-gray-500 mb-3">اختر طريقة التواصل مع المهتمين</p>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { id: "phone",    label: "هاتف فقط",   icon: Phone,         active: "bg-blue-50 border-blue-300 text-blue-600" },
                        { id: "whatsapp", label: "واتساب فقط", icon: MessageCircle, active: "bg-emerald-50 border-emerald-300 text-emerald-600" },
                        { id: "both",     label: "كلاهما",     icon: CheckCircle,   active: "bg-[#EBF9FB] border-[#1EBFD5] text-[#1EBFD5]" },
                      ] as { id: ContactMode; label: string; icon: any; active: string }[]).map(mode => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setContactMode(mode.id)}
                          className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
                            contactMode === mode.id ? mode.active : "border-gray-200 text-gray-400 hover:border-gray-300 bg-gray-50"
                          }`}
                        >
                          <mode.icon className="w-5 h-5" />
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {(contactMode === "phone" || contactMode === "both") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Field label="رقم الهاتف" required>
                          <div className="flex gap-2">
                            <span className="flex items-center px-3.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-600 flex-shrink-0">+20</span>
                            <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} placeholder="1012345678" dir="ltr" type="tel" />
                          </div>
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(contactMode === "whatsapp" || contactMode === "both") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Field label="رقم الواتساب" required>
                          <div className="flex gap-2">
                            <span className="flex items-center px-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-medium text-emerald-600 flex-shrink-0">+20</span>
                            <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className={inputCls} placeholder="1012345678" dir="ltr" type="tel" />
                          </div>
                        </Field>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Preview */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                    <p className="text-xs font-medium text-gray-500 mb-3">معاينة بيانات التواصل</p>
                    {(contactMode === "phone" || contactMode === "both") && (
                      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">هاتف</p>
                          <p className="font-semibold text-sm text-gray-900" dir="ltr">+20{phone || "xxxxxxxxxx"}</p>
                        </div>
                      </div>
                    )}
                    {(contactMode === "whatsapp" || contactMode === "both") && (
                      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400">واتساب</p>
                          <p className="font-semibold text-sm text-gray-900" dir="ltr">+20{whatsapp || "xxxxxxxxxx"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final save */}
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">جاهز للحفظ؟</p>
                    <p className="text-xs text-gray-400 mt-0.5">راجع كل البيانات قبل الحفظ النهائي</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => navigate("/dashboard")}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-medium text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                      إلغاء
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={saving || saved}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        saved   ? "bg-emerald-500 text-white" :
                        saving  ? "bg-gray-200 text-gray-400 cursor-not-allowed" :
                                  "bg-[#1EBFD5] text-white hover:bg-[#17a8bd]"
                      }`}>
                      {saved   ? <><CheckCircle className="w-4 h-4" /> تم الحفظ</> :
                       saving  ? "جار الحفظ..." :
                                 <><Save className="w-4 h-4" /> حفظ الإعلان</>}
                    </motion.button>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button onClick={() => setTab("location")}
                    className="px-4 py-2.5 rounded-lg font-medium text-sm text-gray-500 border border-gray-200 hover:bg-white transition-colors">السابق</button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
