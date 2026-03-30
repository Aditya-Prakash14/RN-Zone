export interface UILibrary {
  id: string;
  name: string;
  description: string;
  tags: string[];
  npmPackages: string[];
  peerDependencies?: string[];
  expoCompatible: boolean;
  cliCompatible: boolean;
  setupSteps: SetupStep[];
  docsUrl: string;
}

export interface SetupStep {
  label: string;
  type: "install" | "code" | "command" | "info";
  content: string;
  filename?: string;
}

export const UI_LIBRARIES: UILibrary[] = [
  {
    id: "paper",
    name: "React Native Paper",
    description: "Material Design 3 components. Theming, dark mode, accessibility built-in.",
    tags: ["Material", "Theming", "Popular"],
    npmPackages: ["react-native-paper"],
    peerDependencies: ["react-native-vector-icons"],
    expoCompatible: true,
    cliCompatible: true,
    docsUrl: "https://reactnativepaper.com",
    setupSteps: [
      {
        label: "Install packages",
        type: "install",
        content: "react-native-paper react-native-vector-icons"
      },
      {
        label: "Wrap App with PaperProvider",
        type: "code",
        filename: "App.tsx",
        content: `import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      {/* your app */}
    </PaperProvider>
  );
}`
      },
      {
        label: "For Expo — no native linking needed",
        type: "info",
        content: "Expo manages vector icons automatically. For bare RN CLI, run: npx pod-install"
      }
    ]
  },
  {
    id: "nativewind",
    name: "NativeWind (Tailwind CSS)",
    description: "Use Tailwind CSS utility classes in React Native. v4 with new Metro plugin.",
    tags: ["Tailwind", "Utility-first", "Trending"],
    npmPackages: ["nativewind", "tailwindcss"],
    expoCompatible: true,
    cliCompatible: true,
    docsUrl: "https://nativewind.dev",
    setupSteps: [
      {
        label: "Install packages",
        type: "install",
        content: "nativewind tailwindcss"
      },
      {
        label: "Create tailwind.config.js",
        type: "code",
        filename: "tailwind.config.js",
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};`
      },
      {
        label: "Update babel.config.js",
        type: "code",
        filename: "babel.config.js",
        content: `module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['nativewind/babel'],
};`
      },
      {
        label: "Add global.css",
        type: "code",
        filename: "global.css",
        content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`
      },
      {
        label: "Import global.css in App entry",
        type: "code",
        filename: "App.tsx",
        content: `import "./global.css";`
      }
    ]
  },
  {
    id: "gluestack",
    name: "Gluestack UI",
    description: "Universal, accessible component library. Works on RN + Web (RSC-ready).",
    tags: ["Universal", "Accessible", "RSC"],
    npmPackages: ["@gluestack-ui/themed", "@gluestack-style/react"],
    expoCompatible: true,
    cliCompatible: true,
    docsUrl: "https://gluestack.io",
    setupSteps: [
      {
        label: "Install packages",
        type: "install",
        content: "@gluestack-ui/themed @gluestack-style/react @legendapp/motion"
      },
      {
        label: "Wrap App with GluestackUIProvider",
        type: "code",
        filename: "App.tsx",
        content: `import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      {/* your app */}
    </GluestackUIProvider>
  );
}`
      }
    ]
  },
  {
    id: "elements",
    name: "React Native Elements",
    description: "Cross-platform UI toolkit with customizable components and theming.",
    tags: ["Classic", "Customizable"],
    npmPackages: ["@rneui/themed", "@rneui/base"],
    peerDependencies: ["react-native-vector-icons"],
    expoCompatible: true,
    cliCompatible: true,
    docsUrl: "https://reactnativeelements.com",
    setupSteps: [
      {
        label: "Install packages",
        type: "install",
        content: "@rneui/themed @rneui/base react-native-vector-icons"
      },
      {
        label: "Wrap App with ThemeProvider",
        type: "code",
        filename: "App.tsx",
        content: `import { ThemeProvider, createTheme } from '@rneui/themed';

const theme = createTheme({
  lightColors: { primary: '#6200ea' },
  darkColors:  { primary: '#bb86fc' },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* your app */}
    </ThemeProvider>
  );
}`
      }
    ]
  },
  {
    id: "tamagui",
    name: "Tamagui",
    description: "Optimizing UI kit with compile-time performance. Universal RN + Web.",
    tags: ["Performance", "Universal", "Design System"],
    npmPackages: ["tamagui", "@tamagui/core", "@tamagui/config"],
    expoCompatible: true,
    cliCompatible: true,
    docsUrl: "https://tamagui.dev",
    setupSteps: [
      {
        label: "Install packages",
        type: "install",
        content: "tamagui @tamagui/core @tamagui/config @tamagui/babel-plugin"
      },
      {
        label: "Update babel.config.js",
        type: "code",
        filename: "babel.config.js",
        content: `module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['@tamagui/babel-plugin', {
      components: ['tamagui'],
      config: './tamagui.config.ts',
      logTimings: true,
    }],
  ],
};`
      },
      {
        label: "Create tamagui.config.ts",
        type: "code",
        filename: "tamagui.config.ts",
        content: `import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

export const tamaguiConfig = createTamagui(config);
export default tamaguiConfig;
export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}`
      },
      {
        label: "Wrap App with TamaguiProvider",
        type: "code",
        filename: "App.tsx",
        content: `import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      {/* your app */}
    </TamaguiProvider>
  );
}`
      }
    ]
  }
];

export function getLibraryForId(id: string): UILibrary | undefined {
  return UI_LIBRARIES.find(lib => lib.id === id);
}

export function getInstallCommand(packageManager: "npm" | "yarn" | "bun", packages: string[]): string {
  const pkgList = packages.join(" ");
  if (packageManager === "npm") return `npm install ${pkgList}`;
  if (packageManager === "yarn") return `yarn add ${pkgList}`;
  if (packageManager === "bun") return `bun add ${pkgList}`;
  return `npm install ${pkgList}`;
}
