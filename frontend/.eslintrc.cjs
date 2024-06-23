const path = require("path");
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier",
    "prettier",
    "plugin:storybook/recommended",
  ],
  plugins: ["prettier"],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        paths: [path.resolve(__dirname, "")],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    node: true,
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react/jsx-no-target-blank": "warn",
    "prettier/prettier": [
      "warn",
      {
        arrowParens: "always",
        semi: true,
        trailingComma: "all",
        tabWidth: 2,
        endOfLine: "auto",
        useTabs: false,
        singleQuote: false,
        printWidth: 120,
        jsxSingleQuote: false,
        singleAttributePerLine: true,
      },
    ],
  },
};
