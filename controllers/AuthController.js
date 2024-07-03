import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static getEmailAndPassword(getAuthorization) {
    const getValue = getAuthorization.split(' ');
    // console.log(getValue);
    if (getValue.length === 2) {
      if (getValue[0] === 'Basic' && getValue[1].length) {
        const decode = Buffer.from(getValue[1], 'base64').toString('utf-8');
        const [email, password] = decode.split(':');
        return { email, password };
      }
    }
    return { email: undefined, password: undefined };
  }

  static async getConnect(req, res) {
    const getAuthorization = req.get('Authorization');
    const { email, password } = AuthController.getEmailAndPassword(getAuthorization);
    if (email && password) {
      const user = await dbClient.User('get', { email });
      // console.log(user);
      if (user && user.email === email) {
        if (user.password === sha1(password)) {
          const token = uuidv4();
          await redisClient.set(
            `auth_${token}`,
            user._id.toString(),
            60 * 60 * 24,
          );
          return res.status(200).json({ token });
        }
      }
    }
    // console.log(getAuthorization, email, password);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  static async getDisconnect(req, res) {
    const token = req.get('X-Token');
    const id = await redisClient.get(`auth_${token}`);
    if (id) {
      redisClient.del(`auth_${token}`);
      return res.status(204).json();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default AuthController;
