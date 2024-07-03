import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const user = await dbClient.User('get', { email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = sha1(password);
    const response = await dbClient.User('set', { email, password: hashedPassword });
    return res.status(201).json({ id: response.insertedId, email });
  }

  static async getMe(req, res) {
    const token = req.get('X-Token');
    // console.log(token);
    if (token && token.length) {
      const id = await redisClient.get(`auth_${token}`);
      // console.log(id);
      if (id) {
        const user = await dbClient.User('get', { _id: new ObjectId(id) });
        if (user) {
          return res
            .status(200)
            .json({ id: user._id.toString(), email: user.email });
        }
      }
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default UsersController;
