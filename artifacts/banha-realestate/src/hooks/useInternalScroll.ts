import { useRef, useEffect, RefObject } from "react";

export function useInternalScroll<T extends HTMLElement = HTMLDivElement>(
  _loadMoreRef?: RefObject<HTMLElement | null>,
  onNearBottom?: () => void
) {
  const containerRef = useRef<T>(null);

  /* ── Smooth wheel scroll + scroll-trap ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;
    let targetScroll = el.scrollTop;
    let animating = false;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

    const onWheel = (e: WheelEvent) => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const atTop    = el.scrollTop <= 0 && e.deltaY < 0;
      const atBottom = el.scrollTop >= maxScroll - 2 && e.deltaY > 0;
      if (atTop || atBottom) return;

      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
      targetScroll = clamp(targetScroll + delta, 0, maxScroll);

      if (!animating) {
        animating = true;
        const tick = () => {
          const diff = targetScroll - el.scrollTop;
          if (Math.abs(diff) < 0.6) {
            el.scrollTop = targetScroll;
            animating = false;
            return;
          }
          el.scrollTop = lerp(el.scrollTop, targetScroll, 0.13);
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── Infinite scroll via native scroll event ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !onNearBottom) return;

    let fired = false;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const distFromBottom = scrollHeight - scrollTop - clientHeight;
      if (distFromBottom < 120 && !fired) {
        fired = true;
        onNearBottom();
        setTimeout(() => { fired = false; }, 600);
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onNearBottom]);

  return containerRef;
}
