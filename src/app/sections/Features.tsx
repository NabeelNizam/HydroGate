import {
  BellRing,
  CloudCog,
  Cpu,
  Database,
  LineChart,
  RadioTower,
  SlidersHorizontal,
} from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Monitoring real-time",
    desc: "Menampilkan status air, jarak sensor, dan pembaruan terakhir dari perangkat lapangan.",
  },
  {
    icon: Cpu,
    title: "Monitoring banyak perangkat",
    desc: "Meringkas kondisi beberapa perangkat agar operator dapat melihat prioritas penanganan.",
  },
  {
    icon: RadioTower,
    title: "Integrasi AWS IoT",
    desc: "Disiapkan untuk menerima sinyal dari perangkat ESP32 melalui jalur IoT yang terkelola.",
  },
  {
    icon: Database,
    title: "Penyimpanan DynamoDB",
    desc: "Data sensor tersimpan pada DynamoDB sehingga riwayat monitoring dapat ditelusuri kembali.",
  },
  {
    icon: BellRing,
    title: "Notifikasi status",
    desc: "Status aman, siaga, dan bahaya dapat ditampilkan jelas untuk mempercepat respons petugas.",
  },
  {
    icon: SlidersHorizontal,
    title: "Kontrol pintu jarak jauh",
    desc: "Mendukung alur kendali pintu air dari dasbor saat integrasi aktuator tersedia.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#0F766E]">
              Fitur Unggulan
            </p>
            <h2 className="text-3xl font-semibold tracking-normal text-[#0F172A] md:text-5xl">
              Fitur inti untuk pemantauan dan pengendalian pintu air.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            Setiap fitur disusun untuk kebutuhan operasional: mudah dipindai,
            memiliki konteks status yang jelas, dan terhubung dengan data yang
            tersimpan di backend.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const highlighted = index === 0 || index === 3;

            return (
              <div
                key={feature.title}
                className={`rounded-lg border p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] ${
                  highlighted
                    ? "border-[#BAE6FD] bg-gradient-to-br from-white to-[#F0FDFA]"
                    : "border-[#E2E8F0] bg-white"
                }`}
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <span className="rounded-lg bg-[#ECFEFF] p-3 text-[#0F766E]">
                    <Icon size={23} />
                  </span>
                  {highlighted && (
                    <CloudCog size={18} className="text-[#38BDF8]" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
