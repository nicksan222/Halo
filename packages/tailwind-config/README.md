# @acme/tailwind-config

Centralized Tailwind CSS configuration package for OwnFit applications. This package provides a unified design system configuration that can be shared across all apps and extended as needed.

## Features

- 🎨 **Complete Design System**: Comprehensive color palette with semantic naming
- 🌙 **Dark Mode Support**: Built-in class-based dark mode configuration
- 🎬 **Custom Animations**: Consistent UI animations across applications
- 📱 **Responsive Design**: Standard container and breakpoint configurations
- 🔧 **Extensible**: Easy to extend and customize for specific applications

## Installation

```bash
# Install the package (workspace-aware)
npm install @acme/tailwind-config

# Peer dependencies
npm install tailwindcss tailwindcss-animate
```

## Usage

### Basic Usage (Web Applications)

For most web applications (React, Next.js), use the web configuration:

```typescript
// tailwind.config.ts
import { webTailwindConfig } from "@acme/tailwind-config/web";

export default webTailwindConfig;
```

### Custom Content Paths

If you need custom content paths while keeping the design system:

```typescript
// tailwind.config.ts
import { webTailwindConfig } from "@acme/tailwind-config/web";
import type { Config } from "tailwindcss";

const config: Config = {
  ...webTailwindConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add your custom paths here
    "./custom-components/**/*.{js,ts,jsx,tsx}",
    // Keep the UI package paths
    ...webTailwindConfig.content.filter((path) => path.includes("ui-web")),
  ],
};

export default config;
```

### Extending the Configuration

To extend the base configuration with additional customizations:

```typescript
// tailwind.config.ts
import { baseTailwindConfig } from "@acme/tailwind-config/base";
import type { Config } from "tailwindcss";

const config: Config = {
  ...baseTailwindConfig,
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    ...baseTailwindConfig.theme,
    extend: {
      ...baseTailwindConfig.theme?.extend,
      // Add your custom extensions
      fontSize: {
        "custom-xl": "1.75rem",
      },
      colors: {
        ...baseTailwindConfig.theme?.extend?.colors,
        // Add app-specific colors
        brand: {
          primary: "#custom-color",
        },
      },
    },
  },
};

export default config;
```

### Using Individual Design Tokens

You can also import specific design tokens:

```typescript
import {
  designSystemColors,
  designSystemAnimations,
} from "@acme/tailwind-config";

// Use in your custom configuration
const myConfig = {
  theme: {
    extend: {
      colors: {
        ...designSystemColors,
        // Add more colors
      },
    },
  },
};
```

## Available Exports

### Configurations

- `webTailwindConfig` - Complete configuration for web applications
- `baseTailwindConfig` - Base configuration without content paths
- `webContentPaths` - Standard content paths for web apps

### Design Tokens

- `designSystemColors` - Complete color palette
- `designSystemAnimations` - Keyframes and animations

## Design System Colors

The package includes a comprehensive color system:

### Base Colors

- `border`, `input`, `ring`, `background`, `foreground`
- `primary`, `secondary`, `destructive`, `muted`, `accent`
- `popover`, `card`, `sidebar`

### Status Colors

- `stred`, `storange`, `stamber`, `styellow`, `stlime`
- `stgreen`, `stemerald`, `stteal`, `stcyan`, `stsky`
- `stblue`, `stindigo`, `stviolet`, `stpurple`, `stfuchsia`
- `stpink`, `strose`

### Financial Colors

- `debit`, `credit`

### Component Colors

- `chatitem`, `badge`

Each color includes variants like `DEFAULT`, `foreground`, and `matte` where applicable.

## Animations

Pre-configured animations for common UI patterns:

- `accordion-down` / `accordion-up`
- `collapsible-down` / `collapsible-up`

## Development

```bash
# Build the package
npm run build

# Watch for changes
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## Migration Guide

### From Individual Configurations

1. Install the package: `npm install @acme/tailwind-config`
2. Replace your existing tailwind.config.ts:

```diff
- import type { Config } from 'tailwindcss';
-
- const config = {
-   darkMode: 'class',
-   content: ['**/*.{ts,tsx}'],
-   theme: {
-     // ... your existing theme
-   },
-   plugins: [require('tailwindcss-animate')]
- } satisfies Config;
+ import { webTailwindConfig } from '@acme/tailwind-config/web';

- export default config;
+ export default webTailwindConfig;
```

3. If you have custom extensions, use the extending pattern shown above.

## Support

For questions or issues related to the Tailwind configuration, please reach out to the OwnFit development team.
