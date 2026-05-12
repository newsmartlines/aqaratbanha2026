import React, { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, User, Plus, ArrowLeft, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import logoColor from "@assets/rgb_1778457941418.png";
import logoWhite from "@assets/footer_1778457955133.png";

interface NavbarProps {
  transparent?: boolean;
  scrolled?: boolean;
  showSearch?: boolean;
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center flex-shrink-0">
      <img
        src={light ? logoWhite : logoColor}
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
    { label: t("home"), href: "/" },
    { label: t("properties"), href: "/search" },
    { label: t("mapSearch"), href: "/map" },
  ];

  const isLight = transparent && !scrolled;
  const bgClass = transparent
    ? scrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-100 py-3" : "bg-transparent py-5"
    : "bg-white border-b border-gray-100 py-3";

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${bgClass}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-4">

          {/* Logo */}
          <button onClick={() => navigate("/")} className="focus:outline-none">
            <Logo light={isLight} />
          </button>

          {/* Search bar (optional) */}
          {showSearch && (
            <div className="flex-1 max-w-xl hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 gap-3 hover:border-[#1EBFD5] focus-within:border-[#1EBFD5] focus-within:ring-2 focus-within:ring-[#1EBFD5]/20 transition-all">
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
            <nav className="hidden md:flex items-center gap-7 mr-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.href)}
                  className={`text-sm font-medium transition-colors hover:text-[#1EBFD5] ${isLight ? "text-white/90" : "text-gray-600"}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 mr-auto">

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                isLight
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-gray-200 text-gray-600 hover:border-[#1EBFD5] hover:text-[#1EBFD5]"
              }`}
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>

            {/* User icon */}
            <button
              onClick={() => navigate("/login")}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isLight ? "text-white hover:bg-white/10" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/login")}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${isLight ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"}`}
            >
              {t("signIn")}
            </button>

            <button
              onClick={() => navigate("/register")}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all ${isLight ? "bg-white/15 hover:bg-white/25 text-white border border-white/30" : "text-[#123C79] border border-[#123C79]/30 hover:bg-[#123C79]/5"}`}
            >
              {t("register")}
            </button>

            <button
              onClick={() => navigate("/add-property")}
              className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "#1EBFD5" }}
            >
              <Plus className="w-4 h-4" />
              {t("addProperty")}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ml-auto ${isLight ? "text-white" : "text-gray-700"}`}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRTL ? "100%" : "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? "100%" : "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <Logo />
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600"
                >
                  {lang === "ar" ? "EN" : "ع"}
                </button>
                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex flex-col p-5 gap-1 flex-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { setMobileOpen(false); navigate(link.href); }}
                  className="text-lg font-semibold text-gray-800 border-b border-gray-50 py-4 text-right flex items-center justify-between"
                >
                  {link.label}
                  <ArrowLeft className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
            <div className="p-5 flex flex-col gap-3 border-t border-gray-100">
              <button
                onClick={() => { setMobileOpen(false); navigate("/login"); }}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm"
              >
                {t("login")}
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate("/register"); }}
                className="w-full py-3 rounded-xl border border-[#123C79]/30 text-[#123C79] font-semibold text-sm"
              >
                {t("register")}
              </button>
              <button
                onClick={() => { setMobileOpen(false); navigate("/add-property"); }}
                className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: "#1EBFD5" }}
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
