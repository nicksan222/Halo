/**
 * Base Tailwind CSS Configuration for OwnFit Design System
 *
 * Preset condiviso (senza `content`) con tema, colori, animazioni e plugin.
 * Usato da tutte le app tramite `presets`.
 */

import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * OwnFit Design System Color Palette
 *
 * Comprehensive color system with semantic naming and multiple variants
 * for each color. Supports both light and dark themes through CSS variables.
 */
export const designSystemColors = {
  // Base semantic colors
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  cardChart: 'hsla(var(--cardChart))',

  // Sidebar component colors
  sidebar: {
    DEFAULT: 'hsl(var(--sidebar-background))',
    foreground: 'hsl(var(--sidebar-foreground))',
    primary: 'hsl(var(--sidebar-primary))',
    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    accent: 'hsl(var(--sidebar-accent))',
    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    border: 'hsl(var(--sidebar-border))',
    ring: 'hsl(var(--sidebar-ring))'
  },

  // Chat and badge colors
  chatitem: 'hsl(var(--chatitem))',
  badge: 'hsl(var(--badge))',

  // Primary UI colors
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },

  // Financial/transaction colors
  debit: 'hsl(var(--debit))',
  credit: 'hsl(var(--credit))',

  // Extended color palette for status indicators and categories
  stred: {
    DEFAULT: 'hsl(var(--st-red))',
    foreground: 'hsl(var(--st-red-foreground))',
    matte: 'hsl(var(--st-red-matte))'
  },
  storange: {
    DEFAULT: 'hsl(var(--st-orange))',
    foreground: 'hsl(var(--st-orange-foreground))',
    matte: 'hsl(var(--st-orange-matte))'
  },
  stamber: {
    DEFAULT: 'hsl(var(--st-amber))',
    foreground: 'hsl(var(--st-amber-foreground))',
    matte: 'hsl(var(--st-amber-matte))'
  },
  styellow: {
    DEFAULT: 'hsl(var(--st-yellow))',
    foreground: 'hsl(var(--st-yellow-foreground))',
    matte: 'hsl(var(--st-yellow-matte))'
  },
  stlime: {
    DEFAULT: 'hsl(var(--st-lime))',
    foreground: 'hsl(var(--st-lime-foreground))',
    matte: 'hsl(var(--st-lime-matte))'
  },
  stgreen: {
    DEFAULT: 'hsl(var(--st-green))',
    foreground: 'hsl(var(--st-green-foreground))',
    matte: 'hsl(var(--st-green-matte))'
  },
  stemerald: {
    DEFAULT: 'hsl(var(--st-emerald))',
    foreground: 'hsl(var(--st-emerald-foreground))',
    matte: 'hsl(var(--st-emerald-matte))'
  },
  stteal: {
    DEFAULT: 'hsl(var(--st-teal))',
    foreground: 'hsl(var(--st-teal-foreground))',
    matte: 'hsl(var(--st-teal-matte))'
  },
  stcyan: {
    DEFAULT: 'hsl(var(--st-cyan))',
    foreground: 'hsl(var(--st-cyan-foreground))',
    matte: 'hsl(var(--st-cyan-matte))'
  },
  stsky: {
    DEFAULT: 'hsl(var(--st-sky))',
    foreground: 'hsl(var(--st-sky-foreground))',
    matte: 'hsl(var(--st-sky-matte))'
  },
  stblue: {
    DEFAULT: 'hsl(var(--st-blue))',
    foreground: 'hsl(var(--st-blue-foreground))',
    matte: 'hsl(var(--st-blue-matte))'
  },
  stindigo: {
    DEFAULT: 'hsl(var(--st-indigo))',
    foreground: 'hsl(var(--st-indigo-foreground))',
    matte: 'hsl(var(--st-indigo-matte))'
  },
  stviolet: {
    DEFAULT: 'hsl(var(--st-violet))',
    foreground: 'hsl(var(--st-violet-foreground))',
    matte: 'hsl(var(--st-violet-matte))'
  },
  stpurple: {
    DEFAULT: 'hsl(var(--st-purple))',
    foreground: 'hsl(var(--st-purple-foreground))',
    matte: 'hsl(var(--st-purple-matte))'
  },
  stfuchsia: {
    DEFAULT: 'hsl(var(--st-fuchsia))',
    foreground: 'hsl(var(--st-fuchsia-foreground))',
    matte: 'hsl(var(--st-fuchsia-matte))'
  },
  stpink: {
    DEFAULT: 'hsl(var(--st-pink))',
    foreground: 'hsl(var(--st-pink-foreground))',
    matte: 'hsl(var(--st-pink-matte))'
  },
  strose: {
    DEFAULT: 'hsl(var(--st-rose))',
    foreground: 'hsl(var(--st-rose-foreground))',
    matte: 'hsl(var(--st-rose-matte))'
  }
};

/**
 * OwnFit Design System Animations
 */
export const designSystemAnimations = {
  keyframes: {
    'accordion-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-accordion-content-height)' }
    },
    'accordion-up': {
      from: { height: 'var(--radix-accordion-content-height)' },
      to: { height: '0' }
    },
    'collapsible-down': {
      from: { height: '0' },
      to: { height: 'var(--radix-collapsible-content-height)' }
    },
    'collapsible-up': {
      from: { height: 'var(--radix-collapsible-content-height)' },
      to: { height: '0' }
    }
  },
  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    'collapsible-down': 'collapsible-down 0.2s ease-out',
    'collapsible-up': 'collapsible-up 0.2s ease-out'
  }
};

/**
 * Base preset (no `content`). Da usare in `presets` nelle app.
 */
export const baseTailwindPreset = {
  darkMode: 'class',
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: designSystemColors,
      ...designSystemAnimations
    }
  },
  plugins: [tailwindcssAnimate]
} satisfies Omit<Config, 'content'>;

export default baseTailwindPreset;
