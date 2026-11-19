const axios = require("axios");
require("dotenv").config();

async function sendWhatsApp(message) {
    try {
        const response = await axios.post(
            "https://api.fonnte.com/send",
            new URLSearchParams({
                target: process.env.WHATSAPP_TARGET,
                message: message,
                countryCode: "62"
            }),
            {
                headers: {
                    Authorization: process.env.FONNTE_TOKEN,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        if (!response.data.status) {
            throw new Error(response.data.reason || "Pengiriman gagal");
        }

        console.log("Permintaan WhatsApp berhasil:", response.data);
        return true;

    } catch (error) {
        console.error("Gagal mengirim WhatsApp:", error.message);
        return false;
    }
}

module.exports = { sendWhatsApp };