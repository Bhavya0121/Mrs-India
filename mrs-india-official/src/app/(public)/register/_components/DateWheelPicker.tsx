"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const ITEM_H = 40; // px height of one row
const VISIBLE = 5; // rows visible at once (center + 2 each side)
const PAD = ((VISIBLE - 1) / 2) * ITEM_H; // top/bottom spacer so ends can center

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MIN_YEAR = 1900;
const DEFAULT_YEARS_BACK = 25;

const pad2 = (n: number) => String(n).padStart(2, "0");
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const daysInMonth = (year: number, monthIndex: number) =>
  new Date(year, monthIndex + 1, 0).getDate();

type Props = {
  value: string; // dd-mm-yyyy or ""
  onChange: (value: string) => void;
  error?: boolean;
  placeholder?: string;
};

export default function DateWheelPicker({
  value,
  onChange,
  error,
  placeholder = "dd-mm-yyyy",
}: Props) {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear; y >= MIN_YEAR; y--) list.push(y); // descending
    return list;
  }, [currentYear]);

  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(1);
  const [monthIndex, setMonthIndex] = useState(0);
  const [year, setYear] = useState(currentYear - DEFAULT_YEARS_BACK);

  const dayItems = useMemo(
    () => Array.from({ length: daysInMonth(year, monthIndex) }, (_, i) => i + 1),
    [year, monthIndex],
  );

  // Derive the in-range day so shrinking the month (e.g. 31 -> Feb) clamps the
  // wheel without an extra state-sync effect. The raw `day` is preserved, so
  // switching back to a 31-day month restores the original selection.
  const effectiveDay = Math.min(day, dayItems.length);

  // Lock body scroll + Escape-to-cancel while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openPicker() {
    const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
    if (m) {
      const d = Number(m[1]);
      const mo = Number(m[2]) - 1;
      const y = Number(m[3]);
      setYear(clamp(y, MIN_YEAR, currentYear));
      setMonthIndex(clamp(mo, 0, 11));
      setDay(clamp(d, 1, daysInMonth(clamp(y, MIN_YEAR, currentYear), clamp(mo, 0, 11))));
    } else {
      setYear(currentYear - DEFAULT_YEARS_BACK);
      setMonthIndex(0);
      setDay(1);
    }
    setOpen(true);
  }

  function confirm() {
    onChange(`${pad2(effectiveDay)}-${pad2(monthIndex + 1)}-${year}`);
    setOpen(false);
  }

  const triggerBorder = error
    ? "border-[var(--crimson)]"
    : "border-[color:var(--line)]";

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        className={`bg-black border ${triggerBorder} px-4 py-3.5 text-sm outline-none transition-colors hover:border-gold focus:border-gold w-full text-left cursor-pointer ${
          value ? "text-cream" : "text-[rgba(157,141,133,0.5)]"
        }`}
      >
        {value || placeholder}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Select date of birth"
        >
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => setOpen(false)}
            className="absolute inset-0 w-full h-full cursor-default"
          />

          <div className="relative w-full max-w-[360px] bg-black-soft border border-gold shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <div className="px-6 py-4 border-b border-[color:var(--line)]">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold font-medium">
                Date of Birth
              </span>
            </div>

            <div className="grid grid-cols-3 px-4 pt-2 pb-1">
              {["Day", "Month", "Year"].map((l) => (
                <span
                  key={l}
                  className="text-center text-[10px] tracking-[0.2em] uppercase text-cream-muted"
                >
                  {l}
                </span>
              ))}
            </div>

            <div
              className="relative grid grid-cols-3"
              style={{ height: VISIBLE * ITEM_H }}
            >
              {/* center highlight band */}
              <div
                className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 border-y border-gold bg-[rgba(201,169,97,0.06)]"
                style={{ height: ITEM_H }}
              />

              <Wheel
                items={dayItems.map((d) => pad2(d))}
                valueIndex={effectiveDay - 1}
                onSelect={(i) => setDay(i + 1)}
              />
              <Wheel
                items={MONTHS}
                valueIndex={monthIndex}
                onSelect={setMonthIndex}
              />
              <Wheel
                items={years.map(String)}
                valueIndex={currentYear - year}
                onSelect={(i) => setYear(years[i])}
              />
            </div>

            <div className="grid grid-cols-2 border-t border-[color:var(--line)]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="py-4 text-[11px] tracking-[0.28em] uppercase text-cream-muted transition-colors hover:text-cream border-r border-[color:var(--line)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm}
                className="py-4 text-[11px] tracking-[0.28em] uppercase text-gold font-medium transition-colors hover:bg-gold hover:text-black"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Wheel({
  items,
  valueIndex,
  onSelect,
}: {
  items: string[];
  valueIndex: number;
  onSelect: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastReported = useRef(valueIndex);
  const raf = useRef<number | null>(null);
  const [active, setActive] = useState(valueIndex);

  // Initial scroll position on mount. `active` already initialises to
  // valueIndex via useState, so no setState is needed here.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = valueIndex * ITEM_H;
    lastReported.current = valueIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // External changes (e.g. day clamped by month) — scroll to the new index.
  useLayoutEffect(() => {
    if (valueIndex === lastReported.current) return;
    const el = ref.current;
    if (el) el.scrollTop = valueIndex * ITEM_H;
    setActive(valueIndex);
    lastReported.current = valueIndex;
  }, [valueIndex]);

  function handleScroll() {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const idx = clamp(Math.round(el.scrollTop / ITEM_H), 0, items.length - 1);
      setActive(idx);
      if (idx !== lastReported.current) {
        lastReported.current = idx;
        onSelect(idx);
      }
    });
  }

  function jumpTo(i: number) {
    ref.current?.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
  }

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{
        height: VISIBLE * ITEM_H,
        // No scroll-padding: with `snap-center` the optimal snap for item i is
        // scrollTop = i * ITEM_H. Adding scroll-padding would offset that and
        // make index 0 and the last item unreachable.
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
      }}
    >
      {/* Top spacer = PAD (= (VISIBLE-1)/2 item-heights) so item 0 can center. */}
      <div aria-hidden style={{ height: PAD }} />
      {items.map((label, i) => {
        const dist = Math.abs(i - active);
        const cls =
          dist === 0
            ? "text-cream font-semibold"
            : dist === 1
              ? "text-cream-muted"
              : "text-cream-muted opacity-40";
        return (
          <button
            type="button"
            key={label}
            onClick={() => jumpTo(i)}
            className={`block w-full snap-center text-center text-[15px] tabular-nums transition-colors ${cls}`}
            style={{ height: ITEM_H, lineHeight: `${ITEM_H}px` }}
          >
            {label}
          </button>
        );
      })}
      {/* Bottom spacer = PAD so the last item can reach the center slot
          (maxScrollTop = (items.length - 1) * ITEM_H). */}
      <div aria-hidden style={{ height: PAD }} />
    </div>
  );
}
