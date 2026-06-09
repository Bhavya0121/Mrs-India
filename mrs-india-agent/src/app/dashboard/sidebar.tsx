"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type NavItem = {
  href: string;
  label: string;
  icon: string;
  badge?: number;
};

export function Sidebar({
  pendingCount,
  agentName,
}: {
  pendingCount: number;
  agentName: string;
}) {
  const pathname = usePathname();
  const avatarInitials = initials(agentName) || "AD";

  const navItems: NavItem[] = [
    { href: "/dashboard", label: "Applications", icon: "♛", badge: pendingCount },
    { href: "/dashboard/content", label: "Content", icon: "✎" },
    { href: "/dashboard/media", label: "Media", icon: "◇" },
  ];

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="bg-surface border-r border-border flex flex-col">
      <div className="px-6 py-[22px] border-b border-border">
        <div className="hidden lg:block">
          <div className="font-serif font-medium text-lg tracking-[0.08em] text-text leading-none whitespace-nowrap">
            The Rising Queen
          </div>
          <div className="text-[9px] tracking-[0.32em] uppercase text-gold mt-1">
            Admin
          </div>
        </div>
      </div>

      <nav className="p-3 flex-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "flex items-center gap-3.5 px-4 py-3 text-[13px] border-l-2 transition-colors mb-1",
                active
                  ? "bg-surface-2 text-gold border-gold"
                  : "border-transparent text-text-muted hover:bg-surface-2 hover:text-text",
              ].join(" ")}
            >
              <span aria-hidden className="text-base w-5 text-center">
                {item.icon}
              </span>
              <span className="hidden lg:inline">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="hidden lg:inline-flex ml-auto bg-gold text-bg text-[10px] font-semibold px-2 py-[2px] rounded-[8px] leading-none items-center">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-[13px] shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--gold-deep), var(--gold))",
            color: "var(--bg)",
          }}
        >
          {avatarInitials}
        </div>
        <div className="hidden lg:block min-w-0">
          <div className="text-[13px] text-text leading-none truncate">
            {agentName}
          </div>
          <div className="text-[10px] tracking-[0.18em] uppercase text-text-muted mt-1.5">
            Admin
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            void signOut({ callbackUrl: "/login" });
          }}
          title="Logout"
          aria-label="Logout"
          className="hidden lg:inline-flex ml-auto p-1.5 text-text-muted hover:text-gold transition-colors text-base"
        >
          ⎋
        </button>
      </div>
    </aside>
  );
}
