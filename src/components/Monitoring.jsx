
import {
  Thermometer,
  Droplets,
  Activity,
  Wind,
  Fan,
  Wifi,
  Info,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const parameters = [
  {
    key: "temperature",
    name: "Suhu Kandang",
    unit: "°C",
    color: "#4F7EB6",
    icon: Thermometer,
  },
  {
    key: "humidity",
    name: "Kelembapan",
    unit: "%",
    color: "#A7C6E8",
    icon: Droplets,
  },
  {
    key: "thi",
    name: "Temperature Humidity Index",
    unit: "",
    color: "#C99A5B",
    icon: Activity,
  },
  {
    key: "ammonia",
    name: "Kadar Amonia",
    unit: "ppm",
    color: "#8B5E3A",
    icon: Wind,
  },
];

function SensorChart({ parameter, history, latest }) {
  const Icon = parameter.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex justify-between items-start gap-3 mb-6">
        <div>
          <p className="text-sm text-slate-500">{parameter.name}</p>
          <h3 className="text-2xl font-bold text-[#23436B] mt-2">
            {latest[parameter.key].toLocaleString("id-ID")}
            <span className="text-sm font-normal text-slate-500 ml-1">
              {parameter.unit}
            </span>
          </h3>
        </div>

        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${parameter.color}20` }}
        >
          <Icon size={23} color={parameter.color} />
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF3" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              minTickGap={22}
            />
            <YAxis
              width={35}
              tick={{ fontSize: 11 }}
              domain={["auto", "auto"]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={parameter.key}
              stroke={parameter.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-slate-400 mt-3">
       Data rata-rata Node 1 & Node 2 • Firebase Realtime 
      </p>
    </div>
  );
}

export default function Monitoring({
  latest,
  history,
  thresholds,
  fanOn,
  nozzleOn,
}) {
  const warning =
    latest.thi > thresholds.thi ||
    latest.ammonia > thresholds.ammonia;

  return (
    <div className="space-y-7">
      <section className="bg-gradient-to-r from-[#23436B] to-[#4F7EB6] rounded-3xl p-7 text-white">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <p className="text-sm text-blue-100">
             DREAMSHEEP REAL-TIME MONITORING
            </p>
            <h2 className="text-2xl font-bold mt-2">
              Monitoring Lingkungan Kandang
            </h2>
            <p className="text-sm text-blue-100 mt-3">
             Pantau perubahan parameter mikroklimat dan kadar gas kandang
             secara real-time dari node sensor.            </p>
          </div>

          <span className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl text-sm">
            <Wifi size={17} />
            Sinkronisasi Firebase 
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parameters.map((parameter) => (
          <SensorChart
            key={parameter.key}
            parameter={parameter}
            history={history}
            latest={latest}
          />
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#23436B]">
            Kondisi Lingkungan
          </h3>

          <div
            className={`mt-5 rounded-xl p-5 ${
              warning
                ? "bg-amber-50 text-amber-800"
                : "bg-emerald-50 text-emerald-800"
            }`}
          >
            <p className="font-semibold">
              {warning
                ? "Evaluasi Kondisi Kandang "
                : "Status dihitung otomatis berdasarkan ambang batas kenyamanan ternak"}
            </p>
            <p className="text-sm mt-2">
              Status dihitung berdasarkan ambang demonstrasi,
              bukan hasil penilaian kesehatan ternak.
            </p>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-500 mt-5">
            <Info size={16} className="shrink-0" />
            <p>
              Ambang THI dan NH₃ akan disesuaikan dengan
              rancangan final tim hardware.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-[#23436B]">
            Status Aktuator Perangkat 
          </h3>

          <div className="space-y-4 mt-5">
            <div className="flex justify-between items-center bg-[#F5F7FA] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Fan size={22} color="#4F7EB6" />
                <span className="font-medium text-[#23436B]">
                  Kipas Termoregulatif
                </span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  fanOn
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {fanOn ? "ON" : "OFF"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#F5F7FA] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Droplets size={22} color="#8B5E3A" />
                <span className="font-medium text-[#23436B]">
                  Nozzle Bioaktivator
                </span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  nozzleOn
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {nozzleOn ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-5">
            tatus relay dikendalikan otomatis oleh mikrokontroler
             ESP32 berdasarkan pembacaan sensor. 
          </p>
        </div>
      </section>
    </div>
  );
}
