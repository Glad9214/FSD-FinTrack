require('dotenv').config();
const { MongoClient } = require('mongodb');

async function test() {
  try {
    console.log('Connecting with MongoClient...');
    const client = new MongoClient(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    console.log('✅ MongoDB Connected!');
    process.exit(0);
  } catch(e) {
    console.error('❌ MongoDB Connection Failed:', e);
    process.exit(1);
  }
}

test();
