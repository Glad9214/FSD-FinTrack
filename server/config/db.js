const mongoose = require('mongoose');
const net = require('net');
const path = require('path');
const fs = require('fs');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodInstance = null;

const isLocalPortOpen = (port = 27017) =>
  new Promise((resolve) => {
    const s = net.createConnection({ port, host: '127.0.0.1', timeout: 1000 }, () => {
      s.end();
      resolve(true);
    });
    s.on('error', () => resolve(false));
    s.on('timeout', () => {
      s.destroy();
      resolve(false);
    });
  });

const connectDB = async () => {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const configuredUri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
  const isAtlas = configuredUri && (configuredUri.startsWith('mongodb+srv://') || configuredUri.includes('.mongodb.net'));

  // 1. If Atlas is configured, attempt connection
  if (isAtlas) {
    try {
      console.log('📡 Attempting connection to MongoDB Atlas...');
      const conn = await mongoose.connect(configuredUri, {
        serverSelectionTimeoutMS: 5000,
        family: 4, // Force IPv4
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    } catch (atlasError) {
      console.error(`\n❌ MongoDB Atlas could not be reached:`);
      console.error(`   Reason: ${atlasError.message}`);
      console.error(`   👉 Check MongoDB Atlas: Go to "Network Access" and ensure "0.0.0.0/0" (Allow from Anywhere) is active!`);
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`MongoDB Atlas connection failed: ${atlasError.message}. Ensure MONGO_URI is configured and 0.0.0.0/0 is added to Atlas Network Access.`);
      }
      console.log(`🔄 Automatically falling back to Local Persistent MongoDB for development...\n`);
    }
  }

  // 2. Local MongoDB (or fallback from Atlas)
  const dbDir = path.join(__dirname, '..', 'data', 'db');
  fs.mkdirSync(dbDir, { recursive: true });

  const port27017Active = await isLocalPortOpen(27017);

  if (port27017Active) {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/finance-tracker', {
        serverSelectionTimeoutMS: 3000,
        family: 4,
      });
      console.log(`✅ Local MongoDB Connected: mongodb://127.0.0.1:27017/finance-tracker`);
      return conn;
    } catch (err) {
      console.log('Local port 27017 in use but connection failed, starting managed local instance...');
    }
  }

  // 3. Start local persistent MongoDB instance
  try {
    if (!mongodInstance) {
      console.log('📦 Starting managed persistent MongoDB engine...');
      try {
        mongodInstance = await MongoMemoryServer.create({
          instance: {
            dbPath: dbDir,
            port: 27017,
            storageEngine: 'wiredTiger',
          },
        });
      } catch (portErr) {
        // If 27017 unavailable, use random available port
        mongodInstance = await MongoMemoryServer.create({
          instance: {
            dbPath: dbDir,
            storageEngine: 'wiredTiger',
          },
        });
      }
    }

    const localUri = mongodInstance.getUri('finance-tracker');
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });

    console.log(`✅ Local Persistent MongoDB Connected: ${localUri}`);
    console.log(`💾 Database files: ${dbDir}`);
    return conn;
  } catch (localErr) {
    console.error(`❌ Failed to start local MongoDB: ${localErr.message}`);
    throw localErr;
  }
};

// Graceful cleanup
const cleanup = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongodInstance) {
      await mongodInstance.stop({ doCleanup: false });
      mongodInstance = null;
    }
  } catch (err) {
    // Ignore cleanup error on exit
  }
};

process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

module.exports = connectDB;
