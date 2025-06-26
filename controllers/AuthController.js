import { Buffer } from 'buffer';
import { v4 } from 'uuid';
import redisClient from '../utils/redis.js';
import UtilController from './UtilController.js';
import dbClient from '../utils/db.js';

export default class AuthController {
  static async getConnect(request, response) {
    try {
      // Get authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      
      // Decode credentials
      const encodeAuthPair = authHeader.split(' ')[1];
      const decodeAuthPair = Buffer.from(encodeAuthPair, 'base64').toString().split(':');
      
      if (decodeAuthPair.length !== 2) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      
      const email = decodeAuthPair[0];
      const password = decodeAuthPair[1];
      
      // Hash password and find user
      const hashedPassword = UtilController.SHA1(password);
      const user = await dbClient.filterUser({ email });
      
      if (!user || user.password !== hashedPassword) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      
      // Generate token and store in Redis
      const token = v4();
      await redisClient.set(`auth_${token}`, user._id.toString(), 86400);
      
      return response.status(200).json({ token });
      
    } catch (error) {
      console.error('Connect error:', error);
      return response.status(401).json({ error: 'Unauthorized' });
    }
  }

  static async getDisconnect(request, response) {
    try {
      const token = request.headers['x-token'];
      
      if (!token) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      
      // Remove token from Redis
      await redisClient.del(`auth_${token}`);
      return response.status(204).end();
      
    } catch (error) {
      console.error('Disconnect error:', error);
      return response.status(401).json({ error: 'Unauthorized' });
    }
  }
}
