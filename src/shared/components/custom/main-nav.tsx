"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Users, Calendar, FileText } from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: FileText,
  },
  {
    href: "/pegawai",
    label: "Data Pegawai",
    icon: Users,
  },
  {
    href: "/absensi",
    label: "Absensi",
    icon: Calendar,
  },
  {
    href: "/laporan",
    label: "Laporan",
    icon: FileText,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-8">
          <Link href="/" className="font-bold text-xl">
            Sistem Absensi
          </Link>
          <div className="flex gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
