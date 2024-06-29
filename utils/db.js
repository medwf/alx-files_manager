import { MongoClient } from 'mongodb';

class DBClient {
  /**
   * connect to mongodb
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const URL = `mongodb://${host}:${port}`;

    this.isConnected = false;
    MongoClient.connect(URL, { useUnifiedTopology: true }, (_err, Client) => {
      if (Client) {
        this.isConnected = true;
        this.client = Client.db(database);
      }
    });
  }

  /**
   * Check if client connect to mongodb
   * @returns {boolean}
   */
  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    return this.client.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
