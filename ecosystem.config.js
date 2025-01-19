module.exports = {
    apps: [
      {
        name: 'next-opson-backend', // Name of your PM2 process for development
        script: 'tsx', // Use tsx for development
        args: 'watch src/main.ts',
        interpreter: 'none', // No Node interpreter required for tsx
        watch: false, // Disable PM2 watch as tsx handles it
        env: {
          NODE_ENV: 'development', // Development environment variables
          PORT: 4002, // Port for development
        },
        env_production: {
          NODE_ENV: 'production', // Production environment variables
          PORT: 4002, // Port for production
        },
      },
    ],
  };
  