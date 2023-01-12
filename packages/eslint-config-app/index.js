module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    //'next',
    "plugin:prettier/recommended",
    "prettier",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    //'react/jsx-key': 'off',
    //"@typescript-eslint/no-unused-vars": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/type-annotation-spacing": [
          "off",
          {
            before: true,
            after: true,
          },
        ],
      },
    },
  ],
}
