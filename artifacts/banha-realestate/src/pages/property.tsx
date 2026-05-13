import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "wouter";
import {
  MapPin, BedDouble, Bath, Maximize2, Phone, Heart,
  ChevronLeft, X, ChevronRight, Star, CheckCircle,
  Calendar, Layers, Building2, Share2, ArrowLeft,
  MessageCircle, Send, User, Home, Copy, Check,
  Eye, Clock, Shield, AlertTriangle, Megaphone
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PROPERTIES, getSimilarProperties, getProperty } from "@/data/properties";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PropertyImage from "@/components/PropertyImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageOff } from "lucide-react";

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [erroredImages, setErroredImages] = useState<Set<number>>(new Set());
  const markError = (i: number) => setErroredImages(prev => new Set([...prev, i]));

  const prev = () => setActiveIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx(i => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  const thumbSlots = Array.from({ length: 4 }, (_, i) => images[i + 1] ?? null);

  return (
    <>
      <div className="flex gap-2 h-[420px] md:h-[500px]">
        <div className="hidden sm:grid grid-cols-2 grid-rows-2 gap-2 w-[34%] flex-shrink-0">
          {thumbSlots.map((img, i) => {
            const noImage = img === null || erroredImages.has(i + 1);
            return (
              <div
                key={i}
                className={`relative overflow-hidden rounded-xl group ${noImage ? "" : "cursor-pointer"}`}
                onClick={() => { if (!noImage) { setActiveIdx(i + 1); setLightbox(true); } }}
              >
                {noImage ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300 gap-1 select-none">
                    <ImageOff className="w-6 h-6" />
                    <span className="text-xs text-gray-400 font-medium">لا توجد صورة</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={img!}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={() => markError(i + 1)}
                    />
                    {i === 3 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/55 flex items-center justify-center rounded-xl">
                        <span className="text-white font-black text-xl">+{images.length - 4}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div
          className="flex-1 relative cursor-zoom-in group rounded-2xl overflow-hidden"
          onClick={() => setLightbox(true)}
        >
          {erroredImages.has(activeIdx) ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300 gap-2">
              <ImageOff className="w-12 h-12" />
              <span className="text-sm text-gray-400 font-medium">لا يوجد صورة</span>
            </div>
          ) : (
          <motion.img
            key={activeIdx}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            src={images[activeIdx]}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
            onError={() => markError(activeIdx)}
          />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
            {activeIdx + 1} / {images.length}
          </div>

          <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" /> تكبير
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 left-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setLightbox(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            {erroredImages.has(activeIdx) ? (
              <div className="w-[60vw] h-[60vh] flex flex-col items-center justify-center bg-gray-800 text-gray-500 rounded-xl gap-3" onClick={e => e.stopPropagation()}>
                <ImageOff className="w-14 h-14" />
                <span className="text-sm font-medium">لا يوجد صورة</span>
              </div>
            ) : (
            <motion.img
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={images[activeIdx]}
              alt={title}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={e => e.stopPropagation()}
              onError={() => markError(activeIdx)}
            />
            )}
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveIdx(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIdx ? "bg-white w-5" : "bg-white/40"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ContactForm() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  return (
    <div>
      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h4 className="font-bold text-gray-900 mb-1">{t("messageSent")}</h4>
          <p className="text-sm text-gray-500">{t("messageSentSub")}</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder={t("yourName")} value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
              className="w-full border border-gray-200 rounded-xl py-2.5 pr-9 pl-3 text-sm focus:border-[#123C79] focus:outline-none focus:ring-2 focus:ring-[#123C79]/10 transition-all"
            />
          </div>
          <div className="relative">
            <Phone className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="tel" placeholder={t("yourPhone")} value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required
              className="w-full border border-gray-200 rounded-xl py-2.5 pr-9 pl-3 text-sm focus:border-[#123C79] focus:outline-none focus:ring-2 focus:ring-[#123C79]/10 transition-all"
              dir="ltr"
            />
          </div>
          <textarea
            rows={3}
            placeholder={t("messagePlaceholder")}
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:border-[#123C79] focus:outline-none focus:ring-2 focus:ring-[#123C79]/10 transition-all resize-none placeholder-gray-300"
          />
          <button
            type="submit"
            className="w-full bg-[#123C79] hover:bg-[#0d2b5e] text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> {t("send")}
          </button>
        </form>
      )}
    </div>
  );
}

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [saved, setSaved] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportForm, setReportForm] = useState({ email: "", message: "" });
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [params.id]);

  const id = parseInt(params.id || "1");
  const property = getProperty(id) ?? PROPERTIES[0];
  const similar = getSimilarProperties(id, 4);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      <Navbar scrolled={scrolled} />

      <div className="pt-[57px]">

        <div className="container mx-auto px-4 md:px-6 py-8">

          {/* Breadcrumb — above gallery */}
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap overflow-x-auto scrollbar-none">
            <button onClick={() => navigate("/")} className="flex items-center gap-1 text-gray-500 hover:text-[#123C79] transition-colors flex-shrink-0">
              <Home className="w-3 h-3" />
              <span>{t("home")}</span>
            </button>
            <ChevronLeft className="w-3 h-3 flex-shrink-0 text-gray-300" />
            <button onClick={() => navigate("/search")} className="text-gray-500 hover:text-[#123C79] transition-colors flex-shrink-0">
              {t("searchResults")}
            </button>
            <ChevronLeft className="w-3 h-3 flex-shrink-0 text-gray-300" />
            <button onClick={() => navigate("/search")} className="text-gray-500 hover:text-[#123C79] transition-colors flex-shrink-0">
              {property.category}
            </button>
            <ChevronLeft className="w-3 h-3 flex-shrink-0 text-gray-300" />
            <button onClick={() => navigate("/search")} className="text-gray-500 hover:text-[#123C79] transition-colors flex-shrink-0">
              {property.type}
            </button>
            <ChevronLeft className="w-3 h-3 flex-shrink-0 text-gray-300" />
            <button onClick={() => navigate("/search")} className="text-gray-500 hover:text-[#123C79] transition-colors flex-shrink-0">
              {property.area}
            </button>
            <ChevronLeft className="w-3 h-3 flex-shrink-0 text-gray-300" />
            <span className="text-[#123C79] font-bold truncate">{property.title}</span>
          </div>

          {/* Gallery */}
          <div className="mb-0 relative">
            <ImageGallery images={property.images} title={property.title} />

            {/* Badges ON TOP of gallery */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {/* نوع الصفقة */}
              <span
                className={`text-xs font-black px-3 py-1.5 rounded-full text-white shadow-lg backdrop-blur-sm tracking-wide ${property.type === "للبيع" ? "bg-[#123C79]/90" : "bg-[#1EBFD5]/90"}`}
              >
                {property.type}
              </span>

              {/* مميز badge */}
              {property.featured && (
                <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm text-white"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                  <Star className="w-3 h-3 fill-white text-white" />
                  مميز
                </span>
              )}

              {/* موثق / other badge */}
              {property.badge && property.badge !== "مميز" && (
                <span className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm text-white"
                  style={{ background: "linear-gradient(135deg, #123C79, #1EBFD5)" }}>
                  <CheckCircle className="w-3 h-3 fill-white text-white" />
                  {property.badge}
                </span>
              )}
            </div>
          </div>

          {/* ── Title + Price + Stats ── */}
          <div className="mt-5 mb-8 bg-white rounded-2xl border border-gray-100 p-5">
            {/* Price — above title */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-black text-[#123C79]">{property.priceLabel}</span>
              {property.type === "للإيجار" && (
                <span className="text-sm text-gray-400 font-medium">{t("perMonth")}</span>
              )}
            </div>

            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">{property.title}</h1>
              {/* Full address */}
              <div className="flex items-start gap-1.5 mt-2 text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-[#1EBFD5] flex-shrink-0" />
                <div>
                  <span>{property.address}</span>
                  <button
                    onClick={() => document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                    className="mr-2 text-[#1EBFD5] font-bold hover:underline text-xs whitespace-nowrap"
                  >
                    {t("viewMap")}
                  </button>
                </div>
              </div>
              {/* Stats row: days + views */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {property.daysAgo} {t("daysAgo")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {property.views.toLocaleString()} {t("views")}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border transition-all ${saved ? "bg-rose-50 text-rose-600 border-rose-200" : "border-gray-200 text-gray-600 hover:border-rose-200 hover:text-rose-500"}`}
              >
                <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                {saved ? t("saved") : t("save")}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-[#123C79] hover:text-[#123C79] transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                {copied ? t("copied") : t("share")}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex gap-8 items-start">

            {/* Left column */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* Key stats */}
              {(() => {
                const stats = [
                  ...(property.beds > 0   ? [{ icon: <BedDouble className="w-6 h-6" />, value: property.beds,  label: t("bedroom"), color: "#123C79" }] : []),
                  ...(property.baths > 0  ? [{ icon: <Bath      className="w-6 h-6" />, value: property.baths, label: t("bath"),    color: "#1EBFD5" }] : []),
                  { icon: <Maximize2 className="w-6 h-6" />, value: property.size, label: "م²", color: "#123C79" },
                  ...(property.floor !== null && property.floor > 0 ? [{ icon: <Layers className="w-6 h-6" />, value: property.floor, label: t("floor"), color: "#1EBFD5" }] : []),
                ];
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg,#123C79,#1EBFD5)" }} />
                    <div className="flex">
                      {stats.map((s, i) => (
                        <div key={i} className={`flex-1 flex flex-col items-center py-8 px-4 ${i < stats.length - 1 ? "border-l border-gray-100" : ""}`}>
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-white"
                            style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)` }}
                          >
                            {s.icon}
                          </div>
                          <span className="text-3xl font-black text-gray-900 leading-none mb-1">{s.value}</span>
                          <span className="text-sm text-gray-400 font-medium">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Description */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#1EBFD5] rounded-full inline-block" />
                  {t("propertyDescription")}
                </h2>
                <p className="text-gray-900 leading-relaxed text-sm">{property.description}</p>
              </div>

              {/* مواصفات العقار — labels bold, values gray */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#1EBFD5] rounded-full inline-block" />
                  {t("propertySpecs")}
                </h2>
                <div className="grid grid-cols-2 gap-y-2 gap-x-6">
                  <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                    <span className="font-bold text-gray-900">{t("refNumber")}</span>
                    <span className="text-gray-600 font-medium">BNH-{String(property.id).padStart(4, "0")}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                    <span className="font-bold text-gray-900">{t("dealType")}</span>
                    <span className="text-gray-600 font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                    <span className="font-bold text-gray-900">{t("category")}</span>
                    <span className="text-gray-600 font-medium">{property.category}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                    <span className="font-bold text-gray-900">{t("areaSize")}</span>
                    <span className="text-gray-600 font-medium">{property.size} م²</span>
                  </div>
                  {property.yearBuilt > 0 && (
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                      <span className="font-bold text-gray-900">{t("yearBuilt")}</span>
                      <span className="text-gray-600 font-medium">{property.yearBuilt}</span>
                    </div>
                  )}
                  {property.floor !== null && (
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                      <span className="font-bold text-gray-900">{t("floor")}</span>
                      <span className="text-gray-600 font-medium">{property.floor}{property.totalFloors ? ` / ${property.totalFloors}` : ""}</span>
                    </div>
                  )}
                  {property.beds > 0 && (
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                      <span className="font-bold text-gray-900">{t("bedroomsSpec")}</span>
                      <span className="text-gray-600 font-medium">{property.beds}</span>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2.5">
                      <span className="font-bold text-gray-900">{t("bathsSpec")}</span>
                      <span className="text-gray-600 font-medium">{property.baths}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#1EBFD5] rounded-full inline-block" />
                  {t("amenities")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50">
                      <CheckCircle className="w-4 h-4 text-[#1EBFD5] flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Video Tour ── */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#1EBFD5] rounded-full inline-block" />
                  جولة فيديو للعقار
                </h2>
                <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full border-0"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
                    title="جولة فيديو للعقار"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.52V8.48L15.82 12l-6.07 3.52z"/>
                  </svg>
                  جولة مرئية كاملة داخل العقار بجودة عالية
                </p>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#1EBFD5] rounded-full inline-block" />
                  {t("locationOnMap")}
                </h2>
                <div id="map-section" className="rounded-xl overflow-hidden border border-gray-200 h-64 relative bg-gray-100">
                  <iframe
                    title="map"
                    className="w-full h-full border-0"
                    loading="lazy"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55144.29!2d31.1847!3d30.4632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7e4c2cba9f69b%3A0x15a2de69f8b88547!2z2KjZhtic2KE!5e0!3m2!1sar!2seg!4v1"
                    allowFullScreen
                  />
                  <div className="absolute bottom-3 right-3">
                    <a
                      href="https://maps.google.com/?q=Banha,Egypt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-xs font-bold text-[#123C79] px-3 py-1.5 rounded-lg shadow-md border border-gray-200 hover:bg-[#123C79] hover:text-white transition-colors"
                    >
                      {t("openInMaps")}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-3 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-[#1EBFD5] mt-0.5 flex-shrink-0" />
                  <span>{property.address}</span>
                </div>
              </div>

            </div>

            {/* Right sticky contact card */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-[80px] space-y-4">

                {/* Owner card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#1EBFD5] rounded-full inline-block" />
                    {t("ownerCard")}
                  </h3>
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${property.agent.color}`}>
                        {property.agent.initials}
                      </div>
                      <span className={`absolute bottom-0 left-0 w-3.5 h-3.5 rounded-full border-2 border-white ${property.ownerOnline ? "bg-green-500" : "bg-gray-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{property.agent.name}</p>
                      <p className={`text-xs font-medium ${property.ownerOnline ? "text-green-600" : "text-gray-400"}`}>
                        {property.ownerOnline ? t("online") : t("offline")}
                      </p>
                      <button className="text-xs text-[#1EBFD5] font-bold hover:underline mt-0.5">
                        {t("seeAllListings")}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    {phoneRevealed ? (
                      <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center justify-center gap-2 w-full bg-[#123C79] hover:bg-[#0d2b5e] text-white py-3 rounded-xl font-bold text-sm transition-colors"
                        dir="ltr"
                      >
                        <Phone className="w-4 h-4" />
                        {property.agent.phone}
                      </a>
                    ) : (
                      <button
                        onClick={() => setPhoneRevealed(true)}
                        className="flex items-center justify-center gap-2 w-full bg-[#123C79] hover:bg-[#0d2b5e] text-white py-3 rounded-xl font-bold text-sm transition-colors"
                      >
                        <Phone className="w-4 h-4" /> {t("revealPhone")}
                      </button>
                    )}
                    <a
                      href={`https://wa.me/${property.agent.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4" /> {t("whatsapp")}
                    </a>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs font-bold text-gray-700 mb-3">{t("sendMessage")}</p>
                    <ContactForm />
                  </div>
                </div>

                {/* Safety section */}
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-[#123C79]" />
                    <h3 className="font-black text-gray-900 text-sm">{t("safetyFirst")}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      "قابل السمسار أو المالك في مكان معروف وآمن داخل بنها",
                      "يفضّل أن يكون معاك شخص موثوق وقت المعاينة",
                      "عاين المقار على الطبيعة وتأكد من حالته ومطابقته للإعلان",
                      "اسأل عن كل التفاصيل: السعر، المرافق، الأوراق، والمصاريف",
                      "مدفعش أي عربون أو تحوّل فلوس غير بعد المعاينة والتأكد من المستندات",
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#123C79] mt-1.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Report abuse + listing number row */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">رقم الإعلان</span>
                    <span className="text-xs font-black text-gray-700 tracking-wide">503477573</span>
                  </div>
                  <button
                    onClick={() => { setReportOpen(true); setReportSent(false); setReportForm({ email: "", message: "" }); }}
                    className="flex items-center gap-1.5 text-rose-600 text-xs font-bold border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-2.5 rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {t("reportAbuse")}
                  </button>
                </div>

                {/* Featured property promo box */}
                {(() => {
                  const featuredProp = PROPERTIES.find(p => p.featured && p.id !== property.id) ?? PROPERTIES.find(p => p.id !== property.id);
                  if (!featuredProp) return null;
                  return (
                    <div
                      className="relative rounded-2xl overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/property/${featuredProp.id}`)}
                    >
                      <PropertyImage
                        src={featuredProp.image}
                        alt={featuredProp.title}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm text-amber-700 border border-amber-200/80 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          مميز
                        </span>
                      </div>
                      <div className="absolute bottom-0 p-4 w-full">
                        <p className="text-white font-black text-sm leading-snug line-clamp-2">{featuredProp.title}</p>
                        <p className="text-white/80 text-xs mt-1 font-medium">{featuredProp.priceLabel}</p>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>
          </div>

          {/* Report Abuse Modal */}
          <AnimatePresence>
            {reportOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4"
                onClick={() => setReportOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      </div>
                      <h2 className="text-lg font-black text-gray-900">{t("reportAbuse")}</h2>
                    </div>
                    <button onClick={() => setReportOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {reportSent ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">تم إرسال البلاغ</h4>
                      <p className="text-sm text-gray-500">سنراجع بلاغك في أقرب وقت ممكن</p>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={e => { e.preventDefault(); setReportSent(true); }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-gray-500 leading-relaxed">إذا رأيت محتوى مسيء أو مضللاً، أخبرنا بذلك وسنتخذ الإجراء المناسب.</p>
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">البريد الإلكتروني</label>
                        <input
                          type="email"
                          required
                          placeholder="example@email.com"
                          value={reportForm.email}
                          onChange={e => setReportForm(p => ({ ...p, email: e.target.value }))}
                          dir="ltr"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 mb-1.5 block">نص البلاغ</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="اذكر سبب الإبلاغ بوضوح..."
                          value={reportForm.message}
                          onChange={e => setReportForm(p => ({ ...p, message: e.target.value }))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/15 transition-all resize-none placeholder-gray-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl text-white font-bold text-sm bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" /> إرسال البلاغ
                      </button>
                    </form>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile contact buttons */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3 z-40 shadow-xl">
            <a
              href={`tel:${property.agent.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#123C79] text-white py-3 rounded-xl font-bold text-sm"
            >
              <Phone className="w-4 h-4" /> {t("call")}
            </a>
            <a
              href={`https://wa.me/${property.agent.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold text-sm"
            >
              <FaWhatsapp className="w-4 h-4" /> {t("whatsapp")}
            </a>
          </div>

          {/* Similar Properties */}
          <div className="mt-12 pb-20 lg:pb-0">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-7 bg-[#1EBFD5] rounded-full inline-block" />
              {t("similarProperties")}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map((prop) => (
                <motion.div
                  key={prop.id}
                  whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
                  onClick={() => navigate(`/property/${prop.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <PropertyImage
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Top badges */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full text-white shadow-md backdrop-blur-sm ${prop.type === "للبيع" ? "bg-[#123C79]/90" : "bg-[#1EBFD5]/90"}`}>
                        {prop.type}
                      </span>
                      {prop.featured && (
                        <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full text-white shadow-md"
                          style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
                          <Star className="w-2.5 h-2.5 fill-white text-white" /> مميز
                        </span>
                      )}
                      {prop.badge && prop.badge !== "مميز" && (
                        <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full text-white shadow-md"
                          style={{ background: "linear-gradient(135deg,#123C79,#1EBFD5)" }}>
                          <CheckCircle className="w-2.5 h-2.5 fill-white text-white" /> {prop.badge}
                        </span>
                      )}
                    </div>
                    {/* Price chip */}
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-md">
                      <span className="text-xs font-black text-[#123C79]">{prop.priceLabel}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#123C79] transition-colors line-clamp-1">{prop.title}</h3>
                    <div className="flex items-center text-gray-400 text-[11px] mb-2">
                      <MapPin className="w-3 h-3 ml-1 text-[#1EBFD5]" />{prop.location}
                    </div>
                    <div className="flex items-center gap-2.5 text-[11px] text-gray-500">
                      {prop.beds > 0 && <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3" />{prop.beds}</span>}
                      {prop.baths > 0 && <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{prop.baths}</span>}
                      <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" />{prop.size}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
