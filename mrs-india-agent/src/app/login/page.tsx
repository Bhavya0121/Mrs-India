import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6 animate-fade-in">
      <div className="w-full max-w-[420px] bg-surface border border-border p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full border border-gold flex items-center justify-center text-gold font-serif italic text-2xl mb-5">
            M
          </div>
          <h1 className="font-serif text-2xl text-text font-medium tracking-[0.18em]">
            MRS INDIA
          </h1>
          <div className="text-[10px] tracking-[0.32em] uppercase text-gold mt-2">
            · Admin ·
          </div>
        </div>

        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

function LoginFormFallback() {
  return (
    <div className="flex flex-col gap-5">
      <FallbackField label="Email" />
      <FallbackField label="Password" />
      <div className="h-10 bg-surface-2 border border-border" />
    </div>
  );
}

function FallbackField({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium">
        {label}
      </span>
      <div className="h-10 bg-bg border border-border" />
    </div>
  );
}
