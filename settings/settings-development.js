const settings = {
  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
  },
  graphql: {
    uri: "http://localhost:5001/api/graphql",
  },
  meta: {
    rootUrl: "http://localhost:5000",
    title: "App",
    description: "The app description goes here.",
    social: {
      graphic:
        "https://cheatcode-assets.s3.amazonaws.com/default-social-graphic.png",
      twitter: "@cheatcodetuts",
    },
  },
  routes: {
    authenticated: {
      pathAfterFailure: "/login",
    },
    public: {
      pathAfterFailure: "/documents",
    },
  },
};

export default settings;
