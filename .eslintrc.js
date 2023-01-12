module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-app`
  extends: ['app'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
};