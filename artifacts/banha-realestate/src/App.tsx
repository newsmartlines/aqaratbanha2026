import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Property from "@/pages/property";
import MapPage from "@/pages/map";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import AddPropertyPage from "@/pages/add-property";
import PlansPage from "@/pages/plans";
import PaymentConfirmPage from "@/pages/payment-confirm";
import DashboardPage from "@/pages/dashboard";
import EditListingPage from "@/pages/edit-listing";
import AdminLogin from "@/pages/admin-login";
import AdminPanel from "@/pages/admin";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { SiteLogosProvider } from "@/contexts/SiteLogosContext";

const queryClient = new QueryClient();

function getGoogleClientId(): string {
  try { return localStorage.getItem("oauth_google_client_id") ?? ""; } catch { return ""; }
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 350);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.22 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="العودة للأعلى"
          className="fixed bottom-24 right-4 z-[99] w-11 h-11 rounded-full shadow-xl flex items-center justify-center border border-white/20 hover:scale-110 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #123C79, #1EBFD5)" }}
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/map" component={MapPage} />
        <Route path="/property/:id" component={Property} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/add-property" component={AddPropertyPage} />
        <Route path="/plans" component={PlansPage} />
        <Route path="/payment-confirm" component={PaymentConfirmPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/dashboard/edit/:id" component={EditListingPage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppInner() {
  const { isRTL, lang } = useLanguage();
  return (
    <div dir={isRTL ? "rtl" : "ltr"} lang={lang}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
      <BackToTopButton />
    </div>
  );
}

function App() {
  const clientId = getGoogleClientId();
  return (
    <GoogleOAuthProvider clientId={clientId || "placeholder-configure-in-admin"}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <SiteLogosProvider>
              <AppInner />
            </SiteLogosProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
