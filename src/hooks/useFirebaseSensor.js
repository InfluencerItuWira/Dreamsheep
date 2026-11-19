import { useEffect, useState } from "react";
import { ref, onValue, query, limitToLast, update } from "firebase/database";
import { database } from "../firebase";

const DEFAULT_THRESHOLDS = {
  thi: 75,
  ammonia: 25,
};

function normalizeTimestampMs(rawTs) {
  if (!rawTs) return 0;
  const num = Number(rawTs);
  if (Number.isNaN(num)) return 0;
  return num < 1e12 ? num * 1000 : num;
}

function formatTime(unixValue) {
  const ms = normalizeTimestampMs(unixValue);
  if (!ms) {
    return new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  return new Date(ms).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function calculateAverage(val1, val2, decimals = 1) {
  const n1 = Number(val1);
  const n2 = Number(val2);
  const valid1 = !Number.isNaN(n1);
  const valid2 = !Number.isNaN(n2);

  if (valid1 && valid2) return +((n1 + n2) / 2).toFixed(decimals);
  if (valid1) return +n1.toFixed(decimals);
  if (valid2) return +n2.toFixed(decimals);
  return 0;
}

export default function useFirebaseSensor() {
  const [masterData, setMasterData] = useState(null);
  const [nodesData, setNodesData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const masterRef = ref(database, "Dream-Sheep/Master");
    const unsubMaster = onValue(masterRef, (snapshot) => {
      if (snapshot.exists()) {
        setMasterData(snapshot.val());
        setIsConnected(true);
      }
    });

    const nodesRef = ref(database, "Dream-Sheep/Nodes");
    const unsubNodes = onValue(nodesRef, (snapshot) => {
      if (snapshot.exists()) {
        setNodesData(snapshot.val());
        setIsConnected(true);
      }
    });

    const historyQuery = query(
      ref(database, "Dream-Sheep/History"),
      limitToLast(20)
    );
    const unsubHistory = onValue(historyQuery, (snapshot) => {
      if (snapshot.exists()) {
        const rawObj = snapshot.val();
        const formattedList = Object.values(rawObj)
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
          .map((item) => {
            const tempAvg = calculateAverage(item.Node1_Suhu, item.Node2_Suhu, 1);
            const humAvg = Math.round(
              calculateAverage(item.Node1_Kelembapan, item.Node2_Kelembapan, 0)
            );
            const thiAvg = calculateAverage(item.Node1_THI, item.Node2_THI, 1);
            const ammonia = +(Number(item.Amonia_PPM) || 0).toFixed(1);

            const fanOn =
              String(item.Status_Kipas || "").toUpperCase() === "MENYALA";
            const nozzleOn =
              String(item.Status_Pompa || "").toUpperCase() === "MENYALA";

            const ts = normalizeTimestampMs(item.timestamp) || Date.now();

            return {
              timestamp: ts,
              time: formatTime(item.timestamp),
              temperature: tempAvg,
              humidity: humAvg,
              thi: thiAvg,
              ammonia,
              fanOn,
              nozzleOn,
              node1: {
                suhu: item.Node1_Suhu,
                kelembapan: item.Node1_Kelembapan,
                thi: item.Node1_THI,
                status: item.Node1_Status,
              },
              node2: {
                suhu: item.Node2_Suhu,
                kelembapan: item.Node2_Kelembapan,
                thi: item.Node2_THI,
                status: item.Node2_Status,
              },
            };
          });

        setHistory(formattedList);
      }
    });

    return () => {
      unsubMaster();
      unsubNodes();
      unsubHistory();
    };
  }, []);

  const node1 = nodesData?.Node1 || {};
  const node2 = nodesData?.Node2 || {};
  const master = masterData || {};

  const latestTemperature = calculateAverage(node1.Suhu, node2.Suhu, 1);
  const latestHumidity = Math.round(
    calculateAverage(node1.Kelembapan, node2.Kelembapan, 0)
  );
  const latestThi = calculateAverage(node1.THI, node2.THI, 1);
  const latestAmmonia = +(Number(master.Amonia_PPM) || 0).toFixed(1);

  // Cek apakah alat ESP32 aktif mengirim data dalam 2 menit terakhir
  const lastUpdateMs = normalizeTimestampMs(master.LastUpdate);
  const isDeviceOnline =
    lastUpdateMs > 0 && Math.abs(Date.now() - lastUpdateMs) < 2 * 60 * 1000;

  // Pastikan status ON hanya aktif jika ESP32 benar-benar sedang online
  const fanOn =
    isDeviceOnline &&
    String(master.Status_Kipas || "").toUpperCase() === "MENYALA";
  const nozzleOn =
    isDeviceOnline &&
    String(master.Status_Pompa || "").toUpperCase() === "MENYALA";

    


  // Fungsi opsional untuk mengubah status aktuator di Firebase
  const toggleActuator = async (field, currentState) => {
    const masterRef = ref(database, "Dream-Sheep/Master");
    await update(masterRef, {
      [field]: currentState ? "MATI" : "MENYALA",
    });
  };

  const latest = {
    timestamp: lastUpdateMs || Date.now(),
    time: formatTime(master.LastUpdate),
    temperature: latestTemperature,
    humidity: latestHumidity,
    thi: latestThi,
    ammonia: latestAmmonia,
    fanOn,
    nozzleOn,
    statusAmonia: master.Status_Amonia || "-",
    node1Status: node1.Status || "OFFLINE",
    node2Status: node2.Status || "OFFLINE",
  };

  return {
    latest,
    history: history.length > 0 ? history : [latest],
    thresholds: DEFAULT_THRESHOLDS,
    fanOn,
    nozzleOn,
    isConnected,
    isDeviceOnline,
    toggleActuator,
    nodes: { node1, node2 },
    master,
  };
}