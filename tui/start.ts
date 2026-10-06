import { isCancel, select } from "@clack/prompts";
import chalk from "chalk"
import figlet from "figlet";
import { runCLIMode } from "../modes/cli";
import { runTelegramBot } from "../modes/telegram";

const BANNER_FONT = 'ANSI Shadow'
const SHADOW = chalk.hex('#5b4d9e')
const FACE = chalk.hex('#e8dcf8').bold

function printBanner(title: string) {
  const bannerLines = title.replace(/\s+$/, '').split('\n');
  const maxLen = Math.max(...bannerLines.map((l) => l.length), 0);
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(SHADOW(('  ' + line).padEnd(rowWidth)));
  }
  process.stdout.write(`\x1b[${bannerLines.length}A`);
  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }
  console.log();
}


export async function start() {
  let title: string;
  title = figlet.textSync("C3CLAW", { font: BANNER_FONT })
  printBanner(title)

  const mode = await select({
    message: "Which mode do you want to use?",
    options: [
      { value: "cli", label: "cli" },
      { value: "telegram", label: "telegram" },
      { value: "exit", label: "exit" }
    ],
  });

  if (isCancel(mode) || mode === "exit") {
    console.log(chalk.dim('\n Goodbye!\n'))
    return
  }

  if (mode === 'cli') {
    await runCLIMode();
  } else if (mode === 'telegram') {
    await runTelegramBot();
  }
  else {
    return;
  }

}
