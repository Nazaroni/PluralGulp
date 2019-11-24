module.exports = () => {
  const client = './src/client/';

  const config = {
    // temp file for garbage
    temp: './.tmp/',
    /**
     * Files paths
     */
    // all *.js to vet
    alljs: [
      './src/**/*.js',
      './*.js',
    ],

    less: `${ client }styles/styles.less`,
  };
  return config;
};
