import sha1 from 'sha1';
import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
    }

    const user = await dbClient.User('get', email, password);
    if (user) {
      res.status(400).json({ error: 'Already exist' });
    } else {
      const hashedPassword = sha1(password);
      const response = await dbClient.User('set', email, hashedPassword);
      res.status(201).json({ id: response.insertedId, email });
    }
  }
}
