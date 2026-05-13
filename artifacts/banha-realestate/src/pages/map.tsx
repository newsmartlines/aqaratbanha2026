import "leaflet/dist/leaflet.css";
import React, { useState, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  MapPin, BedDouble, Bath, Maximize2, X, Heart,
  ChevronDown, ChevronRight, Bell, SlidersHorizontal, List,
  Star, CheckCircle, Phone, Search,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PROPERTIES } from "@/data/properties";
import PropertyImage from "@/components/PropertyImage";
import { useHoverScroll } from "@/hooks/useHoverScroll";
import Navbar from "@/components/Navbar";

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
  13: [30.4640, 31.1870],
  14: [30.4590, 31.1760],
  15: [30.4710, 31.1930],
  16: [30.4555, 31.1850],
  17: [30.4695, 31.1775],
  18: [30.4625, 31.1945],
  19: [30.4565, 31.1920],
};

function formatPriceShort(price: number): string {
  if (price >= 1_000_000) {
    const m = price / 1_000_000;
    return m % 1 === 0 ? `${m}م` : `${m.toFixed(1)}م`;
  }
  if (price >= 1_000) return `${Math.round(price / 1_000)}ألف`;
  return String(price);
}

function makePriceIcon(label: string, selected: boolean, featured: boolean) {
  const bg    = selected ? "#123C79" : featured ? "#f59e0b" : "#ffffff";
  const color = selected || featured ? "#ffffff" : "#123C79";
  const border = selected ? "#1EBFD5" : featured ? "#d97706" : "#d1d5db";
  const shadow = selected
    ? "0 4px 18px rgba(18,60,121,0.5)"
    : "0 2px 10px rgba(0,0,0,0.15)";
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${bg};color:${color};border:2px solid ${border};
      padding:4px 10px;border-radius:20px;font-size:11px;font-weight:900;
      white-space:nowrap;box-shadow:${shadow};font-family:Cairo,Arial,sans-serif;
      cursor:pointer;user-select:none;letter-spacing:0.3px;
      transform:${selected ? "scale(1.12)" : "scale(1)"};transition:transform .15s;
    ">${label}</div>`,
    iconAnchor: [32, 16],
    iconSize: [64, 32],
  });
}

function MapEvents({
  onBoundsChange,
  onZoomChange,
}: {
  onBoundsChange: (b: L.LatLngBounds) => void;
  onZoomChange: (z: number) => void;
}) {
  useMapEvents({
    moveend: (e) => onBoundsChange(e.target.getBounds()),
    zoomend: (e) => { onBoundsChange(e.target.getBounds()); onZoomChange(e.target.getZoom()); },
    load:    (e) => { onBoundsChange(e.target.getBounds()); onZoomChange(e.target.getZoom()); },
  });
  return null;
}

/* ── Cluster icon: orange circle with white count ── */
function makeClusterIcon(count: number) {
  const size = count >= 10 ? 44 : 36;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:linear-gradient(135deg,#f97316,#ea580c);
      color:#fff;font-size:${count >= 10 ? 13 : 14}px;font-weight:900;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 16px rgba(249,115,22,0.55),0 0 0 3px rgba(249,115,22,0.2);
      font-family:Cairo,Arial,sans-serif;cursor:pointer;
      border:2.5px solid #fff;
    ">${count}</div>`,
    iconAnchor: [size / 2, size / 2],
    iconSize:   [size, size],
  });
}

/* ── Grid-based clustering ── */
interface Cluster {
  lat: number;
  lng: number;
  ids: number[];
}

function computeClusters(
  props: typeof PROPERTIES,
  zoom: number
): Cluster[] {
  const cellSize = 0.028 / Math.pow(2, Math.max(0, zoom - 12));
  const cells: Record<string, number[]> = {};
  for (const p of props) {
    const coord = COORDS[p.id];
    if (!coord) continue;
    const [lat, lng] = coord;
    const row = Math.floor(lat / cellSize);
    const col = Math.floor(lng / cellSize);
    const key = `${row}_${col}`;
    if (!cells[key]) cells[key] = [];
    cells[key].push(p.id);
  }
  return Object.values(cells).map(ids => {
    const lats = ids.map(id => COORDS[id]?.[0] ?? 0);
    const lngs = ids.map(id => COORDS[id]?.[1] ?? 0);
    return {
      lat: lats.reduce((a, b) => a + b, 0) / lats.length,
      lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
      ids,
    };
  });
}

const CATEGORIES = ["الكل", "شقة", "فيلا", "محل", "مكتب", "أرض سكنية", "مخزن"];
const PRICE_OPTIONS = [
  { label: "أي سعر", value: "" },
  { label: "أقل من 500 ألف", value: "500000" },
  { label: "أقل من مليون", value: "1000000" },
  { label: "أقل من 2 مليون", value: "2000000" },
  { label: "أقل من 5 مليون", value: "5000000" },
];
const AREA_OPTIONS = [
  { label: "أي مساحة", value: "" },
  { label: "أقل من 100 م²", value: "100" },
  { label: "أقل من 150 م²", value: "150" },
  { label: "أقل من 250 م²", value: "250" },
  { label: "أكثر من 250 م²", value: "250+" },
];

function Dropdown({
  label, options, value, onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-sm font-bold transition-all whitespace-nowrap ${open ? "border-[#1EBFD5] text-[#123C79] bg-[#1EBFD5]/5" : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"}`}
      >
        <span>{selected?.label ?? label}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform text-gray-400 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13 }}
            className="absolute top-full mt-1.5 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-[2000] min-w-[160px] overflow-hidden"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-right px-4 py-2.5 text-sm font-medium transition-colors ${value === opt.value ? "bg-[#123C79]/8 text-[#123C79] font-bold" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PropertyCardSmall({
  prop, selected, onClick,
}: {
  prop: typeof PROPERTIES[0];
  selected: boolean;
  onClick: () => void;
}) {
  const [saved, setSaved] = useState(false);
  const [, navigate] = useLocation();
  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/property/${prop.id}`)}
      className={`bg-white rounded-2xl overflow-hidden border cursor-pointer transition-all ${
        selected ? "border-[#1EBFD5] shadow-xl ring-2 ring-[#1EBFD5]/20" : "border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200"
      }`}
    >
      <div className="relative">
        <PropertyImage
          src={prop.image}
          alt={prop.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={e => { e.stopPropagation(); setSaved(v => !v); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${saved ? "bg-rose-500 text-white" : "bg-white/90 text-gray-400 hover:bg-white hover:text-rose-500"}`}
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        </button>
        {prop.images && prop.images.length > 1 && (
          <span className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            📷 {prop.images.length}
          </span>
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {prop.badge === "موثق" && (
            <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg text-white"
              style={{ background: "linear-gradient(135deg,#0f2d5e,#1EBFD5)", boxShadow: "0 2px 8px rgba(30,191,213,0.4)" }}>
              <CheckCircle className="w-2.5 h-2.5 fill-white" /> موثق
            </span>
          )}
          {prop.featured && (
            <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg text-white"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              <Star className="w-2.5 h-2.5 fill-white" /> مميز
            </span>
          )}
        </div>
      </div>
      <div className="p-3.5">
        <p className="text-base font-black text-[#123C79] mb-1">{prop.priceLabel}</p>
        <p className="text-sm text-gray-700 font-semibold line-clamp-1 mb-2">{prop.title}</p>
        <div className="flex items-center text-xs text-gray-400 gap-3">
          {prop.beds > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5" /> {prop.beds}
            </span>
          )}
          {prop.baths > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" /> {prop.baths}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" /> {prop.size} م²
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function MapPage() {
  const [, navigate] = useLocation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [txType, setTxType] = useState<"" | "للبيع" | "للإيجار">("");
  const [category, setCategory] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [areaMax, setAreaMax] = useState("");
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedSearch, setSavedSearch] = useState(false);
  const [zoom, setZoom] = useState(13);
  const cardsRef = useHoverScroll<HTMLDivElement>();

  const handleBoundsChange = useCallback((b: L.LatLngBounds) => setBounds(b), []);
  const handleZoomChange   = useCallback((z: number) => setZoom(z), []);

  const filtered = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (txType && p.type !== txType) return false;
      if (category && category !== "الكل" && p.category !== category) return false;
      if (priceMax && p.price > parseInt(priceMax)) return false;
      if (areaMax && areaMax !== "250+" && p.size > parseInt(areaMax)) return false;
      if (areaMax === "250+" && p.size <= 250) return false;
      if (searchQuery && !p.title.includes(searchQuery) && !p.location.includes(searchQuery)) return false;
      if (bounds && COORDS[p.id]) {
        const [lat, lng] = COORDS[p.id];
        if (!bounds.contains([lat, lng])) return false;
      }
      return true;
    });
  }, [txType, category, priceMax, areaMax, searchQuery, bounds]);

  const selectedProp = selectedId ? PROPERTIES.find(p => p.id === selectedId) : null;

  const txOptions = [
    { label: "للبيع والإيجار", value: "" },
    { label: "للبيع", value: "للبيع" },
    { label: "للإيجار", value: "للإيجار" },
  ];
  const catOptions = CATEGORIES.map(c => ({ label: c === "الكل" ? "كل التصنيفات" : c, value: c === "الكل" ? "" : c }));

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-gray-50" dir="rtl">

      {/* ── MAIN NAVBAR ── */}
      <Navbar showSearch={true} />
      <div className="flex-shrink-0 h-[60px]" />

      {/* ── TOP HEADER ── */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0 z-[1500]">
        <div className="flex items-center gap-3 px-4 py-2.5">
          {/* Save search */}
          <button
            onClick={() => setSavedSearch(v => !v)}
            className={`flex items-center gap-1.5 text-sm font-bold whitespace-nowrap transition-colors ${savedSearch ? "text-[#1EBFD5]" : "text-gray-600 hover:text-[#123C79]"}`}
          >
            <Bell className={`w-4 h-4 ${savedSearch ? "fill-[#1EBFD5] text-[#1EBFD5]" : ""}`} />
            حفظ نتائج البحث
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Location search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالعنوان أو المنطقة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pr-9 pl-8 text-sm focus:outline-none focus:border-[#1EBFD5] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto scroll-hidden">
          <Dropdown
            label="للبيع والإيجار"
            options={txOptions}
            value={txType}
            onChange={v => setTxType(v as any)}
          />
          <Dropdown
            label="كل التصنيفات"
            options={catOptions}
            value={category}
            onChange={setCategory}
          />
          <Dropdown
            label="السعر (ج.م)"
            options={PRICE_OPTIONS}
            value={priceMax}
            onChange={setPriceMax}
          />
          <Dropdown
            label="المساحة"
            options={AREA_OPTIONS}
            value={areaMax}
            onChange={setAreaMax}
          />
          <div className="w-px h-5 bg-gray-200 mx-0.5" />
          <button className="flex items-center gap-1.5 border border-[#1EBFD5] text-[#1EBFD5] rounded-lg px-3 py-2 text-sm font-bold hover:bg-[#1EBFD5]/5 transition-colors whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            المزيد من الخيارات
          </button>

          {(txType || category || priceMax || areaMax) && (
            <button
              onClick={() => { setTxType(""); setCategory(""); setPriceMax(""); setAreaMax(""); }}
              className="text-xs text-rose-500 font-bold border border-rose-200 rounded-lg px-2.5 py-1.5 hover:bg-rose-50 transition-colors whitespace-nowrap"
            >
              مسح الكل
            </button>
          )}

          <span className="mr-auto text-xs text-gray-500 font-medium whitespace-nowrap">
            <span className="font-black text-[#123C79]">{filtered.length}</span> عقار
          </span>
        </div>
      </header>

      {/* ── MAIN: MAP + CARDS ── */}
      <div className="flex flex-1 overflow-hidden" style={{ direction: "ltr" }}>

        {/* ── LEFT: MAP ── */}
        <div className="flex-1 relative min-w-0" style={{ direction: "rtl" }}>
          <MapContainer
            center={BANHA_CENTER}
            zoom={13}
            zoomControl={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              maxZoom={19}
            />
            <MapEvents onBoundsChange={handleBoundsChange} onZoomChange={handleZoomChange} />

            {computeClusters(filtered.filter(p => COORDS[p.id]), zoom).map((cluster, i) => {
              const isSingle = cluster.ids.length === 1;
              const singleId = cluster.ids[0];
              const singleProp = isSingle ? PROPERTIES.find(p => p.id === singleId) : null;
              const isSelected = isSingle && selectedId === singleId;

              return (
                <Marker
                  key={`cluster-${i}`}
                  position={[cluster.lat, cluster.lng]}
                  icon={isSingle && singleProp
                    ? makePriceIcon(formatPriceShort(singleProp.price), isSelected, singleProp.featured)
                    : makeClusterIcon(cluster.ids.length)
                  }
                  eventHandlers={{
                    click: () => {
                      if (isSingle) {
                        setSelectedId(singleId === selectedId ? null : singleId);
                      }
                    },
                  }}
                  zIndexOffset={isSelected ? 1000 : isSingle && singleProp?.featured ? 100 : 0}
                />
              );
            })}
          </MapContainer>

          {/* ── SELECTED PROPERTY POPUP ── */}
          <AnimatePresence>
            {selectedProp && (
              <motion.div
                key={selectedProp.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
                className="absolute bottom-6 right-4 z-[1000] w-[320px] max-w-[calc(100%-2rem)]"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  {/* Close + heart */}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
                    <button
                      onClick={() => setSelectedId(null)}
                      className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 hover:text-rose-500 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex gap-0">
                    {/* Info */}
                    <div className="flex-1 p-4 min-w-0">
                      <p className="text-lg font-black text-[#123C79] mb-1">{selectedProp.priceLabel}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3 text-[#1EBFD5] flex-shrink-0" />
                        <span className="line-clamp-1">{selectedProp.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        {selectedProp.beds > 0 && (
                          <span className="flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-gray-400" /> {selectedProp.beds}
                          </span>
                        )}
                        {selectedProp.baths > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-gray-400" /> {selectedProp.baths}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-gray-400" /> {selectedProp.size} م²
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => navigate(`/property/${selectedProp.id}`)}
                          className="flex-1 py-2 rounded-xl text-xs font-black text-white"
                          style={{ background: "linear-gradient(135deg,#123C79,#1EBFD5)" }}
                        >
                          عرض التفاصيل
                        </button>
                        <a
                          href={`https://wa.me/${selectedProp.agent.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-colors flex-shrink-0"
                        >
                          <FaWhatsapp className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${selectedProp.agent.phone}`}
                          className="w-8 h-8 bg-[#123C79] rounded-xl flex items-center justify-center text-white hover:bg-[#0d2b5e] transition-colors flex-shrink-0"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-28 flex-shrink-0">
                      <PropertyImage
                        src={selectedProp.image}
                        alt={selectedProp.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded-md text-white ${selectedProp.type === "للبيع" ? "bg-[#123C79]" : "bg-[#1EBFD5]"}`}>
                        {selectedProp.type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: PROPERTY CARDS ── */}
        <div className="w-[460px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
          {/* Cards header */}
          <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <span className="text-sm font-black text-gray-900">العقارات المتاحة</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-bold">{filtered.length} عقار</span>
          </div>

          {/* Cards scroll */}
          <div
            ref={cardsRef}
            className="flex-1 overflow-y-auto scroll-subtle p-3"
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                <MapPin className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">لا توجد عقارات</p>
                <p className="text-xs mt-1 text-center">حرّك الخريطة أو عدّل الفلاتر</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {filtered.map(prop => (
                  <PropertyCardSmall
                    key={prop.id}
                    prop={prop}
                    selected={selectedId === prop.id}
                    onClick={() => setSelectedId(prop.id === selectedId ? null : prop.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
