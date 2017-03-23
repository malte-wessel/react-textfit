module.exports = {
  root: true,
  extends: 'react-app',
  plugins: ['babel'],
  rules: {
    'babel/semi': ['error', 'never'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_|@observer',
        args: 'none',
      },
    ],
  },
}
