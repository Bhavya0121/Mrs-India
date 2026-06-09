"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type MediaMap = Record<string, { url: string }>;

type Slot = { key: string; label: string };

type ToastKind = "success" | "error";

/** Six reference placeholder gradients, cycled by card index. */
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #3C0F1F, #14080C)",
  "linear-gradient(135deg, #8B6F38, #1A0F12)",
  "linear-gradient(135deg, #5C1428, #14080C)",
  "linear-gradient(135deg, #3C0F1F, #8B6F38)",
  "linear-gradient(135deg, #14080C, #5C1428)",
  "linear-gradient(160deg, #C9A961, #4A0F23)",
] as const;

function glyphFor(index: number): string {
  return index % 2 === 0 ? "♛" : "✦";
}

export function MediaEditor({
  initial,
  slots,
}: {
  initial: MediaMap;
  slots: readonly Slot[];
}) {
  const [media, setMedia] = useState<MediaMap>(initial);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const [toastMessage, setToastMessage] = useState("");
  const [toastKind, setToastKind] = useState<ToastKind>("success");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((kind: ToastKind, message: string) => {
    setToastMessage(message);
    setToastKind(kind);
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const handleUpload = useCallback(
    async (slot: string, file: File) => {
      setUploading((u) => ({ ...u, [slot]: true }));
      try {
        const form = new FormData();
        form.append("slot", slot);
        form.append("file", file);
        const res = await fetch("/api/media", { method: "POST", body: form });
        const data = (await res.json().catch(() => ({}))) as {
          url?: string;
          error?: string;
        };
        if (!res.ok || typeof data.url !== "string") {
          throw new Error(data.error ?? `Upload failed (${res.status})`);
        }
        const url = data.url;
        setMedia((m) => ({ ...m, [slot]: { url } }));
        showToast("success", "Image uploaded.");
      } catch (err) {
        console.error("Failed to upload media:", err);
        showToast(
          "error",
          err instanceof Error ? err.message : "Could not upload image."
        );
      } finally {
        setUploading((u) => ({ ...u, [slot]: false }));
      }
    },
    [showToast]
  );

  const handleDelete = useCallback(
    async (slot: string) => {
      if (!window.confirm("Delete this image?")) return;
      try {
        const res = await fetch(
          `/api/media?slot=${encodeURIComponent(slot)}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error(`Delete failed (${res.status})`);
        setMedia((m) => {
          const next = { ...m };
          delete next[slot];
          return next;
        });
        showToast("success", "Image deleted.");
      } catch (err) {
        console.error("Failed to delete media:", err);
        showToast("error", "Could not delete image. Please try again.");
      }
    },
    [showToast]
  );

  return (
    <>
      <div className="mb-7">
        <h1 className="font-serif text-[32px] text-text font-medium leading-tight">
          Media
        </h1>
        <p className="text-text-muted text-[13px] mt-1">
          Upload and replace the images shown on your website.
        </p>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {slots.map((slot, index) => (
          <MediaCard
            key={slot.key}
            slot={slot}
            index={index}
            url={media[slot.key]?.url}
            uploading={Boolean(uploading[slot.key])}
            onUpload={handleUpload}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Toast kind={toastKind} message={toastMessage} visible={toastVisible} />
    </>
  );
}

function MediaCard({
  slot,
  index,
  url,
  uploading,
  onUpload,
  onDelete,
}: {
  slot: Slot;
  index: number;
  url?: string;
  uploading: boolean;
  onUpload: (slot: string, file: File) => void;
  onDelete: (slot: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasAsset = typeof url === "string" && url.length > 0;

  function pickFile() {
    inputRef.current?.click();
  }

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden border border-border bg-surface">
        {hasAsset ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={slot.label}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-gold text-3xl"
            style={{ background: PLACEHOLDER_GRADIENTS[index % 6] }}
          >
            {glyphFor(index)}
          </div>
        )}

        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/70 text-gold text-[12px] tracking-[0.18em] uppercase">
            Uploading…
          </div>
        ) : null}

        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {hasAsset ? (
            <>
              <CardButton
                label="Replace"
                glyph="↻"
                onClick={pickFile}
                disabled={uploading}
              />
              <CardButton
                label="Delete"
                glyph="×"
                onClick={() => onDelete(slot.key)}
                disabled={uploading}
              />
            </>
          ) : (
            <CardButton
              label="Upload"
              glyph="⇡"
              onClick={pickFile}
              disabled={uploading}
            />
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(slot.key, file);
            e.target.value = "";
          }}
        />
      </div>

      <div className="mt-2.5">
        <div className="media-name font-serif text-[14px] text-text truncate">
          {slot.label}
        </div>
        <div className="media-meta text-[10px] tracking-[0.18em] uppercase text-gold mt-0.5 truncate">
          {slot.key}
        </div>
      </div>
    </div>
  );
}

function CardButton({
  label,
  glyph,
  onClick,
  disabled,
}: {
  label: string;
  glyph: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] text-gold bg-bg/50 backdrop-blur-sm border border-border-strong hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span aria-hidden className="text-[13px] leading-none">
        {glyph}
      </span>
      <span className="hidden sm:inline">{label}</span>
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
        className={
          kind === "error" ? "text-danger text-lg" : "text-success text-lg"
        }
      >
        {kind === "error" ? "!" : "✓"}
      </span>
      <span>{message || " "}</span>
    </div>
  );
}
