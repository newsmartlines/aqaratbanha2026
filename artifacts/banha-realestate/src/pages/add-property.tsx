import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Home, Building2, Building, Store, Briefcase, Stethoscope,
  Trees, Layers, MapPin, Maximize2,
  ChevronLeft, ChevronRight, Check, X, Upload, Video,
  DollarSign, Star, Wifi, Wind, Car, Dumbbell, Shield,
  Waves, Coffee, PawPrint, Sun, Zap, Droplets, Package,
  Phone, Eye, Sparkles, Navigation,
} from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";
import "leaflet/dist/leaflet.css";

const STEPS = ["الصفقة", "الفئة", "النوع", "التفاصيل", "السعر والموقع", "المزايا"];

const MAIN_CATEGORIES = [
  { id: "سكني", label: "سكني", icon: <Home className="w-6 h-6" />, desc: "شقق، فيلات، دوبلكس", color: "#1EBFD5" },
  { id: "تجاري", label: "تجاري", icon: <Store className="w-6 h-6" />, desc: "محلات، مراكز تجارية", color: "#8B5CF6" },
  { id: "أراضي", label: "أراضي", icon: <Trees className="w-6 h-6" />, desc: "أراضي سكنية وتجارية", color: "#10B981" },
  { id: "إداري", label: "إداري", icon: <Briefcase className="w-6 h-6" />, desc: "مكاتب ومقرات إدارية", color: "#F59E0B" },
  { id: "طبي", label: "طبي", icon: <Stethoscope className="w-6 h-6" />, desc: "عيادات ومستشفيات", color: "#EF4444" },
  { id: "مباني", label: "مباني", icon: <Building className="w-6 h-6" />, desc: "عمارات ومجمعات", color: "#06B6D4" },
];

const SUB_CATEGORIES: Record<string, { id: string; label: string; icon: React.ReactNode }[]> = {
  سكني: [
    { id: "شقة", label: "شقة", icon: <Building2 className="w-5 h-5" /> },
    { id: "دوبلكس", label: "دوبلكس", icon: <Layers className="w-5 h-5" /> },
    { id: "بنتهاوس", label: "بنتهاوس", icon: <Building className="w-5 h-5" /> },
    { id: "فيلا", label: "فيلا", icon: <Home className="w-5 h-5" /> },
    { id: "استوديو", label: "استوديو", icon: <Home className="w-5 h-5" /> },
    { id: "استراحة", label: "استراحة", icon: <Trees className="w-5 h-5" /> },
  ],
  تجاري: [
    { id: "محل", label: "محل تجاري", icon: <Store className="w-5 h-5" /> },
    { id: "مركز_تجاري", label: "مركز تجاري", icon: <Building2 className="w-5 h-5" /> },
    { id: "معرض", label: "معرض", icon: <Eye className="w-5 h-5" /> },
    { id: "مخزن", label: "مخزن", icon: <Package className="w-5 h-5" /> },
  ],
  أراضي: [
    { id: "أرض_سكنية", label: "أرض سكنية", icon: <Home className="w-5 h-5" /> },
    { id: "أرض_تجارية", label: "أرض تجارية", icon: <Store className="w-5 h-5" /> },
    { id: "أرض_زراعية", label: "أرض زراعية", icon: <Trees className="w-5 h-5" /> },
    { id: "أرض_صناعية", label: "أرض صناعية", icon: <Building className="w-5 h-5" /> },
  ],
  إداري: [
    { id: "مكتب", label: "مكتب", icon: <Briefcase className="w-5 h-5" /> },
    { id: "مقر_إداري", label: "مقر إداري", icon: <Building2 className="w-5 h-5" /> },
  ],
  طبي: [
    { id: "عيادة", label: "عيادة", icon: <Stethoscope className="w-5 h-5" /> },
    { id: "مستشفى", label: "مستشفى", icon: <Building2 className="w-5 h-5" /> },
    { id: "صيدلية", label: "صيدلية", icon: <Package className="w-5 h-5" /> },
  ],
  مباني: [
    { id: "عمارة", label: "عمارة", icon: <Building className="w-5 h-5" /> },
    { id: "مجمع_سكني", label: "مجمع سكني", icon: <Building2 className="w-5 h-5" /> },
    { id: "كومباوند", label: "كومباوند", icon: <Home className="w-5 h-5" /> },
  ],
};

const AMENITIES = [
  { id: "wifi", label: "إنترنت فايبر", icon: <Wifi className="w-4 h-4" /> },
  { id: "ac", label: "تكييف مركزي", icon: <Wind className="w-4 h-4" /> },
  { id: "parking", label: "جراج / موقف", icon: <Car className="w-4 h-4" /> },
  { id: "gym", label: "جيم", icon: <Dumbbell className="w-4 h-4" /> },
  { id: "security", label: "حراسة 24/7", icon: <Shield className="w-4 h-4" /> },
  { id: "pool", label: "حمام سباحة", icon: <Waves className="w-4 h-4" /> },
  { id: "cafe", label: "كافيه", icon: <Coffee className="w-4 h-4" /> },
  { id: "pets", label: "يسمح بالحيوانات", icon: <PawPrint className="w-4 h-4" /> },
  { id: "solar", label: "طاقة شمسية", icon: <Sun className="w-4 h-4" /> },
  { id: "generator", label: "جنريتور", icon: <Zap className="w-4 h-4" /> },
  { id: "water", label: "خزان مياه", icon: <Droplets className="w-4 h-4" /> },
  { id: "elevator", label: "مصعد", icon: <Navigation className="w-4 h-4" /> },
  { id: "balcony", label: "بلكونة", icon: <Navigation className="w-4 h-4" /> },
  { id: "garden", label: "حديقة", icon: <Trees className="w-4 h-4" /> },
  { id: "phone", label: "خط تليفون", icon: <Phone className="w-4 h-4" /> },
  { id: "view", label: "إطلالة مميزة", icon: <Eye className="w-4 h-4" /> },
];

const FINISHING = ["سوبر لوكس", "لوكس", "نصف تشطيب", "هيكل", "مفروش"];
const AREAS = ["الفلل", "الأهرام", "أتريب", "محيط كلية الحقوق", "شارع أبو هشيش", "بطا", "الآثار", "الحرس الوطني", "المنشية", "النجدة", "العلوم", "وسط البلد"];

// Leaflet map modal — uses OpenStreetMap tiles (free, no API key)
function MapPickerModal({ onConfirm, onClose, initial }: {
  onConfirm: (lat: number, lng: number, label: string) => void;
  onClose: () => void;
  initial?: { lat: number; lng: number };
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(initial || null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    import("leaflet").then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const startLat = initial?.lat ?? 30.4667;
      const startLng = initial?.lng ?? 31.1833;

      const map = L.map(mapRef.current!, { zoomControl: true }).setView([startLat, startLng], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      if (initial) {
        markerRef.current = L.marker([initial.lat, initial.lng]).addTo(map);
      }

      map.on("click", (e: import("leaflet").LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setPicked({ lat, lng });
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else markerRef.current = L.marker([lat, lng]).addTo(map);
      });

      leafletMapRef.current = map;
    });
    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <h3 className="font-bold text-gray-800 text-base">تحديد موقع العقار</h3>
          <MapPin className="w-5 h-5 text-[#1EBFD5]" />
        </div>
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-700 text-center">انقر على الخريطة لتحديد موقع العقار بدقة</p>
        </div>
        <div ref={mapRef} style={{ height: "380px", width: "100%" }} />
        <div className="px-5 py-4 bg-gray-50 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            {picked ? (
              <span className="text-green-600 font-medium">✓ تم تحديد الموقع — {picked.lat.toFixed(5)}, {picked.lng.toFixed(5)}</span>
            ) : "لم يتم التحديد بعد"}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors">إلغاء</button>
            <button
              onClick={() => picked && onConfirm(picked.lat, picked.lng, `${picked.lat.toFixed(5)}, ${picked.lng.toFixed(5)}`)}
              disabled={!picked}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ background: picked ? "linear-gradient(135deg, #1EBFD5, #123C79)" : "#ccc" }}
            >
              تأكيد الموقع
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="relative flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                i < current ? "bg-[#1EBFD5] border-[#1EBFD5] text-white"
                : i === current ? "bg-white border-[#1EBFD5] text-[#1EBFD5]"
                : "bg-white border-gray-200 text-gray-300"
              }`}>
                {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
            </div>
            <span className={`text-[10px] font-medium hidden sm:block text-center ${i <= current ? "text-[#1EBFD5]" : "text-gray-300"}`}>{step}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #1EBFD5, #123C79)" }}
          initial={{ width: 0 }}
          animate={{ width: `${(current / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Card({ selected, onClick, children, color = "#1EBFD5" }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl border-2 p-4 text-right transition-all duration-200 hover:shadow-md ${
        selected ? "border-[#1EBFD5] shadow-md" : "border-gray-100 hover:border-gray-300 bg-white"
      }`}
      style={selected ? { background: `linear-gradient(135deg, ${color}08, white)`, borderColor: color } : {}}
    >
      {selected && (
        <div className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: color }}>
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
      {children}
    </button>
  );
}

function NumericStepper({ value, onChange, min = 0, max = 20, label, icon }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-gray-50">
      <div className="text-[#1EBFD5]">{icon}</div>
      <span className="text-gray-500 text-xs font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1EBFD5] hover:text-[#1EBFD5] transition-all bg-white">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <span className="text-xl font-bold text-gray-800 min-w-[1.5rem] text-center">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1EBFD5] hover:text-[#1EBFD5] transition-all bg-white">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Input({ placeholder, value, onChange, type = "text", textarea = false, icon }: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; icon?: React.ReactNode;
}) {
  const cls = "w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300";
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-gray-200 px-3.5 py-3 focus-within:border-[#1EBFD5] focus-within:ring-2 focus-within:ring-[#1EBFD5]/10 transition-all bg-white">
      {icon && <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>}
      {textarea
        ? <textarea className={`${cls} min-h-[90px] resize-none`} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
        : <input type={type} className={cls} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8"
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="text-center mb-7">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-400 text-sm mt-1">{sub}</p>
    </div>
  );
}

export default function AddPropertyPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [dealType, setDealType] = useState<"بيع" | "إيجار" | "">("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [floor, setFloor] = useState(1);
  const [finishing, setFinishing] = useState("");
  const [ready, setReady] = useState<"جاهز" | "قيد الإنشاء" | "">("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canGoNext = useCallback(() => {
    if (step === 0) return dealType !== "";
    if (step === 1) return mainCategory !== "";
    if (step === 2) return subCategory !== "";
    if (step === 3) return title.trim() !== "" && area.trim() !== "";
    if (step === 4) return price.trim() !== "" && region !== "" && address.trim() !== "";
    return true;
  }, [step, dealType, mainCategory, subCategory, title, area, price, region, address]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const isResidential = mainCategory === "سكني";
  const mainCat = MAIN_CATEGORIES.find(c => c.id === mainCategory);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm">
            <ChevronRight className="w-4 h-4" />
            رجوع
          </button>
          <img src={logoColor} alt="عقارات بنها" className="h-8 w-auto" />
          <span className="text-xs text-gray-400 font-medium">{step + 1} / {STEPS.length}</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <ProgressBar current={step} />

        <AnimatePresence mode="wait">
          {/* STEP 0 — نوع الصفقة */}
          {step === 0 && (
            <StepWrap key="s0">
              <StepTitle title="ما الحالة؟" sub="هل تريد البيع أم الإيجار؟" />
              <div className="grid grid-cols-2 gap-4">
                {(["بيع", "إيجار"] as const).map((type) => (
                  <Card key={type} selected={dealType === type} onClick={() => setDealType(type)}>
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${dealType === type ? "text-white" : "bg-gray-50 text-gray-400"}`}
                        style={dealType === type ? { background: "linear-gradient(135deg, #1EBFD5, #123C79)" } : {}}>
                        {type === "بيع" ? <DollarSign className="w-7 h-7" /> : <Star className="w-7 h-7" />}
                      </div>
                      <span className={`text-lg font-bold ${dealType === type ? "text-gray-800" : "text-gray-400"}`}>للـ{type}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </StepWrap>
          )}

          {/* STEP 1 — الفئة الرئيسية */}
          {step === 1 && (
            <StepWrap key="s1">
              <StepTitle title="الفئة الرئيسية" sub="اختر نوع العقار" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MAIN_CATEGORIES.map((cat) => (
                  <Card key={cat.id} selected={mainCategory === cat.id} onClick={() => { setMainCategory(cat.id); setSubCategory(""); }} color={cat.color}>
                    <div className="flex flex-col items-center gap-2 py-1 text-center">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all`}
                        style={{ background: mainCategory === cat.id ? `${cat.color}18` : "#f9fafb", color: mainCategory === cat.id ? cat.color : "#9ca3af" }}>
                        {cat.icon}
                      </div>
                      <span className={`text-sm font-bold ${mainCategory === cat.id ? "text-gray-800" : "text-gray-400"}`}>{cat.label}</span>
                      <span className="text-[10px] text-gray-400 leading-tight">{cat.desc}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </StepWrap>
          )}

          {/* STEP 2 — النوع الفرعي */}
          {step === 2 && (
            <StepWrap key="s2">
              <StepTitle title="النوع الفرعي" sub={`حدد نوع ${mainCategory} بدقة`} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(SUB_CATEGORIES[mainCategory] || []).map((sub) => (
                  <Card key={sub.id} selected={subCategory === sub.id} onClick={() => setSubCategory(sub.id)}>
                    <div className="flex flex-col items-center gap-2 py-1 text-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all`}
                        style={{ background: subCategory === sub.id ? "#1EBFD518" : "#f9fafb", color: subCategory === sub.id ? "#1EBFD5" : "#9ca3af" }}>
                        {sub.icon}
                      </div>
                      <span className={`text-sm font-bold ${subCategory === sub.id ? "text-gray-800" : "text-gray-400"}`}>{sub.label}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </StepWrap>
          )}

          {/* STEP 3 — تفاصيل العقار */}
          {step === 3 && (
            <StepWrap key="s3">
              <StepTitle title="تفاصيل العقار" sub="المعلومات الأساسية للإعلان" />
              <div className="flex flex-col gap-5">
                <Field label="اسم الإعلان *">
                  <Input placeholder="مثال: شقة فاخرة بالأهرام 120م" value={title} onChange={setTitle} />
                </Field>
                <Field label="وصف العقار">
                  <Input placeholder="اكتب وصفاً تفصيلياً جذاباً..." value={description} onChange={setDescription} textarea />
                </Field>
                <Field label="صور العقار">
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-[#1EBFD5] hover:bg-[#1EBFD5]/5 transition-all group bg-gray-50">
                      <Upload className="w-5 h-5 text-gray-300 group-hover:text-[#1EBFD5] transition-colors" />
                      <span className="text-[10px] text-gray-300 group-hover:text-[#1EBFD5]">رفع</span>
                    </button>
                    {photos.slice(0, 7).map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="المساحة (م²) *">
                    <Input placeholder="120" value={area} onChange={setArea} type="number" icon={<Maximize2 className="w-4 h-4" />} />
                  </Field>
                  <div />
                </div>
                {isResidential && (
                  <div className="grid grid-cols-3 gap-3">
                    <NumericStepper label="غرف النوم" value={bedrooms} onChange={setBedrooms} min={0} max={10} icon={<Building2 className="w-4 h-4" />} />
                    <NumericStepper label="الحمامات" value={bathrooms} onChange={setBathrooms} min={1} max={8} icon={<Droplets className="w-4 h-4" />} />
                    <NumericStepper label="الدور" value={floor} onChange={setFloor} min={0} max={30} icon={<Layers className="w-4 h-4" />} />
                  </div>
                )}
              </div>
            </StepWrap>
          )}

          {/* STEP 4 — السعر والموقع */}
          {step === 4 && (
            <StepWrap key="s4">
              <StepTitle title="السعر والموقع" sub="آخر التفاصيل قبل المزايا" />
              <div className="flex flex-col gap-5">
                <Field label="نوع التشطيب">
                  <div className="flex flex-wrap gap-2">
                    {FINISHING.map((f) => (
                      <button key={f} onClick={() => setFinishing(f)}
                        className={`px-3.5 py-1.5 rounded-xl text-sm font-medium border transition-all ${finishing === f ? "border-[#1EBFD5] bg-[#1EBFD5]/8 text-[#1EBFD5]" : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="حالة العقار">
                  <div className="grid grid-cols-2 gap-3">
                    {(["جاهز", "قيد الإنشاء"] as const).map((r) => (
                      <button key={r} onClick={() => setReady(r)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${ready === r ? "border-[#1EBFD5] bg-[#1EBFD5]/8 text-[#1EBFD5]" : "border-gray-200 text-gray-400 bg-white"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="السعر (جنيه) *">
                    <Input placeholder="1,500,000" value={price} onChange={setPrice} type="number" icon={<DollarSign className="w-4 h-4" />} />
                  </Field>
                  <Field label="قابل للتفاوض">
                    <button onClick={() => setNegotiable(!negotiable)}
                      className={`w-full h-11 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${negotiable ? "border-[#1EBFD5] bg-[#1EBFD5]/8 text-[#1EBFD5]" : "border-gray-200 text-gray-400 bg-white"}`}>
                      {negotiable && <Check className="w-4 h-4" />}
                      {negotiable ? "نعم، قابل" : "لا"}
                    </button>
                  </Field>
                </div>
                <Field label="المنطقة *">
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map((a) => (
                      <button key={a} onClick={() => setRegion(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${region === a ? "border-[#1EBFD5] bg-[#1EBFD5]/8 text-[#1EBFD5]" : "border-gray-200 text-gray-500 bg-white"}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="عنوان العقار *">
                  <Input placeholder="مثال: شارع النيل، بجوار مسجد..." value={address} onChange={setAddress} icon={<MapPin className="w-4 h-4" />} />
                </Field>
                <Field label="تحديد الموقع على الخريطة">
                  <button
                    onClick={() => setShowMap(true)}
                    className={`w-full rounded-2xl border-2 border-dashed overflow-hidden transition-all hover:shadow-md ${mapLocation ? "border-[#1EBFD5]" : "border-gray-200 hover:border-[#1EBFD5]"}`}
                    style={{ height: 130 }}
                  >
                    {mapLocation ? (
                      <div className="h-full bg-gradient-to-br from-[#1EBFD5]/10 to-[#123C79]/10 flex flex-col items-center justify-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#1EBFD5] flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[#1EBFD5] font-semibold text-sm">تم تحديد الموقع</span>
                        <span className="text-gray-400 text-xs">{mapLocation.label}</span>
                        <span className="text-[#1EBFD5] text-xs underline">انقر لتعديل الموقع</span>
                      </div>
                    ) : (
                      <div className="h-full bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gray-300" />
                        </div>
                        <span className="text-gray-400 text-sm font-medium">انقر لتحديد الموقع على الخريطة</span>
                        <span className="text-gray-300 text-xs">OpenStreetMap — مجاني بالكامل</span>
                      </div>
                    )}
                  </button>
                </Field>
                <Field label="رابط الفيديو (اختياري)">
                  <Input placeholder="https://youtube.com/..." value={videoLink} onChange={setVideoLink} icon={<Video className="w-4 h-4" />} />
                </Field>
              </div>
            </StepWrap>
          )}

          {/* STEP 5 — المزايا */}
          {step === 5 && (
            <StepWrap key="s5">
              <StepTitle title="مزايا العقار" sub="اختر المزايا المتوفرة — تزيد جاذبية الإعلان" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {AMENITIES.map((am) => {
                  const sel = amenities.includes(am.id);
                  return (
                    <button key={am.id} onClick={() => setAmenities(p => sel ? p.filter(a => a !== am.id) : [...p, am.id])}
                      className={`relative rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all text-center ${sel ? "border-[#1EBFD5] bg-[#1EBFD5]/6 shadow-sm" : "border-gray-100 bg-white hover:border-gray-300"}`}>
                      {sel && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#1EBFD5] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <span style={{ color: sel ? "#1EBFD5" : "#9ca3af" }}>{am.icon}</span>
                      <span className={`text-xs font-medium ${sel ? "text-gray-700" : "text-gray-400"}`}>{am.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-5 p-3.5 rounded-2xl bg-[#1EBFD5]/6 border border-[#1EBFD5]/15 text-center">
                <p className="text-sm text-gray-600">
                  اخترت <span className="text-[#1EBFD5] font-bold">{amenities.length}</span> ميزة
                  {amenities.length >= 5 && " — ممتاز! إعلانك أكثر جاذبية"}
                </p>
              </div>
            </StepWrap>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-5 gap-3">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium bg-white"
          >
            <ChevronRight className="w-4 h-4" />
            السابق
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canGoNext() && setStep(s => s + 1)}
              disabled={!canGoNext()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-white"
              style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)", boxShadow: canGoNext() ? "0 4px 20px rgba(30,191,213,0.25)" : "none" }}
            >
              التالي
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #1EBFD5, #123C79)", boxShadow: "0 4px 20px rgba(30,191,213,0.3)" }}
            >
              <Sparkles className="w-4 h-4" />
              نشر الإعلان
            </button>
          )}
        </div>

        <p className="text-center text-gray-300 text-xs mt-4">
          {step < 3 ? "* الحقول الإلزامية" : "بياناتك محمية ومشفرة"}
        </p>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <MapPickerModal
            initial={mapLocation ? { lat: mapLocation.lat, lng: mapLocation.lng } : undefined}
            onConfirm={(lat, lng, label) => { setMapLocation({ lat, lng, label }); setShowMap(false); }}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
