import redisClient from '../utils/redis';
import dbClient from '../utils/db';

export default class AppController {
  static getStatus(_req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  static getStats(_req, res) {
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()]).then(
      ([users, files]) => {
        res.status(200).json({ users, files });
      },
    );
  }
}
