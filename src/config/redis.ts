import {createClient} from 'redis';

// Create a Redis client instance
const redisClient = createClient();

// Connect to the Redis server with error handling
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis server');
  } catch (err) {
    console.error('Failed to connect to Redis server:', err);
  }
})();

// Handle Redis client errors
redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

// Monitor client events
redisClient.on('ready', () => {
  console.log('Redis client is ready');
});

redisClient.on('end', () => {
  console.log('Connection to Redis server closed');
});

// Export the Redis client for use in other modules
export default redisClient;
