import { MongoClient } from 'mongodb';
require('dotenv').config();

class DBClient {
  /**
   * connect to mongodb
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const URL = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(URL, {
      useUnifiedTopology: true,
    });

    this.client.connect();
  }

  /**
   * Check if client connect to mongodb
   * @returns {boolean}
   */
  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments() || 0;
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments() || 0;
  }
}

const dbClient = new DBClient();
export default dbClient;
