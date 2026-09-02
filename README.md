# orbit-ops-server

## Deploy to Vercel

This server uses `api/index.ts` as its Vercel serverless entrypoint. Import this repository as a Vercel project with the project root set to this directory. Vercel will use `vercel.json` to route requests to the Express app.

Before deploying, provision MongoDB and Redis services that are reachable from Vercel. MongoDB Atlas and a managed Redis provider are suitable; the Docker Compose services are for local development only.

Add these environment variables in Vercel for the Production, Preview, and Development environments as needed:

```text
NODE_ENV=production
DB_URL=
REDIS_URL=
FRONTEND_URL=https://your-frontend.example.com
PORT=8080
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=
JWT_VERIFY_SECRET=
JWT_VERIFY_EXPIRES_IN=
BCRYPT_SALT=
EXPRESS_SESSION_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

After deployment, the health response is available at `/`, and API routes remain under `/api/v1` (for example, `/api/v1/auth/login`). Configure the frontend to use the deployed server URL and ensure its origin matches `FRONTEND_URL`; credentialed cookies require HTTPS in production.

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
```node script/generate-module.js user --dir src/api/modules```

# Skip certain files
```node script/generate-module.js product --skip validation,index```

# Overwrite existing files
```node script/generate-module.js order --force```

# Preview without creating (dry run)
```node script/generate-module.js payment --dry-run```

Optional — make it a global CLI command by adding this to your package.json:
json"scripts": {
  "gen:module": "node script/generate-module.js"
}
Then run: ```npm run gen:module auth```
Each generated file comes with boilerplate wired together — the controller imports from the service, the service uses the interface and model, and the routes file binds everything to an Express router. You just fill in your schema fields and business logic.