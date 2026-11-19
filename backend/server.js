require("dotenv").config();

const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { sendWhatsApp } = require("./whatsapp");

const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const PORT = process.env.PORT || 3001;

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = getDatabase();

const COOLDOWN =
    Number(process.env.COOLDOWN_MINUTES || 15) * 60000;

let lastNotification = 0;
let sending = false;

app.get("/", (req, res) => {
    res.send("DreamSheep Backend is Running!");
});

db.ref("Dream-Sheep").on("value", async (snapshot) => {
    const master = snapshot.child("Master").val();
    const nodes = snapshot.child("Nodes").val();

    if (!master || !nodes) return;

    const lastUpdate = Number(master.LastUpdate);
    const age = Date.now() - lastUpdate;

    if (!Number.isFinite(age) || age > 300000 || age < -60000) {
        console.log("Mode testing: menggunakan data sensor lama.");
    }

    let warnings = [];

    for (const name of ["Node1", "Node2"]) {
        const node = nodes[name];

        if (!node || node.Status !== "ONLINE") continue;

        if (node.Suhu >= 30) {
            warnings.push(
                `${name}: Suhu tinggi (${node.Suhu} °C)`
            );
        }

        if (node.Kelembapan >= 85) {
            warnings.push(
                `${name}: Kelembapan tinggi (${node.Kelembapan}%)`
            );
        }

        if (node.THI >= 80) {
            warnings.push(
                `${name}: THI tinggi (${Number(node.THI).toFixed(2)})`
            );
        }
    }

    if (master.Status_Amonia === "BAHAYA") {
        warnings.push(
            "Status sensor amonia: BAHAYA (perlu verifikasi)"
        );
    }

    console.clear();
    console.log("===== DREAMSHEEP MONITORING =====");
    console.log("Node 1:", nodes.Node1);
    console.log("Node 2:", nodes.Node2);
    console.log("Status Amonia:", master.Status_Amonia);
    console.log("Status Kipas:", master.Status_Kipas);
    console.log("Status Pompa:", master.Status_Pompa);
    console.log("Peringatan:", warnings);

    if (
        warnings.length > 0 &&
        !sending &&
        Date.now() - lastNotification >= COOLDOWN
    ) {
        sending = true;

        const message = [
            "*🚨 PERINGATAN DREAMSHEEP*",
            "",
            "Terdeteksi kondisi kandang tidak normal!",
            "",
            ...warnings,
            "",
            `Status Kipas: ${master.Status_Kipas}`,
            `Status Pompa: ${master.Status_Pompa}`,
            "",
            "Segera periksa kondisi kandang dan sensor.",
            "",
            new Date().toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta"
            }) + " WIB",
            "",
            "_DreamSheep Monitoring System_"
        ].join("\n");

        try {
            const success = await sendWhatsApp(message);

            if (success) {
                lastNotification = Date.now();
                console.log("Notifikasi masuk antrean Fonnte!");
            }
        } finally {
            sending = false;
        }
    }
}, (error) => {
    console.error("Firebase Error:", error.message);
});

app.listen(PORT, "127.0.0.1", () => {
    console.log("DreamSheep Backend aktif!");
    console.log(`Server: http://localhost:${PORT}`);
});