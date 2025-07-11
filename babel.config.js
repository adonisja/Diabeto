module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable environment variable substitution
      ['inline-dotenv', {
        path: '.env', // Path to .env file
        safe: false, // Don't require .env.example file
        systemVar: 'overwrite', // Allow system env vars to override .env
      }]
    ]
  };
};
