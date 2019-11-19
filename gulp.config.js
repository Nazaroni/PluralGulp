module.exports = () => {
  const config = {
    // all *.js to vet
    alljs: [
      './src/**/*.js',
      './*.js',
    ],
  };
  return config;
};
