const express = require('express');
const axios = require('axios');
const { DateTime } = require('luxon');

const app = express();
const OWNER_NAME = "ZEXX_OWNER";

// 🔑 Keys Database
const KEYS_DB = {
  "ZEXX@_VIP": { expiry: "2026-12-31" },
  "OWNER_TEST": { expiry: "2035-12-30" },
  "ZEXX_@TRY": { expiry: "2026-04-15" },
  "ZEXX_P@ID": { expiry: "2026-07-01" }
};

app.use(express.json());

// 🔎 Search Route
app.get('/search', async (req, res) => {
  const { phone, key } = req.query;

  // 1️⃣ Key Check
  if (!key || !KEYS_DB[key]) {
    return res.status(401).json({
      success: false,
      type: "error",
      error: "Invalid Key!",
      owner: OWNER_NAME
    });
  }

  // 2️⃣ Expiry Check
  const today = DateTime.local();
  const expiryDate = DateTime.fromISO(KEYS_DB[key].expiry);

  if (today > expiryDate) {
    return res.status(403).json({
      success: false,
      type: "error",
      error: "Key Expired hogya go & owner",
      owner: OWNER_NAME
    });
  }

  // 3️⃣ Phone Check
  if (!phone) {
    return res.status(400).json({
      success: false,
      type: "error",
      error: "Phone parameter required pls fill parameter real",
      owner: OWNER_NAME
    });
  }

  try {
    // 🔥 External API Call
    const response = await axios.get(
      "https://abbas-apis.vercel.app/api/num-name",
      {
        params: { number: phone },
        timeout: 10000
      }
    );

    let apiData = response.data;

    // Optional credit replace
    if (apiData && apiData.owner) {
      apiData.owner = "CYBER×CHAT";
    }

    return res.json({
      success: true,
      type: "success",
      owner: OWNER_NAME,
      data: apiData || {}
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "error",
      error: error.message,
      owner: OWNER_NAME
    });
  }
});

// 🏠 Home Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    type: "success",
    message: "API Running Successfully 🚀",
    owner: OWNER_NAME
  });
});

module.exports = app;
