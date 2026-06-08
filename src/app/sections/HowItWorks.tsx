import { Cloud, Cpu, Database, MonitorCheck } from "lucide-react";

const steps = [
  {
    icon: Cpu,
    label: "ESP32",
    title: "Perangkat membaca kondisi air",
    desc: "Sensor pada perangkat lapangan membaca tinggi air, jarak ultrasonik, status pintu, dan posisi aktuator.",
  },
  {
    icon: Cloud,
    label: "AWS IoT Core",
    title: "Sinyal dikirim ke AWS",
    desc: "Data perangkat dikirim melalui jalur IoT untuk diproses sebelum masuk ke penyimpanan backend.",
  },
  {
    icon: Database,
    label: "DynamoDB",
    title: "Data sensor disimpan",
    desc: "Setiap item sensor tersimpan sebagai riwayat yang dapat dibaca ulang oleh API aplikasi.",
  },
  {
    icon: MonitorCheck,
    label: "Website HydroGate",
    title: "Operator memantau dari dasbor",
    desc: "Website menampilkan ringkasan perangkat, status terbaru, dan data monitoring langsung.",
  },
];

export default function HowItWorks() {
  return (
    <section id="workflow" className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#0F766E]">
            Cara Kerja
          </p>
          <h2 className="text-3xl font-semibold tracking-normal text-[#0F172A] md:text-5xl">
            Alur data dari perangkat lapangan hingga website.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            HydroGate menempatkan perangkat, layanan cloud, penyimpanan, dan
            antarmuka operator dalam satu alur monitoring yang mudah dipahami.
          </p>
        </div>

        <div className="relative grid gap-4 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-[#38BDF8] via-[#14B8A6] to-[#0F172A] lg:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="relative rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-[0_16px_42px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:border-[#BAE6FD] hover:shadow-[0_20px_48px_rgba(20,184,166,0.12)]"
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-lg bg-[#ECFEFF] text-[#0F766E] ring-8 ring-white">
                    <Icon size={23} />
                  </span>
                  <span className="text-sm font-semibold text-[#38BDF8]">
                    0{index + 1}
                  </span>
                </div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#0F766E]">
                  {step.label}
                </p>
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-[#CFE7F3] bg-gradient-to-r from-[#F8FAFC] via-white to-[#ECFEFF] px-5 py-4 text-sm font-semibold text-[#0F172A] shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          ESP32 <span className="mx-2 text-[#38BDF8]">-&gt;</span> AWS IoT Core
          <span className="mx-2 text-[#38BDF8]">-&gt;</span> DynamoDB
          <span className="mx-2 text-[#38BDF8]">-&gt;</span> Website HydroGate
        </div>
      </div>
    </section>
  );
}
