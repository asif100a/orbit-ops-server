# orbit-ops-server

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

# Automatically generate module

Here's a clean CLI script that generates all module files for Express.js automatically.Created a file, read a fileCreated a file, read a fileHere's your Express module generator! Drop it in your project root and run it like this:
Basic usage:
bashnode generate-module.js auth
This creates src/modules/auth/ with 7 files:

auth.controller.ts
auth.service.ts
auth.interface.ts
auth.model.ts
auth.routes.ts
auth.validation.ts
auth.index.ts

More options:
bash# Custom output directory

```bash
node script/generate-module.js user --dir src/api/modules
```

# Skip certain files

```bash
node script/generate-module.js product --skip validation,index
```

# Overwrite existing files

```bash
node script/generate-module.js order --force
```

# Preview without creating (dry run)

```bash
node script/generate-module.js payment --dry-run
```

Optional — make it a global CLI command by adding this to your package.json:
json"scripts": {
"gen:module": "node script/generate-module.js"
}
Then run: `npm run gen:module auth`
Each generated file comes with boilerplate wired together — the controller imports from the service, the service uses the interface and model, and the routes file binds everything to an Express router. You just fill in your schema fields and business logic.
