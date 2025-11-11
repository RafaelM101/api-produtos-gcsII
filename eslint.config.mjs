
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jest from "eslint-plugin-jest";

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
 
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  },


  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    plugins: { jest },
    languageOptions: {
      globals: {
        ...globals.node,
        ...jest.environments.globals.globals
      }
    },
    rules: {
      "no-unused-vars": "off", 
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error"
    }
  }
]);
