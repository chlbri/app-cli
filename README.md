# @bemedev/app-typings

---

## About

This library provides a command-line interface (CLI) for the `&bemedev/app`
library to enhance and generate more accurate TypeScript typings. It
streamlines the extraction, generation, and integration of type definitions
from `&bemedev/app` configurations and files, offering a better development
experience (autocompletion, type checking, documentation).

This README contains essential information for installing, using, and
contributing to the project. All useful content is placed after the
"License" section.

<br/>

## Features

- Simple CLI to generate TypeScript typings from `&bemedev/app`
  configuration files.
- Automatic extraction of types from objects and configurations.
- Options to customize input and output files, and to watch for changes.
- Easy integration into CI/CD pipelines and npm/pnpm scripts.

<br/>

## Installation

Use pnpm (recommended) or npm/yarn depending on your project:

- With pnpm (in the project directory using `&bemedev/app`):

```sh
pnpm add -D @chlbri/app-typings
```

<br/>

## Usage (CLI)

The CLI exposes the following main commands:

- `app-typings generate` — Generates typings from input files.
- `app-typings validate` — Checks that existing typings match the sources.
- `app-typings watch` — Watches source files and regenerates automatically.

Common options:

- `--input, -i`: input file or folder path (e.g., `src/configs`).
- `--output, -o`: output file for generated typings (e.g.,
  `types/app-config.d.ts`).
- `--config, -c`: path to a custom JSON/TS config file.
- `--watch, -w`: enables watch mode for automatic regeneration.
- `--help, -h`: displays help.

Examples:

- Generate typings from `src` to `types/app.d.ts`:

```sh
app-typings generate -i src -o types/app.d.ts
```

- Run in watch mode:

```sh
app-typings watch -i src -o types/app.d.ts
```

- Use a custom config file:

```sh
app-typings generate -c .app-typingsrc.json
```

<br/>

## Integration in npm/pnpm script

Add a script in your `package.json`:

```json
{
  "scripts": {
    "typings:generate": "app-typings generate -i src -o types/app.d.ts"
  }
}
```

Then run:

```sh
pnpm run typings:generate
```

<br/>

## Configuration

An optional configuration file (e.g., `.app-typingsrc.json` or
`.app-typingsrc.js`) can include:

- `input`: input path
- `output`: output path
- `watch`: boolean
- `ignore`: patterns to ignore

Minimal example:

```json
{
  "input": "src",
  "output": "types/app.d.ts",
  "watch": false
}
```

<br/>

## Best Practices

- Commit the generated `types/*.d.ts` file to ensure build stability and
  reproducibility.
- Use the `validate` command in your CI pipelines to detect drifts between
  source and typings.

<br/>

## Contribution

Contributions are welcome: bugs, PRs, improvement suggestions. Please open
an issue or a PR targeting the `dev` branch.

Quick guide:

- Fork → new branch → PR to `dev`.
- Respect tests and linting (see `pnpm test`).

<br/>

## CHANGE_LOG

See the full changelog:  
https://github.com/chlbri/app-cli/blob/main/CHANGELOG.md

<br/>

## Author

chlbri (bri_lvi@icloud.com)

[My GitHub](https://github.com/chlbri?tab=repositories)

[<svg width="98" height="96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>](https://github.com/chlbri?tab=repositories)

<br/>

## Links

- Documentation: https://github.com/chlbri/new-package

<br/>

## License

MIT
