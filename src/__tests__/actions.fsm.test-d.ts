import type { PrivateContextFrom } from "@bemedev/app";

type CF1 = PrivateContextFrom<typeof import("./actions.fsm").default>;
