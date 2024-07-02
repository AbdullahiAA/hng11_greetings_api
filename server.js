const express = require("express");
const axios = require("axios");
const requestIp = require("request-ip");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

app.get("/api/hello", async (req, res) => {
  try {
    const visitor_name = req.query.visitor_name || "";

    if (!visitor_name.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a visitor name",
      });
    }

    const clientIp = requestIp.getClientIp(req);

    const weatherRes = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${clientIp}`
    );

    const { name: city } = weatherRes.data.location;
    const { temp_c } = weatherRes.data.current;

    res.status(200).json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitor_name}!, the temperature is ${temp_c} degrees Celsius in ${city}`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to get location or the weather information",
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Not Found",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
