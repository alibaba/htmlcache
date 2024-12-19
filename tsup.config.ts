import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // Output different formats to different folder instead of using different extensions
  legacyOutput: true,
  minify: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
});
