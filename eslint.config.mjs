import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  // Базовые настройки ИГНОРИРОВАНИЯ
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "out/**",
      "*.config.js",
      "next-env.d.ts",
      "prisma",
    ],
  },

  // JavaScript файлы
  {
    files: ["**/*.{js,jsx}"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // TypeScript файлы - ОСНОВНОЙ КОНФИГ
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "unused-imports": unusedImports,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // ===== ОЧИЩАЕМ КОНФЛИКТУЮЩИЕ ПРАВИЛА =====

      // 1. Отключаем стандартное правило ESLint для неиспользуемых переменных
      "no-unused-vars": "off",

      // 2. Отключаем TypeScript ESLint правило (оно включено в recommended)
      "@typescript-eslint/no-unused-vars": "off",

      // 3. Включаем ТОЛЬКО unused-imports плагин с автофиксом
      "unused-imports/no-unused-vars": [
        "error", // или "warn" если хотите предупреждения
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "unused-imports/no-unused-imports": "error", // Автоудаление импортов

      // 4. Другие TypeScript правила
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Next.js правила
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
      "@next/next/no-assign-module-variable": "error",
    },
  },
]);
