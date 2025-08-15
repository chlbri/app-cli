# @bemedev/app-cli

---

## About

This library provides a command-line interface (CLI) for generating
TypeScript typings from `@bemedev/app-ts` state machine configurations. It
automatically extracts and generates type definitions from your machine
files, offering a better development experience with improved
autocompletion, type checking, and documentation.

This README contains essential information for installing, using, and
contributing to the project.

<br/>

## Features

- **Automatic Type Generation**: Extracts TypeScript typings from
  `.machine.ts` files that use `createMachine` from `@bemedev/app-ts`
- **Watch Mode**: Monitors file changes and regenerates types automatically
- **Flexible File Selection**: Generate types for specific files or use
  glob patterns
- **Strict Mode**: Ensures all files follow the `.machine.ts` naming
  convention
- **Easy Integration**: Simple CLI commands that work with any Node.js
  project

<br/>

## Installation

Install as a development dependency in your project using
`@bemedev/app-ts`:

```sh
pnpm add -D @bemedev/app-cli
```

<br/>

## Requirements

- Node.js >= 22
- Files must use `@bemedev/app-ts` with `createMachine` function
- Machine files should follow the `.machine.ts` naming convention

<br/>

## Usage (CLI)

The CLI provides two main commands:

### `app-typings generate`

Generates typings from all `.machine.ts` files in your project:

```sh
app-typings generate
```

**Options:**

- `--watch, -w`: Watch for file changes and regenerate automatically
- `--help, -h`: Show help information

**Aliases:** `gen`

**Examples:**

```sh
# Generate types once
app-typings generate

# Generate types and watch for changes
app-typings generate --watch

# Using alias
app-typings gen -w
```

### `app-typings generateOne`

Generates typings for specific files:

```sh
app-typings generateOne file1.machine.ts file2.machine.ts
```

**Options:**

- `--watch, -w`: Watch specified files for changes
- `--strict, -s`: Enable strict mode (all files must end with
  `.machine.ts`)
- `--help, -h`: Show help information

**Aliases:** `genOne`, `genO`

**Examples:**

```sh
# Generate types for specific files
app-typings generateOne src/user.machine.ts src/auth.machine.ts

# Watch specific files
app-typings generateOne src/user.machine.ts --watch

# Strict mode - ensures all files follow naming convention (Regex : "**/*.machine.ts")
app-typings generateOne src/user.machine.ts --strict
```

<br/>

## File Structure

The CLI looks for files with the following pattern:

- `**/*.machine.ts` - TypeScript machine files
- `**/*.machine.tsx` - TypeScript React machine files

Generated files will have the `.gen.ts` extension:

- `user.machine.ts` → `user.machine.gen.ts`
- `auth.machine.ts` → `auth.machine.gen.ts`

<br/>

## Integration with npm/pnpm Scripts

Add scripts to your `package.json`:

```json
{
  "scripts": {
    "types:generate": "app-typings generate",
    "types:watch": "app-typings generate --watch",
    "types:build": "app-typings generateOne src/**/*.machine.ts"
  }
}
```

Then run:

```sh
pnpm run types:generate
pnpm run types:watch
```

<br/>

## Environment Variables

You can configure the CLI using environment variables:

- `APP_TYPINGS_WATCH`: Enable watch mode for `generate` command
- `APP_TYPINGS_WATCH_ONE`: Enable watch mode for `generateOne` command
- `APP_TYPINGS_STRICT_ONE`: Enable strict mode for `generateOne` command

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
[CHANGE_LOG](https://github.com/chlbri/app-cli/blob/main/CHANGE_LOG.md)

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
