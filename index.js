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
  const { key, type, value } = req.query;

  // 🔐 Key Check
  if (!key || !KEYS_DB[key]) {
    return res.status(401).json({
      success: false,
      type: "error",
      message: "Invalid Key!",
      owner: OWNER_NAME
    });
  }

  // 📅 Expiry Check
  const today = DateTime.local();
  const expiryDate = DateTime.fromISO(KEYS_DB[key].expiry);

  if (today > expiryDate) {
    return res.status(403).json({
      success: false,
      type: "error",
      message: "Key Expired!",
      owner: OWNER_NAME
    });
  }

  // 🔎 Type & Value Check
  if (!type || !value) {
    return res.status(400).json({
      success: false,
      type: "error",
      message: "Type and value parameter required",
      owner: OWNER_NAME
    });
  }

  try {
    let response;

    // 📱 PHONE API
    if (type === "phone") {
      response = await axios.get(
        "https://abbas-apis.vercel.app/api/num-name",
        {
          params: { number: value },
          timeout: 10000
        }
      );
    }

    // 🪪 PAN API
    else if (type === "pan") {
      response = await axios.get(
        "https://pan2info-shatirownerrr.vercel.app/pan",
        {
          params: {
            key: "demo",
            term: value
          },
          timeout: 10000
        }
      );
    }

    // 🏢 GST API
    else if (type === "gst") {
      response = await axios.get(
        "https://osint-info.great-site.net/api/gst_lookup.php",
        {
          params: { gstNumber: value },
          timeout: 10000
        }
      );
    }

    else {
      return res.status(400).json({
        success: false,
        type: "error",
        message: "Invalid type! Use phone, pan, or gst",
        owner: OWNER_NAME
      });
    }

    return res.json({
      success: true,
      type: "success",
      owner: OWNER_NAME,
      data: response.data || {}
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "error",
      message: "External API Error",
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
