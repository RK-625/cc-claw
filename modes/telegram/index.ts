import { Telegraf } from "telegraf";
import chalk from "chalk";
import { WELCOME } from "./constant";

export async function runTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.TELEGRAM_OWNER_ID;

  const bot = new Telegraf(token!);
  await bot.telegram.sendMessage(ownerId!, WELCOME, { parse_mode: "MarkdownV2" })
  console.log(chalk.green('Telegram bot started'));
  bot.launch();
  console.log(chalk.green('Telegram bot launched'));
  await new Promise<void>((resolve) => {
    const stop = () => {
      bot.stop("SIGINIT");
      resolve();
    };
    process.on("SIGINT", stop);
    process.on("SIGTERM", stop);
  });
}
