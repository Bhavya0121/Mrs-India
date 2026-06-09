"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { SerializedApplication } from "@/types/application";
import type { ApplicationStatus } from "@/models/Application";
import { Sidebar } from "./sidebar";

type FilterKey = "all" | ApplicationStatus;
type ToastKind = "success" | "error";

const PAGE_SIZE = 10;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #C9A961, #5C1428)",
  "linear-gradient(135deg, #8B6F38, #1A0F12)",
  "linear-gradient(135deg, #5C1428, #14080C)",
  "linear-gradient(135deg, #3C0F1F, #8B6F38)",
  "linear-gradient(135deg, #14080C, #5C1428)",
  "linear-gradient(135deg, #C9A961, #8B6F38)",
  "linear-gradient(135deg, #5C1428, #C9A961)",
  "linear-gradient(135deg, #8B6F38, #5C1428)",
];

const CSV_COLUMNS: [string, (a: SerializedApplication) => string][] = [
  ["Reference", (a) => a.reference ?? ""],
  ["Full Name", (a) => a.full_name],
  ["Email", (a) => a.email],
  ["Phone", (a) => a.phone ?? ""],
  ["DOB", (a) => a.dob ?? ""],
  ["Marital Status", (a) => a.marital_status ?? ""],
  ["Nationality", (a) => a.nationality ?? ""],
  ["City", (a) => a.city ?? ""],
  ["State", (a) => a.state ?? ""],
  ["Category", (a) => a.category ?? ""],
  ["Height", (a) => a.height ?? ""],
  ["Profession", (a) => a.profession ?? ""],
  ["Instagram", (a) => a.instagram ?? ""],
  ["Languages", (a) => a.languages ?? ""],
  ["Status", (a) => a.status],
  ["Payment Status", (a) => a.payment_status ?? ""],
  ["Fee Amount", (a) => (a.fee_amount != null ? String(a.fee_amount) : "")],
  ["Source", (a) => a.source ?? ""],
  ["Emergency Name", (a) => a.emergency_name ?? ""],
  ["Emergency Phone", (a) => a.emergency_phone ?? ""],
  ["Created At", (a) => a.createdAt],
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diffMs = Date.now() - then;
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 30) return `${day} days ago`;
  return new Date(iso).toLocaleDateString();
}

function formatDob(raw: string | undefined): string {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const dateStr = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const age = Math.floor(
    (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000)
  );
  return `${dateStr} · ${age} years`;
}

function statusBadgeClasses(status: ApplicationStatus): string {
  switch (status) {
    case "pending":
      return "bg-[var(--warning-bg)] text-warning";
    case "shortlisted":
      return "bg-[rgba(201,169,97,0.12)] text-gold";
    case "approved":
      return "bg-[var(--success-bg)] text-success";
    case "rejected":
      return "bg-[var(--danger-bg)] text-danger";
  }
}

function paymentColor(payment: string | undefined): string {
  const v = (payment ?? "").toLowerCase();
  if (v === "paid" || v === "success" || v === "completed")
    return "var(--success)";
  if (v === "failed" || v === "refunded") return "var(--danger)";
  return "var(--warning)";
}

function paymentLabel(payment: string | undefined): string {
  if (!payment) return "Pending";
  return payment.charAt(0).toUpperCase() + payment.slice(1);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function escapeCsv(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function downloadCsv(rows: SerializedApplication[]): number {
  const header = CSV_COLUMNS.map(([h]) => escapeCsv(h)).join(",");
  const body = rows.map((r) =>
    CSV_COLUMNS.map(([, fn]) => escapeCsv(fn(r))).join(",")
  );
  const csv = [header, ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return rows.length;
}

export function DashboardShell({
  initialApplications,
  agentName,
}: {
  initialApplications: SerializedApplication[];
  agentName?: string | null;
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [toastMessage, setToastMessage] = useState("");
  const [toastKind, setToastKind] = useState<ToastKind>("success");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    setToastMessage(message);
    setToastKind(kind);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => {
    const base: Record<FilterKey, number> = {
      all: applications.length,
      pending: 0,
      shortlisted: 0,
      approved: 0,
      rejected: 0,
    };
    for (const a of applications) base[a.status] += 1;
    return base;
  }, [applications]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      return (
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.reference ?? "").toLowerCase().includes(q)
      );
    });
  }, [applications, filter, query]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = visible.slice(pageStart, pageStart + PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const set = new Set<number>([
      1,
      totalPages,
      safePage - 1,
      safePage,
      safePage + 1,
    ]);
    return Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
  }, [totalPages, safePage]);

  const selected = useMemo(
    () => applications.find((a) => a._id === selectedId) ?? null,
    [applications, selectedId]
  );

  async function updateStatus(id: string, status: ApplicationStatus) {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? `Update failed (${res.status})`);
      }
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
      setSelectedId(null);
      showToast("success", `Marked as ${capitalize(status)}.`);
      startTransition(() => router.refresh());
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Update failed."
      );
    }
  }

  function onExport() {
    if (visible.length === 0) {
      showToast("error", "Nothing to export.");
      return;
    }
    const count = downloadCsv(visible);
    showToast("success", `Exported ${count} application${count === 1 ? "" : "s"}.`);
  }

  return (
    <>
      <div className="grid h-screen overflow-hidden grid-cols-[64px_1fr] lg:grid-cols-[240px_1fr]">
        <Sidebar
          pendingCount={counts.pending}
          agentName={agentName ?? "Admin User"}
        />

        <main className="flex flex-col overflow-hidden">
          <header className="h-16 bg-surface border-b border-border flex items-center px-8 shrink-0">
            <div className="font-serif text-2xl text-text font-medium">
              Applications
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5 md:p-8 animate-fade-in">
            <div className="mb-7 flex items-end justify-between gap-5 flex-wrap">
              <div>
                <h1 className="font-serif text-[32px] text-text font-medium leading-tight">
                  Applications
                </h1>
                <p className="text-text-muted text-[13px] mt-1">
                  Review and manage contestant applications.
                </p>
              </div>
              <div className="flex gap-2.5">
                <GhostButton onClick={onExport}>⇣ Export CSV</GhostButton>
              </div>
            </div>

            <div className="bg-surface border border-border overflow-hidden">
              <div className="px-[22px] py-4 border-b border-border flex gap-2.5 items-center flex-wrap">
                {FILTERS.map((f) => (
                  <FilterPill
                    key={f.key}
                    active={filter === f.key}
                    label={f.label}
                    count={counts[f.key]}
                    onClick={() => setFilter(f.key)}
                  />
                ))}
                <div className="relative ml-auto w-[240px]">
                  <span
                    aria-hidden
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted text-[13px] pointer-events-none"
                  >
                    ⌕
                  </span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name or email..."
                    className="w-full bg-surface-2 border border-border text-text pl-8 pr-3 py-[7px] text-[12px] outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {[
                        "Applicant",
                        "Category",
                        "Location",
                        "Applied",
                        "Status",
                        "Payment",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-[14px] px-[22px] text-[10px] tracking-[0.25em] uppercase text-text-muted font-medium border-b border-border bg-surface-2 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-14 px-[22px] text-center text-text-muted text-[13px]"
                        >
                          No applications match this view.
                        </td>
                      </tr>
                    ) : (
                      pageRows.map((a, i) => (
                        <tr
                          key={a._id}
                          onClick={() => setSelectedId(a._id)}
                          className="border-b border-border last:border-b-0 hover:bg-surface-2 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-[22px] align-middle">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[12px] shrink-0"
                                style={{
                                  background:
                                    AVATAR_GRADIENTS[
                                      i % AVATAR_GRADIENTS.length
                                    ],
                                  color: "var(--bg)",
                                }}
                              >
                                {initials(a.full_name) || "—"}
                              </div>
                              <div>
                                <div className="font-medium text-text text-[13px]">
                                  {a.full_name}
                                </div>
                                <div className="text-[11px] text-text-muted mt-0.5">
                                  {a.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-[22px] text-[13px] text-text">
                            {a.category ?? "—"}
                          </td>
                          <td className="py-4 px-[22px] text-[13px] text-text">
                            {[a.city, a.state].filter(Boolean).join(", ") ||
                              "—"}
                          </td>
                          <td className="py-4 px-[22px] text-[13px] text-text">
                            {relativeTime(a.createdAt)}
                          </td>
                          <td className="py-4 px-[22px]">
                            <StatusBadge status={a.status} />
                          </td>
                          <td
                            className="py-4 px-[22px] text-[12px]"
                            style={{ color: paymentColor(a.payment_status) }}
                          >
                            {paymentLabel(a.payment_status)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-[22px] py-[14px] flex justify-between items-center text-[12px] text-text-muted border-t border-border flex-wrap gap-3">
                <span>
                  {visible.length === 0
                    ? "Showing 0 of 0"
                    : `Showing ${pageStart + 1}-${Math.min(
                        pageStart + PAGE_SIZE,
                        visible.length
                      )} of ${visible.length}`}
                </span>
                <div className="flex gap-1">
                  <PaginationButton
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    ariaLabel="Previous page"
                  >
                    ‹
                  </PaginationButton>
                  {pageNumbers.map((n) => (
                    <PaginationButton
                      key={n}
                      active={n === safePage}
                      onClick={() => setPage(n)}
                      ariaLabel={`Page ${n}`}
                    >
                      {n}
                    </PaginationButton>
                  ))}
                  <PaginationButton
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    ariaLabel="Next page"
                  >
                    ›
                  </PaginationButton>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <SlideOver
        application={selected}
        isPending={isPending}
        onClose={() => setSelectedId(null)}
        onAction={(status) => {
          if (selected) void updateStatus(selected._id, status);
        }}
      />

      <Toast kind={toastKind} message={toastMessage} visible={toastVisible} />
    </>
  );
}

function FilterPill({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 px-[14px] py-[7px] bg-surface-2 border text-[11px] uppercase tracking-[0.15em] transition-colors",
        active
          ? "border-gold text-gold bg-[rgba(201,169,97,0.08)]"
          : "border-border text-text-muted hover:border-gold hover:text-gold",
      ].join(" ")}
    >
      {label}
      <span className="bg-bg text-text px-1.5 py-[2px] text-[10px] rounded-[8px] leading-none">
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase font-medium badge-dot",
        statusBadgeClasses(status),
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function PaginationButton({
  children,
  active,
  disabled,
  onClick,
  ariaLabel,
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={[
        "w-[30px] h-[30px] border text-[12px] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-gold text-bg border-gold"
          : "border-border text-text-muted hover:border-gold hover:text-gold",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function GhostButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-[18px] py-[9px] text-[12px] tracking-[0.18em] uppercase font-medium border border-border-strong text-text bg-transparent hover:border-gold hover:text-gold transition-colors whitespace-nowrap"
    >
      {children}
    </button>
  );
}

function Toast({
  kind,
  message,
  visible,
}: {
  kind: ToastKind;
  message: string;
  visible: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "fixed top-6 right-6 bg-surface border text-text px-[22px] py-[14px] text-[13px] z-[1000] flex items-center gap-3 transition-transform duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.4)]",
        kind === "error" ? "border-danger" : "border-gold",
        visible ? "translate-x-0" : "translate-x-[120%]",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={kind === "error" ? "text-danger text-lg" : "text-success text-lg"}
      >
        {kind === "error" ? "!" : "✓"}
      </span>
      <span>{message || " "}</span>
    </div>
  );
}

function SlideOver({
  application,
  isPending,
  onClose,
  onAction,
}: {
  application: SerializedApplication | null;
  isPending: boolean;
  onClose: () => void;
  onAction: (status: ApplicationStatus) => void;
}) {
  const open = application !== null;
  return (
    <>
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-[200] bg-[rgba(13,6,8,0.7)] backdrop-blur-md transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      />
      <aside
        className={[
          "fixed top-0 right-0 bottom-0 z-[201] w-full sm:w-[560px] max-w-[90vw] bg-surface border-l border-border-strong flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
        aria-label="Applicant details"
      >
        {application ? (
          <SlideOverContent
            application={application}
            isPending={isPending}
            onClose={onClose}
            onAction={onAction}
          />
        ) : null}
      </aside>
    </>
  );
}

function SlideOverContent({
  application: a,
  isPending,
  onClose,
  onAction,
}: {
  application: SerializedApplication;
  isPending: boolean;
  onClose: () => void;
  onAction: (status: ApplicationStatus) => void;
}) {
  return (
    <>
      <header className="px-7 py-[22px] border-b border-border flex justify-between items-start gap-4">
        <div>
          <h2 className="font-serif text-[26px] text-text font-medium leading-tight">
            {a.full_name}
          </h2>
          <div className="text-[11px] tracking-[0.2em] uppercase text-text-muted mt-1">
            {a.reference ?? "—"} · Applied {relativeTime(a.createdAt)}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 border border-border-strong rounded-full text-text text-lg flex items-center justify-center hover:bg-gold hover:text-bg hover:border-gold transition-colors shrink-0"
        >
          ×
        </button>
      </header>

      <div className="px-7 py-6 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <PhotoTile
            url={a.headshot_url}
            label="Headshot"
            alt={`${a.full_name} headshot`}
          />
          <PhotoTile
            url={a.fullbody_url}
            label="Full Body"
            alt={`${a.full_name} full body`}
          />
        </div>

        <Section title="Personal Details">
          <DetailRow k="Date of Birth" v={formatDob(a.dob)} />
          <DetailRow k="Marital Status" v={a.marital_status ?? "—"} />
          <DetailRow k="Nationality" v={a.nationality ?? "—"} />
          <DetailRow k="Email" v={a.email} />
          <DetailRow k="Phone" v={a.phone ?? "—"} />
          <DetailRow
            k="Location"
            v={[a.city, a.state].filter(Boolean).join(", ") || "—"}
          />
        </Section>

        <Section title="Profile">
          <DetailRow
            k="Category"
            v={a.category ?? "—"}
            valueClassName="text-gold"
          />
          <DetailRow k="Height" v={a.height ?? "—"} />
          <DetailRow k="Profession" v={a.profession ?? "—"} />
          <DetailRow k="Instagram" v={a.instagram ?? "—"} />
          <DetailRow k="Languages" v={a.languages ?? "—"} />
        </Section>

        {a.about ? (
          <Section title="About">
            <div className="bg-bg border border-border px-[18px] py-4 text-[13px] leading-[1.7] text-text whitespace-pre-wrap">
              {a.about}
            </div>
          </Section>
        ) : null}

        {a.achievements ? (
          <Section title="Achievements">
            <div className="bg-bg border border-border px-[18px] py-4 text-[13px] leading-[1.7] text-text whitespace-pre-wrap">
              {a.achievements}
            </div>
          </Section>
        ) : null}

        <Section title="Application Info">
          <DetailRow k="Application ID" v={a.reference ?? a._id} />
          <DetailRow
            k="Status"
            v={capitalize(a.status)}
          />
          <DetailRow
            k="Submitted"
            v={new Date(a.createdAt).toLocaleString()}
          />
          <DetailRow
            k="Payment"
            v={`${paymentLabel(a.payment_status)}${
              typeof a.fee_amount === "number"
                ? ` · ₹${a.fee_amount.toLocaleString("en-IN")}`
                : ""
            }`}
            valueStyle={{ color: paymentColor(a.payment_status) }}
          />
          <DetailRow k="Heard About Us" v={a.source ?? "—"} />
          <DetailRow
            k="Emergency Contact"
            v={
              a.emergency_name || a.emergency_phone
                ? `${a.emergency_name ?? "—"} · ${a.emergency_phone ?? "—"}`
                : "—"
            }
          />
        </Section>
      </div>

      <footer className="px-7 py-[18px] border-t border-border bg-surface-2 flex gap-2.5 justify-end">
        <ActionButton
          variant="danger"
          disabled={isPending || a.status === "rejected"}
          onClick={() => onAction("rejected")}
        >
          Reject
        </ActionButton>
        <ActionButton
          variant="default"
          disabled={isPending || a.status === "shortlisted"}
          onClick={() => onAction("shortlisted")}
        >
          ★ Shortlist
        </ActionButton>
        <ActionButton
          variant="primary"
          disabled={isPending || a.status === "approved"}
          onClick={() => onAction("approved")}
        >
          Approve
        </ActionButton>
      </footer>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-6 last:mb-0">
      <h4 className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3.5 font-medium">
        {title}
      </h4>
      <div>{children}</div>
    </section>
  );
}

function DetailRow({
  k,
  v,
  valueClassName,
  valueStyle,
}: {
  k: string;
  v: string;
  valueClassName?: string;
  valueStyle?: CSSProperties;
}) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-border last:border-b-0 text-[13px]">
      <span className="text-text-muted">{k}</span>
      <span
        className={[
          "text-text font-medium text-right max-w-[60%] break-words",
          valueClassName ?? "",
        ].join(" ")}
        style={valueStyle}
      >
        {v}
      </span>
    </div>
  );
}

function PhotoTile({
  url,
  label,
  alt,
}: {
  url: string | undefined;
  label: string;
  alt: string;
}) {
  return (
    <div
      className="relative aspect-[3/4] border border-border flex items-center justify-center text-gold text-xl overflow-hidden"
      style={{
        background: url
          ? undefined
          : "linear-gradient(135deg, var(--surface-2), var(--surface-3))",
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>◇ {label}</span>
      )}
      <span className="absolute bottom-2 left-2 text-[9px] tracking-[0.2em] uppercase text-gold bg-[rgba(13,6,8,0.9)] px-2 py-1">
        {label}
      </span>
    </div>
  );
}

function ActionButton({
  variant,
  disabled,
  onClick,
  children,
}: {
  variant: "primary" | "danger" | "default";
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const base =
    "inline-flex items-center gap-2 px-[18px] py-[9px] text-[12px] tracking-[0.18em] uppercase font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
  const styles =
    variant === "primary"
      ? "bg-gold text-bg border-gold hover:bg-gold-bright hover:border-gold-bright"
      : variant === "danger"
      ? "border-[rgba(216,113,113,0.4)] text-danger hover:bg-danger hover:text-text hover:border-danger"
      : "border-border-strong text-text bg-transparent hover:border-gold hover:text-gold";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}
