module.exports = {
    root: true,  // Indicates that this is the root configuration for ESLint
    env: { browser: true, es2020: true },  // Specifies the environments the code is designed to run in
    extends: [
      'eslint:recommended',  // Use the recommended ESLint rules
      'plugin:@typescript-eslint/recommended',  // Use the recommended rules from the @typescript-eslint plugin
      'plugin:react-hooks/recommended',  // Use recommended rules for React hooks
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],  // Files and directories to ignore during linting
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser to allow TypeScript syntax
    plugins: ['react-refresh'],  // Includes the react-refresh plugin for hot reloading
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },  // Custom rule configuration for the react-refresh plugin
      ],
    },
  }