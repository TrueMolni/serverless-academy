const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const NodeCache = require("node-cache");

const API_KEY = "20592fef14d0a4fbdbe2137d29f25cb0";
const TOKEN = "6373988593:AAFwez6oUV9nT24OVmMcNVDAYJdQPYpoxK4";

const bot = new TelegramBot(TOKEN, { polling: true });
const location = "Chernivtsi";
const cache = new NodeCache({ stdTTL: 60 });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Choose an option:", {
    reply_markup: {
      keyboard: [["Weather", "Exchange Rate"]],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

bot.onText(/\/погода|Weather/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Choose the forecast interval:", {
    reply_markup: {
      keyboard: [
        [
          { text: `Forecast in ${location} - 3 hours` },
          { text: `Forecast in ${location} - 6 hours` },
        ],
        [{ text: "Back" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

bot.onText(/\/курс валют|Exchange Rate/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Choose a currency:", {
    reply_markup: {
      keyboard: [[{ text: "USD" }, { text: "EUR" }], [{ text: "Back" }]],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === `Forecast in ${location} - 3 hours`) {
    const forecast = await getWeatherForecast(location, 3);
    bot.sendMessage(chatId, forecast);
  } else if (msg.text === `Forecast in ${location} - 6 hours`) {
    const forecast = await getWeatherForecast(location, 6);
    bot.sendMessage(chatId, forecast);
  } else if (msg.text === "USD" || msg.text === "EUR") {
    const currencyCode = msg.text;
    const exchangeRate = await getExchangeRate(currencyCode);
    bot.sendMessage(
      chatId,
      `Current ${currencyCode} exchange rate:\nBuy: ${exchangeRate.buy} Sale: ${exchangeRate.sale}`
    );
  } else if (msg.text === "Back") {
    bot.sendMessage(chatId, "Choose an option:", {
      reply_markup: {
        keyboard: [["Weather", "Exchange Rate"]],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
  } else if (
    msg.text.toLowerCase() === "Іра".toLowerCase() ||
    msg.text.toLowerCase() === "Ірка".toLowerCase() ||
    msg.text.toLowerCase() === "Іруся".toLowerCase() ||
    msg.text.toLowerCase() === "Ірина".toLowerCase() ||
    msg.text.toLowerCase() === "Я Ірина".toLowerCase() ||
    msg.text.toLowerCase() === "Іринка".toLowerCase()
  ) {
    bot.sendMessage(
      chatId,
      `Привіт, Іра!\n
      Стас тебе любить.\n
      Гарного дня!`
    );
    console.log(msg.text);
  } else {
    console.log(msg.text);
  }
});

async function getWeatherForecast(city, interval) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=${interval}&lang=uk&appid=${API_KEY}`
    );
    switch (interval) {
      case 6:
        const forecasts = response.data.list
          .filter((item, index) => index % 2 !== 0)
          .map((item) => {
            return `Date: ${item.dt_txt}, Temperature: ${item.main.temp}°C, Description: ${item.weather[0].description}`;
          });
        return forecasts.join("\n");

      default:
        const forecastss = response.data.list.map((item) => {
          return `Date: ${item.dt_txt}, Temperature: ${item.main.temp}°C, Description: ${item.weather[0].description}`;
        });
        return forecastss.join("\n");
    }
  } catch (error) {
    return "Error fetching weather data.";
  }
}

async function getExchangeRate(currencyCode) {
  const cacheKey = `exchange_rate_${currencyCode}`;
  const cachedRate = cache.get(cacheKey);
  if (cachedRate) {
    return cachedRate;
  }

  try {
    response = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5"
    );

    if (response?.data?.length > 0) {
      let rate = {};
      console.log(response.data);
      if (currencyCode === "USD") {
        rate.buy = response.data[1].buy;
        rate.sale = response.data[1].sale;
      } else if (currencyCode === "EUR") {
        rate.buy = response.data[0].buy;
        rate.sale = response.data[0].sale;
      }
      cache.set(cacheKey, rate);
      return rate;
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
  }

  return "Error fetching exchange rate.";
}
