// useDisableScroll.ts
import { useLayoutEffect } from "react";

let locks = 0;

export function useDisableScroll(enabled: boolean, target?: HTMLElement | null) {
  useLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const el =
      target ??
      (document.scrollingElement as HTMLElement) ??
      document.documentElement;

    const prev = {
      overflow: el.style.overflow,
      paddingRight: el.style.paddingRight,
      overscrollBehavior: el.style.overscrollBehavior,
      position: (document.body.style.position || ""),
      top: (document.body.style.top || ""),
      width: (document.body.style.width || ""),
    };

    const isIOS =
      /iP(ad|hone|od)/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && "ontouchstart" in window);

    const scrollbarGap =
      el === document.documentElement ? window.innerWidth - document.documentElement.clientWidth
                                      : el.offsetWidth - el.clientWidth;

    const scrollY = window.scrollY;

    locks++;

    if (isIOS && (el === document.body || el === document.documentElement)) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      el.style.overflow = "hidden";
      if (scrollbarGap > 0) el.style.paddingRight = `${scrollbarGap}px`;
    }
    el.style.overscrollBehavior = "contain";

    const stop = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });

    return () => {
      if (--locks > 0) return;
      el.style.overflow = prev.overflow;
      el.style.paddingRight = prev.paddingRight;
      el.style.overscrollBehavior = prev.overscrollBehavior;
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);

      if (isIOS) {
        document.body.style.position = prev.position;
        document.body.style.top = prev.top;
        document.body.style.width = prev.width;
        window.scrollTo(0, scrollY);
      }
    };
  }, [enabled, target]);
}
