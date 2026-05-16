import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import {
  getSiteLogos, saveSiteLogos, applyFavicon,
  DEFAULT_LOGOS,
} from "../utils/siteLogos";
import type { SiteLogos } from "../utils/siteLogos";

interface SiteLogosContextValue {
  logos: SiteLogos;
  updateLogos: (next: Partial<SiteLogos>) => void;
  resetLogos: () => void;
}

const SiteLogosContext = createContext<SiteLogosContextValue | null>(null);

export function SiteLogosProvider({ children }: { children: ReactNode }) {
  const [logos, setLogos] = useState<SiteLogos>(getSiteLogos);

  // Apply favicon whenever it changes
  useEffect(() => {
    applyFavicon(logos.faviconUrl);
  }, [logos.faviconUrl]);

  const updateLogos = useCallback((next: Partial<SiteLogos>) => {
    setLogos(prev => {
      const updated = { ...prev, ...next };
      saveSiteLogos(updated);
      return updated;
    });
  }, []);

  const resetLogos = useCallback(() => {
    saveSiteLogos(DEFAULT_LOGOS);
    setLogos({ ...DEFAULT_LOGOS });
  }, []);

  return (
    <SiteLogosContext.Provider value={{ logos, updateLogos, resetLogos }}>
      {children}
    </SiteLogosContext.Provider>
  );
}

export function useSiteLogos(): SiteLogosContextValue {
  const ctx = useContext(SiteLogosContext);
  if (!ctx) throw new Error("useSiteLogos must be used inside <SiteLogosProvider>");
  return ctx;
}
