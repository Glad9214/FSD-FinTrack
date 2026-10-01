require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

async function runTest() {
  console.log('🔍 Testing MongoDB Connection and Operations...\n');

  try {
    const conn = await connectDB();
    console.log(`\n🎉 Connection Established:`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Port: ${conn.connection.port || 27017}`);
    console.log(`   Database: ${conn.connection.name}`);

    // Test a basic Mongoose collection operation
    console.log('\n📝 Testing Mongoose CRUD Operations...');
    const testSchema = new mongoose.Schema({
      message: String,
      createdAt: { type: Date, default: Date.now },
    });
    const TestModel = mongoose.models.HealthProbe || mongoose.model('HealthProbe', testSchema);

    const doc = await TestModel.create({ message: 'FinTrack MongoDB Health Probe' });
    console.log(`   ✅ Document inserted with ID: ${doc._id}`);

    const retrieved = await TestModel.findById(doc._id);
    console.log(`   ✅ Document retrieved successfully: "${retrieved.message}"`);

    await TestModel.deleteOne({ _id: doc._id });
    console.log(`   ✅ Document cleaned up successfully.`);

    console.log('\n🌟 MongoDB is 100% WORKING and ready for FinTrack!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ MongoDB Test Failed:', error);
    process.exit(1);
  }
}

runTest();
