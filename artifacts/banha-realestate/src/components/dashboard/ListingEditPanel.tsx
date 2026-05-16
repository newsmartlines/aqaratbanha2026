import React, { useState, useRef, useEffect, useCallback } from "react";
import { applyWatermark } from "../../utils/watermark";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, CheckCircle, Upload, Trash2, MapPin, Phone, MessageCircle,
  ChevronLeft, ChevronRight, Image as ImageIcon, Star, AlertCircle,
  Home, Building2, Store, Trees, Briefcase, Wifi, Wind, Car,
  Dumbbell, Shield, Waves, Coffee, Sun, Zap, Droplets, Navigation,
  PawPrint, Plus,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

interface Listing {
  id: number;
  title: string;
  location: string;
  address: string;
  price: number;
  priceLabel: string;
  type: string;
  category: string;
  beds: number;
  baths: number;
  size: number;
  description: string;
  image: string;
  images: string[];
  amenities: string[];
  agent: { phone: string; whatsapp: string };
  active: boolean;
  featured: boolean;
}

interface ListingEditPanelProps {
  listing: Listing | null;
  onClose: () => void;
  onSave: (updated: Listing) => void;
}

const DEAL_TYPES = ["للبيع", "للإيجار"];
const CATEGORIES = ["شقة", "فيلا", "دوبلكس", "بنتهاوس", "محل تجاري", "مكتب", "أرض", "عمارة", "استوديو"];

const AMENITIES_LIST = [
  { id: "wifi", label: "إنترنت فايبر", icon: Wifi },
  { id: "ac", label: "تكييف مركزي", icon: Wind },
  { id: "parking", label: "جراج / موقف", icon: Car },
  { id: "gym", label: "جيم", icon: Dumbbell },
  { id: "security", label: "حراسة 24/7", icon: Shield },
  { id: "pool", label: "حمام سباحة", icon: Waves },
  { id: "cafe", label: "كافيه", icon: Coffee },
  { id: "pets", label: "يسمح بالحيوانات", icon: PawPrint },
  { id: "solar", label: "طاقة شمسية", icon: Sun },
  { id: "generator", label: "جنريتور", icon: Zap },
  { id: "water", label: "خزان مياه", icon: Droplets },
  { id: "elevator", label: "مصعد", icon: Navigation },
];

const TABS = [
  { id: "info", label: "البيانات الأساسية", icon: Home },
  { id: "photos", label: "الصور", icon: ImageIcon },
  { id: "location", label: "الموقع", icon: MapPin },
  { id: "contact", label: "التواصل", icon: Phone },
];

function MapPicker({ address, onAddressChange }: { address: string; onAddressChange: (a: string) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let L: any;
    import("leaflet").then((leafletModule) => {
      L = leafletModule.default;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      const map = L.map(mapRef.current!).setView([30.4634, 31.1833], 14);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
      const marker = L.marker([30.4634, 31.1833], { draggable: true }).addTo(map);
      marker.on("dragend", (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        onAddressChange(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      });
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onAddressChange(`${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
      });
      mapInstanceRef.current = map;
      markerRef.current = marker;
    });
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div ref={mapRef} style={{ height: 320, borderRadius: 16, overflow: "hidden", border: "1px solid #E5E7EB" }} />
      <p className="text-xs text-gray-400 font-medium text-center">اضغط على الخريطة أو اسحب الدبوس لتحديد الموقع بدقة</p>
      <div>
        <label className="text-xs font-black text-gray-500 block mb-1.5">العنوان التفصيلي</label>
        <input
          value={address}
          onChange={e => onAddressChange(e.target.value)}
          className="w-full py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all"
          placeholder="مثال: شارع الجمهورية، بنها، القليوبية"
        />
      </div>
    </div>
  );
}

export default function ListingEditPanel({ listing, onClose, onSave }: ListingEditPanelProps) {
  const [tab, setTab] = useState<"info" | "photos" | "location" | "contact">("info");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Listing & { contactMode: "phone" | "whatsapp" | "both" }>(() => ({
    ...listing!,
    contactMode: "both",
  }));

  const [images, setImages] = useState<string[]>(listing?.images ?? [listing?.image ?? ""]);
  const [amenities, setAmenities] = useState<string[]>(listing?.amenities ?? []);

  const update = (key: keyof Listing, value: any) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = async ev => {
        const raw = ev.target?.result as string;
        const stamped = await applyWatermark(raw);
        setImages(prev => [...prev, stamped]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }, []);

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleAmenity = (id: string) => {
    setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleSave = () => {
    onSave({ ...form, images, amenities });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  if (!listing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        {/* Backdrop */}
        <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Panel */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="w-full max-w-2xl bg-white flex flex-col h-full shadow-2xl overflow-hidden"
          dir="rtl"
          onClick={e => e.stopPropagation()}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h2 className="font-black text-gray-900 text-base leading-tight">تعديل الإعلان</h2>
                <p className="text-xs text-gray-400 font-medium truncate max-w-48">{form.title}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-sm transition-all ${saved
                ? "bg-green-500 text-white"
                : "bg-gradient-to-l from-[#0F5373] to-[#123C79] text-white shadow-sm"}`}
            >
              {saved ? <><CheckCircle className="w-4 h-4" /> تم الحفظ</> : <><CheckCircle className="w-4 h-4" /> حفظ التغييرات</>}
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-white sticky top-[65px] z-10">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold transition-all relative ${tab === t.id ? "text-[#0F5373]" : "text-gray-400 hover:text-gray-600"}`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:block">{t.label}</span>
                {tab === t.id && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5373] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* ── INFO TAB ── */}
              {tab === "info" && (
                <motion.div key="info" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 space-y-5">

                  <div>
                    <label className="text-xs font-black text-gray-500 block mb-1.5">عنوان الإعلان *</label>
                    <input
                      value={form.title}
                      onChange={e => update("title", e.target.value)}
                      className="w-full py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all"
                      placeholder="مثال: شقة فاخرة في منطقة الفلل"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-500 block mb-1.5">نوع الصفقة</label>
                      <div className="flex rounded-xl overflow-hidden border border-gray-100">
                        {DEAL_TYPES.map(dt => (
                          <button key={dt} onClick={() => update("type", dt)}
                            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${form.type === dt ? "bg-[#0F5373] text-white" : "bg-[#F4F7FD] text-gray-500 hover:bg-gray-100"}`}>
                            {dt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-500 block mb-1.5">التصنيف</label>
                      <select
                        value={form.category}
                        onChange={e => update("category", e.target.value)}
                        className="w-full py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all appearance-none"
                      >
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 block mb-1.5">السعر (ج.م) *</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.price}
                        onChange={e => update("price", Number(e.target.value))}
                        className="w-full py-3 pr-4 pl-16 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all"
                        placeholder="0"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">ج.م</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "غرف النوم", key: "beds", min: 0 },
                      { label: "الحمامات", key: "baths", min: 0 },
                      { label: "المساحة (م²)", key: "size", min: 1 },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-black text-gray-500 block mb-1.5">{f.label}</label>
                        <input
                          type="number"
                          min={f.min}
                          value={(form as any)[f.key]}
                          onChange={e => update(f.key as keyof Listing, Number(e.target.value))}
                          className="w-full py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all text-center"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 block mb-1.5">وصف العقار</label>
                    <textarea
                      value={form.description}
                      onChange={e => update("description", e.target.value)}
                      rows={5}
                      className="w-full py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all resize-none"
                      placeholder="أدخل وصفاً تفصيلياً للعقار..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 block mb-3">المميزات والخدمات</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {AMENITIES_LIST.map(a => (
                        <button key={a.id} onClick={() => toggleAmenity(a.label)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${amenities.includes(a.label)
                            ? "bg-[#0F5373]/10 border-[#0F5373]/30 text-[#0F5373]"
                            : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-200"}`}>
                          <a.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-sm text-gray-800">إعلان مميز</span>
                    </div>
                    <button
                      onClick={() => update("featured", !form.featured)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${form.featured ? "bg-amber-400" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.featured ? "right-0.5" : "left-0.5"}`} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── PHOTOS TAB ── */}
              {tab === "photos" && (
                <motion.div key="photos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-gray-900 text-sm">صور العقار</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{images.length} صورة • الأولى هي الصورة الرئيسية</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gradient-to-l from-[#0F5373] to-[#123C79] text-white px-4 py-2 rounded-xl text-sm font-black shadow-sm"
                    >
                      <Upload className="w-4 h-4" /> رفع صور
                    </motion.button>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </div>

                  {images.length === 0 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-[#0F5373]/40 hover:bg-[#F4F7FD] transition-all"
                    >
                      <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="font-bold text-gray-400 text-sm">اضغط لرفع صور العقار</p>
                      <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP — حتى 10 صور</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <motion.div key={idx} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-gray-100">
                        <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-2 right-2 bg-[#0F5373] text-white text-[10px] font-black px-2 py-0.5 rounded-md">رئيسية</span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => removeImage(idx)}
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 text-[10px] text-white/80 font-bold bg-black/30 px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#0F5373]/40 hover:bg-[#F4F7FD] transition-all"
                    >
                      <Plus className="w-6 h-6 text-gray-300" />
                      <span className="text-xs text-gray-300 font-bold">إضافة صورة</span>
                    </motion.div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
                    <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-600 font-medium">الصورة الأولى هي الصورة الرئيسية للإعلان. يُنصح بتحميل صور واضحة وعالية الجودة لجذب أكبر عدد من المهتمين.</p>
                  </div>
                </motion.div>
              )}

              {/* ── LOCATION TAB ── */}
              {tab === "location" && (
                <motion.div key="location" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 space-y-5">
                  <div>
                    <h3 className="font-black text-gray-900 text-sm mb-1">موقع العقار</h3>
                    <p className="text-xs text-gray-400">اسحب الدبوس أو اضغط على الخريطة لتحديد الموقع</p>
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-500 block mb-1.5">المنطقة / الحي</label>
                    <input
                      value={form.location}
                      onChange={e => update("location", e.target.value)}
                      className="w-full py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all"
                      placeholder="مثال: الفلل، بنها"
                    />
                  </div>

                  <MapPicker
                    address={form.address}
                    onAddressChange={val => update("address", val)}
                  />
                </motion.div>
              )}

              {/* ── CONTACT TAB ── */}
              {tab === "contact" && (
                <motion.div key="contact" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 space-y-5">
                  <div>
                    <h3 className="font-black text-gray-900 text-sm mb-1">طريقة التواصل</h3>
                    <p className="text-xs text-gray-400">اختر كيف يتواصل معك المهتمون</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "phone", label: "هاتف فقط", icon: Phone, color: "text-blue-500 bg-blue-50 border-blue-200" },
                      { id: "whatsapp", label: "واتساب فقط", icon: MessageCircle, color: "text-green-500 bg-green-50 border-green-200" },
                      { id: "both", label: "كلاهما", icon: Phone, color: "text-[#0F5373] bg-[#0F5373]/10 border-[#0F5373]/30" },
                    ].map(mode => (
                      <button key={mode.id} onClick={() => setForm(prev => ({ ...prev, contactMode: mode.id as any }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 font-bold text-sm transition-all ${form.contactMode === mode.id
                          ? mode.color + " shadow-sm"
                          : "border-gray-100 text-gray-400 hover:border-gray-200 bg-gray-50"}`}>
                        <mode.icon className="w-5 h-5" />
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {(form.contactMode === "phone" || form.contactMode === "both") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <label className="text-xs font-black text-gray-500 block mb-1.5">رقم الهاتف</label>
                        <div className="flex gap-2">
                          <span className="py-3 px-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-500 flex items-center">+20</span>
                          <input
                            value={form.agent.phone.replace("+20", "")}
                            onChange={e => setForm(prev => ({ ...prev, agent: { ...prev.agent, phone: "+20" + e.target.value } }))}
                            className="flex-1 py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all"
                            placeholder="1012345678"
                            dir="ltr"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {(form.contactMode === "whatsapp" || form.contactMode === "both") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <label className="text-xs font-black text-gray-500 block mb-1.5">رقم الواتساب</label>
                        <div className="flex gap-2">
                          <span className="py-3 px-3 bg-green-50 rounded-xl text-sm font-bold text-green-600 flex items-center">+20</span>
                          <input
                            value={form.agent.whatsapp.replace("+20", "")}
                            onChange={e => setForm(prev => ({ ...prev, agent: { ...prev.agent, whatsapp: "+20" + e.target.value } }))}
                            className="flex-1 py-3 px-4 rounded-xl bg-[#F4F7FD] border border-gray-100 text-sm font-semibold outline-none focus:border-[#0F5373]/50 focus:bg-white transition-all"
                            placeholder="1012345678"
                            dir="ltr"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="bg-[#F4F7FD] rounded-xl p-4 space-y-3">
                    <p className="text-xs font-black text-gray-600">الوضع الحالي</p>
                    {(form.contactMode === "phone" || form.contactMode === "both") && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-700" dir="ltr">{form.agent.phone}</span>
                      </div>
                    )}
                    {(form.contactMode === "whatsapp" || form.contactMode === "both") && (
                      <div className="flex items-center gap-2 text-sm">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-gray-700" dir="ltr">{form.agent.whatsapp}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Bottom bar */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              إلغاء
            </button>
            <div className="flex gap-2">
              {TABS.map((t, i) => (
                <button key={t.id} onClick={() => setTab(t.id as any)}
                  className={`w-2 h-2 rounded-full transition-all ${tab === t.id ? "bg-[#0F5373] w-6" : "bg-gray-200"}`} />
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="bg-gradient-to-l from-[#0F5373] to-[#123C79] text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-sm flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              حفظ التغييرات
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
