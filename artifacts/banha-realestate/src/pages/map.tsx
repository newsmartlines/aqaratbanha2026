import "leaflet/dist/leaflet.css";
import React, { useState, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  MapPin, BedDouble, Bath, Maximize2, X, SlidersHorizontal,
  ChevronLeft, Phone, Star, CheckCircle, Search, Home,
  List, ArrowLeft, Filter
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PROPERTIES } from "@/data/properties";
import Navbar from "@/components/Navbar";
import PropertyImage from "@/components/PropertyImage";

const BANHA_CENTER: [number, number] = [30.4632, 31.1847];

const COORDS: Record<number, [number, number]> = {
  1:  [30.4722, 31.1748],
  2:  [30.4578, 31.1822],
  3:  [30.4662, 31.1912],
  4:  [30.4608, 31.1798],
  5:  [30.4735, 31.1884],
  6:  [30.4548, 31.2002],
  7:  [30.4718, 31.1738],
  8:  [30.4572, 31.1830],
  9:  [30.4688, 31.1958],
  10: [30.4668, 31.1902],
  11: [30.4602, 31.1792],
  12: [30.4728, 31.1762],
};

function makePriceIcon(label: string, selected: boolean, featured: boolean) {
  const bg = selected ? "#123C79" : featured ? "#f59e0b" : "white";
  const color = selected || featured ? "white" : "#123C79";
  const border = selected ? "#1EBFD5" : featured ? "#d97706" : "#123C79";
  const shadow = selected
    ? "0 4px 16px rgba(18,60,121,0.45)"
    : "0 2px 10px rgba(0,0,0,0.18)";
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${bg};color:${color};border:2px solid ${border};
      padding:4px 9px;border-radius:20px;font-size:11px;font-weight:900;
      white-space:nowrap;box-shadow:${shadow};font-family:Arial,sans-serif;
      cursor:pointer;transition:all .15s;user-select:none;
    ">${label}</div>`,
    iconAnchor: [30, 15],
    iconSize: [60, 30],
  });
}

function MapEvents({ onBoundsChange }: { onBoundsChange: (b: L.LatLngBounds) => void }) {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => onBoundsChange(e.target.getBounds()),
    load:    (e) => onBoundsChange(e.target.getBounds()),
  });
  return null;
}

function BadgePill({ badge, featured }: { badge?: string; featured?: boolean }) {
  if (featured)
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
        style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
        <Star className="w-2.5 h-2.5 fill-white" /> مميز
      </span>
    );
  if (badge === "موثق")
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full text-white"
        style={{ background: "linear-gradient(135deg,#123C79,#1EBFD5)" }}>
        <CheckCircle className="w-2.5 h-2.5 fill-white" /> موثق
      </span>
    );
  if (badge === "جديد")
    return (
      <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
        style={{ background: "linear-gradient(135deg,#1EBFD5,#0e8fa3)" }}>جديد</span>
    );
  if (badge === "فرصة")
    return (
      <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
        style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>فرصة</span>
    );
  return null;
}

export default function MapPage() {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [txType, setTxType] = useState<"" | "للبيع" | "للإيجار">("");
  const [minBeds, setMinBeds] = useState(-1);
  const [priceMax, setPriceMax] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBoundsChange = useCallback((b: L.LatLngBounds) => setBounds(b), []);

  const filtered = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (txType && p.type !== txType) return false;
      if (minBeds > 0 && p.beds < minBeds) return false;
      if (priceMax && p.price > parseInt(priceMax.replace(/,/g, ""))) return false;
      if (searchQuery && !p.title.includes(searchQuery) && !p.location.includes(searchQuery)) return false;
      if (bounds && COORDS[p.id]) {
        const [lat, lng] = COORDS[p.id];
        if (!bounds.contains([lat, lng])) return false;
      }
      return true;
    });
  }, [txType, minBeds, priceMax, searchQuery, bounds]);

  const selectedProp = selectedId ? PROPERTIES.find(p => p.id === selectedId) : null;
  const activeCount = [txType, minBeds > 0, priceMax].filter(Boolean).length;

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden" dir="rtl">
      <Navbar scrolled />

      <div className="flex flex-1 overflow-hidden" style={{ paddingTop: 57 }}>

        {/* ── Sidebar ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="h-full bg-white border-l border-gray-100 flex flex-col z-[500] flex-shrink-0 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1EBFD5]" />
                    <h1 className="font-black text-gray-900 text-sm">بحث الخريطة</h1>
                    <span className="text-xs bg-[#123C79] text-white font-bold px-2 py-0.5 rounded-full">{filtered.length}</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search box */}
                <div className="relative mb-3">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث باسم العقار أو المنطقة..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#123C79] transition-colors bg-gray-50"
                  />
                </div>

                {/* Type toggle */}
                <div className="flex gap-1.5 mb-3">
                  {(["", "للبيع", "للإيجار"] as const).map(t => (
                    <button
                      key={t || "all"}
                      onClick={() => setTxType(t)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${txType === t ? "bg-[#123C79] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                    >
                      {t || "الكل"}
                    </button>
                  ))}
                </div>

                {/* Price max */}
                <div className="mb-3">
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">الحد الأقصى للسعر (ج.م)</label>
                  <input
                    type="number"
                    placeholder="أي سعر"
                    value={priceMax}
                    onChange={e => setPriceMax(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#123C79] transition-colors"
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {["500000", "1000000", "2000000", "5000000"].map(v => (
                      <button key={v} onClick={() => setPriceMax(v)}
                        className={`text-[10px] border rounded-full px-2 py-0.5 transition-colors flex-1 ${priceMax === v ? "border-[#123C79] bg-[#123C79] text-white" : "border-gray-200 text-gray-500 hover:border-[#1EBFD5]"}`}>
                        {parseInt(v) >= 1000000 ? `${parseInt(v) / 1000000}م` : `${parseInt(v) / 1000}ألف`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Beds */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">عدد الغرف</label>
                  <div className="flex gap-1.5">
                    {[-1, 1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setMinBeds(n === minBeds ? -1 : n)}
                        className={`flex-1 h-7 rounded-xl text-xs font-bold transition-all ${minBeds === n ? "bg-[#123C79] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {n === -1 ? "أي" : n === 5 ? "5+" : n}
                      </button>
                    ))}
                  </div>
                </div>

                {activeCount > 0 && (
                  <button
                    onClick={() => { setTxType(""); setMinBeds(-1); setPriceMax(""); setSearchQuery(""); }}
                    className="mt-3 w-full text-xs text-rose-500 font-bold border border-rose-200 bg-rose-50 hover:bg-rose-100 py-1.5 rounded-xl transition-colors"
                  >
                    مسح الفلاتر ({activeCount})
                  </button>
                )}
              </div>

              {/* Property list */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <MapPin className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm font-medium">لا توجد عقارات في هذه المنطقة</p>
                    <p className="text-xs mt-1">حرّك الخريطة أو عدّل الفلاتر</p>
                  </div>
                ) : (
                  filtered.map(prop => (
                    <motion.div
                      key={prop.id}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      onClick={() => setSelectedId(prop.id === selectedId ? null : prop.id)}
                      className={`flex gap-3 p-3 cursor-pointer transition-all ${
                        selectedId === prop.id
                          ? "bg-[#123C79]/5 border-r-[3px] border-[#123C79]"
                          : "border-r-[3px] border-transparent"
                      }`}
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                        <PropertyImage
                          src={prop.image}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {prop.featured && (
                          <div className="absolute top-1 right-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 drop-shadow" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs line-clamp-1 mb-0.5">{prop.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
                          <MapPin className="w-2.5 h-2.5 text-[#1EBFD5]" />
                          <span>{prop.area}</span>
                        </div>
                        <p className="text-sm font-black text-[#123C79]">{prop.priceLabel}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          {prop.beds > 0 && <span className="flex items-center gap-0.5"><BedDouble className="w-2.5 h-2.5" />{prop.beds}</span>}
                          {prop.baths > 0 && <span className="flex items-center gap-0.5"><Bath className="w-2.5 h-2.5" />{prop.baths}</span>}
                          <span className="flex items-center gap-0.5"><Maximize2 className="w-2.5 h-2.5" />{prop.size}م²</span>
                          <span className={`mr-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${prop.type === "للبيع" ? "bg-[#123C79]" : "bg-[#1EBFD5]"}`}>{prop.type}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Map ── */}
        <div className="flex-1 relative">

          {/* Toggle sidebar */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="absolute top-4 right-4 z-[1000] bg-white shadow-lg border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {sidebarOpen ? "إخفاء القائمة" : "عرض القائمة"}
            {!sidebarOpen && filtered.length > 0 && (
              <span className="bg-[#123C79] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{filtered.length}</span>
            )}
          </button>

          {/* Home link */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 z-[1000] bg-white shadow-lg border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4 text-[#123C79]" />
            الرئيسية
          </button>

          {/* Map title badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
            <div className="bg-white shadow-lg border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-[#1EBFD5]" />
              <span>بنها، القليوبية</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-[#123C79] font-black">{filtered.length} عقار</span>
            </div>
          </div>

          <MapContainer
            center={BANHA_CENTER}
            zoom={13}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              maxZoom={19}
            />
            <MapEvents onBoundsChange={handleBoundsChange} />

            {PROPERTIES.filter(p => filtered.some(f => f.id === p.id)).map(prop => (
              COORDS[prop.id] ? (
                <Marker
                  key={prop.id}
                  position={COORDS[prop.id]}
                  icon={makePriceIcon(prop.priceLabel, selectedId === prop.id, prop.featured)}
                  eventHandlers={{
                    click: () => setSelectedId(prop.id === selectedId ? null : prop.id),
                  }}
                  zIndexOffset={selectedId === prop.id ? 1000 : prop.featured ? 100 : 0}
                />
              ) : null
            ))}
          </MapContainer>

          {/* Selected property card — slides up from bottom */}
          <AnimatePresence>
            {selectedProp && (
              <motion.div
                key={selectedProp.id}
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 120, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[420px] max-w-[calc(100vw-2rem)]"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="flex gap-0">
                    {/* Image */}
                    <div className="relative w-36 flex-shrink-0">
                      <PropertyImage
                        src={selectedProp.image}
                        alt={selectedProp.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-sm ${selectedProp.type === "للبيع" ? "bg-[#123C79]" : "bg-[#1EBFD5]"}`}>
                          {selectedProp.type}
                        </span>
                        {selectedProp.featured && <BadgePill featured />}
                        {selectedProp.badge && selectedProp.badge !== "مميز" && <BadgePill badge={selectedProp.badge} />}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 min-w-0">
                      <button
                        onClick={() => setSelectedId(null)}
                        className="absolute top-3 left-3 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <p className="font-black text-gray-900 text-sm line-clamp-1 mb-1 ml-8">{selectedProp.title}</p>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-2">
                        <MapPin className="w-3 h-3 text-[#1EBFD5]" />
                        <span>{selectedProp.location}</span>
                      </div>
                      <p className="text-lg font-black text-[#123C79] mb-2">{selectedProp.priceLabel}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        {selectedProp.beds > 0 && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" />{selectedProp.beds} غرف</span>}
                        {selectedProp.baths > 0 && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{selectedProp.baths} حمام</span>}
                        <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{selectedProp.size} م²</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/property/${selectedProp.id}`)}
                          className="flex-1 py-2 rounded-xl text-xs font-black text-white transition-colors"
                          style={{ background: "linear-gradient(135deg,#123C79,#1EBFD5)" }}
                        >
                          عرض التفاصيل
                        </button>
                        <a
                          href={`https://wa.me/${selectedProp.agent.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-colors flex-shrink-0"
                        >
                          <FaWhatsapp className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${selectedProp.agent.phone}`}
                          onClick={e => e.stopPropagation()}
                          className="w-9 h-9 bg-[#123C79] rounded-xl flex items-center justify-center text-white hover:bg-[#0d2b5e] transition-colors flex-shrink-0"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
