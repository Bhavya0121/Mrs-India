"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    if (!targets.length) return;

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => io.observe(el));

    // Reveal any target already within the viewport (initial load or #hash jump),
    // since the observer may not fire for elements that are already on screen.
    const revealInView = () => {
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("in-view");
          io.unobserve(el);
        }
      });
    };

    revealInView();

    const onHashChange = () => {
      requestAnimationFrame(revealInView);
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
