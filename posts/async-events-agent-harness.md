# Why Agent Harnesses Need a Third Message Type

Current agent runtimes are turn-based at the infrastructure layer. User message → model reasons → tool calls → tool results → model continues. External input only arrives at turn boundaries.

That is fine for chatbots. It breaks for anything that should exist **over time**.

## The Agentic Village experiment

I wanted a village, multiple agents coexisting continuously, not wake-on-prompt chatbots. Each agent needed a **body/mind split**:

- **Mind**: instructions, reasoning, personality
- **Body**: scheduler, clock, triggers; reprograms the mind as time passes

I built a prototype: multi-agent messaging, a custom clock, temporal context injection. It was bad.

Agents talked to each other with a *sense* of time. They did not have bodies. "Time passing" collapsed into another turn-bound message at the harness boundary. Triggers and dynamic instruction updates had nowhere to live.

## The discovery

The prototype failed in a useful way. The body needed to:

- Fire when time elapsed
- Receive external signals without a human starting a new turn
- Rewrite mind state while reasoning might be mid-flight

Harnesses today only allow external input at:

1. **Turn start** (user message)
2. **Mid-turn when the model asked** (tool result)

No third channel. The agent is deaf and blind while reasoning. Every claim about long-running autonomous agents is constrained by that leash.

## The async event primitive

The articulation that came out of the failure:

```
user message
assistant message (with tool calls)
tool result
[ASYNC EVENT: context 80% full / inter-agent request / runtime alert]
assistant message
```

A third message category, **async events**: injected at safe points during execution without restarting the turn loop.

Use cases:

- **Context compaction**: runtime signals 80% full; agent dispatches compaction without breaking the loop
- **Inter-agent communication**: Agent B needs something from Agent A mid-execution
- **Runtime alerts**: rate limits, subagent completion, critical external signals

Pitch line I keep coming back to: **agents today have one sensory channel. This adds the rest.**

## Honest status

This is systems investigation, not shipped product. The prototype failure is evidence. The open problem, event semantics during tool calls, subagent spawn, nested events, is where real engineering lives.

Clink is shipped multi-agent orchestration at the application layer. Agentic Village + async events is runtime architecture one layer below, the harness problem that blocked the embodiment experiment.

## Prior art

`session.steer` in some harnesses, dynamic system prompts before execution, LangGraph interrupts, related but different semantics. Nobody has a clean public answer for mid-reasoning external events yet.

What would establish the idea: public design doc, reference implementation, compelling demo (context compaction or boiler-room maintenance agent).

If you're building "agents that run for hours," ask whether your harness can receive input while the model is thinking. If not, you're building chat with extra steps.
