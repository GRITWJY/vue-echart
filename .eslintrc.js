module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
  	'no-console':'off',
	  'no-debugger':'off',
	  "generator-star-spacing": "off",
		"no-tabs":"off",
		"no-unused-vars":"off",
		"no-irregular-whitespace":"off",
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
