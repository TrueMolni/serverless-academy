const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

//  підставити справжні
const API_KEY = "20592fef14d0a4fbdbe2137d29f25cb0";
const TOKEN = "6373988593:AAFwez6oUV9nT24OVmMcNVDAYJdQPYpoxK4";

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome to the Weather Bot! Type /forecast to get the weather forecast."
  );
});

bot.onText(/\/forecast/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Choose the forecast interval:", {
    reply_markup: {
      keyboard: [
        [
          { text: "Forecast in Chernivtsi - 3 hours" },
          { text: "Forecast in Chernivtsi - 6 hours" },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const location = "Chernivtsi";

  if (msg.text === `Forecast in ${location} - 3 hours`) {
    const forecast = await getWeatherForecast(location, 1000);
    bot.sendMessage(chatId, forecast);
  } else if (msg.text === `Forecast in ${location} - 6 hours`) {
    const forecast = await getWeatherForecast(location, 2000);
    bot.sendMessage(chatId, forecast);
  }
});

async function getWeatherForecast(city, interval) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=3&lang=uk&appid=${API_KEY}`
    );
    const forecasts = response.data.list.map((item) => {
      return `Date: ${new Date(
        item.dt * interval
      ).toLocaleString()}, Temperature: ${item.main.temp}°C, Description: ${
        item.weather[0].description
      }`;
    });
    return forecasts.join("\n");
  } catch (error) {
    return "Error fetching weather data.";
  }
}
