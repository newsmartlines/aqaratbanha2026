import { useRef, useEffect } from "react";

export function useHoverScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isHovered = false;
    let rafId = 0;
    let targetScroll = 0;
    let animating = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(Math.max(v, lo), hi);

    const onWheel = (e: WheelEvent) => {
      if (!isHovered) return;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const atTop = el.scrollTop <= 0 && e.deltaY < 0;
      const atBottom = el.scrollTop >= maxScroll - 1 && e.deltaY > 0;
      if (atTop || atBottom) return;

      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      targetScroll = clamp(targetScroll + delta, 0, maxScroll);

      if (!animating) {
        animating = true;
        const tick = () => {
          const diff = targetScroll - el.scrollTop;
          if (Math.abs(diff) < 0.5) {
            el.scrollTop = targetScroll;
            animating = false;
            return;
          }
          el.scrollTop = lerp(el.scrollTop, targetScroll, 0.14);
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      }
    };

    const onEnter = () => {
      isHovered = true;
      targetScroll = el.scrollTop;
    };

    const onLeave = () => {
      isHovered = false;
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}
