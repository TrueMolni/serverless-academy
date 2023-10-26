const axios = require("axios");

const endpoints = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
];

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`[Fail] ${url}: ${error.message}`);
    return null;
  }
}

async function processEndpoints() {
  let trueCount = 0;
  let falseCount = 0;

  for (const endpoint of endpoints) {
    let retries = 3;
    let responseData = null;

    while (retries > 0) {
      responseData = await fetchData(endpoint);
      if (responseData !== null) {
        break;
      }
      retries--;
    }

    if (responseData !== null && responseData.hasOwnProperty("isDone")) {
      console.log(`[Success] ${endpoint}: isDone - ${responseData.isDone}`);
      if (responseData.isDone) {
        trueCount++;
      } else {
        falseCount++;
      }
    } else {
      console.log(`[Fail] ${endpoint}: The endpoint is unavailable`);
    }
  }

  console.log(`Found True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

processEndpoints();
