// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["node_modules/**", "db.sqlite3", "eslint.config.mjs"],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "commonjs"
    },
    extends: [js.configs.recommended],
    rules: {
      // Suas regras personalizadas (opcional)
    }
  }
]);
