import { ClipboardCheck, Eye, Landmark, Waves } from "lucide-react";

const values = [
  {
    icon: Eye,
    title: "Pemantauan yang mudah dibaca",
    desc: "Petugas dapat melihat kondisi air, perangkat, dan pintu air tanpa harus membuka banyak sistem terpisah.",
  },
  {
    icon: ClipboardCheck,
    title: "Keputusan operasional lebih cepat",
    desc: "Data sensor dan status perangkat ditampilkan berdekatan agar perubahan penting segera terlihat.",
  },
  {
    icon: Landmark,
    title: "Mendukung tata kelola infrastruktur",
    desc: "Riwayat data tersimpan rapi sebagai dasar evaluasi, pelaporan, dan tindak lanjut lapangan.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-[#F8FAFC] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#0F766E]">
              Tentang HydroGate
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-normal text-[#0F172A] md:text-5xl">
              Sistem monitoring pintu air untuk operasi yang lebih terkendali.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              HydroGate adalah platform berbasis IoT untuk mengumpulkan,
              menyimpan, dan menampilkan data pintu air dari perangkat lapangan.
              Sistem ini dirancang agar tim operasional dapat memantau kondisi
              secara real-time, memahami risiko perubahan tinggi air, dan
              melakukan kontrol jarak jauh saat dibutuhkan.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Monitoring pintu air penting karena keterlambatan membaca kondisi
              lapangan dapat berdampak pada keselamatan, distribusi air, dan
              kelancaran koordinasi petugas.
            </p>
          </div>

          <div className="rounded-xl border border-[#CFE7F3] bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <div className="rounded-lg bg-gradient-to-br from-[#0F172A] via-[#164E63] to-[#0F766E] p-5 text-white">
              <div className="mb-10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-cyan-100">
                    Fokus operasi
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Pintu air, sensor, dan perangkat IoT
                  </p>
                </div>
                <span className="rounded-lg bg-white/10 p-3 text-cyan-200">
                  <Waves size={24} />
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {["Tinggi air", "Status pintu", "Kesehatan perangkat"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-white/10 bg-white/[0.08] p-4"
                    >
                      <p className="text-sm font-semibold text-white">{item}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-300">
                        Ditampilkan dalam satu alur monitoring.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {values.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-[#E2E8F0] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(20,184,166,0.1)]"
                  >
                    <Icon size={21} className="mb-6 text-[#0F766E]" />
                    <h3 className="text-base font-semibold text-[#0F172A]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
