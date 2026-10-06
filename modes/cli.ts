import { isCancel, select } from "@clack/prompts";
import chalk from "chalk";
import { runAgentMode } from "./agent/orchestrator";
import { runAskMode } from "./ask/orchestrator";
import { runPlanMode } from "./plan/orchestrator";

export async function runCLIMode() {
    while (true) {
        const mode = await select({
            message: "Choose a mode",
            options: [
                { value: "agent", label: "Agent Mode" },
                { value: "ask", label: "Ask Mode" },
                { value: "plan", label: "Plan Mode" },
                { value: "back", label: "back to main menu" },
            ],
        });

        if (isCancel(mode) || mode === "back") {
            return;
        }
        if (mode === "agent") {
            await runAgentMode();
        }
        if (mode === "ask") {
            await runAskMode()
        }
        if (mode === "plan") {
          await runPlanMode();
        }

        if (mode !== 'agent' && mode !== 'plan' && mode !== 'ask') {
            console.log(chalk.yellow('\n Invalid mode selected. Please try again.\n'));
        }
    }
}
