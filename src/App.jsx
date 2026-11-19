import Pengaturan from "./components/Pengaturan";
import Notifikasi from "./components/Notifikasi";
import Monitoring from "./components/Monitoring";
import RiwayatData from "./components/RiwayatData";
import Login from "./components/Login";
import useFirebaseSensor from "./hooks/useFirebaseSensor";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import { ref, get } from "firebase/database";
import {
  LayoutDashboard, Activity, History, Bell, Settings,
  Thermometer, Droplets, Wind, Fan, Menu, LogOut,
  Wifi, CheckCircle2, Clock3, Beef
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

const colors = {
  dark: "#23436B",
  blue: "#4F7EB6",
  light: "#A7C6E8",
  brown: "#8B5E3A",
  gold: "#C99A5B",
};


const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, roles: ["admin", "peternak"] },
  { name: "Monitoring", icon: Activity, roles: ["admin", "peternak"] },
  { name: "Riwayat Data", icon: History, roles: ["admin", "peternak"] },
  { name: "Notifikasi", icon: Bell, roles: ["admin", "peternak"] },
  { name: "Pengaturan", icon: Settings, roles: ["admin"] },
];


function SensorCard({ title, value, unit, icon: Icon, color, subtitle }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <div className="flex items-baseline gap-1 mt-3">
            <h3 className="text-3xl font-bold" style={{ color: colors.dark }}>
              {value}
            </h3>
            <span className="text-sm text-slate-500">{unit}</span>
          </div>
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} color={color} />
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4">{subtitle}</p>
    </div>
  );
}

function DashboardContent({ user, role, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const simulation = useFirebaseSensor();

  const displayUsername = user?.email
    ? user.email.split("@")[0]
    : "Admin";
  const avatarInitial = displayUsername.charAt(0).toUpperCase();

  const dataLabel = simulation.isDeviceOnline
    ? "Live dari sensor ESP32"
    : "Data terakhir di Firebase";

  const sensors = [
    {
      title: "Suhu Kandang",
      value: simulation.latest.temperature.toLocaleString("id-ID"),
      unit: "°C",
      icon: Thermometer,
      color: colors.blue,
      subtitle: dataLabel,
    },
    {
      title: "Kelembapan",
      value: simulation.latest.humidity.toLocaleString("id-ID"),
      unit: "%",
      icon: Droplets,
      color: colors.light,
      subtitle: dataLabel,
    },
    {
      title: "Temperature Humidity Index",
      value: simulation.latest.thi.toLocaleString("id-ID"),
      unit: "THI",
      icon: Activity,
      color: colors.gold,
      subtitle: dataLabel,
    },
    {
      title: "Kadar Amonia",
      value: simulation.latest.ammonia.toLocaleString("id-ID"),
      unit: "ppm",
      icon: Wind,
      color: colors.brown,
      subtitle: `Status: ${simulation.latest.statusAmonia}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {sidebarOpen && (
        <button
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup sidebar"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#23436B] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex flex-col items-center">
          <div className="w-full rounded-2xl bg-white p-3 flex justify-center">
            <img
              src="/dreamsheep-logo.png"
              alt="Logo DreamSheep"
              className="w-full h-28 object-contain scale-[1.7]"
            />
          </div>

          <p className="text-xs text-blue-100 text-center mt-3">
            Smart Livestock Monitoring
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems
          .filter((item) => item.roles.includes(role))
          .map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => {
                setActivePage(name);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activePage === name
                  ? "bg-white text-[#23436B]"
                  : "text-blue-100 hover:bg-white/10"
              }`}
            >
              <Icon size={19} />
              {name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-200 hover:bg-rose-500/20 hover:text-white transition cursor-pointer"
          >
            <LogOut size={18} />
            Keluar
          </button>
          <div className="px-2">
            <p className="text-xs text-blue-200">DreamSheep © 2026</p>
            <p className="text-xs text-blue-200">IPB University</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-slate-100 px-6 lg:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu color={colors.dark} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-[#23436B]">{activePage}</h2>
              <p className="text-xs text-slate-500">DreamSheep Monitoring System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`hidden sm:flex items-center gap-2 text-xs px-3 py-2 rounded-full font-medium ${
                simulation.isConnected
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              <Wifi size={14} />
              {simulation.isConnected
                ? simulation.isDeviceOnline
                  ? "Live Firebase • ESP32 Aktif"
                  : "Terhubung Firebase • ESP32 Offline"
                : "Menghubungkan Firebase..."}
            </span>
            <div
              title={`Login sebagai ${displayUsername}`}
              className="w-10 h-10 rounded-full bg-[#A7C6E8] flex items-center justify-center font-bold text-[#23436B]"
            >
              {avatarInitial}
            </div>
          </div>
        </header>

        <div className="p-5 lg:p-10 max-w-7xl mx-auto">
          {activePage === "Dashboard" ? (
            <>
              <section className="bg-gradient-to-r from-[#23436B] to-[#4F7EB6] rounded-3xl p-7 lg:p-9 text-white mb-7">
                <div className="flex flex-col sm:flex-row justify-between gap-5">
                  <div>
                    <p className="text-sm text-blue-100 mb-2">SMART LIVESTOCK MONITORING</p>
                    <h2 className="text-2xl lg:text-3xl font-bold">
                    Selamat Datang di DreamSheep Monitoring
                    </h2>
                    <p className="text-sm text-blue-100 mt-3 max-w-xl">
                      Pantau kondisi lingkungan kandang, parameter sensor,
                      dan aktivitas perangkat dalam satu dashboard.
                    </p>
                  </div>

                  <div className="self-start bg-white/15 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <Beef size={18} className="text-white" />
                    <span>Kandang Domba Kiloanku</span>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#23436B]">Kondisi Kandang</h3>
                <span className="text-xs text-slate-500">
                  {simulation.isDeviceOnline
                    ? "Sinkronisasi real-time aktif"
                    : `Menampilkan rekaman terakhir (${simulation.latest.time})`}
                </span>
              </div>

              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
                {sensors.map((sensor) => (
                  <SensorCard key={sensor.title} {...sensor} />
                ))}
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-7">
                <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-[#23436B]">Grafik Suhu Kandang</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Tren rata-rata suhu Node 1 & Node 2 dari Firebase
                      </p>
                    </div>
                    <Thermometer size={20} color={colors.blue} />
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={simulation.history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF3" />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 11 }}
                          minTickGap={25}
                        />
                        <YAxis domain={[24, 35]} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke={colors.blue}
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-[#23436B] mb-2">Status Aktuator</h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Status perangkat terakhir dari ESP32
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#F5F7FA] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Fan size={22} color={colors.blue} />
                        <div>
                          <p className="text-sm font-semibold text-[#23436B]">Kipas</p>
                          <p className="text-xs text-slate-500">Termoregulatif</p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          simulation.fanOn
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {simulation.fanOn ? "ON" : "OFF"}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F5F7FA] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Droplets size={22} color={colors.brown} />
                        <div>
                          <p className="text-sm font-semibold text-[#23436B]">Nozzle</p>
                          <p className="text-xs text-slate-500">Bioaktivator</p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          simulation.nozzleOn
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {simulation.nozzleOn ? "ON" : "OFF"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mt-6">
                    Status aktuator tersinkronisasi secara real-time dengan node
                    Dream-Sheep/Master pada Firebase.
                  </p>
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-[#23436B] mb-5">Informasi Sistem</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Wifi color={colors.blue} />
                    <div>
                      <p className="text-sm font-semibold text-[#23436B]">Koneksi Perangkat</p>
                      <p className="text-xs text-slate-500">
                        Node 1: {simulation.latest.node1Status} • Node 2: {simulation.latest.node2Status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 color={colors.gold} />
                    <div>
                      <p className="text-sm font-semibold text-[#23436B]">Sumber Data</p>
                      <p className="text-xs text-slate-500">Firebase Realtime Database</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock3 color={colors.brown} />
                    <div>
                      <p className="text-sm font-semibold text-[#23436B]">Integrasi Firebase</p>
                      <p className="text-xs text-slate-500">
                        {simulation.isConnected
                          ? "Terhubung (iot-project-9224b)"
                          : "Menghubungkan ke database..."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : activePage === "Monitoring" ? (
            <Monitoring {...simulation} />
          ) : activePage === "Riwayat Data" ? (
            <RiwayatData history={simulation.history} />
          ) : activePage === "Notifikasi" ? (
            <Notifikasi
              history={simulation.history}
              thresholds={simulation.thresholds}
            />
          ) : activePage === "Pengaturan" && role === "admin" ? (
            <Pengaturan thresholds={simulation.thresholds} />
          ) : (
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100 text-center">
              <h3 className="text-xl font-bold text-[#23436B]">{activePage}</h3>
              <p className="text-slate-500 mt-3">
                Halaman ini akan dikembangkan pada tahap berikutnya.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let requestId = 0;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const currentRequest = ++requestId;

      setAuthLoading(true);
      setAuthError("");
      setUser(null);
      setRole(null);

      if (!currentUser) {
        setAuthLoading(false);
        return;
      }

      try {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (currentRequest !== requestId) return;

        const userData = snapshot.val();
        const userRole = userData?.role;

        if (userRole === "admin" || userRole === "peternak") {
          setUser(currentUser);
          setRole(userRole);
        } else {
          setAuthError("Akun belum memiliki hak akses yang valid.");
        }
      } catch (error) {
        if (currentRequest !== requestId) return;

        console.error("Gagal membaca role:", error);
        setAuthError("Gagal membaca hak akses dari Firebase.");
      } finally {
        if (currentRequest === requestId) {
          setAuthLoading(false);
        }
      }
    });

    return () => {
      requestId++;
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };


  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <p className="text-sm font-medium text-[#23436B]">
          Memuat sistem DreamSheep...
        </p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{authError}</p>
        <button
          onClick={handleLogout}
          className="bg-[#23436B] text-white px-6 py-3 rounded-xl"
        >
          Keluar
        </button>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <DashboardContent
      user={user}
      role={role}
      onLogout={handleLogout}
    />
  );
}


export default App;