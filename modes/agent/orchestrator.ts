import { isCancel, text } from "@clack/prompts";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./tool-executor";
import { stepCountIs, ToolLoopAgent } from "ai";
import { getModel } from "../../ai";
import { createAgentTools } from "./agent-tools";
import chalk from "chalk";
import { renderTerminalMarkdown } from "../../tui/terminal-md";
import { runApprovalFlow } from "./approval";

export async function runAgentMode() {
  console.log('Agent mode');
  const goal = await text({
      message: "What should the agent should do?",
      placeholder: "Concreate task for this codebase"
  });

  if (isCancel(goal) || !goal.trim()) return;

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = createAgentTools(executor);

  const agent = new ToolLoopAgent({
    model: getModel(),
    stopWhen: stepCountIs(40),
    instructions: [
      `Workspace root: ${config.codebasePath}`,
      "All mutations must staged here unitl approval here btw "
    ].join("\n"),
    tools,
  });
  const result = await agent.generate({
    prompt: goal.trim(),
    onStepFinish: ({ toolCalls }) => {
      for(const tc of toolCalls) {
        const preview = JSON.stringify(tc.input).slice(0, 160);
        console.log(
          chalk.green(' DONE'),
          chalk.bold(String(tc.toolName)),
          chalk.dim(preview + (preview.length >= 160 ? "..." : ""))
        );
      }
    },
  });

  if (result.text?.trim()) {
    console.log(renderTerminalMarkdown(result.text));
  }

  const ok = await runApprovalFlow(tracker);
  if (!ok) return executor.clearStaging();
  const {errors} = executor.applyApprovedFromTracker();
  if (errors.length) {
    console.log(chalk.red("\nSome operations reported errors: \n"));
    for (const e of errors) console.log(chalk.red(` => ${e}\n`))
  }
  else {
    console.log(chalk.green("\nApproval flow passed \n"));

  }
  executor.clearStaging();
}
