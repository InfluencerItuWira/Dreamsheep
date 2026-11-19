
import { Bell, AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";

export default function Notifikasi({
  history = [],
  thresholds = { thi: 29, ammonia: 15 },
}) {
  // Mengambil pembacaan yang melewati ambang operasional.
  const notifications = [...history]
    .reverse()
    .flatMap((item) => {
      const alerts = [];

      if (item.thi > thresholds.thi) {
        alerts.push({
          id: `${item.timestamp}-thi`,
          time: item.time,
          title: "Peringatan THI Tinggi",
          description: `Nilai THI mencapai ${item.thi.toLocaleString(
            "id-ID"
          )}, melebihi ambang batas ${thresholds.thi}.`,
          type: "thi",
        });
      }

      if (item.ammonia > thresholds.ammonia) {
        alerts.push({
          id: `${item.timestamp}-ammonia`,
          time: item.time,
          title: "Peringatan Amonia Tinggi",
          description: `Kadar amonia mencapai ${item.ammonia.toLocaleString(
            "id-ID"
          )} ppm, melebihi ambang batas ${thresholds.ammonia} ppm.`,
          type: "ammonia",
        });
      }

      return alerts;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#23436B] to-[#4F7EB6] rounded-3xl p-7 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Bell size={28} />
          <h2 className="text-2xl font-bold">
            Notifikasi Sistem
          </h2>
        </div>

        <p className="text-sm text-blue-100">
          Informasi peringatan kondisi lingkungan kandang
          berdasarkan pembacaan sensor DreamSheep.
        </p>
      </section>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Peringatan
          </p>
          <h3 className="text-3xl font-bold text-[#23436B] mt-2">
            {notifications.length}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Peringatan THI
          </p>
          <h3 className="text-3xl font-bold text-[#C99A5B] mt-2">
            {notifications.filter((n) => n.type === "thi").length}
          </h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Peringatan Amonia
          </p>
          <h3 className="text-3xl font-bold text-[#8B5E3A] mt-2">
            {notifications.filter((n) => n.type === "ammonia").length}
          </h3>
        </div>
      </div>

      {/* Daftar Notifikasi */}
      <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="font-bold text-[#23436B] mb-2">
          Riwayat Peringatan
        </h3>

        <p className="text-xs text-slate-500 mb-6">
          Notifikasi berdasarkan 20 pembacaan simulasi
          terbaru. Belum terhubung ke WhatsApp.
        </p>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2
              size={42}
              className="mx-auto text-green-500 mb-3"
            />
            <p className="font-semibold text-[#23436B]">
              Belum Ada Peringatan
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Tidak ada pembacaan yang melewati ambang
              batas pada riwayat saat ini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50"
              >
                <div className="p-3 rounded-xl bg-amber-100">
                  <AlertTriangle
                    size={20}
                    className="text-amber-700"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#23436B]">
                    {item.title}
                  </h4>

                  <p className="text-sm text-slate-600 mt-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                    <Clock3 size={14} />
                    {item.time}
                  </div>
                </div>

                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                  Peringatan
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
