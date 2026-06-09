"use client";

import { useEffect, useState } from "react";

const DEFAULT_TARGET = "2026-10-28T18:00:00+05:30";

function compute(target: number) {
  const diff = target - Date.now();
  if (diff <= 0) return { d: "00", h: "00", m: "00", s: "00" };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s) };
}

const PLACEHOLDER = { d: "—", h: "—", m: "—", s: "—" };

export default function Countdown({ targetDate }: { targetDate?: string }) {
  const [{ d, h, m, s }, setTime] = useState(PLACEHOLDER);

  useEffect(() => {
    const target = new Date(targetDate || DEFAULT_TARGET).getTime();
    setTime(compute(target));
    const id = setInterval(() => setTime(compute(target)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const boxes: Array<[string, string]> = [
    [d, "Days"],
    [h, "Hours"],
    [m, "Minutes"],
    [s, "Seconds"],
  ];

  return (
    <div className="flex flex-wrap justify-center gap-10 sm:gap-16 lg:gap-[70px] relative z-[2]">
      {boxes.map(([value, label]) => (
        <div key={label} className="text-center">
          <div className="font-serif text-[56px] sm:text-[72px] lg:text-[84px] text-gold leading-none mb-3 tabular-nums">
            {value}
          </div>
          <div className="text-[10px] tracking-[0.4em] uppercase text-cream-muted">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
