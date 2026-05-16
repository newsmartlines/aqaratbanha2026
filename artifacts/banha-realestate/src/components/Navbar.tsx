import React, { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, User, Plus, ArrowLeft, Search, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteLogos } from "@/contexts/SiteLogosContext";

const PRIMARY = "#123C79";

interface NavbarProps {
  transparent?: boolean;
  scrolled?: boolean;
  showSearch?: boolean;
}

function Logo({ light = false }: { light?: boolean }) {
  const { logos } = useSiteLogos();
  return (
    <div className="flex items-center flex-shrink-0">
      <img
        src={light ? logos.footerLogo : logos.headerLogo}
        alt="عقارات بنها"
        className="h-10 w-auto object-contain"
      />
    </div>
  );
}

export default function Navbar({ transparent = false, scrolled = false, showSearch = false }: NavbarProps) {
  const [, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang, setLang, isRTL } = useLanguage();

  const NAV_LINKS = [
    { label: t("home"),      href: "/" },
    { label: t("properties"),href: "/search" },
    { label: t("mapSearch"), href: "/map" },
    { label: t("dashboard"), href: "/dashboard" },
  ];

  const isLight = transparent && !scrolled;
  const bgClass = transparent
    ? scrolled
      ? "bg-white/95 backdrop-blur-md border-b border-gray-100 py-3"
      : "bg-transparent py-5"
    : "bg-white border-b border-gray-100 py-3";

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgClass}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-3">

          {/* Logo */}
          <button onClick={() => navigate("/")} className="focus:outline-none flex-shrink-0">
            <Logo light={isLight} />
          </button>

          {/* Search bar (optional) */}
          {showSearch && (
            <div className="flex-1 max-w-xl hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 gap-3 hover:border-[#123C79] focus-within:border-[#123C79] focus-within:ring-2 focus-within:ring-[#123C79]/10 transition-all">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={t("searchNavPlaceholder")}
                className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
          )}

          {/* Desktop Nav links */}
          {!showSearch && (
            <nav className="hidden lg:flex items-center gap-6 mr-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={`text-sm font-medium transition-colors hover:opacity-80 ${
                    isLight ? "text-white/90" : "text-gray-600"
                  }`}
                  style={{ ["--hover-color" as string]: PRIMARY }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right actions — Desktop */}
          <div className="hidden md:flex items-center gap-2 mr-auto">

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                isLight
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>

            {/* Login */}
            <button
              onClick={() => navigate("/login")}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border transition-all ${
                isLight
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              {t("login")}
            </button>

            {/* Register */}
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
              style={{ backgroundColor: PRIMARY }}
            >
              <UserPlus className="w-3.5 h-3.5" />
              {t("register")}
            </button>

            {/* Add Property */}
            <button
              onClick={() => navigate("/add-property")}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 border border-white/20"
              style={{ backgroundColor: "#0D9488" }}
            >
              <Plus className="w-4 h-4" />
              {t("addProperty")}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg mr-auto ${isLight ? "text-white" : "text-gray-700"}`}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* ── Mobile Menu ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? "100%" : "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            {/* Mobile header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <Logo />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                >
                  {lang === "ar" ? "EN" : "ع"}
                </button>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile nav links */}
            <div className="flex flex-col p-5 gap-0 flex-1 overflow-y-auto">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => { setMobileOpen(false); navigate(link.href); }}
                  className="text-base font-semibold text-gray-800 border-b border-gray-50 py-4 text-right flex items-center justify-between hover:text-[#123C79] transition-colors"
                >
                  {link.label}
                  <ArrowLeft className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>

            {/* Mobile CTA buttons */}
            <div className="p-5 flex flex-col gap-2.5 border-t border-gray-100">
              {/* Login */}
              <button
                onClick={() => { setMobileOpen(false); navigate("/login"); }}
                className="w-full py-3 rounded-xl text-sm font-bold border-2 flex items-center justify-center gap-2 transition-colors"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                <LogIn className="w-4 h-4" />
                {t("login")}
              </button>

              {/* Register */}
              <button
                onClick={() => { setMobileOpen(false); navigate("/register"); }}
                className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2"
                style={{ backgroundColor: PRIMARY }}
              >
                <UserPlus className="w-4 h-4" />
                {t("register")}
              </button>

              {/* Add Property */}
              <button
                onClick={() => { setMobileOpen(false); navigate("/add-property"); }}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: "#0D9488" }}
              >
                <Plus className="w-4 h-4" /> {t("addProperty")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { Logo };
