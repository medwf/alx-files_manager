import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const user = await dbClient.User('get', email, password);
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = sha1(password);
    const response = await dbClient.User('set', email, hashedPassword);
    return res.status(201).json({ id: response.insertedId, email });
  }
}

export default UsersController;
