import fs from "fs";
import path from "path";

// ------------------Config-----------------
const BASE_DIR = "src/app/modules";

// ------------------Templates-----------------
const templates = {
  controller: (name, pascal) => `
    import type {Request, Response} from 'express'
    import {${pascal}Service} from './${name}.service';
    import { catchAsync } from '../../utils/index'
    import type { ${pascal}ResponseType } from './${name}.interface'
    
    const ${name}Service = new ${pascal}Service();
    
    export class ${pascal}Controller {
        async getAll(req: Request, res: Response): Promise<void> {
            try{
                const data = await ${name}Service.findAll();
                res.status(200).json({
                success: true,
                message: "The ${name} data retrieved successfully",
                data
            })
            } catch(error: any) {
                catchAsync(res, error)
            }
        }

        async getById(req: Request, res: Response): Promise<void> {
            const paramsId = req.params.id
            if(!paramsId) {
              throw new Error('Id not found!')
            }
            try{
                const data = await ${name}Service.findById(paramsId as string);
                if(!data) {
                    res.status(404).json({
                        success: false,
                        message: "${pascal} not found"
                        })
                    return;
                }
                res.status(200).json({
                success: true,
                message: "The ${name} data retrieved successfully",
                data
            })
            } catch(error: any) {
               catchAsync(res, error)
            }
        }

        async create(req: Request, res: Response): Promise<void> {
            try{
                const data = await ${name}Service.create(req.body);
                res.status(201).json({
                    success: true,
                    message: "The ${name} data created successfully",
                    data
                })
            }catch(error: any) {
                catchAsync(res, error)
            }
        }

        async update(req: Request, res: Response): Promise<void> {
            const paramsId = req.params.id
            if(!paramsId) {
              throw new Error('Id not found!')
            }
            try {
                const data = await ${name}Service.update(paramsId as string, req.body);
                res.status(200).json({
                    success: true,
                    message: "The ${name} data updated successfully",
                    data
                })
            } catch (error: any) {
                catchAsync(res, error)
            }
        }

        async delete(req: Request, res: Response): Promise<void> {
            try {
                const paramsId = req.params.id
                if (!paramsId) {
                  throw new Error("Id not found!");
                }
                await ${name}Service.delete(paramsId as string)
                res.status(200).json({
                    success: true,
                    message: "The ${name} data deleted successfully",
                })
            } catch (error: any) {
                catchAsync(res, error)
            }
        }
    
    }`,

  service: (name, pascal) => `
    import { type ${pascal}Type } from './${name}.interface';
    import { ${pascal}Model } from './${name}.model';

    export class ${pascal}Service {
        async findAll(): Promise<${pascal}Type[]> {
            return ${pascal}Model.find();
        }

        async findById(id: string): Promise<${pascal}Type | null> {
            return ${pascal}Model.findById(id);
        }

        async create(data: Partial<${pascal}Type>): Promise<${pascal}Type> {
            return ${pascal}Model.create(data);
        }

        async update(id: string, data: Partial<${pascal}Type>): Promise<${pascal}Type | null> {
            return ${pascal}Model.findByIdAndUpdate(id, data, {new: true});
        }

        async delete(id: string): Promise<void> {
            await ${pascal}Model.findByIdAndDelete(id)
        }
    }
    `,

  interface: (name, pascal) => `
  export interface ${pascal}Type {

  }

  export interface ${pascal}ResponseType {
    success: boolean;
    data?: ${pascal}Type | ${pascal}Type[];
    message: string
  }
  `,
  model: (name, pascal) => `
  import mongoose, {Schema, Document} from 'mongoose';
  import type { ${pascal}Type } from './${name}.interface';

  export interface ${pascal}DocumentType extends ${pascal}Type, Document {}

  const ${pascal}Schema: Schema = new Schema(
    {
    // TODO: Define ${pascal} schema fields
    },
    {
      timestamps: true,
      versionKey: false
      }
    )
        
    export const ${pascal}Model = mongoose.model<${pascal}DocumentType>('${pascal}', ${pascal}Schema);
    `,

  route: (name, pascal) => `
    import {Router} from 'express';
    import { ${pascal}Controller } from './${name}.controller';

    const ${name}Route = Router();
    const ${name}Controller = new ${pascal}Controller();

    ${name}Route.get('/', ${name}Controller.getAll.bind(${name}Controller));
    ${name}Route.get('/:id', ${name}Controller.getById.bind(${name}Controller));
    ${name}Route.post('/', ${name}Controller.create.bind(${name}Controller));
    ${name}Route.put('/:id', ${name}Controller.update.bind(${name}Controller));
    ${name}Route.delete('/:id', ${name}Controller.delete.bind(${name}Controller));

    export default ${name}Route;
    `,

  validation: (name, pascal) => `
    import { z } from 'zod'

    export const ${pascal}Schema = z.object({});

    export type ${pascal} = z.infer<typeof ${pascal}Schema>
    `,

  index: (name, pascal) => `
    export * from './${name}.controller'
    export * from './${name}.service'
    export * from './${name}.interface'
    export * from './${name}.model'
    export * from './${name}.route';
    `,
};

// ------------------Helpers-----------------
const toPascalCase = (str) =>
  str
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");

const toCamelCase = (str) => {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toKebabCase = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✔${colors.reset}  ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset}  ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset}  ${msg}`),
  error: (msg) => console.log(`${colors.red}✖${colors.reset}  ${msg}`),
  title: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}`),
  dim: (msg) => console.log(`${colors.dim}${msg}${colors.reset}`),
};

// ------------------Main-----------------
function printUsage() {
  console.log(`
${colors.bold}Express Module Generator${colors.reset}
 
${colors.cyan}Usage:${colors.reset}
  node generate-module.js <module-name> [options]
 
${colors.cyan}Options:${colors.reset}
  --dir <path>     Output directory (default: ${BASE_DIR})
  --skip <files>   Comma-separated list of files to skip
                   Options: controller, service, interface, model, routes, validation, index
  --force          Overwrite existing files
  --dry-run        Preview files without creating them
  --help           Show this help message
 
${colors.cyan}Examples:${colors.reset}
  node generate-module.js auth
  node generate-module.js user --dir src/api/modules
  node generate-module.js product --skip validation,index
  node generate-module.js order --force
  node generate-module.js payment --dry-run
`);
}

function parseArgs(args) {
  const opts = {
    name: null,
    dir: BASE_DIR,
    skip: [],
    force: false,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    } else if (arg === "--dir" && args[i + 1]) {
      opts.dir = args[++i];
    } else if (arg === "--skip" && args[i + 1]) {
      opts.skip = args[++i].split(",").map((s) => s.trim());
    } else if (arg === "--force") {
      opts.force = true;
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (!arg.startsWith("--")) {
      opts.name = arg;
    }
  }

  return opts;
}

function generateModule(opts) {
  const { name: rawName, dir, skip, force, dryRun } = opts;

  if (!rawName) {
    log.error("Module name is required.");
    printUsage();
    process.exit(1);
  }

  const name = toKebabCase(rawName);
  const pascal = toPascalCase(rawName);
  const moduleDir = path.join(dir, name);

  log.title(`🚀 Generating module: ${colors.cyan}${pascal}${colors.reset}`);
  log.dim(`   Output: ${moduleDir}\n`);

  // Create directory
  if (!dryRun) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }

  const fileTypes = [
    "controller",
    "service",
    "interface",
    "model",
    "route",
    "validation",
    "index",
  ];
  const results = { created: 0, skipped: 0, existing: 0 };

  for (const type of fileTypes) {
    if (skip.includes(type)) {
      log.warn(`Skipped   ${name}.${type}.ts`);
      results.skipped++;
      continue;
    }

    const filePath = path.join(moduleDir, `${name}.${type}.ts`);
    const content = templates[type](name, pascal);

    if (dryRun) {
      log.info(`[dry-run] ${filePath}`);
      results.created++;
      continue;
    }

    if (fs.existsSync(filePath) && !force) {
      log.warn(
        `Exists    ${name}.${type}.ts  ${colors.dim}(use --force to overwrite)${colors.reset}`,
      );
      results.existing++;
      continue;
    }

    fs.writeFileSync(filePath, content, "utf8");
    log.success(`Created    ${name}.${type}.ts`);
    results.created++;
  }

  // Summary
  console.log();
  log.dim("-".repeat(45));
  if (dryRun) {
    log.info(
      `[Dry run] ${results.created} file(s) would be created in: ${moduleDir}`,
    );
  } else {
    log.info(
      `Done! ${results.created} created, ${results.skipped} skipped, ${results.existing} already existed.`,
    );
    console.log(
      `\n${colors.dim}Next: import ${name}Routes in your app.ts / index.ts${colors.reset}\n`,
    );
  }
}

// ------------------Run-----------------
const args = process.argv.slice(2);
const opts = parseArgs(args);
generateModule(opts);
