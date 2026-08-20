import { isCancel, text } from "@clack/prompts";
import { defaultAgentConfig } from "./types";

export async function runAgentMode() {
    console.log('Agent mode');
    const goal = await text({
        message: "What should the agent should do?",
        placeholder: "Concreate task for this codebase"
    });

    if (isCancel(goal) || !goal.trim()) return;

    const config = defaultAgentConfig();
}