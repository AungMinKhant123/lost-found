import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Handlebars from "handlebars";
import inquirer from "inquirer";
import path from "node:path";
import { fileURLToPath } from "node:url";

type GeneratorInput = {
  domain: string;
  module: string;
  module_PascalCase: string;

  params_flag: boolean;
  query_flag: boolean;
  body_flag: boolean;
  response_flag: boolean;
  is_response_paginated: boolean;
  guard_flag: boolean;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const templateDir = path.join(currentDir, "templates", "codegen");

const handlersDir = path.join(currentDir, "..", "src", "handlers");

const toPascalCase = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.substring(1);
};

type TemplateFile = {
  template: string;
  output: string;
  enabled: (input: GeneratorInput) => boolean;
};

const templateFiles: TemplateFile[] = [
  {
    template: "handler.hbs",
    output: "handler.ts",
    enabled: () => true,
  },
  {
    template: "schema.hbs",
    output: "schema.ts",
    enabled: () => true,
  },
  {
    template: "requestParams.hbs",
    output: "requestParams.ts",
    enabled: (input) => input.params_flag,
  },
  {
    template: "requestQuery.hbs",
    output: "requestQuery.ts",
    enabled: (input) => input.query_flag,
  },
  {
    template: "requestBody.hbs",
    output: "requestBody.ts",
    enabled: (input) => input.body_flag,
  },
  {
    template: "responseBody.hbs",
    output: "responseBody.ts",
    enabled: () => true,
  },
];

const validateSegment = (value: string): true | string => {
  if (!value.trim()) {
    return "Value cannot be empty.";
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(value.trim())) {
    return "Use only letters, numbers, underscores, or hyphens.";
  }

  return true;
};

const promptInput = async (): Promise<GeneratorInput> => {
  const answers = await inquirer.prompt<{
    domain: string;
    module: string;
    params_flag: boolean;
    query_flag: boolean;
    body_flag: boolean;
    is_response_paginated: boolean;
    guard_flag: boolean;
  }>([
    {
      type: "input",
      name: "domain",
      message: "Business domain:",
      validate: validateSegment,
    },
    {
      type: "input",
      name: "module",
      message: "Module name:",
      validate: validateSegment,
    },
    {
      type: "confirm",
      name: "params_flag",
      message: "Require URL params?",
      default: false,
    },
    {
      type: "confirm",
      name: "query_flag",
      message: "Require query params?",
      default: false,
    },
    {
      type: "confirm",
      name: "body_flag",
      message: "Require request body?",
      default: true,
    },
    {
      type: "confirm",
      name: "is_response_paginated",
      message: "Is the response paginated?",
      default: false,
    },
    {
      type: "confirm",
      name: "guard_flag",
      message: "Require authentication?",
      default: true,
    },
  ]);

  return {
    domain: answers.domain.trim(),
    module: answers.module.trim(),
    module_PascalCase: toPascalCase(answers.module.trim()),

    params_flag: answers.params_flag,
    query_flag: answers.query_flag,
    body_flag: answers.body_flag,
    response_flag: true,
    is_response_paginated: answers.is_response_paginated,
    guard_flag: answers.guard_flag,
  };
};

const generateFiles = (input: GeneratorInput): void => {
  const outputDir = path.join(handlersDir, input.domain, input.module);

  if (existsSync(outputDir)) {
    throw new Error(`Directory already exists: ${outputDir}`);
  }

  mkdirSync(outputDir, { recursive: true });

  for (const file of templateFiles) {
    if (!file.enabled(input)) {
      continue;
    }

    const templatePath = path.join(templateDir, file.template);

    const rawTemplate = readFileSync(templatePath, "utf8");

    const compiled = Handlebars.compile(rawTemplate, { noEscape: true });

    const output = compiled(input);

    const targetPath = path.join(outputDir, file.output);

    writeFileSync(targetPath, output, "utf8");

    console.log(`Created: ${targetPath}`);
  }

  console.log("\nCode generation complete!");
};

const main = async (): Promise<void> => {
  try {
    const input = await promptInput();

    generateFiles(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error(`\n${message}`);

    process.exit(1);
  }
};

void main();
