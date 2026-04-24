import { createMachine, typings } from "@bemedev/app";

export default createMachine(
  "actions",
  {
    initial: "idle",
    on: {
      OINC: {
        actions: ["tito"],
      },
    },
    states: { idle: {} },
  },
  {
    pContext: typings.pContext({
      number: "number",
    }),
  },
);
