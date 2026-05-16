export type WatermarkPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "center";

export interface WatermarkSettings {
  enabled: boolean;
  position: WatermarkPosition;
  opacity: number;   // 10–100
  size: number;      // 5–50 (% of shortest image dimension)
  logoUrl: string;
}

const STORAGE_KEY = "banha_watermark_settings";

export const DEFAULT_WATERMARK: WatermarkSettings = {
  enabled: true,
  position: "bottom-right",
  opacity: 75,
  size: 22,
  logoUrl: "/logo-house-nobg.png",
};

export function getWatermarkSettings(): WatermarkSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_WATERMARK, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_WATERMARK };
}

export function saveWatermarkSettings(s: WatermarkSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function applyWatermark(imageDataUrl: string): Promise<string> {
  return new Promise(resolve => {
    const settings = getWatermarkSettings();
    if (!settings.enabled) { resolve(imageDataUrl); return; }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.onload = () => {
        const shortest = Math.min(img.width, img.height);
        const logoW    = Math.round((shortest * settings.size) / 100);
        const logoH    = Math.round(logo.naturalHeight * (logoW / logo.naturalWidth));
        const pad      = Math.round(shortest * 0.03);

        let x = 0, y = 0;
        switch (settings.position) {
          case "bottom-right": x = img.width  - logoW - pad; y = img.height - logoH - pad; break;
          case "bottom-left":  x = pad;                      y = img.height - logoH - pad; break;
          case "top-right":    x = img.width  - logoW - pad; y = pad; break;
          case "top-left":     x = pad;                      y = pad; break;
          case "center":
            x = (img.width  - logoW) / 2;
            y = (img.height - logoH) / 2;
            break;
        }

        ctx.globalAlpha = settings.opacity / 100;
        ctx.drawImage(logo, x, y, logoW, logoH);
        ctx.globalAlpha = 1;
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      logo.onerror = () => resolve(imageDataUrl);
      logo.src = settings.logoUrl;
    };
    img.onerror = () => resolve(imageDataUrl);
    img.src = imageDataUrl;
  });
}
