import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create Redis client (for Redis v3 and below)
    this.client = createClient();
    this.isConnected = false;
    
    // Handle Redis client connection
    this.client.on('connect', () => {
      this.isConnected = true;
    });
    
    // Handle Redis client errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });
  }

  /**
   * Check if Redis connection is alive
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return this.isConnected && this.client.connected;
  }

  /**
   * Get value from Redis by key
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} The value stored for the key
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, result) => {
        if (err) {
          console.error('Redis GET error:', err);
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Set value in Redis with expiration
   * @param {string} key - The key to store
   * @param {any} value - The value to store
   * @param {number} duration - Expiration time in seconds
   * @returns {Promise<string|null>} Result of the operation
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value.toString(), (err, result) => {
        if (err) {
          console.error('Redis SET error:', err);
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Delete value from Redis by key
   * @param {string} key - The key to delete
   * @returns {Promise<number>} Number of keys deleted
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, result) => {
        if (err) {
          console.error('Redis DEL error:', err);
          resolve(0);
        } else {
          resolve(result);
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
