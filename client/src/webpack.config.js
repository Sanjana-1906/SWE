const path = require('path');

module.exports = {
  // other configuration settings...

  resolve: {
    fallback: {
      "zlib": require.resolve("browserify-zlib")
    }
  },

  // other configuration settings...
};
