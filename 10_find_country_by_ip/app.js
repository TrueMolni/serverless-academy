const express = require("express");
const cors = require("cors");
const csv = require("csv-parser");
const fs = require("fs");
const { IP2Location } = require("ip2location-nodejs");
const requestIp = require("request-ip");

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());
app.use(requestIp.mw());

// Load CSV data into memory
const ipData = [];
fs.createReadStream("IP2LOCATION-LITE-DB1.CSV")
  .pipe(csv())
  .on("data", (row) => {
    ipData.push(row);
  })
  .on("end", () => {
    console.log("CSV file loaded.");
  });

// Set up IP2Location
const ip2loc = new IP2Location();
ip2loc.open("IP2LOCATION-LITE-DB1.CSV");

app.post("/detect-country", (req, res) => {
  // Get the user's IP address from the request
  const userIp = req.clientIp || "127.0.0.1";

  console.log("User IP:", userIp);

  // Clean up the IP address to remove '::ffff:'
  const cleanedIp = userIp.replace("::ffff:", "");

  // Find country in the loaded CSV data
  const ipInfo = ip2loc.getAll(cleanedIp);
  const countryData = ipData.find(
    (row) =>
      parseInt(ipInfo.ip) >= parseInt(row.from_ip) &&
      parseInt(ipInfo.ip) <= parseInt(row.to_ip)
  );

  if (countryData) {
    console.log("User Country:", countryData.country);

    const result = {
      success: true,
      data: {
        ip: cleanedIp,
        country: countryData.country,
        range: `${countryData.from_ip} - ${countryData.to_ip}`,
      },
    };
    res.json(result);
  } else {
    console.log("Country not found for the given IP.");

    res
      .status(404)
      .json({ success: false, error: "Country not found for the given IP." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
