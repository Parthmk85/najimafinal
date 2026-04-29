import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-specific:
    "scripts/**",
    "seed-skills.ts",
  ]),
  {
    rules: {
      // Allow `any` in this app — it is used pervasively in CMS-driven dynamic data shapes.
      "@typescript-eslint/no-explicit-any": "off",
      // Reduce noise from unused vars to warnings; prefix with `_` to suppress entirely.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Treat hooks deps as warnings (existing code intentionally omits some deps).
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "warn",
      // Common minor style issues should not fail builds.
      "react/no-unescaped-entities": "warn",
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
