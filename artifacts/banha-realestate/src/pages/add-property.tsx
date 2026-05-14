import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Home, Building2, Building, Store, Briefcase, Stethoscope,
  Trees, Layers, MapPin, Maximize2,
  ChevronLeft, ChevronRight, Check, X, Upload, Video,
  DollarSign, Star, Wifi, Wind, Car, Dumbbell, Shield,
  Waves, Coffee, PawPrint, Sun, Zap, Droplets, Package,
  Phone, Eye, Sparkles, Navigation, Info, FileText, Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import logoColor from "@assets/rgb_1778457941418.png";
import logoWhite from "@assets/footer_1778457955133.png";
import "leaflet/dist/leaflet.css";

const STEPS = ["نوع الصفقة", "الفئة", "النوع", "التفاصيل", "الموقع والسعر", "المزايا"];

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

// Leaflet map modal
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-white rounded-[32px] shadow-2xl overflow-hidden w-full max-w-2xl"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <h3 className="font-black text-gray-900 text-lg">تحديد موقع العقار</h3>
          <MapPin className="w-6 h-6 text-[#1EBFD5]" />
        </div>
        <div className="px-6 py-3 bg-[#1EBFD5]/5 border-b border-[#1EBFD5]/10">
          <p className="text-sm text-[#123C79] font-medium text-center">انقر على الخريطة لتحديد موقع العقار بدقة متناهية</p>
        </div>
        <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
        <div className="px-6 py-5 bg-gray-50 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-500 font-medium">
            {picked ? (
              <span className="text-[#1EBFD5] flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                تم تحديد الموقع بنجاح
              </span>
            ) : "لم يتم تحديد الموقع بعد"}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-white transition-all">إلغاء</button>
            <button
              onClick={() => picked && onConfirm(picked.lat, picked.lng, `${picked.lat.toFixed(5)}, ${picked.lng.toFixed(5)}`)}
              disabled={!picked}
              className="px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 shadow-lg shadow-[#1EBFD5]/20"
              style={{ background: "#1EBFD5" }}
            >
              تأكيد الموقع
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SelectionCard({ selected, onClick, children, color = "#1EBFD5" }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border-2 p-5 text-right transition-all duration-300 group ${
        selected
          ? "border-[#1EBFD5] bg-[#1EBFD5]/5 shadow-md scale-[1.02]"
          : "border-gray-100 hover:border-gray-200 bg-gray-50 hover:bg-white"
      }`}
    >
      <div className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? "border-[#1EBFD5] bg-[#1EBFD5]" : "border-gray-300"
      }`}>
        {selected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      {children}
    </button>
  );
}

function NumericStepper({ value, onChange, min = 0, max = 20, label, icon }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 bg-gray-50 transition-all hover:bg-white hover:shadow-sm group">
      <div className="text-gray-400 group-hover:text-[#1EBFD5] transition-colors">{icon}</div>
      <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1EBFD5] hover:text-[#1EBFD5] transition-all bg-white shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-xl font-black text-gray-900 min-w-[1.2rem] text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1EBFD5] hover:text-[#1EBFD5] transition-all bg-white shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function InputField({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 block px-1">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute right-4 top-[14px] text-gray-400 group-focus-within:text-[#1EBFD5] transition-colors">
            {icon}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

const inputBaseClass = "w-full bg-white border border-gray-200 rounded-xl py-3.5 pr-11 pl-4 text-sm focus:outline-none focus:border-[#1EBFD5] focus:ring-4 focus:ring-[#1EBFD5]/10 transition-all placeholder:text-gray-300 font-medium";

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
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const canGoNext = useCallback(() => {
    if (step === 0) return dealType !== "";
    if (step === 1) return mainCategory !== "";
    if (step === 2) return subCategory !== "";
    if (step === 3) return title.trim() !== "" && area.trim() !== "" && photos.length > 0;
    if (step === 4) return price.trim() !== "" && region !== "" && address.trim() !== "";
    return true;
  }, [step, dealType, mainCategory, subCategory, title, area, price, region, address, photos]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleNext = () => {
    if (canGoNext()) {
      if (step < STEPS.length - 1) setStep(s => s + 1);
      else {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          navigate("/plans");
        }, 1500);
      }
    }
  };

  const isResidential = mainCategory === "سكني";

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left — Form panel */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top nav */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1EBFD5] transition-colors font-bold"
          >
            {step > 0 ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {step > 0 ? "العودة للخطوة السابقة" : "العودة إلى الرئيسية"}
          </button>
          <button onClick={() => navigate("/")}>
            <img src={logoColor} alt="عقارات بنها" className="h-10 w-auto object-contain" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-50">
          <motion.div
            className="h-full"
            style={{ background: "#1EBFD5" }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-start justify-center px-8 py-12 overflow-y-auto">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs font-bold text-[#1EBFD5] uppercase tracking-widest mb-1">خطوة {step + 1} من {STEPS.length}</p>
                <h1 className="text-3xl font-black text-gray-900 mb-2">{STEPS[step]}</h1>

                {/* Step content */}
                <div className="mt-8 mb-10">
                  {step === 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(["بيع", "إيجار"] as const).map((type) => (
                        <SelectionCard key={type} selected={dealType === type} onClick={() => setDealType(type)}>
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                              dealType === type ? "bg-[#1EBFD5] text-white shadow-lg shadow-[#1EBFD5]/30" : "bg-white text-gray-400 shadow-sm"
                            }`}>
                              {type === "بيع" ? <DollarSign className="w-7 h-7" /> : <Star className="w-7 h-7" />}
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900 text-lg leading-none">عقار لل{type}</p>
                              <p className="text-gray-400 text-xs mt-1.5">{type === "بيع" ? "عرض ملكية عقار للبيع النهائي" : "تأجير وحدة سكنية أو تجارية"}</p>
                            </div>
                          </div>
                        </SelectionCard>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="grid grid-cols-2 gap-3">
                      {MAIN_CATEGORIES.map((cat) => (
                        <SelectionCard key={cat.id} selected={mainCategory === cat.id} onClick={() => { setMainCategory(cat.id); setSubCategory(""); }}>
                          <div className="flex flex-col items-center gap-3 py-1 text-center">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                              mainCategory === cat.id ? "bg-[#1EBFD5] text-white shadow-lg" : "bg-white text-gray-400 shadow-sm"
                            }`} style={mainCategory === cat.id ? { background: cat.color } : {}}>
                              {cat.icon}
                            </div>
                            <span className="font-black text-gray-900 text-sm">{cat.label}</span>
                            <span className="text-gray-400 text-[10px] leading-tight font-medium">{cat.desc}</span>
                          </div>
                        </SelectionCard>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(SUB_CATEGORIES[mainCategory] || []).map((sub) => (
                        <SelectionCard key={sub.id} selected={subCategory === sub.id} onClick={() => setSubCategory(sub.id)}>
                          <div className="flex flex-col items-center gap-2 py-1 text-center">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                              subCategory === sub.id ? "bg-[#1EBFD5] text-white shadow-lg" : "bg-white text-gray-400 shadow-sm"
                            }`}>
                              {sub.icon}
                            </div>
                            <span className="font-black text-gray-900 text-xs">{sub.label}</span>
                          </div>
                        </SelectionCard>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <InputField label="عنوان الإعلان" icon={<FileText className="w-4 h-4" />}>
                        <input
                          type="text"
                          placeholder="مثال: شقة فاخرة بالأهرام 120م"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          className={inputBaseClass}
                        />
                      </InputField>

                      <InputField label="وصف العقار" icon={<Navigation className="w-4 h-4" />}>
                        <textarea
                          placeholder="اكتب وصفاً تفصيلياً يجذب المشترين..."
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className={`${inputBaseClass} h-32 resize-none leading-relaxed pr-11`}
                        />
                      </InputField>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 block px-1">صور العقار (على الأقل صورة واحدة)</label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full aspect-[16/6] rounded-[24px] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#1EBFD5] hover:bg-[#1EBFD5]/5 transition-all group"
                        >
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#1EBFD5] transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-black text-gray-900">اضغط هنا لرفع الصور</p>
                            <p className="text-gray-400 text-xs mt-1">أو اسحب الصور وأفلتها هنا مباشرة</p>
                          </div>
                          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                        </div>

                        {photos.length > 0 && (
                          <div className="grid grid-cols-4 gap-3 mt-4">
                            {photos.map((src, i) => (
                              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
                                <img src={src} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <button onClick={(e) => { e.stopPropagation(); setPhotos(p => p.filter((_, j) => j !== i)); }}
                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors">
                                    <X className="w-4 h-4 text-white" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="المساحة (م²)" icon={<Maximize2 className="w-4 h-4" />}>
                          <input
                            type="number"
                            placeholder="120"
                            value={area}
                            onChange={e => setArea(e.target.value)}
                            className={inputBaseClass}
                          />
                        </InputField>
                        <div />
                      </div>

                      {isResidential && (
                        <div className="grid grid-cols-3 gap-3">
                          <NumericStepper label="الغرف" value={bedrooms} onChange={setBedrooms} icon={<Building2 className="w-4 h-4" />} />
                          <NumericStepper label="الحمامات" value={bathrooms} onChange={setBathrooms} icon={<Droplets className="w-4 h-4" />} />
                          <NumericStepper label="الدور" value={floor} onChange={setFloor} icon={<Layers className="w-4 h-4" />} />
                        </div>
                      )}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 block px-1">نوع التشطيب</label>
                        <div className="flex flex-wrap gap-2">
                          {FINISHING.map((f) => (
                            <button key={f} onClick={() => setFinishing(f)}
                              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                                finishing === f ? "border-[#1EBFD5] bg-[#1EBFD5] text-white shadow-md shadow-[#1EBFD5]/20" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                              }`}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 block px-1">حالة العقار</label>
                        <div className="grid grid-cols-2 gap-3">
                          {(["جاهز", "قيد الإنشاء"] as const).map((r) => (
                            <button key={r} onClick={() => setReady(r)}
                              className={`py-3 rounded-xl text-sm font-black border-2 transition-all ${
                                ready === r ? "border-[#1EBFD5] bg-[#1EBFD5] text-white shadow-md shadow-[#1EBFD5]/20" : "border-gray-100 bg-gray-50 text-gray-400"
                              }`}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="السعر (جنيه)" icon={<DollarSign className="w-4 h-4" />}>
                          <input
                            type="number"
                            placeholder="1,500,000"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className={inputBaseClass}
                          />
                        </InputField>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 block">قابل للتفاوض</label>
                          <button onClick={() => setNegotiable(!negotiable)}
                            className={`w-full h-[50px] rounded-xl border-2 font-black text-sm transition-all flex items-center justify-center gap-2 ${
                              negotiable ? "border-[#1EBFD5] bg-[#1EBFD5]/5 text-[#1EBFD5]" : "border-gray-100 bg-gray-50 text-gray-400"
                            }`}>
                            {negotiable && <Check className="w-4 h-4" />}
                            {negotiable ? "نعم، قابل للتفاوض" : "السعر نهائي"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 block px-1">المنطقة</label>
                        <div className="flex flex-wrap gap-2">
                          {AREAS.map((a) => (
                            <button key={a} onClick={() => setRegion(a)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                                region === a ? "border-[#1EBFD5] bg-[#1EBFD5]/5 text-[#1EBFD5]" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                              }`}>
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>

                      <InputField label="العنوان بالتفصيل" icon={<MapPin className="w-4 h-4" />}>
                        <input
                          type="text"
                          placeholder="مثال: شارع النيل، بجوار مسجد الشريف"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className={inputBaseClass}
                        />
                      </InputField>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 block">الموقع على الخريطة</label>
                        <button
                          onClick={() => setShowMap(true)}
                          className={`w-full h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all group ${
                            mapLocation ? "border-[#1EBFD5] bg-[#1EBFD5]/5 shadow-sm" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          {mapLocation ? (
                            <>
                              <div className="w-10 h-10 rounded-full bg-[#1EBFD5] flex items-center justify-center shadow-lg shadow-[#1EBFD5]/30">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                              <p className="text-sm font-black text-[#123C79]">تم تحديد الموقع بدقة</p>
                              <p className="text-[10px] text-[#1EBFD5] underline">انقر للتعديل</p>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 rounded-full bg-white border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 group-hover:text-[#1EBFD5] group-hover:border-[#1EBFD5] transition-all">
                                <Navigation className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-bold text-gray-400 group-hover:text-gray-600">افتح الخريطة للتحديد</p>
                            </>
                          )}
                        </button>
                      </div>

                      <InputField label="رابط فيديو (اختياري)" icon={<Video className="w-4 h-4" />}>
                        <input
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          value={videoLink}
                          onChange={e => setVideoLink(e.target.value)}
                          dir="ltr"
                          className={inputBaseClass}
                        />
                      </InputField>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {AMENITIES.map((am) => {
                          const sel = amenities.includes(am.id);
                          return (
                            <button
                              key={am.id}
                              onClick={() => setAmenities(p => sel ? p.filter(a => a !== am.id) : [...p, am.id])}
                              className={`relative rounded-[20px] border-2 p-4 flex flex-col items-center gap-2 transition-all group ${
                                sel ? "border-[#1EBFD5] bg-[#1EBFD5]/5 shadow-md scale-[1.02]" : "border-gray-50 bg-gray-50 hover:border-gray-100 hover:bg-white"
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                sel ? "bg-[#1EBFD5] text-white" : "bg-white text-gray-400 shadow-sm"
                              }`}>
                                {am.icon}
                              </div>
                              <span className={`text-[11px] font-bold ${sel ? "text-gray-800" : "text-gray-400"}`}>{am.label}</span>
                              {sel && (
                                <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-[#1EBFD5] flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <div className="p-5 rounded-3xl bg-[#1EBFD5]/10 border border-[#1EBFD5]/20 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#1EBFD5] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[#1EBFD5]/20">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#123C79]">تم اختيار {amenities.length} مزايا</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">كلما زادت المزايا، زادت فرصة ظهور إعلانك للمهتمين</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="flex items-center gap-4">
                  <button
                    disabled={loading || !canGoNext()}
                    onClick={handleNext}
                    className="flex-1 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#1EBFD5]/20 flex items-center justify-center gap-3 transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#1EBFD5" }}
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {step === STEPS.length - 1 ? "نشر الإعلان ومتابعة" : "متابعة للخطوة التالية"}
                        <ArrowRight className="w-5 h-5 rotate-180" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
                  نحن نلتزم بحماية بياناتك وخصوصيتك. <br />
                  بالاستمرار، أنت توافق على شروط النشر المتبعة في منصتنا.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right — Info panel */}
      <div
        className="hidden lg:flex w-[42%] flex-col justify-center px-16 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0e4d6e 0%, #1EBFD5 100%)" }}
      >
        {/* Background Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#123C79]/20 blur-3xl" />

        <div className="relative z-10">
          <img src={logoWhite} alt="عقارات بنها" className="h-12 w-auto object-contain mb-14 self-start" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black text-white leading-[1.15] mb-6">
              أضف عقارك<br />إلى عالم بنها
            </h2>
            <p className="text-2xl font-bold text-white/90 mb-6 leading-snug">
              نحن نصل إعلانك<br />إلى العميل المناسب فوراً
            </p>
            <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-md">
              اتبع الخطوات البسيطة لوصف عقارك بأفضل شكل ممكن. كل تفصيلة صغيرة تفرق في سرعة البيع أو الإيجار.
            </p>

            <div className="space-y-6">
              {[
                { icon: <ImageIcon className="w-5 h-5" />, title: "صور احترافية", desc: "أضف ما يصل لـ 20 صورة عالية الجودة" },
                { icon: <MapPin className="w-5 h-5" />, title: "موقع دقيق", desc: "حدد عقارك على الخريطة ليجده العملاء بسهولة" },
                { icon: <Check className="w-5 h-5" />, title: "تفعيل فوري", desc: "اختر الباقة المناسبة وفعل إعلانك بضغطة زر" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base">{item.title}</h4>
                    <p className="text-white/60 text-xs mt-1 font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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
