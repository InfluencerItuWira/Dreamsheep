
import {
  Settings,
  Thermometer,
  Wind,
  Cpu,
  Bell,
  ShieldCheck,
  Info,
} from "lucide-react";

export default function Pengaturan({
  thresholds = { thi: 29, ammonia: 15 },
}) {
  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-[#23436B] to-[#4F7EB6] rounded-3xl p-7 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Settings size={28} />
          <h2 className="text-2xl font-bold">
            Pengaturan Sistem
          </h2>
        </div>
        <p className="text-sm text-blue-100">
          Informasi konfigurasi dan perangkat
          monitoring kandang DreamSheep.
        </p>
      </section>

      <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="font-bold text-[#23436B] mb-5">
          Ambang Batas Simulasi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-xl bg-[#F5F7FA]">
            <div className="flex items-center gap-3 mb-3">
              <Thermometer color="#C99A5B" size={22} />
              <p className="font-semibold text-[#23436B]">
                Ambang THI
              </p>
            </div>
            <p className="text-3xl font-bold text-[#23436B]">
              {thresholds.thi}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Kipas disimulasikan aktif saat THI
              melebihi ambang ini.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#F5F7FA]">
            <div className="flex items-center gap-3 mb-3">
              <Wind color="#8B5E3A" size={22} />
              <p className="font-semibold text-[#23436B]">
                Ambang Amonia
              </p>
            </div>
            <p className="text-3xl font-bold text-[#23436B]">
              {thresholds.ammonia}
              <span className="text-base font-normal ml-2">
                ppm
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Nozzle disimulasikan aktif saat amonia
              melebihi ambang ini.
            </p>
          </div>
        </div>

        <p className="text-xs text-amber-700 mt-4">
          Nilai ambang hanya untuk demonstrasi UI,
          bukan konfigurasi final perangkat.
        </p>
      </section>

      <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <Cpu color="#4F7EB6" size={23} />
          <h3 className="font-bold text-[#23436B]">
            Informasi Perangkat
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-[#F5F7FA] rounded-xl">
            <p className="text-slate-500">Mikrokontroler</p>
            <p className="font-semibold text-[#23436B] mt-1">
              ESP32 (1 Main + 2 Node)
            </p>
          </div>

          <div className="p-4 bg-[#F5F7FA] rounded-xl">
            <p className="text-slate-500">Sensor Suhu & Kelembapan</p>
            <p className="font-semibold text-[#23436B] mt-1">
              GY-SHT31
            </p>
          </div>

          <div className="p-4 bg-[#F5F7FA] rounded-xl">
            <p className="text-slate-500">Sensor Amonia</p>
            <p className="font-semibold text-[#23436B] mt-1">
              DFRobot MEMS Ammonia NH3
            </p>
          </div>

          <div className="p-4 bg-[#F5F7FA] rounded-xl">
            <p className="text-slate-500">Status Integrasi</p>
            <p className="font-semibold text-amber-700 mt-1">
              Menunggu integrasi perangkat
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bell color="#4F7EB6" size={22} />
            <h3 className="font-bold text-[#23436B]">
              Konfigurasi Notifikasi
            </h3>
          </div>

          <p className="text-sm text-slate-600">
            Peringatan kondisi THI dan amonia saat ini
            ditampilkan melalui website menggunakan
            data simulasi.
          </p>

          <p className="text-xs text-slate-500 mt-4">
            Integrasi WhatsApp: Belum aktif
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck color="#4F7EB6" size={22} />
            <h3 className="font-bold text-[#23436B]">
              Administrator
            </h3>
          </div>

          <p className="text-sm text-slate-600">
            Pengelolaan pengguna dan hak akses
            administrator akan diintegrasikan
            pada tahap pengembangan berikutnya.
          </p>

          <p className="text-xs text-slate-500 mt-4">
            Autentikasi: Belum diaktifkan
          </p>
        </div>
      </section>

      <section className="bg-[#EEF4FB] rounded-2xl p-5 flex items-start gap-3">
        <Info size={22} className="text-[#4F7EB6] shrink-0" />
        <p className="text-sm text-[#23436B]">
          DreamSheep saat ini berjalan dalam mode
          simulasi lokal. Integrasi Firebase,
          perangkat ESP32, dan pengiriman notifikasi
          WhatsApp masih dalam tahap pengembangan.
        </p>
      </section>
    </div>
  );
}
