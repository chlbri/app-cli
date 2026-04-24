import { array, command, multioption, option, string } from "cmd-ts";
import nodeWatch from "node-watch";
import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import {
  DEFAULT_EXCLUDES,
  DEFAULT_OUTPUT,
  DEFAULT_REGEX,
  MACHINE_GLOB,
} from "../core/constants";
import { generator } from "../core/generator";

/**
 * CLI command: `app watch`
 *
 * Long-running file system watcher that monitors machine files and regenerates
 * app.gen.ts automatically on any change.
 *
 * Behavior:
 * 1. **Initial generation**: Performs full generation on startup
 * 2. **Watch phase**: Monitors all *.machine.ts and *.fsm.ts files for changes
 * 3. **Debounced regeneration**: Waits 300ms of stability before regenerating
 *    (handles editor save sequences and git checkouts gracefully)
 * 4. **Feedback**: Logs change detection and regeneration completion
 * 5. **Graceful shutdown**: Responds to Ctrl+C and closes watcher cleanly
 *
 * Ideal for development workflows:
 * - Automatic type updates as you modify machine configs
 * - Immediate IDE feedback (via generated types)
 * - No manual regeneration needed
 * - Works seamlessly with hot reload / dev servers
 *
 * **Arguments:**
 * - `--output, -o [path]` - Where to write app.gen.ts (default: 'app.gen.ts')
 * - `--excludes, -e [patterns...]` - Glob patterns to exclude (default: node_modules, dist, lib)
 *
 * **Usage Examples:**
 * ```bash
 * # Start watching
 * pnpm run generate:watch
 *
 * # Custom output
 * app watch --output lib/app.gen.ts
 *
 * # Exclude additional directories
 * app watch --excludes temp build
 *
 * # Run alongside dev server
 * pnpm run dev &
 * pnpm run generate:watch
 * ```
 *
 * **Important Notes:**
 * - Runs indefinitely until Ctrl+C is pressed
 * - Handles file stabilization with 300ms threshold via Chokidar `awaitWriteFinish`
 * - Automatically scaffolds a new `.machine.ts` / `.fsm.ts` file with
 *   `export default createMachine('name', { initial: 'idle', states: { idle: {} } })`
 *   when the file is created and initially empty
 * - Ignores changes in excluded directories and output file itself
 * - Logs are written to stderr for script integration
 *
 * @see {@link generator} for the underlying generation logic
 * @see {@link MACHINE_GLOB} for the pattern of watched files
 * @see {@link DEFAULT_EXCLUDES} for default ignored directories
 * @see {@link DEFAULT_OUTPUT} for default output file path
 *
 * @see
 *
 * <br/>
 *
 * [node-watch](https://www.npmjs.com/package/node-watch) documentation for handling file change events and debouncing
 *
 * [cmd-ts](https://www.npmjs.com/package/cmd-ts) documentation for defining CLI commands and arguments
 *
 * [ts-morph](https://www.npmjs.com/package/ts-morph) documentation for programmatically creating starter machine files when new machine files are added
 *
 * Uses libs like `node-watch` for efficient file watching and `cmd-ts` for CLI argument parsing.
 */
export const watch = command({
  name: "watch",
  description:
    "Watch *.machine.ts / *.fsm.ts files and regenerate app.gen.ts on change",
  aliases: ["dev"],
  args: {
    output: option({
      type: string,
      long: "output",
      short: "o",
      defaultValue: () => DEFAULT_OUTPUT,
      description: "Output file path (relative to project root)",
    }),
    excludes: multioption({
      type: array(string),
      long: "excludes",
      short: "e",
      defaultValue: () => DEFAULT_EXCLUDES,
      description: "Directories to exclude",
    }),
  },
  handler: async ({ output, excludes }) => {
    const cwd = process.cwd();

    const isMachineFile = (filePath: string) =>
      filePath.endsWith(".machine.ts") || filePath.endsWith(".fsm.ts");

    const getMachineName = (filePath: string) => {
      const filename = basename(filePath);
      return filename.replace(/\.machine\.ts$|\.fsm\.ts$/i, "") || "machine";
    };

    const tryCreateStarterMachine = async (filePath: string) => {
      if (!isMachineFile(filePath)) return;

      const absolutePath = resolve(cwd, filePath);
      let existing = "";

      try {
        existing = await readFile(absolutePath, "utf8");
      } catch (err: any) {
        if (err?.code !== "ENOENT") {
          console.error(`Failed to inspect created file ${filePath}:`, err);
        }
        return;
      }

      if (existing.trim().length > 0) return;

      const defaultName = getMachineName(filePath);
      const defaultContent = `import { createMachine } from '@bemedev/app';\n\nexport default createMachine('${defaultName}', { initial: 'idle', states: { idle: {} } })\n`;

      await writeFile(absolutePath, defaultContent, "utf8");
      console.log(`Created starter machine file: ${filePath}`);
    };

    // Initial generation
    await generator({ output, excludes, cwd });
    const regenerate = async (path: string) => {
      console.log(`\nChange detected: ${path}`);
      await generator({ output, excludes, cwd });
    };

    // const paths = await Array.fromAsync(glob(MACHINE_GLOB));

    const watcher2 = nodeWatch("./", {
      recursive: true,
      delay: 300,
      filter: DEFAULT_REGEX,
    }).on("change", async (_, path) => {
      if (typeof path !== "string") return;
      console.log(`File added: ${path}`);
      await tryCreateStarterMachine(path);
      await regenerate(path);
    });

    // Watch for changes
    // const watcher = chokidarWatch('./', {
    //   cwd,
    //   ignored: (file, stats) => {
    //     const out =
    //       !!stats?.isFile() &&
    //       !file.endsWith('.fsm.ts') &&
    //       !file.endsWith('.machine.ts');

    //     return out;
    //   },
    //   ignoreInitial: true,

    //   awaitWriteFinish: {
    //     stabilityThreshold: 300,
    //     pollInterval: 100,
    //   },
    // })
    //   .on('add', async path => {
    //     console.log(`File added: ${path}`);
    //     await tryCreateStarterMachine(path);
    //     await regenerate(path);
    //   })
    //   .on('change', regenerate)
    //   .on('unlink', regenerate);

    console.log(`\nWatching for changes in ${MACHINE_GLOB}...`);
    console.log("Press Ctrl+C to stop.\n");

    // Keep process alive
    process.on("SIGINT", async () => {
      // await watcher.close();
      watcher2.close();
      process.exit(0);
    });
  },
});
