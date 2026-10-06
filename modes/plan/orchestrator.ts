import chalk from "chalk";
import { confirm, isCancel, text } from "@clack/prompts";
import { ToolLoopAgent, stepCountIs } from "ai";
import { getModel } from "../../ai/ai.config.ts";
import { ActionTracker } from "../agent/action-tracker.ts";
import { ToolExecutor } from "../agent/tool-executor.ts";
import { createAgentTools } from "../agent/agent-tools.ts";
import { defaultAgentConfig } from "../agent/types.ts";
import { runApprovalFlow } from "../agent/approval.ts";
import { renderTerminalMarkdown } from "../../tui/terminal-md.ts";
import { generatePlan } from "./planner.ts";
import { printPlan, selectSteps } from "./selection.ts";
//import { createWebTools } from "./web-tools.ts";
import type { PlanStep, Plan } from "./types.ts";

function stepPrompt(goal: string, step: PlanStep): string {
  return [`Goal: ${goal}`, `Step: ${step.title}`, step.description].join('\n');
}


export async function runPlanMode(): Promise<void> {
  console.log(chalk.bold(`\n Plan mode`));
  const goal = await text({ message: "What do you goal?" });
  if (isCancel(goal) || !goal.trim()) return;

  const plan = await generatePlan(goal);
  printPlan(plan);
  const selected = await selectSteps(plan);
  if(selected.length === 0) return;
  const proceed = await confirm({
    message: `Execute ${selected.length} step(s)?`, initialValue: true
  });
  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = {
    ...createAgentTools(executor)
  }
  for (const step of selected) {
    console.log(chalk.bold('\n ${step.title}\n'));
    const agent = new ToolLoopAgent({ model: getModel(), tools, stopWhen: stepCountIs(30) });
    const result = await agent.generate({ prompt: stepPrompt(plan.goal, step) })
    if(result.text) return console.log(renderTerminalMarkdown(result.text));
  }
  const ok = await runApprovalFlow(tracker);
  if (!ok) return executor.clearStaging()
  const { errors } = executor.applyApprovedFromTracker();
  if (errors.length) {
    console.error(chalk.red(`\n Some operations failed errors: \n`));
    for (const e of errors) console.log(chalk.red(`  - ${e}`));
  } else {
    console.log(chalk.green(`\n All operations succeeded`));
  }
  executor.clearStaging();
}
