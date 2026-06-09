"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Field
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        disabled={loading}
      />
      <Field
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        disabled={loading}
      />

      {error ? (
        <div className="border border-[rgba(216,113,113,0.4)] bg-[var(--danger-bg)] text-danger text-[12px] px-4 py-2.5">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center mt-1 px-[18px] py-[11px] text-[12px] tracking-[0.18em] uppercase font-medium bg-gold text-bg border border-gold hover:bg-gold-bright hover:border-gold-bright transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type,
  autoComplete,
  required,
  disabled,
}: {
  name: string;
  label: string;
  type: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className="bg-bg border border-border text-text px-3.5 py-3 text-[13px] outline-none focus:border-gold transition-colors disabled:opacity-60"
      />
    </label>
  );
}
