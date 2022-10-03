

module.exports = {
  webpack: (config, {isServer}) => {
    if (!isServer) {
      // set 'fs' to an empty module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
          fs: false
      }
    }
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      include: [/graphql/],
      exclude: /node_modules/,
      use: [
        {
          loader: "graphql-tag/loader",
        },
      ],
    });

    return config;
  },
};
