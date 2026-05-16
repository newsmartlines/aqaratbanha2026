import logoColorDefault from "@assets/rgb_1778457941418.png";
import logoWhiteDefault from "@assets/footer_1778457955133.png";

export interface SiteLogos {
  headerLogo: string;   // color logo — light backgrounds (navbar, sidebar, pages)
  footerLogo: string;   // white logo — dark backgrounds (footer, side panels)
  faviconUrl: string;   // browser tab icon
}

const STORAGE_KEY = "banha_site_logos";

export const DEFAULT_LOGOS: SiteLogos = {
  headerLogo: logoColorDefault,
  footerLogo: logoWhiteDefault,
  faviconUrl: "/favicon.svg",
};

export function getSiteLogos(): SiteLogos {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_LOGOS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_LOGOS };
}

export function saveSiteLogos(logos: SiteLogos): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
}

export function applyFavicon(url: string): void {
  const existing = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  const link = existing ?? document.createElement("link");
  link.rel = "icon";
  link.href = url;
  if (!existing) document.head.appendChild(link);
}
