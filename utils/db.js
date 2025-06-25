import { MongoClient, ObjectId } from 'mongodb';

class DBClient {
  constructor() {
    // Get environment variables or use defaults
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    
    // Create MongoDB connection URL
    this.url = `mongodb://${host}:${port}`;
    this.dbName = database;
    
    // Initialize connection state
    this.client = null;
    this.db = null;
    this.connected = false;
    
    // Connect to MongoDB
    this.connect();
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      this.client = new MongoClient(this.url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      this.connected = true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      this.connected = false;
    }
  }

  /**
   * Check if MongoDB connection is alive
   * @returns {boolean} true if connected, false otherwise
   */
  isAlive() {
    return this.connected && this.client && this.client.topology && this.client.topology.isConnected();
  }

  /**
   * Get the number of documents in the users collection
   * @returns {Promise<number>} Number of users
   */
  async nbUsers() {
    try {
      if (!this.isAlive()) {
        return 0;
      }
      const collection = this.db.collection('users');
      return await collection.countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  /**
   * Get the number of documents in the files collection
   * @returns {Promise<number>} Number of files
   */
  async nbFiles() {
    try {
      if (!this.isAlive()) {
        return 0;
      }
      const collection = this.db.collection('files');
      return await collection.countDocuments();
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }

  /**
   * Check if user exists by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User document or null
   */
  async userExists(email) {
    try {
      if (!this.isAlive()) {
        return null;
      }
      const collection = this.db.collection('users');
      return await collection.findOne({ email });
    } catch (error) {
      console.error('Error checking user existence:', error);
      return null;
    }
  }

  /**
   * Create a new user
   * @param {string} email - User email
   * @param {string} passwordHash - Hashed password
   * @returns {Promise<Object>} Insert result
   */
  async newUser(email, passwordHash) {
    try {
      if (!this.isAlive()) {
        throw new Error('Database not connected');
      }
      const collection = this.db.collection('users');
      return await collection.insertOne({ email, password: passwordHash });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find user by filters
   * @param {Object} filters - Search filters
   * @returns {Promise<Object|null>} User document or null
   */
  async filterUser(filters) {
    try {
      if (!this.isAlive()) {
        return null;
      }
      const collection = this.db.collection('users');
      if ('_id' in filters) {
        filters._id = new ObjectId(filters._id);
      }
      return await collection.findOne(filters);
    } catch (error) {
      console.error('Error filtering user:', error);
      return null;
    }
  }

  /**
   * Find file by filters
   * @param {Object} filters - Search filters
   * @returns {Promise<Object|null>} File document or null
   */
  async filterFiles(filters) {
    try {
      if (!this.isAlive()) {
        return null;
      }
      const collection = this.db.collection('files');
      const idFilters = ['_id', 'userId', 'parentId'].filter((prop) => prop in filters && filters[prop] !== '0');
      idFilters.forEach((i) => {
        filters[i] = new ObjectId(filters[i]);
      });
      return await collection.findOne(filters);
    } catch (error) {
      console.error('Error filtering files:', error);
      return null;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
