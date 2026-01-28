import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  /**
   * Create new instance RedisClient to redis
   */
  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = process.env.REDIS_PORT || 6379;
    console.log(`redis://${host}:${port}`)
    this.client = createClient({
      url: `redis://${host}:${port}`
    });
    this.isConnected = true;

    this.client.on('error', (err) => {
      console.log('Redis client not connected to the server: ', err.toString());
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * check if client connect or not.
   * @returns {Boolean}
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Retrieves the value of a given key.
   * @param {String} key the of item to retrieve.
   * @returns {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * set key value with duration is second.
   * @param {String} key of item store
   * @param {String | Number | Boolean} value of item store
   * @param {*} duration The expiration time of items is seconds.
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
  }

  /**
   * delete an item is stored.
   * @param {String} key od an item.
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
