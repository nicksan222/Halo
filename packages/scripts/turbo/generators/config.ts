import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('package', {
    description: 'Create a new package with an empty src/index.ts',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name (without scope, kebab-case):',
        validate: (input: string) => {
          if (!input || !/^[a-z0-9-]+$/.test(input)) {
            return 'Use lowercase letters, numbers, and dashes only.';
          }
          return true;
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../../packages/{{kebabCase name}}/package.json',
        template: `{
  "name": "@acme/{{kebabCase name}}",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "files": [
    "src"
  ],
  "scripts": {
    "build": "bunx tsc -p tsconfig.json --noEmit",
    "typecheck": "bunx tsc -p tsconfig.json --noEmit",
    "lint": "bunx biome check .",
    "format": "bunx biome check --write ."
  }
}`
      },
      {
        type: 'add',
        path: '../../packages/{{kebabCase name}}/tsconfig.json',
        template: `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "declaration": true, "emitDeclarationOnly": false, "skipLibCheck": true }
}`
      },
      {
        type: 'add',
        path: '../../packages/{{kebabCase name}}/src/index.ts',
        template: ''
      }
    ]
  });
}
