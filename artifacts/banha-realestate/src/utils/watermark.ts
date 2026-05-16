export type WatermarkPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "center";

export type WatermarkType = "image" | "text";

export interface WatermarkSettings {
  enabled: boolean;
  type: WatermarkType;
  position: WatermarkPosition;
  opacity: number;    // 10–100
  // image mode
  size: number;       // 5–50 (% of shortest image dimension)
  logoUrl: string;
  // text mode
  text: string;
  textColor: string;
  fontSize: number;   // 3–20 (% of shortest image dimension)
}

const STORAGE_KEY = "banha_watermark_settings";

export const DEFAULT_WATERMARK: WatermarkSettings = {
  enabled: true,
  type: "image",
  position: "bottom-right",
  opacity: 75,
  size: 22,
  logoUrl: "/logo-house-nobg.png",
  text: "عقارات بنها",
  textColor: "#ffffff",
  fontSize: 7,
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

      const shortest = Math.min(img.width, img.height);
      const pad      = Math.round(shortest * 0.03);
      ctx.globalAlpha = settings.opacity / 100;

      if (settings.type === "text") {
        const fontSize = Math.round((shortest * settings.fontSize) / 100);
        ctx.font      = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = settings.textColor;
        ctx.textBaseline = "alphabetic";
        const textW = ctx.measureText(settings.text).width;
        let x = 0, y = 0;
        switch (settings.position) {
          case "bottom-right": x = img.width  - textW - pad; y = img.height - pad; break;
          case "bottom-left":  x = pad;                      y = img.height - pad; break;
          case "top-right":    x = img.width  - textW - pad; y = fontSize   + pad; break;
          case "top-left":     x = pad;                      y = fontSize   + pad; break;
          case "center":
            x = (img.width  - textW)   / 2;
            y = (img.height + fontSize) / 2;
            break;
        }
        // subtle drop shadow for legibility
        ctx.shadowColor   = "rgba(0,0,0,0.55)";
        ctx.shadowBlur    = Math.round(fontSize * 0.3);
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(settings.text, x, y);
      } else {
        // image watermark
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          const logoW = Math.round((shortest * settings.size) / 100);
          const logoH = Math.round(logo.naturalHeight * (logoW / logo.naturalWidth));
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
          ctx.drawImage(logo, x, y, logoW, logoH);
          ctx.globalAlpha = 1;
          resolve(canvas.toDataURL("image/jpeg", 0.92));
        };
        logo.onerror = () => resolve(imageDataUrl);
        logo.src = settings.logoUrl;
        return;
      }

      ctx.globalAlpha = 1;
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => resolve(imageDataUrl);
    img.src = imageDataUrl;
  });
}
