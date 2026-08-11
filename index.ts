#!/usr/bin/env bun

import { Command } from "commander";
import { start } from "./tui/start";

const program = new Command();

program.name("ccclaw")
  .description("CCC-law cli agent")
  .version("0.0.1");

program.command("start")
  .description("Start the program")
  .action(
    async() => {
      start();
    }
  );

await program.parseAsync(process.argv);
