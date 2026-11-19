
import { useState } from "react";
import { History, Search, Database, Download } from "lucide-react";

export default function RiwayatData({ history = [] }) {
  const [search, setSearch] = useState("");

  const filteredData = [...history]
    .reverse()
    .filter((item) =>
      String(item.time ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const formatNumber = (value) =>
    typeof value === "number"
      ? value.toLocaleString("id-ID")
      : value ?? "-";

const exportCSV = () => {
  
const headers = [
  "Waktu",
  "Suhu (°C)",
  "Kelembapan (%)",
  "THI",
  "Amonia (ppm)",
  "Status Kipas",
  "Status Nozzle",
];

const rows = filteredData.map((item) => [
  item.time,
  item.temperature,
  item.humidity,
  item.thi,
  item.ammonia,
  item.fanOn ? "ON" : "OFF",
  item.nozzleOn ? "ON" : "OFF",
]);


  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(";")
    )
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Riwayat_Data_DreamSheep.csv";
  link.click();

  URL.revokeObjectURL(url);
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#23436B] to-[#4F7EB6] rounded-3xl p-7 text-white">
        <div className="flex items-center gap-3 mb-3">
          <History size={28} />
          <h2 className="text-2xl font-bold">
            Riwayat Data Sensor
          </h2>
        </div>

        <p className="text-sm text-blue-100">
          Rekapitulasi hasil pembacaan sensor
          lingkungan kandang DreamSheep.
        </p>
      </section>

      {/* Tabel */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-[#23436B]">
              Data Pembacaan Sensor
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Rekaman data historis yang tersimpan otomatis di Firebase Realtime Database.
            </p>
          </div>

          
<div className="flex flex-col sm:flex-row gap-3">
  <div className="relative">
    <Search
      size={17}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
    />
    <input
      type="text"
      placeholder="Cari waktu..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full sm:w-56 pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#4F7EB6]"
    />
  </div>

  <button
    onClick={exportCSV}
    disabled={filteredData.length === 0}
    className="flex items-center justify-center gap-2 bg-[#23436B] hover:bg-[#4F7EB6] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
  >
    <Download size={17} />
    Ekspor CSV
  </button>
</div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F5F7FA] text-[#23436B]">
              <tr>
                <th className="p-4">No.</th>
                <th className="p-4">Waktu</th>
                <th className="p-4">Suhu (°C)</th>
                <th className="p-4">Kelembapan (%)</th>
                <th className="p-4">THI</th>
                <th className="p-4">Amonia (ppm)</th>
                
<th className="p-4">Status Kipas</th>
<th className="p-4">Status Nozzle</th>

              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{item.time}</td>
                  <td className="p-4">
                    {formatNumber(item.temperature)}
                  </td>
                  <td className="p-4">
                    {formatNumber(item.humidity)}
                  </td>
                  <td className="p-4">
                    {formatNumber(item.thi)}
                  </td>
                  <td className="p-4">
                    {formatNumber(item.ammonia)}
                  </td>
                  
<td className="p-4">
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
      item.fanOn
        ? "bg-green-100 text-green-700"
        : "bg-slate-100 text-slate-600"
    }`}
  >
    {item.fanOn ? "ON" : "OFF"}
  </span>
</td>

<td className="p-4">
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
      item.nozzleOn
        ? "bg-green-100 text-green-700"
        : "bg-slate-100 text-slate-600"
    }`}
  >
    {item.nozzleOn ? "ON" : "OFF"}
  </span>
</td>

                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Database
                size={36}
                className="mx-auto mb-3"
              />
              <p>Belum ada data yang ditampilkan.</p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-5">
          Menampilkan {filteredData.length} dari{" "}
          {history.length} pembacaan simulasi terbaru.
        </p>
      </section>
    </div>
  );
}
