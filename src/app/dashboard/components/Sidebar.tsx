"use client";

import { Activity, Database, Monitor } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { id: "live-status", icon: Activity, label: "Live Status", href: "/dashboard/monitoring" },
  { id: "devices", icon: Monitor, label: "Devices", href: "/dashboard/multi-device" },
  { id: "analisis", icon: Database, label: "Analisis", href: "/dashboard/analisis" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-[#E5E5E5] bg-white lg:flex">
      <div className="border-b border-[#E5E5E5] px-6 py-6">
        <p className="text-lg font-semibold tracking-normal text-[#111111]">HydroGate</p>
        <p className="mt-1 text-xs text-[#6B7280]">Device operations</p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "border-[#111111] bg-[#FAFAFA] text-[#111111]"
                  : "border-transparent text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#111111]"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E5E5E5] p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          All systems operational
        </div>
      </div>
    </aside>
  );
}
