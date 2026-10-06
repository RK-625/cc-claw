import type { Telegraf } from "telegraf";
import { isOwner } from "./auth";
import { WELCOME } from "./constant";

export function registerHandlers(bot: Telegraf) {
  bot.command("start", async (ctx) => {
    if(!isOwner(ctx.chat.id)) return;
    await ctx.reply(WELCOME, { parse_mode: "Markdown" });
  })
}
