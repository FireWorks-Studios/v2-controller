module.exports = {
  "extends": ["react-app"],
  "plugins": ["unused-imports"],
  "rules": {
    // "example-rule": "warn"
    "no-unused-vars": ["error", {
      "vars": "all",
      "varsIgnorePattern": "^_",
      "args": "after-used",
      "argsIgnorePattern": "^_"
    }],
    "unused-imports/no-unused-imports": ["error", {
      "vars": "all",
      "varsIgnorePattern": "^_",
      "args": "after-used",
      "argsIgnorePattern": "^_"
    }],
    "unused-imports/no-unused-vars": [
      "error",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ]
  },
  "overrides": [
    {
      "files": ["**/*.ts?(x)"],
      "rules": {
        // make @typescript-eslint/no-unused-vars an error
        // "@typescript-eslint/no-unused-vars": ["error"]
      }
    }
  ]
}
