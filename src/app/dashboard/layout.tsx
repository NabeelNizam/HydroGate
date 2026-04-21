import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HydroGate - Dam Monitoring System",
  description: "Real-time dam gate monitoring and control dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}