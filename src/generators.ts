import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export type ComponentStyle = "functional" | "memo" | "with-styles" | "with-nativewind";
export type ScreenStyle = "basic" | "with-header" | "scrollable" | "with-safe-area";

export interface GenerateOptions {
  name: string;
  targetDir: string;
  style: ComponentStyle | ScreenStyle;
  typescript: boolean;
}

function toPascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function generateComponent(opts: GenerateOptions): string {
  const name = toPascalCase(opts.name);
  const ext = opts.typescript ? "tsx" : "jsx";

  const templates: Record<ComponentStyle, string> = {
    functional: `import React from 'react';
import { View, Text } from 'react-native';
${opts.typescript ? "\ninterface " + name + "Props {\n  // define props here\n}\n" : ""}
const ${name}${opts.typescript ? ": React.FC<" + name + "Props>" : ""} = () => {
  return (
    <View>
      <Text>${name}</Text>
    </View>
  );
};

export default ${name};
`,
    memo: `import React, { memo } from 'react';
import { View, Text } from 'react-native';
${opts.typescript ? "\ninterface " + name + "Props {\n  // define props here\n}\n" : ""}
const ${name}${opts.typescript ? ": React.FC<" + name + "Props>" : ""} = memo(() => {
  return (
    <View>
      <Text>${name}</Text>
    </View>
  );
});

${name}.displayName = '${name}';
export default ${name};
`,
    "with-styles": `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
${opts.typescript ? "\ninterface " + name + "Props {\n  // define props here\n}\n" : ""}
const ${name}${opts.typescript ? ": React.FC<" + name + "Props>" : ""} = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ${name};
`,
    "with-nativewind": `import React from 'react';
import { View, Text } from 'react-native';
${opts.typescript ? "\ninterface " + name + "Props {\n  // define props here\n}\n" : ""}
const ${name}${opts.typescript ? ": React.FC<" + name + "Props>" : ""} = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-semibold text-gray-800">${name}</Text>
    </View>
  );
};

export default ${name};
`,
  };

  const content = templates[opts.style as ComponentStyle];
  const filename = `${name}.${ext}`;
  const filepath = path.join(opts.targetDir, filename);
  fs.writeFileSync(filepath, content, "utf8");
  return filepath;
}

export function generateScreen(opts: GenerateOptions): string {
  const name = toPascalCase(opts.name);
  const ext = opts.typescript ? "tsx" : "jsx";

  const templates: Record<ScreenStyle, string> = {
    basic: `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
${opts.typescript ? "import type { NativeStackScreenProps } from '@react-navigation/native-stack';\n\ntype Props = NativeStackScreenProps<any, '${name}'>;\n" : ""}
const ${name}Screen${opts.typescript ? ": React.FC<Props>" : ""} = ({ navigation }${opts.typescript ? ": Props" : ""}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title:     { fontSize: 24, fontWeight: 'bold' },
});

export default ${name}Screen;
`,
    "with-header": `import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
${opts.typescript ? "import type { NativeStackScreenProps } from '@react-navigation/native-stack';\n\ntype Props = NativeStackScreenProps<any, '${name}'>;\n" : ""}
const ${name}Screen${opts.typescript ? ": React.FC<Props>" : ""} = ({ navigation }${opts.typescript ? ": Props" : ""}) => {
  useLayoutEffect(() => {
    navigation.setOptions({ title: '${name}' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.body}>Welcome to ${name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  body:      { fontSize: 16, color: '#333' },
});

export default ${name}Screen;
`,
    scrollable: `import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
${opts.typescript ? "import type { NativeStackScreenProps } from '@react-navigation/native-stack';\n\ntype Props = NativeStackScreenProps<any, '${name}'>;\n" : ""}
const ${name}Screen${opts.typescript ? ": React.FC<Props>" : ""} = () => {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>${name}</Text>
        {/* content here */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll:     { flexGrow: 1 },
  container:  { flex: 1, padding: 16, backgroundColor: '#fff' },
  title:      { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});

export default ${name}Screen;
`,
    "with-safe-area": `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
${opts.typescript ? "import type { NativeStackScreenProps } from '@react-navigation/native-stack';\n\ntype Props = NativeStackScreenProps<any, '${name}'>;\n" : ""}
const ${name}Screen${opts.typescript ? ": React.FC<Props>" : ""} = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>${name}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  title:     { fontSize: 24, fontWeight: 'bold' },
});

export default ${name}Screen;
`,
  };

  const content = templates[opts.style as ScreenStyle];
  const filename = `${name}Screen.${ext}`;
  const filepath = path.join(opts.targetDir, filename);
  fs.writeFileSync(filepath, content, "utf8");
  return filepath;
}
