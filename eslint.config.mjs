import globals from "globals";
import pluginJs from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      import: pluginImport,
    },
    /* Форматирование */
    rules: {
      /* Отступы — 4 пробела */
      "indent": ["error", 4],
      /* Двойные кавычки */
      "quotes": ["error", "double", { avoidEscape: true }],
      /* Точка с запятой в конце строки */
      "semi": ["error", "always"],
      /* Переносы строк Unix (LF) */
      "linebreak-style": ["error", "unix"],
      /* Висячая запятая для списков */
      "comma-dangle": ["error", "always-multiline"],
      /* Последняя строка файла пустая */
      "eol-last": ["error", "always"], 
      /* точка с запятой должна стоять в конце строки */
      "semi-style": ["error", "last"],
      /* убрать лишние пробелы */
      "no-trailing-spaces": "error",
      /* наличие пробелов вокруг инфиксных операторов */
      "space-infix-ops": [ "error", { "int32Hint": false }],
      /* пробел вокруг унарных операторов */
      "space-unary-ops": "error",
      /* пробел после символа комментария */
      "spaced-comment": [ "error", "always"],
      /* пробелы в switch операторе */
      "switch-colon-spacing": "error",
      /* отсутствие пробела внутри фигурных скобок в строках-шаблонах */
      "template-curly-spacing": ["error"],
      /* оборачивание регулярных выражений в скобки */
      "wrap-regex": "error",
      /* фигурные скобки в теле стрелочной функции должны использоваться при необходимости */
      "arrow-body-style": ["error", "as-needed"],
      /* ошибка, если функция, объявленная с async, не содержит await */
      "require-await": "error",
      /* оператор при переносе строки был в конце предыдущей строки */
      "operator-linebreak": ["error", "after"],
      /* запрет смешивания операторов && и || в одном выражении */
      "no-mixed-operators": [
        "error",
        {
          "groups": [["&&", "||", ]],
          "allowSamePrecedence": true,
        },
      ],

      /* Импорты */
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
        },
      ],
      "import/newline-after-import": "error", // Пустая строка после импортов

      /* Best practices */
      /* Предупреждение о console.log */
      "no-console": "warn",
      /* Всегда использовать фигурные скобки */
      "curly": ["error", "all"],
    },
  },
  /* Отключение конфликтующих правил для совместимости с Prettier */
  prettier,
];
