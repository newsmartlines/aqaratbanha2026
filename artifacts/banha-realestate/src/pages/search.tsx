import React, { useState, useEffect, useRef } from "react";
import { useHoverScroll } from "@/hooks/useHoverScroll";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { PROPERTIES } from "@/data/properties";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Search, SlidersHorizontal, Grid3X3, List, MapPin,
  BedDouble, Bath, Maximize2, Phone, Heart, ChevronDown,
  ChevronRight, X, Check, LayoutGrid, LayoutList, ArrowUpDown,
  Building2, Home, Store, Briefcase, Warehouse, Trees, Layers,
  Stethoscope, Star, TrendingUp, Filter, ArrowLeft, SortAsc,
  Menu, ChevronLeft, RotateCcw, CheckCircle, Map
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import PropertyImage from "@/components/PropertyImage";

const PROPERTY_TYPES: Record<string, string[]> = {
  سكني: ["شقة", "دوبلكس", "بنتهاوس", "فيلا", "استوديو", "استراحة"],
  تجاري: ["محل", "مول", "مطعم", "كافيه", "مخزن"],
  إداري: ["مكتب", "مقر شركة", "مساحة عمل"],
  طبي: ["صيدلية", "عيادة", "مركز طبي"],
  أراضي: ["أرض سكنية", "أرض تجارية", "أرض زراعية"],
  مباني: ["عمارة سكنية", "مبنى تجاري", "فيلا مقسمة"],
};

const ALL_AREAS = [
  "الفلل", "الأهرام", "أتريب", "المنشية", "كفر الجزار",
  "ميت العطار", "المطرية", "وسط البلد", "شبرا النملة", "الشوبك",
];

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث" },
  { value: "price_asc", label: "السعر: الأقل أولاً" },
  { value: "price_desc", label: "السعر: الأعلى أولاً" },
  { value: "area_asc", label: "المساحة: الأقل أولاً" },
  { value: "area_desc", label: "المساحة: الأكبر أولاً" },
];

const MOCK_PROPERTIES = PROPERTIES.map(p => ({
  id: p.id,
  title: p.title,
  location: p.location,
  price: p.price,
  priceLabel: p.priceLabel,
  type: p.type,
  category: p.category,
  beds: p.beds,
  baths: p.baths,
  area: p.size,
  badge: p.badge,
  agent: p.agent,
  image: p.image,
  featured: p.featured,
}));

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-right"
      >
        <span className="font-bold text-gray-800 text-sm">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 cursor-pointer group">
      <div className="flex items-center gap-2.5">
        <div
          onClick={onChange}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? "border-[#123C79] bg-[#123C79]" : "border-gray-300 group-hover:border-[#1EBFD5]"}`}
        >
          {checked && <Check className="w-2.5 h-2.5 text-white" />}
        </div>
        <span className={`text-sm transition-colors ${checked ? "text-[#123C79] font-semibold" : "text-gray-600 group-hover:text-gray-900"}`}>{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">{count}</span>
      )}
    </label>
  );
}

function PriceRangeInput({
  min, max, onMinChange, onMaxChange
}: { min: string; max: string; onMinChange: (v: string) => void; onMaxChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">من</label>
          <input
            type="number"
            placeholder="0"
            value={min}
            onChange={e => onMinChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#123C79] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">إلى</label>
          <input
            type="number"
            placeholder="∞"
            value={max}
            onChange={e => onMaxChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#123C79] focus:outline-none transition-colors"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["500,000", "1,000,000", "2,000,000", "5,000,000"].map(v => (
          <button
            key={v}
            onClick={() => onMaxChange(v.replace(/,/g, ""))}
            className="text-xs border border-gray-200 rounded-full px-2.5 py-1 hover:border-[#1EBFD5] hover:text-[#123C79] transition-colors"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function BedsSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {[0, 1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n === value ? -1 : n)}
          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${value === n ? "bg-[#123C79] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-[#123C79]/10 hover:text-[#123C79]"}`}
        >
          {n === 0 ? "أي" : n === 5 ? "5+" : n}
        </button>
      ))}
    </div>
  );
}

function PropertyCard({ prop, view }: { prop: typeof MOCK_PROPERTIES[0]; view: "grid" | "list" }) {
  const [saved, setSaved] = useState(false);
  const [, navigate] = useLocation();
  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        data-testid={`card-property-${prop.id}`}
        onClick={() => navigate(`/property/${prop.id}`)}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all group flex cursor-pointer"
      >
        <div className="relative w-64 flex-shrink-0 overflow-hidden">
          <PropertyImage src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-sm ${prop.type === "للبيع" ? "bg-[#123C79]/90" : "bg-[#1EBFD5]/90"}`}>
              {prop.type}
            </span>
            {prop.featured && (
              <span className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-sm"
                style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                <Star className="w-2.5 h-2.5 fill-white text-white" /> مميز
              </span>
            )}
            {prop.badge && prop.badge !== "مميز" && (
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-sm"
                style={{
                  background: prop.badge === "موثق" ? "linear-gradient(135deg,#123C79,#1EBFD5)"
                    : prop.badge === "جديد" ? "linear-gradient(135deg,#1EBFD5,#0e8fa3)"
                    : prop.badge === "فرصة" ? "linear-gradient(135deg,#f97316,#ea580c)"
                    : "linear-gradient(135deg,#6b7280,#4b5563)",
                }}>
                {prop.badge === "موثق" && <CheckCircle className="w-2.5 h-2.5 fill-white text-white inline ml-1" />}
                {prop.badge}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="mb-2">
              <p className="text-xl font-black text-[#123C79] mb-1">{prop.priceLabel}</p>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#123C79] transition-colors">{prop.title}</h3>
              <div className="flex items-center text-gray-500 mt-1 text-sm">
                <MapPin className="w-3.5 h-3.5 ml-1 text-[#1EBFD5]" />{prop.location}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3">
              {prop.beds > 0 && <span className="flex items-center gap-1.5 text-sm text-gray-600"><BedDouble className="w-4 h-4 text-gray-400" />{prop.beds} غرف</span>}
              {prop.baths > 0 && <span className="flex items-center gap-1.5 text-sm text-gray-600"><Bath className="w-4 h-4 text-gray-400" />{prop.baths} حمام</span>}
              <span className="flex items-center gap-1.5 text-sm text-gray-600"><Maximize2 className="w-4 h-4 text-gray-400" />{prop.area} م²</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{prop.category}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2">
              <button onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"><FaWhatsapp className="w-4 h-4" /></button>
              <button onClick={e => e.stopPropagation()} className="w-8 h-8 rounded-full bg-[#123C79]/5 text-[#123C79] flex items-center justify-center hover:bg-[#123C79] hover:text-white transition-colors"><Phone className="w-3.5 h-3.5" /></button>
              <button onClick={e => { e.stopPropagation(); setSaved(!saved); }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${saved ? "bg-rose-500 text-white" : "bg-gray-50 text-gray-400 hover:bg-rose-500 hover:text-white"}`}><Heart className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} /></button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      data-testid={`card-property-${prop.id}`}
      onClick={() => navigate(`/property/${prop.id}`)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all group cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <PropertyImage src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-sm ${prop.type === "للبيع" ? "bg-[#123C79]/90" : "bg-[#1EBFD5]/90"}`}>
            {prop.type}
          </span>
          {prop.featured && (
            <span className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-sm"
              style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
              <Star className="w-2.5 h-2.5 fill-white text-white" /> مميز
            </span>
          )}
          {prop.badge && prop.badge !== "مميز" && (
            <span className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md backdrop-blur-sm"
              style={{
                background: prop.badge === "موثق" ? "linear-gradient(135deg,#123C79,#1EBFD5)"
                  : prop.badge === "جديد" ? "linear-gradient(135deg,#1EBFD5,#0e8fa3)"
                  : prop.badge === "فرصة" ? "linear-gradient(135deg,#f97316,#ea580c)"
                  : "linear-gradient(135deg,#6b7280,#4b5563)",
              }}>
              {prop.badge === "موثق" && <CheckCircle className="w-2.5 h-2.5 fill-white text-white" />}
              {prop.badge}
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute bottom-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm backdrop-blur-md ${saved ? "bg-rose-500 text-white" : "bg-white/80 text-gray-400 hover:bg-rose-500 hover:text-white"}`}
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-lg font-black text-[#123C79] mb-1">{prop.priceLabel}</p>
        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#123C79] transition-colors mb-1 leading-snug">{prop.title}</h3>
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 ml-1 text-[#1EBFD5]" />{prop.location}
        </div>
        <div className="flex items-center gap-3 py-3 border-t border-b border-gray-100 mb-3">
          {prop.beds > 0 && <span className="flex items-center gap-1 text-xs text-gray-600 flex-1 justify-center"><BedDouble className="w-3.5 h-3.5 text-gray-400" />{prop.beds}</span>}
          {prop.baths > 0 && <span className="flex items-center gap-1 text-xs text-gray-600 flex-1 justify-center border-x border-gray-100"><Bath className="w-3.5 h-3.5 text-gray-400" />{prop.baths}</span>}
          <span className="flex items-center gap-1 text-xs text-gray-600 flex-1 justify-center"><Maximize2 className="w-3.5 h-3.5 text-gray-400" />{prop.area} م²</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <button onClick={e => e.stopPropagation()} className="w-7 h-7 rounded-full bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"><FaWhatsapp className="w-3.5 h-3.5" /></button>
            <button onClick={e => e.stopPropagation()} className="w-7 h-7 rounded-full bg-[#123C79]/5 text-[#123C79] flex items-center justify-center hover:bg-[#123C79] hover:text-white transition-colors"><Phone className="w-3 h-3" /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SearchPage() {
  const [, navigate] = useLocation();
  const sidebarRef = useHoverScroll<HTMLElement>();
  const resultsRef = useHoverScroll<HTMLElement>();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [txType, setTxType] = useState<"" | "للبيع" | "للإيجار">("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [minBeds, setMinBeds] = useState(-1);
  const [minBaths, setMinBaths] = useState(-1);
  const [areaMin, setAreaMin] = useState("");
  const [areaMax, setAreaMax] = useState("");

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const toggleArr = (arr: string[], val: string, set: (a: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const toggleCategory = (cat: string) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    if (!next.includes(cat)) {
      setSelectedSubTypes(prev => prev.filter(s => !PROPERTY_TYPES[cat]?.includes(s)));
    }
  };

  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Filtered results
  const filtered = MOCK_PROPERTIES.filter(p => {
    if (txType && p.type !== txType) return false;
    if (selectedSubTypes.length > 0 && !selectedSubTypes.includes(p.category)) return false;
    else if (selectedSubTypes.length === 0 && selectedCategories.length > 0) {
      const allSubs = selectedCategories.flatMap(c => PROPERTY_TYPES[c] || []);
      if (!allSubs.includes(p.category)) return false;
    }
    if (selectedAreas.length > 0 && !selectedAreas.some(a => p.location.includes(a))) return false;
    if (priceMin && p.price < Number(priceMin)) return false;
    if (priceMax && p.price > Number(priceMax)) return false;
    if (minBeds > 0 && p.beds < minBeds) return false;
    if (minBaths > 0 && p.baths < minBaths) return false;
    if (areaMin && p.area < Number(areaMin)) return false;
    if (areaMax && p.area > Number(areaMax)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "area_asc") return a.area - b.area;
    if (sort === "area_desc") return b.area - a.area;
    return b.id - a.id;
  });

  const activeFiltersCount = [
    txType ? 1 : 0,
    selectedCategories.length,
    selectedAreas.length,
    priceMin || priceMax ? 1 : 0,
    minBeds > 0 ? 1 : 0,
    minBaths > 0 ? 1 : 0,
    areaMin || areaMax ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () => {
    setTxType("");
    setSelectedCategories([]);
    setExpandedCategories([]);
    setSelectedSubTypes([]);
    setSelectedAreas([]);
    setPriceMin("");
    setPriceMax("");
    setMinBeds(-1);
    setMinBaths(-1);
    setAreaMin("");
    setAreaMax("");
  };

  const FilterPanel = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#123C79]" />
          <span className="font-black text-gray-900 text-base">الفلاتر</span>
          {activeFiltersCount > 0 && (
            <span className="bg-[#123C79] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors font-medium">
            <RotateCcw className="w-3.5 h-3.5" /> مسح الكل
          </button>
        )}
      </div>

      {/* Transaction Type */}
      <FilterSection title="الحالة">
        <div className="flex gap-2">
          {["", "للبيع", "للإيجار"].map(t => (
            <button
              key={t || "all"}
              onClick={() => setTxType(t as any)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${txType === t ? "bg-[#123C79] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {t || "الكل"}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Category Tree */}
      <FilterSection title="تصنيف العقار">
        <div className="space-y-1">
          {Object.entries(PROPERTY_TYPES).map(([cat, subs]) => (
            <div key={cat}>
              <div className="flex items-center gap-2">
                <div
                  onClick={() => toggleCategory(cat)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${selectedCategories.includes(cat) ? "border-[#123C79] bg-[#123C79]" : "border-gray-300 hover:border-[#1EBFD5]"}`}
                >
                  {selectedCategories.includes(cat) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span
                  onClick={() => toggleCategory(cat)}
                  className={`text-sm cursor-pointer flex-1 py-1.5 font-medium ${selectedCategories.includes(cat) ? "text-[#123C79] font-semibold" : "text-gray-700"}`}
                >
                  {cat}
                </span>
                <button onClick={() => toggleCategoryExpand(cat)} className="text-gray-400 hover:text-gray-600">
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedCategories.includes(cat) ? "rotate-90" : ""}`} />
                </button>
              </div>
              <AnimatePresence>
                {expandedCategories.includes(cat) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden mr-6 mt-1 space-y-0.5"
                  >
                    {subs.map(sub => (
                      <CheckOption
                        key={sub}
                        label={sub}
                        checked={selectedSubTypes.includes(sub)}
                        onChange={() => toggleArr(selectedSubTypes, sub, setSelectedSubTypes)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Areas */}
      <FilterSection title="المنطقة">
        <div className="space-y-0.5">
          {ALL_AREAS.map(area => (
            <CheckOption
              key={area}
              label={area}
              checked={selectedAreas.includes(area)}
              onChange={() => toggleArr(selectedAreas, area, setSelectedAreas)}
              count={MOCK_PROPERTIES.filter(p => p.location.includes(area)).length}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="السعر (ج.م)">
        <PriceRangeInput min={priceMin} max={priceMax} onMinChange={setPriceMin} onMaxChange={setPriceMax} />
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="عدد الغرف">
        <BedsSelector value={minBeds} onChange={setMinBeds} />
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="عدد الحمامات">
        <BedsSelector value={minBaths} onChange={setMinBaths} />
      </FilterSection>

      {/* Area size */}
      <FilterSection title="المساحة (م²)" defaultOpen={false}>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">من</label>
            <input type="number" placeholder="0" value={areaMin} onChange={e => setAreaMin(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#123C79] focus:outline-none transition-colors" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">إلى</label>
            <input type="number" placeholder="∞" value={areaMax} onChange={e => setAreaMax(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#123C79] focus:outline-none transition-colors" />
          </div>
        </div>
      </FilterSection>

      {/* Apply */}
      <div className="pt-4">
        <button
          className="w-full py-3 rounded-xl font-bold text-white text-sm bg-[#123C79] hover:bg-[#0d2b5e] transition-colors"
          onClick={() => setMobileFilterOpen(false)}
        >
          عرض {filtered.length} نتيجة
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-foreground" dir="rtl">

      <Navbar showSearch scrolled={scrolled} />

      <div className="pt-[65px]">
        {/* ─── BREADCRUMB + RESULTS BAR ─────────────────────── */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <button onClick={() => navigate("/")} className="hover:text-[#123C79] transition-colors">الرئيسية</button>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-semibold">نتائج البحث</span>
              <span className="text-gray-400 text-xs">({sorted.length} عقار)</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 hover:border-[#123C79] transition-colors"
              >
                <Filter className="w-4 h-4" />
                الفلاتر
                {activeFiltersCount > 0 && (
                  <span className="bg-[#123C79] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 hover:border-[#123C79] transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="hidden sm:inline">{SORT_OPTIONS.find(s => s.value === sort)?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          className={`w-full text-right px-4 py-3 text-sm font-medium hover:bg-[#123C79]/5 transition-colors flex items-center justify-between ${sort === opt.value ? "text-[#123C79] font-bold bg-[#123C79]/5" : "text-gray-700"}`}
                        >
                          {opt.label}
                          {sort === opt.value && <Check className="w-4 h-4 text-[#123C79]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Map view button */}
              <button
                onClick={() => navigate("/map")}
                className="flex items-center gap-1.5 border-2 border-[#1EBFD5] text-[#1EBFD5] rounded-xl px-3 py-2 text-xs font-black hover:bg-[#1EBFD5] hover:text-white transition-all"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">عرض الخريطة</span>
              </button>

              {/* View toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                <button onClick={() => setView("grid")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === "grid" ? "bg-white text-[#123C79]" : "text-gray-400 hover:text-gray-600"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setView("list")} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === "list" ? "bg-white text-[#123C79]" : "text-gray-400 hover:text-gray-600"}`}>
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MAIN LAYOUT ────────────────────────────────────── */}
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex gap-6">

            {/* ─── RIGHT SIDEBAR (Filters) ──────────────────── */}
            <aside
              ref={sidebarRef}
              className="hidden md:block w-72 flex-shrink-0 overflow-y-auto scroll-subtle rounded-2xl"
              style={{ maxHeight: "calc(100vh - 8rem)" }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <FilterPanel />
              </div>
            </aside>

            {/* ─── RESULTS ──────────────────────────────────── */}
            <main
              ref={resultsRef}
              className="flex-1 min-w-0 overflow-y-auto scroll-subtle"
              style={{ maxHeight: "calc(100vh - 8rem)" }}
            >

              {/* Active filter chips — above the cards */}
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 flex flex-wrap items-center gap-2"
                >
                  <span className="text-xs text-gray-500 font-medium flex-shrink-0">الفلاتر النشطة:</span>
                  {txType && (
                    <span className="inline-flex items-center gap-1.5 bg-[#123C79]/10 text-[#123C79] text-xs font-bold px-3 py-1.5 rounded-full">
                      {txType}
                      <button onClick={() => setTxType("")} className="hover:text-[#123C79]/60 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {selectedCategories.map(c => (
                    <span key={c} className="inline-flex items-center gap-1.5 bg-[#123C79]/10 text-[#123C79] text-xs font-bold px-3 py-1.5 rounded-full">
                      {c}
                      <button onClick={() => toggleCategory(c)} className="hover:text-[#123C79]/60 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {selectedSubTypes.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 bg-[#123C79]/10 text-[#123C79] text-xs font-bold px-3 py-1.5 rounded-full">
                      {s}
                      <button onClick={() => toggleArr(selectedSubTypes, s, setSelectedSubTypes)} className="hover:text-[#123C79]/60 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {selectedAreas.map(a => (
                    <span key={a} className="inline-flex items-center gap-1.5 bg-[#1EBFD5]/15 text-[#0d8fa3] text-xs font-bold px-3 py-1.5 rounded-full">
                      {a}
                      <button onClick={() => toggleArr(selectedAreas, a, setSelectedAreas)} className="hover:text-[#0d8fa3]/60 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {(priceMin || priceMax) && (
                    <span className="inline-flex items-center gap-1.5 bg-[#123C79]/10 text-[#123C79] text-xs font-bold px-3 py-1.5 rounded-full">
                      السعر
                      <button onClick={() => { setPriceMin(""); setPriceMax(""); }} className="hover:text-[#123C79]/60 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {minBeds > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-[#123C79]/10 text-[#123C79] text-xs font-bold px-3 py-1.5 rounded-full">
                      {minBeds}+ غرف
                      <button onClick={() => setMinBeds(-1)} className="hover:text-[#123C79]/60 transition-colors"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-500 font-bold hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-full transition-colors"
                  >
                    مسح الكل
                  </button>
                </motion.div>
              )}

              {sorted.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-500 text-sm mb-6">جرب تعديل الفلاتر للحصول على نتائج أكثر</p>
                  <button
                    onClick={clearAll}
                    className="text-white px-6 py-3 rounded-xl font-bold text-sm bg-[#123C79] hover:bg-[#0d2b5e] transition-colors"
                  >
                    مسح كل الفلاتر
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                    {sorted.map((prop, i) => (
                      <motion.div
                        key={prop.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                      >
                        <PropertyCard prop={prop} view={view} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#123C79] hover:text-[#123C79] transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {[1, 2, 3].map(p => (
                      <button
                        key={p}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === 1 ? "bg-[#123C79] text-white shadow-sm" : "border-2 border-gray-200 text-gray-600 hover:border-[#123C79] hover:text-[#123C79]"}`}
                      >
                        {p}
                      </button>
                    ))}
                    <span className="text-gray-400 text-sm px-1">...</span>
                    <button className="w-10 h-10 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-[#123C79] hover:text-[#123C79] transition-colors">
                      8
                    </button>
                    <button className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#123C79] hover:text-[#123C79] transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ─── MOBILE FILTER DRAWER ───────────────────────────── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <span className="font-black text-gray-900 text-lg">الفلاتر</span>
                <button onClick={() => setMobileFilterOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <FilterPanel />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
