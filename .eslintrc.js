module.exports = {
  
  extends: ["eslint:recommended"],
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules:{
    'no-unused-vars': 1,
  }
  
}