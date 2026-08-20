import { isCancel, select } from "@clack/prompts";
import chalk from "chalk";

export async function runCLIMode() {
    while (true) {
        const mode = await select({
            message: "Choose a mode",
            options: [
                { value: "agent", label: "Agent Mode" },
                { value: "plan", label: "Plan Mode" },
                { value: "ask", label: "Ask Mode" },
                { value: "back", label: "back to main menu" },
            ],
        });

        if (isCancel(mode) || mode === "back") {
            return;
        }
        if (mode === "agent") {
            console.log('agent mode');
        }
        if (mode === "ask") {
            console.log('ask mode');
        }
        if (mode === "plan") {
            console.log('plan mode');
        }

        if (mode !== 'agent' && mode !== 'plan' && mode !== 'ask') {
            console.log(chalk.yellow('\n Invalid mode selected. Please try again.\n'));
        }
    }
}