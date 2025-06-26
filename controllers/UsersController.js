import UtilController from './UtilController';
import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email || !password) {
      response.status(400).json({ error: `Missing ${!email ? 'email' : 'password'}` }).end();
    } else if (await dbClient.userExists(email)) {
      response.status(400).json({ error: 'Already exist' }).end();
    } else {
      try {
        const passwordHash = UtilController.SHA1(password);
        const insert = await dbClient.newUser(email, passwordHash);

        return response.status(201).json({ 
        	id: insert.insertedId,
        	email: email
      	});
      } catch (err) {
        return response.status(400).json({ error: err.message });
      }
    }
  }

	static async getMe(request, response) {
  	try {
    	// Get token from X-Token header
    	const token = request.headers['x-token'];

    	// Retrieve the user based on the token
    	const userId = await redisClient.get(`auth_${token}`);

    	// If not found, return error Unauthorized with status code 401
    	if (!userId) {
      		return response.status(401).json({ error: 'Unauthorized' });
    	}

    	// Get user from database using the userId
    	const user = await dbClient.filterUser({ _id: userId });

   	// If user not found, return error Unauthorized with status code 401
    	if (!user) {
      		return response.status(401).json({ error: 'Unauthorized' });
    	}

    	// Return the user object (email and id only)
   	return response.status(200).json({
      		id: user._id,
      		email: user.email
    	});

  	} catch (error) {
    	// If any error occurs, return Unauthorized
    	return response.status(401).json({ error: 'Unauthorized' });
  	}}
}
