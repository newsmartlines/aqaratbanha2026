import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInternalScroll } from "@/hooks/useInternalScroll";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { PROPERTIES } from "@/data/properties";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Building2, Home, MapPin, BedDouble, Bath, Maximize2,
  Heart, Search, ChevronDown, Star, ArrowLeft, Plus,
  Users, CheckCircle, ShieldCheck, Building, Store, Warehouse, Trees,
  Stethoscope, Briefcase, Layers, Check, X, Clock
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import PropertyImage from "@/components/PropertyImage";

type MainCategory = "سكني" | "تجاري" | "إداري" | "طبي" | "أراضي" | "مباني" | "";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1920&q=80";

const propertyCategories: Record<string, { label: string; icon: React.ReactNode }[]> = {
  سكني: [
    { label: "شقة", icon: <Building2 className="w-4 h-4" /> },
    { label: "دوبلكس", icon: <Layers className="w-4 h-4" /> },
    { label: "بنتهاوس", icon: <Building className="w-4 h-4" /> },
    { label: "فيلا", icon: <Home className="w-4 h-4" /> },
    { label: "استوديو", icon: <Home className="w-4 h-4" /> },
    { label: "استراحة", icon: <Trees className="w-4 h-4" /> },
  ],
  تجاري: [
    { label: "محل", icon: <Store className="w-4 h-4" /> },
    { label: "مول", icon: <Building2 className="w-4 h-4" /> },
    { label: "مطعم", icon: <Store className="w-4 h-4" /> },
    { label: "كافيه", icon: <Store className="w-4 h-4" /> },
    { label: "مخزن", icon: <Warehouse className="w-4 h-4" /> },
  ],
  إداري: [
    { label: "مكتب", icon: <Briefcase className="w-4 h-4" /> },
    { label: "مقر شركة", icon: <Building2 className="w-4 h-4" /> },
    { label: "مساحة عمل", icon: <Building className="w-4 h-4" /> },
  ],
  طبي: [
    { label: "صيدلية", icon: <Stethoscope className="w-4 h-4" /> },
    { label: "عيادة", icon: <Stethoscope className="w-4 h-4" /> },
    { label: "مركز طبي", icon: <Building2 className="w-4 h-4" /> },
  ],
  أراضي: [
    { label: "أرض سكنية", icon: <MapPin className="w-4 h-4" /> },
    { label: "أرض تجارية", icon: <MapPin className="w-4 h-4" /> },
    { label: "أرض زراعية", icon: <Trees className="w-4 h-4" /> },
  ],
  مباني: [
    { label: "عمارة سكنية", icon: <Building2 className="w-4 h-4" /> },
    { label: "مبنى تجاري", icon: <Building className="w-4 h-4" /> },
    { label: "فيلا مقسمة", icon: <Home className="w-4 h-4" /> },
  ],
};

const mainCategoryIcons: Record<string, React.ReactNode> = {
  سكني: <Home className="w-4 h-4" />,
  تجاري: <Store className="w-4 h-4" />,
  إداري: <Briefcase className="w-4 h-4" />,
  طبي: <Stethoscope className="w-4 h-4" />,
  أراضي: <MapPin className="w-4 h-4" />,
  مباني: <Building2 className="w-4 h-4" />,
};

const ALL_AREAS: { name: string; count: number }[] = [
  { name: "الفلل", count: 36 },
  { name: "الأهرام", count: 16 },
  { name: "أتريب", count: 10 },
  { name: "محيط كلية الحقوق", count: 9 },
  { name: "شارع أبو هشيش", count: 4 },
  { name: "بطا", count: 3 },
  { name: "الآثار", count: 3 },
  { name: "الحرس الوطني", count: 3 },
  { name: "المنشية", count: 3 },
  { name: "النجدة", count: 2 },
  { name: "العلوم", count: 2 },
  { name: "وسط البلد", count: 5 },
];

function SingleDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: { label: string; icon?: React.ReactNode; count?: number }[];
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = options.find((o) => o.label === value);
  return (
    <div className="flex-1 w-full relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 bg-gray-50 border-2 text-gray-800 py-2.5 px-4 rounded-xl transition-all font-medium text-sm ${open ? "border-[#1EBFD5] ring-2 ring-[#1EBFD5]/20 bg-white" : "border-gray-200 hover:border-[#1EBFD5]"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <span className="text-primary flex-shrink-0">{selected.icon}</span>
              <span>{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[200] overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => { onChange(opt.label); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-[#1EBFD5]/5 hover:text-[#1EBFD5] transition-colors ${value === opt.label ? "bg-[#1EBFD5]/10 text-[#1EBFD5] font-bold" : "text-gray-700"}`}
              >
                {opt.icon && <span className={value === opt.label ? "text-[#1EBFD5]" : "text-gray-400"}>{opt.icon}</span>}
                <span className="flex-1 text-right">{opt.label}</span>
                {opt.count !== undefined && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: "#1EBFD5" }}>
                    {opt.count}
                  </span>
                )}
                {value === opt.label && !opt.count && <Check className="w-4 h-4 mr-auto text-[#1EBFD5]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MultiAreaDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (areas: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const toggle = (area: string) => {
    onChange(selected.includes(area) ? selected.filter((a) => a !== area) : [...selected, area]);
  };
  const displayText = selected.length === 0 ? "كل مناطق بنها" : selected.length === 1 ? selected[0] : `${selected.length} مناطق مختارة`;
  return (
    <div className="flex-1 w-full relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-2 bg-gray-50 border-2 text-gray-800 py-2.5 px-4 rounded-xl transition-all font-medium text-sm ${open ? "border-[#1EBFD5] ring-2 ring-[#1EBFD5]/20 bg-white" : "border-gray-200 hover:border-[#1EBFD5]"}`}
      >
        <span className="flex items-center gap-2 truncate">
          <MapPin className="w-4 h-4 text-[#1EBFD5] flex-shrink-0" />
          <span className={selected.length === 0 ? "text-gray-400" : "text-gray-800"}>{displayText}</span>
        </span>
        <div className="flex items-center gap-1">
          {selected.length > 0 && (
            <span className="text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: "#1EBFD5" }}>
              {selected.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[200] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
              <span className="text-xs font-bold text-gray-500">اختر منطقة أو أكثر</span>
              {selected.length > 0 && (
                <button onClick={() => onChange([])} className="text-xs text-red-500 font-bold hover:underline">
                  مسح الكل
                </button>
              )}
            </div>
            <div>
              {ALL_AREAS.map((area) => {
                const isSelected = selected.includes(area.name);
                return (
                  <button
                    key={area.name}
                    type="button"
                    onClick={() => toggle(area.name)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-[#1EBFD5]/5 transition-colors ${isSelected ? "text-[#1EBFD5]" : "text-gray-700"}`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "border-[#1EBFD5]" : "border-gray-300"}`} style={isSelected ? { background: "#1EBFD5" } : {}}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className="flex-1 text-right">{area.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ background: "#1EBFD5" }}>
                      {area.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PAGE_SIZE = 8;
const LOAD_MORE = 4;

export default function HomePage() {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreSentinel = useRef<HTMLDivElement>(null);

  const handleNearBottom = useCallback(() => {
    setVisibleCount(prev => prev + LOAD_MORE);
  }, []);

  const propertiesRef = useInternalScroll<HTMLDivElement>(loadMoreSentinel, handleNearBottom);

  const [searchTab, setSearchTab] = useState<"buy" | "rent">("buy");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory>("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleMainCategoryChange = (val: string) => {
    setMainCategory(val as MainCategory);
    setSubCategory("");
  };

  const propertyTypes = [
    { name: "شقة", count: 243, icon: <Building2 className="w-4 h-4" /> },
    { name: "أرض", count: 87, icon: <MapPin className="w-4 h-4" /> },
    { name: "محل", count: 156, icon: <Store className="w-4 h-4" /> },
    { name: "فيلا", count: 34, icon: <Home className="w-4 h-4" /> },
    { name: "مكتب", count: 92, icon: <Briefcase className="w-4 h-4" /> },
    { name: "مخزن", count: 45, icon: <Warehouse className="w-4 h-4" /> },
    { name: "دوبلكس", count: 28, icon: <Layers className="w-4 h-4" /> },
    { name: "استراحة", count: 19, icon: <Trees className="w-4 h-4" /> },
  ];

  const neighborhoods = [
    { name: "الفلل", count: 312, gradient: "from-[#123C79] to-[#1EBFD5]", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=75" },
    { name: "الأهرام", count: 198, gradient: "from-[#0d2b5e] to-[#123C79]", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=75" },
    { name: "أتريب", count: 87, gradient: "from-[#1EBFD5] to-[#0e8fa3]", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=75" },
    { name: "المنشية", count: 143, gradient: "from-[#123C79] to-[#1a5bb5]", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=75" },
    { name: "كفر الجزار", count: 76, gradient: "from-[#0a2244] to-[#123C79]", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=75" },
    { name: "ميت العطار", count: 54, gradient: "from-[#0e8fa3] to-[#1EBFD5]", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=75" },
    { name: "المطرية", count: 89, gradient: "from-[#123C79] to-[#1EBFD5]", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=75" },
    { name: "وسط البلد", count: 234, gradient: "from-[#1a1f3c] to-[#123C79]", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=75" },
  ];

  const [propertyTab, setPropertyTab] = useState("الكل");
  const handleTabChange = (tab: string) => {
    setPropertyTab(tab);
    setVisibleCount(PAGE_SIZE);
    if (propertiesRef.current) propertiesRef.current.scrollTop = 0;
  };

  const latestProperties = PROPERTIES.map(p => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.priceLabel,
    type: p.type,
    category: p.category,
    badges: Array.from(new Set([
      ...(p.badge ? [p.badge] : []),
      ...(p.featured ? ["مميز"] : []),
    ])),
    beds: p.beds,
    baths: p.baths,
    area: p.size,
    daysAgo: p.daysAgo,
    agent: p.agent,
    image: p.image,
  }));

  const filteredProperties = propertyTab === "الكل"
    ? latestProperties
    : propertyTab === "للإيجار"
    ? latestProperties.filter(p => p.type === "للإيجار")
    : propertyTab === "للبيع"
    ? latestProperties.filter(p => p.type === "للبيع")
    : latestProperties.filter(p => p.category === propertyTab);

  const testimonials = [
    {
      name: "محمد عبد الله",
      role: "مشتري عقار",
      quote: "تجربة ممتازة في البحث عن شقة في بنها. الموقع سهل الاستخدام والعقارات ذات جودة عالية والمعلومات دقيقة جداً.",
    },
    {
      name: "أحمد سيد",
      role: "مستثمر عقاري",
      quote: "أفضل منصة عقارية في القليوبية بلا منازع. سرعة في التواصل واحترافية في التعامل من قبل الوكلاء.",
    },
    {
      name: "منى إبراهيم",
      role: "بائعة عقار",
      quote: "قمت بعرض شقتي للبيع على المنصة وتلقيت اتصالات عديدة في أيام قليلة. خدمة رائعة وموثوقة جداً.",
    },
  ];

  const mainCategoryCounts: Record<string, number> = {
    سكني: 243, تجاري: 156, إداري: 92, طبي: 45, أراضي: 87, مباني: 34,
  };

  const mainCategoryOptions = Object.keys(propertyCategories).map((key) => ({
    label: key,
    icon: mainCategoryIcons[key],
    count: mainCategoryCounts[key],
  }));

  const subCategoryOptions = mainCategory ? propertyCategories[mainCategory] : [];

  const subCategoryCounts: Record<string, number> = {
    شقة: 198, دوبلكس: 23, بنتهاوس: 12, فيلا: 34, استوديو: 45, استراحة: 19,
    محل: 87, مول: 15, مطعم: 32, كافيه: 28, مخزن: 45,
    مكتب: 67, "مقر شركة": 18, "مساحة عمل": 12,
    صيدلية: 12, عيادة: 28, "مركز طبي": 9,
    "أرض سكنية": 45, "أرض تجارية": 28, "أرض زراعية": 14,
    "عمارة سكنية": 18, "مبنى تجاري": 12, "فيلا مقسمة": 9,
  };

  const subCategoryOptionsWithCounts = subCategoryOptions.map(opt => ({
    ...opt,
    count: subCategoryCounts[opt.label],
  }));

  const priceOptions = [
    { label: "أقل من 500,000", count: 89 },
    { label: "أقل من مليون", count: 156 },
    { label: "أقل من 2 مليون", count: 213 },
    { label: "أكثر من 2 مليون", count: 78 },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden" dir="rtl">

      <Navbar transparent scrolled={scrolled} />

      {/* ─── HERO SECTION ───────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center pt-20 pb-14"
        style={{ minHeight: "72vh" }}
      >
        {/* Background Image via CSS — guaranteed to show */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Photo background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#123C79] via-[#1EBFD5] to-[#123C79] z-10" />

        <div className="container mx-auto px-4 z-10 flex flex-col items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            {/* Pill badge */}
            <span className="inline-block bg-[#1EBFD5]/20 border border-[#1EBFD5]/40 text-[#1EBFD5] text-sm font-bold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              المنصة العقارية الأولى في بنها
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              اكتشف أفضل العقارات في بنها
              <br />
              <span className="text-[#1EBFD5]">بسهولة وأمان</span>
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto font-medium leading-relaxed">
              آلاف العقارات المعتمدة في انتظارك — ابحث عن بيتك المثالي اليوم
            </p>
          </motion.div>

          {/* Floating Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-full max-w-5xl"
            style={{ isolation: "isolate" }}
          >
            {/* ── Tab Strip — sits above the white box ── */}
            <div className="flex items-end gap-1 relative z-10">
              {([
                { key: "buy",  label: "للبيع" },
                { key: "rent", label: "للإيجار" },
              ] as const).map((tab) => {
                const active = searchTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSearchTab(tab.key)}
                    data-testid={`tab-search-${tab.key}`}
                    className={`rounded-t-2xl font-bold text-sm transition-all duration-200 flex flex-col items-center gap-1 ${
                      active
                        ? "bg-white text-gray-900 px-7 py-3 relative -mb-px pb-[14px]"
                        : "text-white px-5 py-2 hover:opacity-90"
                    }`}
                    style={!active ? { background: "#1EBFD5" } : {}}
                  >
                    {tab.label}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#1EBFD5] block" />}
                  </button>
                );
              })}
            </div>

            {/* ── White Search Box ── */}
            <div
              className="bg-white rounded-b-2xl rounded-tl-2xl shadow-2xl relative"
              style={{ zIndex: 9, overflow: "visible" }}
            >
              {/* Inputs Row */}
              <div
                className="px-5 md:px-7 py-5 flex flex-col md:flex-row gap-4 items-center"
                style={{ overflow: "visible", position: "relative", zIndex: 50 }}
              >
                {/* Keyword search */}
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="ابحث بالعنوان أو المنطقة..."
                      value={searchKeyword}
                      onChange={e => setSearchKeyword(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1EBFD5] focus:ring-2 focus:ring-[#1EBFD5]/20 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Main Category */}
                <SingleDropdown
                  label="تصنيف العقار"
                  value={mainCategory}
                  options={mainCategoryOptions}
                  onChange={handleMainCategoryChange}
                  placeholder="اختر التصنيف"
                />

                {/* Sub Category — slides in */}
                <AnimatePresence>
                  {mainCategory && (
                    <motion.div
                      key="sub"
                      initial={{ opacity: 0, scaleX: 0.8, x: 10 }}
                      animate={{ opacity: 1, scaleX: 1, x: 0 }}
                      exit={{ opacity: 0, scaleX: 0.8 }}
                      transition={{ duration: 0.22 }}
                      className="flex-1 min-w-0 origin-right"
                    >
                      <SingleDropdown
                        label="نوع العقار"
                        value={subCategory}
                        options={subCategoryOptionsWithCounts}
                        onChange={setSubCategory}
                        placeholder="اختر النوع"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Multi-area */}
                <MultiAreaDropdown selected={selectedAreas} onChange={setSelectedAreas} />

                {/* Price */}
                <SingleDropdown
                  label="السعر المتوقع"
                  value={price}
                  options={priceOptions}
                  onChange={setPrice}
                  placeholder="أي سعر"
                />

                {/* Search button */}
                <div className="w-full md:w-auto flex-shrink-0">
                  <button
                    data-testid="button-search"
                    onClick={() => navigate("/search")}
                    className="w-full md:w-[54px] h-[50px] rounded-2xl text-white flex items-center justify-center transition-all hover:opacity-90 shadow-md"
                    style={{ background: "#1EBFD5" }}
                    title="بحث"
                  >
                    <Search className="w-6 h-6" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Selected area chips */}
              <AnimatePresence>
                {selectedAreas.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 md:px-7 pb-4 flex flex-wrap gap-2 overflow-hidden"
                  >
                    {selectedAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-1 bg-[#123C79]/10 text-[#123C79] text-xs font-bold px-3 py-1.5 rounded-full"
                      >
                        {area}
                        <button
                          onClick={() => setSelectedAreas((p) => p.filter((a) => a !== area))}
                          className="text-[#123C79]/60 hover:text-[#123C79] ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PROPERTY TYPES ─────────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-[#1EBFD5] text-xs font-bold uppercase tracking-widest mb-1">تصفح</p>
              <h2 className="text-xl font-black text-gray-900">تصفح حسب نوع العقار</h2>
              <p className="text-gray-400 text-xs mt-0.5">مجموعة متنوعة من العقارات تناسب جميع احتياجاتك</p>
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5">
            {propertyTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                data-testid={`card-property-type-${index}`}
                onClick={() => navigate(`/search?category=${type.name}`)}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:border-[#1EBFD5]/50 hover:bg-[#1EBFD5]/5 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#123C79] group-hover:border-[#1EBFD5] group-hover:text-[#1EBFD5] transition-colors flex-shrink-0">
                  {type.icon}
                </div>
                <p className="text-xs font-bold text-gray-700 group-hover:text-[#1EBFD5] transition-colors">{type.name}</p>
                <p className="text-[10px] text-gray-400">{type.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST PROPERTIES ──────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-[#1EBFD5] font-bold text-sm uppercase tracking-widest mb-2 block">حصري</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">أحدث العقارات المتاحة</h2>
              <p className="text-gray-500">تمت إضافتها مؤخراً وحصرياً على منصتنا</p>
            </div>
            <button
              onClick={() => navigate("/search")}
              className="hidden md:flex items-center gap-1.5 text-[#123C79] font-bold hover:text-[#1EBFD5] transition-colors text-sm border border-[#123C79]/20 px-4 py-2 rounded-xl hover:border-[#1EBFD5]/40"
            >
              عرض الكل
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scroll-hidden">
            {[
              { key: "الكل", label: "الكل" },
              { key: "شقة", label: "شقق" },
              { key: "فيلا", label: "فيلل" },
              { key: "محل", label: "محلات" },
              { key: "مكتب", label: "مكاتب" },
              { key: "أرض سكنية", label: "أراضي" },
              { key: "للإيجار", label: "للإيجار" },
              { key: "للبيع", label: "للبيع" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex-shrink-0 text-sm font-bold px-5 py-2 rounded-xl transition-all ${
                  propertyTab === tab.key
                    ? "bg-[#123C79] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-gray-500">
              عرض <span className="font-black text-[#123C79]">{Math.min(visibleCount, filteredProperties.length)}</span> من <span className="font-black text-gray-700">{filteredProperties.length}</span> عقار
            </span>
            <button
              onClick={() => navigate("/search")}
              className="hidden md:flex items-center gap-1 text-[#1EBFD5] font-bold text-xs hover:underline"
            >
              عرض الكل في صفحة البحث →
            </button>
          </div>

          {/* Latest Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProperties.slice(0, visibleCount).map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index % 4) * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/property/${prop.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all group cursor-pointer shadow-sm hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <PropertyImage
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Status Badges */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md text-white ${prop.type === "للبيع" ? "bg-[#123C79]" : "bg-[#1EBFD5]"}`}>
                      {prop.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-lg font-black text-[#123C79] mb-1">{prop.price}</p>
                  <h3 className="text-base font-bold text-gray-900 leading-snug mb-1 line-clamp-1">{prop.title}</h3>
                  <div className="flex items-center text-gray-500 text-xs font-medium mb-3">
                    <MapPin className="w-3.5 h-3.5 ml-1 text-[#1EBFD5]" />
                    {prop.location}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-900 pt-2.5 border-t border-gray-100">
                    <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-gray-400" />{prop.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-gray-400" />{prop.baths}</span>
                    <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-gray-400" />{prop.area} م²</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredProperties.length && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setVisibleCount(p => p + LOAD_MORE)}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                تحميل المزيد
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── LAND PROPERTIES ───────────────────────────────────── */}
      <section className="py-14 bg-[#f8faf5]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-7">
            <div>
              <span className="text-[#4caf50] font-bold text-xs uppercase tracking-widest mb-1 block">استثمر</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">أراضي للبيع في بنها</h2>
              <p className="text-gray-400 text-sm">أراضٍ سكنية وتجارية في أفضل مواقع بنها</p>
            </div>
            <button
              onClick={() => navigate("/search?category=أرض")}
              className="hidden md:flex items-center gap-1.5 text-[#4caf50] font-bold hover:text-[#388e3c] transition-colors text-sm border border-[#4caf50]/30 px-4 py-2 rounded-xl hover:border-[#388e3c]/50"
            >
              عرض الكل
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROPERTIES.filter(p => p.category.includes("أرض")).map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/property/${prop.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-[#e8f5e9] cursor-pointer group shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <PropertyImage
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md text-white bg-[#388e3c]">
                      {prop.type}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white bg-black/60 backdrop-blur-sm">
                      {prop.category}
                    </span>
                  </div>
                  <button
                    onClick={e => e.stopPropagation()}
                    className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors group/heart"
                  >
                    <Heart className="w-4 h-4 text-gray-400 group-hover/heart:text-red-500 transition-colors" />
                  </button>
                  {/* Area badge bottom */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow">
                    <Maximize2 className="w-3.5 h-3.5 text-[#4caf50]" />
                    <span className="text-xs font-black text-gray-900">{prop.size} م²</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-lg font-black text-[#388e3c] mb-1">{prop.priceLabel}</p>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-1">{prop.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 ml-1 text-[#4caf50] flex-shrink-0" />
                      {prop.location}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      منذ {prop.daysAgo} {prop.daysAgo === 1 ? "يوم" : "أيام"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <button
              onClick={() => navigate("/search?category=أرض")}
              className="border-2 border-[#4caf50] text-[#4caf50] hover:bg-[#4caf50] hover:text-white px-8 py-3 rounded-xl font-bold transition-colors w-full flex items-center justify-center gap-2"
            >
              عرض كل الأراضي
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── COMMERCIAL SHOPS ───────────────────────────────────── */}
      <section className="py-14 bg-[#fff8f0]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-7">
            <div>
              <span className="text-[#f97316] font-bold text-xs uppercase tracking-widest mb-1 block">تجارة</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">محلات تجارية في بنها</h2>
              <p className="text-gray-400 text-sm">محلات في أفضل المواقع التجارية والحيوية</p>
            </div>
            <button
              onClick={() => navigate("/search?category=محل")}
              className="hidden md:flex items-center gap-1.5 text-[#f97316] font-bold hover:text-[#ea580c] transition-colors text-sm border border-[#f97316]/30 px-4 py-2 rounded-xl hover:border-[#ea580c]/50"
            >
              عرض الكل
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROPERTIES.filter(p => p.category === "محل").map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/property/${prop.id}`)}
                className="bg-white rounded-2xl overflow-hidden border border-[#fff3e0] cursor-pointer group shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <PropertyImage
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md text-white ${prop.type === "للبيع" ? "bg-[#ea580c]" : "bg-[#f97316]"}`}>
                      {prop.type}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white bg-black/60 backdrop-blur-sm">
                      {prop.category}
                    </span>
                    {prop.badge === "مميز" && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full text-white flex items-center gap-1"
                        style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                        <Star className="w-2.5 h-2.5 fill-white" />مميز
                      </span>
                    )}
                  </div>
                  <button
                    onClick={e => e.stopPropagation()}
                    className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors group/heart"
                  >
                    <Heart className="w-4 h-4 text-gray-400 group-hover/heart:text-red-500 transition-colors" />
                  </button>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow">
                    <Maximize2 className="w-3.5 h-3.5 text-[#f97316]" />
                    <span className="text-xs font-black text-gray-900">{prop.size} م²</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-lg font-black text-[#ea580c] mb-1">{prop.priceLabel}</p>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 line-clamp-1">{prop.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 ml-1 text-[#f97316] flex-shrink-0" />
                      {prop.location}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      منذ {prop.daysAgo} {prop.daysAgo === 1 ? "يوم" : "أيام"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <button
              onClick={() => navigate("/search?category=محل")}
              className="border-2 border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white px-8 py-3 rounded-xl font-bold transition-colors w-full flex items-center justify-center gap-2"
            >
              عرض كل المحلات
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── NEIGHBORHOODS ──────────────────────────────────────── */}
      <section id="neighborhoods" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header – centered like reference */}
          <div className="text-center mb-10">
            <span className="inline-block w-10 h-1 rounded-full bg-[#1EBFD5] mb-4" />
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">المناطق المميزة</h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">اكتشف أرقى وأشهر أحياء بنها المختارة للفرص والقيمة العقارية</p>
          </div>

          {/* Layout: 1 large card (right) + 2×2 grid (left) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 items-stretch">

            {/* ── Large featured card (first neighborhood) ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              whileHover={{ scale: 1.015 }}
              data-testid="card-neighborhood-0"
              onClick={() => navigate("/search")}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[420px]"
            >
              <img
                src={neighborhoods[0].image}
                alt={neighborhoods[0].name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 absolute inset-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-0 p-7 w-full">
                <h3 className="text-3xl font-black text-white mb-1 drop-shadow-lg">{neighborhoods[0].name}</h3>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest">{neighborhoods[0].count} عقار متاح</p>
              </div>
            </motion.div>

            {/* ── 2×2 grid of smaller cards ── */}
            <div className="grid grid-cols-2 gap-4">
              {neighborhoods.slice(1, 5).map((hood, index) => (
                <motion.div
                  key={index + 1}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  data-testid={`card-neighborhood-${index + 1}`}
                  onClick={() => navigate("/search")}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-400"
                  style={{ minHeight: "195px" }}
                >
                  <img
                    src={hood.image}
                    alt={hood.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 absolute inset-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 p-4 w-full">
                    <h3 className="text-lg font-black text-white drop-shadow leading-tight">{hood.name}</h3>
                    <p className="text-white/65 text-xs font-bold uppercase tracking-widest mt-0.5">{hood.count} عقار</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom row: remaining neighborhoods */}
          {neighborhoods.length > 5 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
              {neighborhoods.slice(5).map((hood, index) => (
                <motion.div
                  key={index + 5}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  whileHover={{ scale: 1.03 }}
                  data-testid={`card-neighborhood-${index + 5}`}
                  onClick={() => navigate("/search")}
                  className="group relative h-36 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={hood.image}
                    alt={hood.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 p-3 w-full">
                    <h3 className="text-sm font-black text-white drop-shadow">{hood.name}</h3>
                    <p className="text-white/65 text-[10px] font-bold uppercase tracking-wider">{hood.count} عقار</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/search")}
              className="inline-flex items-center gap-2 border-2 border-[#123C79] text-[#123C79] hover:bg-[#123C79] hover:text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              عرض كل المناطق
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #eef4ff 0%, #e0f7fa 100%)" }} />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(#123C79 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-[#123C79]/10 text-[#123C79] text-sm font-bold px-4 py-1.5 rounded-full mb-6">
              سجل مجاناً
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#123C79] mb-6 leading-tight">
              هل تريد بيع أو تأجير عقارك؟
            </h2>
            <p className="text-xl text-[#123C79]/70 mb-10 font-medium">
              سجل عقارك الآن مجاناً وسنتولى الباقي لضمان وصوله لآلاف المهتمين
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/search")}
                className="text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #123C79 0%, #1EBFD5 100%)" }}
              >
                <Plus className="w-5 h-5" />
                أضف عقارك الآن
              </button>
              <a
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border-2 border-[#123C79] text-[#123C79] hover:bg-[#123C79]/5 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 shadow-sm flex items-center justify-center gap-2"
              >
                <FaYoutube className="w-5 h-5 text-green-600 hidden" />
                تواصل معنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SEO LINKS ──────────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-8 text-right">عقارات للبيع في بنها</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div>
              <h3 className="text-[#1EBFD5] font-bold text-sm mb-3 border-b border-gray-100 pb-2">شقق للبيع في بنها</h3>
              <ul className="space-y-1.5">
                {["الفلل","الأهرام","أتريب","المنشية","كفر الجزار","المطرية","وسط البلد","ميت العطار"].map(area => (
                  <li key={area}>
                    <button
                      onClick={() => navigate(`/search?type=للبيع&category=شقة&area=${area}`)}
                      className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full"
                    >
                      شقة للبيع في {area}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate("/search?type=للبيع&category=محل")} className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full">
                    محل للبيع في بنها
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/search?type=للبيع&category=محل")} className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full">
                    محلات للبيع في بنها
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/search?type=للإيجار&category=محل")} className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full">
                    محلات للإيجار بنها
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-[#1EBFD5] font-bold text-sm mb-3 border-b border-gray-100 pb-2">شقق للإيجار في بنها</h3>
              <ul className="space-y-1.5">
                {["الفلل","الأهرام","أتريب","المنشية","كفر الجزار","المطرية","وسط البلد","ميت العطار"].map(area => (
                  <li key={area}>
                    <button
                      onClick={() => navigate(`/search?type=للإيجار&category=شقة&area=${area}`)}
                      className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full"
                    >
                      شقة للإيجار في {area}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate("/search?type=للإيجار&category=استوديو")} className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full">
                    استوديو للإيجار بنها
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/search?type=للإيجار&category=مكتب")} className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full">
                    مكاتب للإيجار بنها
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-[#1EBFD5] font-bold text-sm mb-3 border-b border-gray-100 pb-2">أراضي للبيع في بنها</h3>
              <ul className="space-y-1.5">
                {[
                  { label: "أراضي للبيع في بنها",        q: "/search?category=أرض سكنية" },
                  { label: "أراضي في الفلل",              q: "/search?category=أرض سكنية&area=الفلل" },
                  { label: "أراضي في أتريب",              q: "/search?category=أرض سكنية&area=أتريب" },
                  { label: "أراضي في المنشية",            q: "/search?category=أرض سكنية&area=المنشية" },
                  { label: "أراضي في الجلوم",             q: "/search?category=أرض سكنية" },
                  { label: "أراضي في الجده",              q: "/search?category=أرض سكنية" },
                  { label: "أراضي في شارع أبو حشيش",     q: "/search?category=أرض تجارية" },
                  { label: "أراضي في محيط كلية الحقوق",  q: "/search?category=أرض سكنية" },
                  { label: "أراضي في منطقة الآثار",       q: "/search?category=أرض تجارية" },
                  { label: "أرض زراعية بنها",             q: "/search?category=أرض زراعية" },
                ].map(({ label, q }) => (
                  <li key={label}>
                    <button
                      onClick={() => navigate(q)}
                      className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-[#1EBFD5] font-bold text-sm mb-3 border-b border-gray-100 pb-2">فلل ووحدات للبيع</h3>
              <ul className="space-y-1.5">
                {[
                  { label: "شقة للبيع في منطقة الآثار",  q: "/search?type=للبيع&category=شقة" },
                  { label: "شقة للبيع في الفلل",          q: "/search?type=للبيع&category=شقة&area=الفلل" },
                  { label: "شقة للبيع في الأهرام",        q: "/search?type=للبيع&category=شقة&area=الأهرام" },
                  { label: "شقة للبيع في أتريب",          q: "/search?type=للبيع&category=شقة&area=أتريب" },
                  { label: "شقة للبيع في كفر الجزار",     q: "/search?type=للبيع&category=شقة&area=كفر الجزار" },
                  { label: "شقة للبيع في الجلوم",         q: "/search?type=للبيع&category=شقة" },
                  { label: "شقة للبيع في الجده",          q: "/search?type=للبيع&category=شقة" },
                  { label: "شقة للبيع في المنشية",        q: "/search?type=للبيع&category=شقة&area=المنشية" },
                  { label: "فيلا للبيع في بنها",          q: "/search?type=للبيع&category=فيلا" },
                  { label: "دوبلكس للبيع في بنها",        q: "/search?type=للبيع&category=دوبلكس" },
                  { label: "شقة للبيع في المثال",         q: "/search?type=للبيع&category=شقة" },
                ].map(({ label, q }) => (
                  <li key={label}>
                    <button
                      onClick={() => navigate(q)}
                      className="text-gray-500 hover:text-[#123C79] text-xs transition-colors text-right w-full"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
