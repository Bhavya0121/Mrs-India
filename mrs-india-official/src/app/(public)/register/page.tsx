"use client";

import Link from "next/link";
import { useState } from "react";
import { REGISTRATION_FEE } from "@/lib/constants";
import DateWheelPicker from "./_components/DateWheelPicker";

type FormState = {
  full_name: string;
  dob: string;
  email: string;
  phone: string;
};

const EMPTY: FormState = {
  full_name: "",
  dob: "",
  email: "",
  phone: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhone(value: string): boolean {
  if (!/^\+?[\d\s\-()]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

// Validate a dd-mm-yyyy string as a real calendar date and return its ISO
// (yyyy-mm-dd) form, or null if invalid.
function parseDob(value: string): string | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const currentYear = new Date().getFullYear();
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > currentYear) return null;
  // Reject impossible dates (e.g. 31-02-2000) via round-trip check.
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${yyyy}-${mm}-${dd}`;
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3200);
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.full_name.trim()) next.full_name = "Full name is required.";

    if (!form.dob.trim()) {
      next.dob = "Date of birth is required.";
    } else if (!parseDob(form.dob)) {
      next.dob = "Enter a valid date in dd-mm-yyyy format.";
    }

    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!isValidPhone(form.phone.trim())) {
      next.phone = "Enter a valid phone number.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit() {
    if (!validate()) {
      showToast("Please complete all required fields.");
      return;
    }
    // validate() guarantees a valid date here; guard keeps the type non-null.
    const dobIso = parseDob(form.dob);
    if (!dobIso) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          dob: dobIso,
          email: form.email,
          phone: form.phone,
          fee_amount: REGISTRATION_FEE,
          payment_status: "unpaid",
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        showToast(body.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      const saved = (await res.json()) as { reference?: string };
      setReference(saved.reference ?? "RQ-2026-XXXX");
      setDone(true);
    } catch {
      showToast("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 justify-center bg-[var(--black)] px-4 py-8 sm:px-6 sm:py-12">
      {toast && (
        <div className="fixed top-7 left-1/2 -translate-x-1/2 z-[2000] bg-[var(--crimson)] text-cream px-7 py-3.5 text-[13px] tracking-[0.1em] border border-gold">
          {toast}
        </div>
      )}

      <div className="w-full max-w-[640px] bg-black-soft border border-gold flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.6)] my-auto">
        <header className="px-6 sm:px-12 py-6 border-b border-[color:var(--line)] flex justify-between items-center">
          <h1 className="font-serif font-medium text-cream text-xl sm:text-[26px]">
            Apply to{" "}
            <em className="italic text-gold">The Rising Queen of India</em>
          </h1>
          <Link
            href="/"
            aria-label="Close"
            className="w-10 h-10 border border-gold rounded-full text-gold text-xl flex items-center justify-center transition-all hover:bg-gold hover:text-black hover:rotate-90"
          >
            ×
          </Link>
        </header>

        <div className="px-6 sm:px-12 py-10 flex-1">
          {done ? (
            <StepSuccess reference={reference} />
          ) : (
            <section>
              <StepTitle title="Tell us" emphasis="about you." />
              <StepSub>
                Begin with the essentials. Everything stays confidential.
              </StepSub>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" required error={errors.full_name}>
                  <Input
                    value={form.full_name}
                    onChange={(v) => update("full_name", v)}
                    placeholder="As per ID"
                    error={Boolean(errors.full_name)}
                  />
                </Field>
                <Field label="Date of Birth" required error={errors.dob}>
                  <DateWheelPicker
                    value={form.dob}
                    onChange={(v) => update("dob", v)}
                    error={Boolean(errors.dob)}
                  />
                </Field>
                <Field label="Email" required error={errors.email}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@email.com"
                    error={Boolean(errors.email)}
                  />
                </Field>
                <Field label="Phone" required error={errors.phone}>
                  <Input
                    type="tel"
                    value={form.phone}
                    onChange={(v) => update("phone", v)}
                    placeholder="+91 XXXXX XXXXX"
                    error={Boolean(errors.phone)}
                  />
                </Field>
              </div>
            </section>
          )}
        </div>

        {!done && (
          <div className="px-6 sm:px-12 py-5 border-t border-[color:var(--line)] bg-black flex justify-end items-center">
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-gold text-black border border-gold text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-cream disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit Application →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function StepSuccess({ reference }: { reference: string | null }) {
  return (
    <section className="text-center py-10 px-5">
      <span className="text-[64px] text-gold mb-6 block leading-none">♛</span>
      <h3 className="font-serif italic text-cream text-3xl sm:text-[38px] mb-4 font-medium">
        Your crown awaits.
      </h3>
      <p className="text-cream-muted max-w-[540px] mx-auto leading-[1.7] text-[15px] mb-6">
        Thank you for applying to The Rising Queen of India, Season 01. Your
        application reference is{" "}
        <span className="inline-block px-4 py-2 border border-gold text-gold font-serif italic text-lg mx-1">
          {reference ?? "RQ-2026-XXXX"}
        </span>
      </p>
      <p className="text-[13px] text-cream-muted mb-6 max-w-[540px] mx-auto leading-[1.7]">
        Our team will review your application and reach out personally about
        next steps, audition details, and the registration payment. Please keep
        your reference number handy.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-3 px-8 py-3.5 bg-gold text-black border border-gold text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-cream"
      >
        Back to Home
      </Link>
    </section>
  );
}

function StepTitle({ title, emphasis }: { title: string; emphasis: string }) {
  return (
    <h2 className="font-serif text-cream text-3xl sm:text-[32px] mb-2 font-medium leading-tight">
      {title} <em className="italic text-gold">{emphasis}</em>
    </h2>
  );
}

function StepSub({ children }: { children: React.ReactNode }) {
  return <p className="text-cream-muted text-sm mb-8 leading-[1.5]">{children}</p>;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <span className="text-[10px] tracking-[0.25em] uppercase text-gold mb-2.5 font-medium block">
      {label}
      {required && <span className="text-[var(--crimson)] ml-0.5">*</span>}
    </span>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col">
      <FieldLabel label={label} required={required} />
      {children}
      {error && (
        <span className="text-[var(--crimson)] text-[11px] mt-1.5">{error}</span>
      )}
    </label>
  );
}

function inputClasses(error?: boolean) {
  return `bg-black border ${
    error ? "border-[var(--crimson)]" : "border-[color:var(--line)]"
  } text-cream px-4 py-3.5 text-sm outline-none transition-colors focus:border-gold w-full placeholder:text-[rgba(157,141,133,0.5)]`;
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.ComponentProps<"input">["inputMode"];
  error?: boolean;
}) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClasses(error)}
    />
  );
}
