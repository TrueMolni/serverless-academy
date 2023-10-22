#!/usr/bin/env node

const { program } = require("commander");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs").promises;

const botToken = "6966339808:AAHc6Gonq_qoAf_e6cicYF6x9iW5EX_YLWw";
const chatId = "864411543";
const options = {
  polling: true,
};
const bot = new TelegramBot(botToken, options);

program.version("1.0.0");

program
  .command("m <message>")
  .description("Send a message to the Telegram bot")
  .action((msg) => {
    bot.sendMessage(chatId, msg).then(() => {
      console.log("Message sent to Telegram bot:", msg);
      togglePolling(false);
    });
  });

program
  .command("p <path>")
  .description("Send a photo to the Telegram bot")
  .action(async (path) => {
    try {
      const photoBuffer = await fs.readFile(path);
      bot.sendPhoto(chatId, photoBuffer).then(() => {
        console.log("Photo sent to Telegram bot:", path);
        togglePolling(false);
      });
    } catch (error) {
      console.error("Error sending photo:", error);
      togglePolling(false);
    }
  });

program
  .command("help")
  .description("Display available commands")
  .action(() => {
    program.help();
  });

function togglePolling(enable) {
  if (enable) {
    options.polling = true;
    bot.startPolling();
  } else {
    options.polling = false;
    bot.stopPolling();
  }
}

program.parse(process.argv);
