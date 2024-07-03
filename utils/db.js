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

  async User(event, data) {
    if (event === 'get') return this.client.collection('users').findOne(data);
    if (event === 'set') return this.client.collection('users').insertOne(data);
    return this.client.collection('users');
  }

  async File(event, data) {
    if (event === 'get') return this.client.collection('files').findOne(data);
    if (event === 'set') return this.client.collection('files').insertOne(data);
    if (event === 'count') return this.client.collection('files').countDocuments(data);
    if (event === 'pagination') return this.client.collection('files').aggregate(data);
    return this.client.collection('files');
  }
}

const dbClient = new DBClient();
export default dbClient;
