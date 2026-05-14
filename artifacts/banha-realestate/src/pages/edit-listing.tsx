import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "wouter";
import {
  ArrowRight, CheckCircle, Save, Upload, Trash2, MapPin, Phone,
  MessageCircle, Image as ImageIcon, Star, AlertCircle, Home,
  Building2, Store, Trees, Briefcase, Wifi, Wind, Car, Dumbbell,
  Shield, Waves, Coffee, Sun, Zap, Droplets, Navigation, PawPrint,
  Plus, Eye, ToggleLeft, ToggleRight, X, LogOut, LayoutDashboard,
  Heart, Package, Settings, Bell, Search, Menu, ChevronRight,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import logoColor from "@assets/rgb_1778457941418.png";
import { PROPERTIES } from "@/data/properties";

// ─── Static data ──────────────────────────────────────────────────────────────
const DEAL_TYPES = ["للبيع", "للإيجار"];

const CATEGORIES = [
  "شقة", "فيلا", "دوبلكس", "بنتهاوس", "استوديو", "استراحة",
  "محل تجاري", "مكتب", "مقر إداري", "عيادة", "صيدلية",
  "أرض سكنية", "أرض تجارية", "أرض زراعية", "عمارة", "كومباوند",
];

const AREAS = [
  "الفلل", "الزهور", "المطرية", "البساتين", "النزهة",
  "الكورنيش", "المنشية", "وسط البلد", "شبرا", "الشوربجي",
];

const AMENITIES = [
  { id: "wifi",      label: "إنترنت فايبر",      icon: Wifi },
  { id: "ac",        label: "تكييف مركزي",       icon: Wind },
  { id: "parking",   label: "جراج / موقف",       icon: Car },
  { id: "gym",       label: "جيم",               icon: Dumbbell },
  { id: "security",  label: "حراسة 24/7",        icon: Shield },
  { id: "pool",      label: "حمام سباحة",        icon: Waves },
  { id: "cafe",      label: "كافيه",             icon: Coffee },
  { id: "pets",      label: "يسمح بالحيوانات",  icon: PawPrint },
  { id: "solar",     label: "طاقة شمسية",        icon: Sun },
  { id: "generator", label: "جنريتور",           icon: Zap },
  { id: "water",     label: "خزان مياه",         icon: Droplets },
  { id: "elevator",  label: "مصعد",              icon: Navigation },
  { id: "balcony",   label: "بلكونة",            icon: Home },
  { id: "garden",    label: "حديقة خاصة",        icon: Trees },
];

const SECTIONS = [
  { id: "info",     label: "البيانات الأساسية", icon: Building2 },
  { id: "photos",   label: "الصور",              icon: ImageIcon },
  { id: "location", label: "الموقع",             icon: MapPin },
  { id: "contact",  label: "التواصل",            icon: Phone },
];

type ContactMode = "phone" | "whatsapp" | "both";
type SectionId = "info" | "photos" | "location" | "contact";

// ─── Map component ─────────────────────────────────────────────────────────────
function LeafletMap({ address, onPick }: { address: string; onPick: (coords: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(ref.current!).setView([30.4634, 31.1833], 14);
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
      markerRef.current = marker;
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  return (
    <div className="space-y-3">
      <div ref={ref} className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: 360 }} />
      <p className="text-xs text-gray-400 text-center font-medium">
        اضغط على الخريطة أو اسحب الدبوس لتحديد الموقع بدقة
      </p>
    </div>
  );
}

// ─── Image Grid ────────────────────────────────────────────────────────────────
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
      r.onload = (ev) => { reads[idx] = ev.target!.result as string; if (++done === files.length) onAdd(reads); };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-gray-900 text-sm">{images.length} صورة مرفوعة</p>
          <p className="text-xs text-gray-400 mt-0.5">الصورة الأولى هي الصورة الرئيسية للإعلان</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white px-4 py-2.5 rounded-xl text-sm font-black shadow-sm"
        >
          <Upload className="w-4 h-4" /> رفع صور
        </motion.button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handle} />
      </div>

      {images.length === 0 ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-2xl py-16 flex flex-col items-center gap-3 cursor-pointer hover:border-[#1EBFD5]/40 hover:bg-[#F4F7FD] transition-all"
        >
          <ImageIcon className="w-12 h-12 text-gray-200" />
          <p className="font-bold text-gray-400">اضغط لرفع صور العقار</p>
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

              {/* Main badge */}
              {i === 0 && (
                <span className="absolute top-2 right-2 bg-[#1EBFD5] text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow">
                  رئيسية
                </span>
              )}

              {/* Number */}
              <span className="absolute bottom-2 left-2 bg-black/40 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {i + 1}
              </span>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSetMain(i); }}
                    className="w-8 h-8 bg-[#1EBFD5] rounded-full flex items-center justify-center text-white text-[10px] font-black"
                    title="تعيين كرئيسية"
                  >
                    ★
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                  className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add more */}
          <motion.div
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => inputRef.current?.click()}
            className="aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#1EBFD5]/40 hover:bg-[#F4F7FD] transition-all"
          >
            <Plus className="w-6 h-6 text-gray-300" />
            <span className="text-xs font-bold text-gray-300">إضافة</span>
          </motion.div>
        </div>
      )}

      <div className="flex items-start gap-2.5 bg-blue-50 rounded-xl p-4 border border-blue-100">
        <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-600 font-medium leading-relaxed">
          الصور الواضحة وعالية الجودة تزيد المشاهدات بنسبة تصل إلى 70٪. اضغط على أي صورة لجعلها رئيسية.
        </p>
      </div>
    </div>
  );
}

// ─── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black text-gray-500 flex items-center gap-1">
        {label} {required && <span className="text-[#1EBFD5]">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold text-gray-900 outline-none focus:border-[#1EBFD5]/60 focus:bg-white transition-all placeholder:text-gray-300";
const selectCls = inputCls + " appearance-none";

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [activeSection, setActiveSection] = useState<SectionId>("info");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const property = PROPERTIES.find(p => p.id === Number(params.id)) ?? PROPERTIES[0];

  // ── Form state ────────────────────────────────────────────────────────────────
  const [title, setTitle]           = useState(property.title);
  const [dealType, setDealType]     = useState(property.type);
  const [category, setCategory]     = useState(property.category);
  const [area, setArea]             = useState(property.area);
  const [price, setPrice]           = useState(String(property.price));
  const [beds, setBeds]             = useState(String(property.beds));
  const [baths, setBaths]           = useState(String(property.baths));
  const [size, setSize]             = useState(String(property.size));
  const [floor, setFloor]           = useState(String(property.floor ?? ""));
  const [totalFloors, setTotalFloors] = useState(String(property.totalFloors ?? ""));
  const [yearBuilt, setYearBuilt]   = useState(String(property.yearBuilt));
  const [description, setDescription] = useState(property.description);
  const [amenities, setAmenities]   = useState<string[]>(property.amenities);
  const [featured, setFeatured]     = useState(property.featured);
  const [active, setActive]         = useState(true);

  const [images, setImages]         = useState<string[]>(property.images.length ? property.images : [property.image]);
  const [address, setAddress]       = useState(property.address);
  const [mapCoords, setMapCoords]   = useState("");

  const [contactMode, setContactMode] = useState<ContactMode>("both");
  const [phone, setPhone]           = useState(property.agent.phone.replace("+20", ""));
  const [whatsapp, setWhatsapp]     = useState(property.agent.whatsapp.replace("+20", ""));

  const toggleAmenity = (label: string) =>
    setAmenities(prev => prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]);

  const addImages = useCallback((srcs: string[]) => setImages(prev => [...prev, ...srcs]), []);
  const removeImage = useCallback((i: number) => setImages(prev => prev.filter((_, idx) => idx !== i)), []);
  const setMain = useCallback((i: number) => setImages(prev => {
    const n = [...prev];
    [n[0], n[i]] = [n[i], n[0]];
    return n;
  }), []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    }, 1000);
  };

  // Sidebar nav items
  const NAV = [
    { id: "overview", label: "لوحة التحكم",  icon: LayoutDashboard },
    { id: "listings", label: "إعلاناتي",      icon: Building2 },
    { id: "favorites",label: "المفضلة",        icon: Heart },
    { id: "messages", label: "الرسائل",        icon: MessageCircle },
    { id: "plans",    label: "باقتي",          icon: Package },
    { id: "settings", label: "الإعدادات",      icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FD] flex" dir="rtl">

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <aside className={`w-64 bg-white border-l border-gray-100 flex flex-col fixed h-full z-30 shadow-lg transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="px-6 py-5 border-b border-gray-50">
          <img src={logoColor} alt="عقارات بنها" className="h-8 w-auto" />
        </div>

        <div className="mx-4 mt-4 mb-2 p-3 bg-gradient-to-l from-[#1EBFD5]/10 to-[#123C79]/10 rounded-2xl flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1EBFD5] to-[#123C79] flex items-center justify-center text-white font-black text-sm">أ</div>
            <span className="absolute bottom-0 left-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm">أحمد محمد</p>
            <p className="text-[11px] text-gray-400 font-medium">المسيّر</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { navigate(item.id === "overview" ? "/dashboard" : "/dashboard"); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                ${item.id === "listings"
                  ? "bg-gradient-to-l from-[#1EBFD5]/15 to-[#123C79]/10 text-[#123C79]"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"}`}
            >
              <span className="flex items-center gap-3">
                <item.icon style={{ width: 18, height: 18 }} className={item.id === "listings" ? "text-[#1EBFD5]" : ""} />
                {item.label}
              </span>
              {item.id === "listings" && <ChevronRight className="w-4 h-4 text-[#1EBFD5] opacity-60" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-50">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut style={{ width: 18, height: 18 }} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 lg:mr-64 flex flex-col min-h-screen">

        {/* ── HEADER ── */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-500 hover:text-[#1EBFD5] font-bold text-sm transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:block">إعلاناتي</span>
            </motion.button>
            <span className="text-gray-200 hidden sm:block">/</span>
            <span className="text-gray-700 font-black text-sm hidden sm:block line-clamp-1 max-w-48">
              تعديل الإعلان
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Active toggle */}
            <button
              onClick={() => setActive(p => !p)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"
              }`}
            >
              {active ? <><span className="w-2 h-2 rounded-full bg-green-500" />نشط</> : <><span className="w-2 h-2 rounded-full bg-gray-300" />موقوف</>}
            </button>

            <button className="relative w-9 h-9 rounded-xl bg-[#F4F7FD] flex items-center justify-center text-gray-400">
              <Bell style={{ width: 18, height: 18 }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving || saved}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm shadow-sm transition-all ${
                saved   ? "bg-green-500 text-white" :
                saving  ? "bg-gray-200 text-gray-400 cursor-not-allowed" :
                          "bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white"
              }`}
            >
              {saved   ? <><CheckCircle className="w-4 h-4" /> تم الحفظ</> :
               saving  ? <><Save className="w-4 h-4 animate-spin" /> جار الحفظ...</> :
                         <><Save className="w-4 h-4" /> حفظ التغييرات</>}
            </motion.button>
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-8">

          {/* Left: Section nav */}
          <aside className="w-full lg:w-56 flex-shrink-0">
            {/* Property thumbnail card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
              <div className="h-28 relative">
                <img src={images[0] ?? property.image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-2 right-2 text-white text-xs font-black line-clamp-1">{title || "بدون عنوان"}</p>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-[#1EBFD5] font-black text-xs">{Number(price || 0).toLocaleString("ar")} ج.م</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                  {active ? "نشط" : "موقوف"}
                </span>
              </div>
            </div>

            {/* Nav sections */}
            <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => setActiveSection(s.id as SectionId)}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 w-full ${
                    activeSection === s.id
                      ? "bg-gradient-to-l from-[#1EBFD5]/15 to-[#123C79]/10 text-[#123C79] shadow-sm"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                    activeSection === s.id ? "bg-[#1EBFD5] text-white" : "bg-gray-100 text-gray-400"
                  }`}>{i + 1}</span>
                  <s.icon style={{ width: 16, height: 16 }} className={activeSection === s.id ? "text-[#1EBFD5]" : ""} />
                  <span className="hidden lg:block">{s.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Save reminder (desktop) */}
            <div className="hidden lg:block mt-4 bg-amber-50 rounded-2xl border border-amber-100 p-4">
              <p className="text-xs font-black text-amber-700 mb-1">تذكير</p>
              <p className="text-xs text-amber-600 font-medium leading-relaxed">
                لا تنسَ حفظ التغييرات قبل المغادرة.
              </p>
            </div>
          </aside>

          {/* Right: Section content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {/* ══ BASIC INFO ══ */}
              {activeSection === "info" && (
                <motion.div key="info"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  {/* Card: Main */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                    <h2 className="font-black text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#1EBFD5]" /> البيانات الأساسية
                    </h2>

                    <Field label="عنوان الإعلان" required>
                      <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="مثال: شقة فاخرة في منطقة الفلل" />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="نوع الصفقة" required>
                        <div className="flex rounded-xl overflow-hidden border border-gray-100">
                          {DEAL_TYPES.map(dt => (
                            <button key={dt} type="button" onClick={() => setDealType(dt as any)}
                              className={`flex-1 py-3 text-sm font-bold transition-colors ${dealType === dt ? "bg-[#1EBFD5] text-white" : "bg-[#F4F7FD] text-gray-500 hover:bg-gray-100"}`}>
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
                          <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputCls + " pl-14"} placeholder="0" />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300">ج.م</span>
                        </div>
                      </Field>
                    </div>
                  </div>

                  {/* Card: Specs */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                    <h3 className="font-black text-gray-800 text-sm">مواصفات العقار</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: "غرف النوم",    val: beds,       set: setBeds,       ph: "3" },
                        { label: "الحمامات",      val: baths,      set: setBaths,      ph: "2" },
                        { label: "المساحة (م²)",  val: size,       set: setSize,       ph: "150" },
                        { label: "الطابق",        val: floor,      set: setFloor,      ph: "2" },
                        { label: "إجمالي الطوابق",val: totalFloors,set: setTotalFloors,ph: "8" },
                        { label: "سنة البناء",    val: yearBuilt,  set: setYearBuilt,  ph: "2020" },
                      ].map(f => (
                        <Field key={f.label} label={f.label}>
                          <input
                            type="number"
                            value={f.val}
                            onChange={e => f.set(e.target.value)}
                            className={inputCls + " text-center"}
                            placeholder={f.ph}
                          />
                        </Field>
                      ))}
                    </div>
                  </div>

                  {/* Card: Description */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="font-black text-gray-800 text-sm">وصف العقار</h3>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={6}
                      className={inputCls + " resize-none"}
                      placeholder="اكتب وصفاً تفصيلياً يجذب المهتمين..."
                    />
                    <p className="text-xs text-gray-300 text-left">{description.length} / 2000 حرف</p>
                  </div>

                  {/* Card: Amenities */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h3 className="font-black text-gray-800 text-sm">المميزات والخدمات</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {AMENITIES.map(a => (
                        <button key={a.id} type="button" onClick={() => toggleAmenity(a.label)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                            amenities.includes(a.label)
                              ? "bg-[#1EBFD5]/10 border-[#1EBFD5]/40 text-[#1EBFD5]"
                              : "bg-gray-50 border-transparent text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          <a.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card: Featured */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">إعلان مميز</p>
                        <p className="text-xs text-gray-400 font-medium">يظهر في الصدارة ويحصل على مشاهدات أكثر</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setFeatured(p => !p)}
                      className={`w-14 h-7 rounded-full transition-colors relative flex-shrink-0 ${featured ? "bg-amber-400" : "bg-gray-200"}`}>
                      <motion.span
                        animate={{ right: featured ? 4 : "auto", left: featured ? "auto" : 4 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setActiveSection("photos")}
                      className="bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-sm">
                      التالي: الصور <ArrowRight className="w-4 h-4 rotate-180" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ══ PHOTOS ══ */}
              {activeSection === "photos" && (
                <motion.div key="photos"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-black text-gray-900 flex items-center gap-2 mb-5">
                      <ImageIcon className="w-5 h-5 text-[#1EBFD5]" /> صور العقار
                    </h2>
                    <PhotoGrid images={images} onAdd={addImages} onRemove={removeImage} onSetMain={setMain} />
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => setActiveSection("info")} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-white border border-gray-200 transition-colors">
                      السابق
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setActiveSection("location")}
                      className="bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-sm">
                      التالي: الموقع <ArrowRight className="w-4 h-4 rotate-180" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ══ LOCATION ══ */}
              {activeSection === "location" && (
                <motion.div key="location"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                    <h2 className="font-black text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#1EBFD5]" /> موقع العقار
                    </h2>

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

                    <LeafletMap address={address} onPick={(coords) => setMapCoords(coords)} />

                    {mapCoords && (
                      <div className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2.5 border border-green-100">
                        <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <p className="text-xs font-bold text-green-700" dir="ltr">{mapCoords}</p>
                        <span className="text-xs text-green-500 font-medium">تم تحديد الموقع</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => setActiveSection("photos")} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-white border border-gray-200 transition-colors">
                      السابق
                    </button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setActiveSection("contact")}
                      className="bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-sm">
                      التالي: التواصل <ArrowRight className="w-4 h-4 rotate-180" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ══ CONTACT ══ */}
              {activeSection === "contact" && (
                <motion.div key="contact"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h2 className="font-black text-gray-900 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-[#1EBFD5]" /> وسائل التواصل
                    </h2>

                    {/* Mode selector */}
                    <div>
                      <p className="text-xs font-black text-gray-500 mb-3">اختر طريقة التواصل مع المهتمين</p>
                      <div className="grid grid-cols-3 gap-3">
                        {([
                          { id: "phone",    label: "هاتف فقط",   icon: Phone,          ring: "ring-blue-400",    bg: "bg-blue-50",   text: "text-blue-600" },
                          { id: "whatsapp", label: "واتساب فقط", icon: MessageCircle,  ring: "ring-green-400",   bg: "bg-green-50",  text: "text-green-600" },
                          { id: "both",     label: "كلاهما",     icon: CheckCircle,    ring: "ring-[#1EBFD5]",   bg: "bg-[#1EBFD5]/10", text: "text-[#1EBFD5]" },
                        ] as { id: ContactMode; label: string; icon: any; ring: string; bg: string; text: string }[]).map(mode => (
                          <motion.button
                            key={mode.id}
                            type="button"
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setContactMode(mode.id)}
                            className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                              contactMode === mode.id
                                ? `${mode.bg} ${mode.text} ring-2 ${mode.ring} border-transparent shadow-sm`
                                : "border-gray-100 text-gray-400 hover:border-gray-200 bg-gray-50"
                            }`}
                          >
                            <mode.icon className="w-6 h-6" />
                            {mode.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Phone field */}
                    <AnimatePresence>
                      {(contactMode === "phone" || contactMode === "both") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                        >
                          <Field label="رقم الهاتف" required>
                            <div className="flex gap-2">
                              <span className="flex items-center px-4 bg-blue-50 border border-blue-100 rounded-xl text-sm font-black text-blue-600 flex-shrink-0">
                                +20
                              </span>
                              <input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className={inputCls}
                                placeholder="1012345678"
                                dir="ltr"
                                type="tel"
                              />
                            </div>
                          </Field>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* WhatsApp field */}
                    <AnimatePresence>
                      {(contactMode === "whatsapp" || contactMode === "both") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                        >
                          <Field label="رقم الواتساب" required>
                            <div className="flex gap-2">
                              <span className="flex items-center px-4 bg-green-50 border border-green-100 rounded-xl text-sm font-black text-green-600 flex-shrink-0">
                                +20
                              </span>
                              <input
                                value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value)}
                                className={inputCls}
                                placeholder="1012345678"
                                dir="ltr"
                                type="tel"
                              />
                            </div>
                          </Field>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Preview */}
                    <div className="bg-[#F4F7FD] rounded-2xl p-5 space-y-3">
                      <p className="text-xs font-black text-gray-600 mb-2">معاينة بيانات التواصل</p>
                      {(contactMode === "phone" || contactMode === "both") && (
                        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold">هاتف</p>
                            <p className="font-black text-sm text-gray-900" dir="ltr">+20{phone || "xxxxxxxxxx"}</p>
                          </div>
                        </div>
                      )}
                      {(contactMode === "whatsapp" || contactMode === "both") && (
                        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold">واتساب</p>
                            <p className="font-black text-sm text-gray-900" dir="ltr">+20{whatsapp || "xxxxxxxxxx"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Final save */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="font-black text-gray-900 text-sm">جاهز للحفظ؟</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">راجع كل البيانات قبل الحفظ النهائي</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button onClick={() => navigate("/dashboard")} className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors">
                        إلغاء
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={handleSave}
                        disabled={saving || saved}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-black text-sm shadow-sm transition-all ${
                          saved   ? "bg-green-500 text-white" :
                          saving  ? "bg-gray-200 text-gray-400" :
                                    "bg-gradient-to-l from-[#1EBFD5] to-[#123C79] text-white"
                        }`}
                      >
                        {saved   ? <><CheckCircle className="w-4 h-4" /> تم الحفظ</> :
                         saving  ? "جار الحفظ..." :
                                   <><Save className="w-4 h-4" /> حفظ الإعلان</>}
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button onClick={() => setActiveSection("location")} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-white border border-gray-200 transition-colors">
                      السابق
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
