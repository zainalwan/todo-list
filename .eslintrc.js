module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "indent": [
      "error",
      2,
      {
        "ignoredNodes": [
          "PropertyDefinition"
        ]
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "comma-spacing": [
      "error"
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "no-var": [
      "error",
    ],
    "prefer-const": [
      "off",
    ],
    "sort-imports": [
      "error",
    ],
  }
};
